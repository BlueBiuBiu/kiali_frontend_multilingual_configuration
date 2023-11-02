import * as React from 'react';
import { connect } from 'react-redux';
import { KialiDispatch } from 'types/Redux';
import _round from 'lodash/round';
import { Button, ButtonVariant, Card, CardBody, Grid, GridItem, Tooltip } from '@patternfly/react-core';
import { InfoAltIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import { JaegerTrace, RichSpanData } from 'types/TracingInfo';
import { TracingTraceTitle } from './TracingTraceTitle';
import { GraphType, NodeType } from 'types/Graph';
import { FormattedTraceInfo, shortIDStyle } from './FormattedTraceInfo';
import { PFColors } from 'components/Pf/PfColors';
import { KialiAppState } from 'store/Store';
import { TracingThunkActions } from 'actions/TracingThunkActions';
import { getTraceId } from 'utils/SearchParamUtils';
import { average } from 'utils/MathUtils';
import {
  averageSpanDuration,
  buildQueriesFromSpans,
  isSimilarTrace,
  reduceMetricsStats,
  StatsMatrix
} from 'utils/tracing/TraceStats';
import { TraceLabels } from './TraceLabels';
import { TargetKind } from 'types/Common';
import { MetricsStatsQuery } from 'types/MetricsOptions';
import { MetricsStatsThunkActions } from 'actions/MetricsStatsThunkActions';
import { renderTraceHeatMap } from './StatsComparison';
import { HeatMap } from 'components/HeatMap/HeatMap';
import { formatDuration, sameSpans } from 'utils/tracing/TracingHelper';
import { GraphSelectorBuilder } from 'pages/Graph/GraphSelector';
import { TEMPO } from '../../../types/Tracing';

type ReduxProps = {
  loadMetricsStats: (queries: MetricsStatsQuery[], isCompact: boolean, cluster?: string) => void;
  setTraceId: (cluster?: string, traceId?: string) => void;
};

type Props = ReduxProps & {
  cluster?: string;
  isStatsMatrixComplete: boolean;
  namespace: string;
  otherTraces: JaegerTrace[];
  provider?: string;
  statsMatrix?: StatsMatrix;
  target: string;
  targetKind: TargetKind;
  trace?: JaegerTrace;
  tracingURL?: string;
  tabTraceID?: string;
};

interface State {}

class TraceDetailsComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const urlTrace = getTraceId();
    if (urlTrace && urlTrace !== props.trace?.traceID) {
      props.setTraceId(this.props.cluster, urlTrace);
    } else if (!urlTrace && props.trace) {
      // Remove old stored selected trace
      props.setTraceId(this.props.cluster, undefined);
    }
    this.state = { completeMetricsStats: false };
  }

  componentDidMount() {
    if (this.props.trace) {
      this.fetchComparisonMetrics(this.props.trace.spans);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.trace && !sameSpans(prevProps.trace?.spans || [], this.props.trace.spans)) {
      this.fetchComparisonMetrics(this.props.trace.spans);
    }
  }

  shouldComponentUpdate(nextProps, _) {
    if (
      nextProps.isStatsMatrixComplete !== this.props.isStatsMatrixComplete ||
      nextProps.tabTraceID !== this.props.tabTraceID
    ) {
      return true;
    }
    return false;
  }

  private fetchComparisonMetrics(spans: RichSpanData[]) {
    const queries = buildQueriesFromSpans(spans, false);
    this.props.loadMetricsStats(queries, false, this.props.cluster);
  }

  private getGraphURL = (traceID: string) => {
    let graphSelector = new GraphSelectorBuilder().namespace(this.props.namespace);
    let graphType: GraphType = GraphType.APP;

    switch (this.props.targetKind) {
      case 'app':
        graphSelector = graphSelector.app(this.props.target).nodeType(NodeType.APP);
        break;
      case 'service':
        graphType = GraphType.SERVICE;
        graphSelector = graphSelector.service(this.props.target);
        break;
      case 'workload':
        graphType = GraphType.WORKLOAD;
        graphSelector = graphSelector.workload(this.props.target);
        break;
    }

    return `/graph/namespaces?graphType=${graphType}&injectServiceNodes=true&namespaces=${
      this.props.namespace
    }&traceId=${traceID}&focusSelector=${encodeURI(graphSelector.build())}`;
  };

  private renderSimilarHeatmap = (
    similarTraces: JaegerTrace[],
    traceDuration: number,
    avgSpanDuration: number | undefined
  ) => {
    const similarMeanDuration = average(similarTraces, trace => trace.duration);
    const similarSpanDurations = similarTraces
      .map(t => averageSpanDuration(t))
      .filter(d => d !== undefined) as number[];
    const similarMeanAvgSpanDuration = average(similarSpanDurations, d => d);
    const genDiff = (a: number | undefined, b: number | undefined) => (a && b ? (a - b) / 1000 : undefined);
    const similarTracesToShow = similarTraces.slice(0, 8);
    const similarMatrixHeaders = similarTracesToShow
      .map(t => {
        const info = new FormattedTraceInfo(t);
        return (
          <Tooltip
            content={
              <>
                {info.name()}
                <span className={shortIDStyle}>{info.shortID()}</span>
                <small>({info.fromNow()})</small>
              </>
            }
          >
            <Button
              style={{ paddingLeft: 0, paddingRight: 3, fontSize: '0.7rem' }}
              variant={ButtonVariant.link}
              onClick={() => this.props.setTraceId(t.traceID)}
            >
              {info.shortID()}
            </Button>
          </Tooltip>
        );
      })
      .concat([<>{$t('Mean')}</>]);
    const similarMatrix = similarTracesToShow
      .map(t => {
        const avgSpans = averageSpanDuration(t);
        return [genDiff(traceDuration, t.duration), genDiff(avgSpanDuration, avgSpans)];
      })
      .concat([[genDiff(traceDuration, similarMeanDuration), genDiff(avgSpanDuration, similarMeanAvgSpanDuration)]]);
    return (
      <HeatMap
        xLabels={similarMatrixHeaders}
        yLabels={[$t('Full_duration'), $t('SpansAverage')]}
        data={similarMatrix}
        displayMode={'large'}
        colorMap={HeatMap.HealthColorMap}
        dataRange={{ from: -10, to: 10 }}
        colorUndefined={PFColors.ColorLight200}
        valueFormat={v => (v > 0 ? '+' : '') + _round(v, 1)}
        tooltip={(x, _, v) => {
          // Build explanation tooltip
          const slowOrFast = v > 0 ? 'slower' : 'faster';
          const diff = _round(Math.abs(v), 2);
          const versus = x === similarTracesToShow.length ? $t('tip386') : similarTracesToShow[x].traceID;
          return `This trace was ${diff}ms ${slowOrFast} than ${versus}`;
        }}
      />
    );
  };

  render() {
    const { trace, otherTraces } = this.props;
    if (!trace) {
      return null;
    }
    const formattedTrace = new FormattedTraceInfo(trace);

    // Compute a bunch of stats
    const avgSpanDuration = averageSpanDuration(trace);
    const similarTraces = otherTraces.filter(t => t.traceID !== trace.traceID && isSimilarTrace(t, trace));
    const comparisonLink =
      this.props.tracingURL && this.props.provider !== TEMPO && similarTraces.length > 0
        ? `${this.props.tracingURL}/trace/${trace.traceID}...${similarTraces[0].traceID}?cohort=${
            trace.traceID
          }${similarTraces
            .slice(0, 10)
            .map(t => `&cohort=${t.traceID}`)
            .join('')}`
        : undefined;

    return (
      <Card isCompact>
        <TracingTraceTitle
          formattedTrace={formattedTrace}
          externalURL={this.props.tracingURL ? this.props.tracingURL.replace('TRACEID', trace.traceID) : undefined}
          graphURL={this.getGraphURL(trace.traceID)}
          comparisonURL={comparisonLink}
        />
        <CardBody>
          <Grid style={{ marginTop: '20px' }}>
            <GridItem span={3}>
              <TraceLabels spans={trace.spans} oneline={false} />
            </GridItem>
            <GridItem span={3}>
              <Tooltip content={<>{$t('tip260')}</>}>
                <strong>{$t('Full_duration')}: </strong>
              </Tooltip>
              {formatDuration(trace.duration)}
              <br />
              <Tooltip content={<>{$t('tip261')}</>}>
                <strong>{$t('Spans_average_duration')}: </strong>
              </Tooltip>
              {avgSpanDuration ? formatDuration(avgSpanDuration) : 'n/a'}
              <br />
              <br />
              {this.props.statsMatrix && (
                <>
                  <strong>{$t('Compared_with_metrics')}: </strong>
                  {renderTraceHeatMap(this.props.statsMatrix, false)}
                  {!this.props.isStatsMatrixComplete && (
                    <>
                      <WarningTriangleIcon /> {$t('tip262')}
                    </>
                  )}
                </>
              )}
            </GridItem>
            <GridItem span={6}>
              <Tooltip content={$t('tip263')}>
                <>
                  <InfoAltIcon /> <strong>{$t('Similar_traces')}</strong>
                  <br />
                </>
              </Tooltip>
              {similarTraces.length > 0
                ? this.renderSimilarHeatmap(similarTraces, trace.duration, avgSpanDuration)
                : $t('tip264')}
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = (state: KialiAppState) => {
  if (state.tracingState.tabTrace) {
    const { matrix, isComplete } = reduceMetricsStats(state.tracingState.tabTrace, state.metricsStats.data, false);
    return {
      trace: state.tracingState.tabTrace,
      statsMatrix: matrix,
      isStatsMatrixComplete: isComplete
    };
  }
  return {
    trace: state.tracingState.tabTrace,
    isStatsMatrixComplete: false
  };
};

const mapDispatchToProps = (dispatch: KialiDispatch) => ({
  setTraceId: (cluster?: string, traceId?: string) => dispatch(TracingThunkActions.setTraceId(cluster, traceId)),
  loadMetricsStats: (queries: MetricsStatsQuery[], isCompact: boolean) =>
    dispatch(MetricsStatsThunkActions.load(queries, isCompact))
});

export const TraceDetails = connect(mapStateToProps, mapDispatchToProps)(TraceDetailsComponent);
