import * as React from 'react';
import { connect } from 'react-redux';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Tab } from '@patternfly/react-core';
import * as API from '../../services/Api';
import { App, AppId } from '../../types/App';
import { AppInfo } from './AppInfo';
import * as AlertUtils from '../../utils/AlertUtils';
import { IstioMetrics } from '../../components/Metrics/IstioMetrics';
import { MetricsObjectTypes } from '../../types/Metrics';
import { CustomMetrics } from '../../components/Metrics/CustomMetrics';
import { DurationInSeconds, TimeInMilliseconds, TimeRange } from '../../types/Common';
import { KialiAppState } from '../../store/Store';
import { durationSelector, timeRangeSelector } from '../../store/Selectors';
import { ParameterizedTabs, activeTab } from '../../components/Tab/Tabs';
import { TracingInfo } from '../../types/TracingInfo';
import { TracesComponent } from '../../components/TracingIntegration/TracesComponent';
import { TrafficDetails } from 'components/TrafficList/TrafficDetails';
import { TimeControl } from '../../components/Time/TimeControl';
import { AppHealth } from 'types/Health';
import { RenderHeader } from '../../components/Nav/Page/RenderHeader';
import { ErrorMsg } from '../../types/ErrorMsg';
import { ErrorSection } from '../../components/ErrorSection/ErrorSection';
import { connectRefresh } from '../../components/Refresh/connectRefresh';
import { history, HistoryManager } from 'app/History';
import { basicTabStyle } from 'styles/TabStyles';

type AppDetailsState = {
  app?: App;
  cluster?: string;
  health?: AppHealth;
  // currentTab is needed to (un)mount tab components
  // when the tab is not rendered.
  currentTab: string;
  error?: ErrorMsg;
};

type ReduxProps = {
  duration: DurationInSeconds;
  tracingInfo?: TracingInfo;
  timeRange: TimeRange;
};

type AppDetailsProps = ReduxProps & {
  appId: AppId;
  lastRefreshAt: TimeInMilliseconds;
};

const tabName = 'tab';
const defaultTab = 'info';
const tracesTabName = 'traces';
const paramToTab: { [key: string]: number } = {
  info: 0,
  traffic: 1,
  in_metrics: 2,
  out_metrics: 3,
  traces: 4
};
const nextTabIndex = 5;

class AppDetails extends React.Component<AppDetailsProps, AppDetailsState> {
  constructor(props: AppDetailsProps) {
    super(props);
    const cluster = HistoryManager.getClusterName();
    this.state = { currentTab: activeTab(tabName, defaultTab), cluster: cluster };
  }

  componentDidMount(): void {
    this.fetchApp();
  }

  componentDidUpdate(prevProps: AppDetailsProps) {
    // when linking from one cluster's app to another cluster's app, cluster in state should be changed
    const cluster = HistoryManager.getClusterName() || this.state.cluster;
    const currentTab = activeTab(tabName, defaultTab);
    if (
      this.props.appId.namespace !== prevProps.appId.namespace ||
      this.props.appId.app !== prevProps.appId.app ||
      this.props.lastRefreshAt !== prevProps.lastRefreshAt ||
      currentTab !== this.state.currentTab ||
      this.props.duration !== prevProps.duration
    ) {
      if (currentTab === 'info') {
        this.fetchApp(cluster);
      }
      if (currentTab !== this.state.currentTab || cluster !== this.state.cluster) {
        this.setState({ currentTab: currentTab, cluster: cluster });
      }
    }
  }

  private fetchApp = (cluster?: string) => {
    if (!cluster) {
      cluster = this.state.cluster;
    }
    const params: { [key: string]: string } = { rateInterval: String(this.props.duration) + 's', health: 'true' };
    API.getApp(this.props.appId.namespace, this.props.appId.app, params, cluster)
      .then(details => {
        this.setState({
          app: details.data,
          health: AppHealth.fromJson(this.props.appId.namespace, this.props.appId.app, details.data.health, {
            rateInterval: this.props.duration,
            hasSidecar: details.data.workloads.some(w => w.istioSidecar),
            hasAmbient: details.data.workloads.some(w => w.istioAmbient)
          })
        });
      })
      .catch(error => {
        AlertUtils.addError('Could not fetch App Details.', error);
        const msg: ErrorMsg = {
          title: 'No App is selected',
          description: this.props.appId.app + ' is not found in the mesh'
        };
        this.setState({ error: msg });
      });
  };

  private runtimeTabs() {
    let tabOffset = 0;

    const tabs: JSX.Element[] = [];
    if (this.state.app) {
      this.state.app.runtimes.forEach(runtime => {
        runtime.dashboardRefs.forEach(dashboard => {
          if (dashboard.template !== 'envoy') {
            const tabKey = tabOffset + nextTabIndex;
            paramToTab['cd-' + dashboard.template] = tabKey;

            const tab = (
              <Tab title={dashboard.title} key={'cd-' + dashboard.template} eventKey={tabKey}>
                <CustomMetrics
                  lastRefreshAt={this.props.lastRefreshAt}
                  namespace={this.props.appId.namespace}
                  app={this.props.appId.app}
                  template={dashboard.template}
                />
              </Tab>
            );
            tabs.push(tab);
            tabOffset++;
          }
        });
      });
    }

    return tabs;
  }

  private staticTabs() {
    const overTab = (
      <Tab title="Overview" eventKey={0} key={'Overview'}>
        <AppInfo app={this.state.app} duration={this.props.duration} health={this.state.health} />
      </Tab>
    );

    const trafficTab = (
      <Tab title="Traffic" eventKey={1} key={'Traffic'}>
        <TrafficDetails
          itemName={this.props.appId.app}
          itemType={MetricsObjectTypes.APP}
          lastRefreshAt={this.props.lastRefreshAt}
          namespace={this.props.appId.namespace}
          cluster={this.state.cluster}
        />
      </Tab>
    );

    const inTab = (
      <Tab title="Inbound Metrics" eventKey={2} key={'Inbound Metrics'}>
        <IstioMetrics
          data-test="inbound-metrics-component"
          lastRefreshAt={this.props.lastRefreshAt}
          namespace={this.props.appId.namespace}
          object={this.props.appId.app}
          objectType={MetricsObjectTypes.APP}
          cluster={this.state.cluster}
          direction={'inbound'}
        />
      </Tab>
    );

    const outTab = (
      <Tab title="Outbound Metrics" eventKey={3} key={'Outbound Metrics'}>
        <IstioMetrics
          data-test="outbound-metrics-component"
          lastRefreshAt={this.props.lastRefreshAt}
          namespace={this.props.appId.namespace}
          object={this.props.appId.app}
          objectType={MetricsObjectTypes.APP}
          cluster={this.state.cluster}
          direction={'outbound'}
        />
      </Tab>
    );

    // Default tabs
    const tabsArray: JSX.Element[] = [overTab, trafficTab, inTab, outTab];

    // Conditional Traces tab
    if (this.props.tracingInfo && this.props.tracingInfo.enabled) {
      if (this.props.tracingInfo.integration) {
        tabsArray.push(
          <Tab eventKey={4} style={{ textAlign: 'center' }} title={'Traces'} key={tracesTabName}>
            <TracesComponent
              lastRefreshAt={this.props.lastRefreshAt}
              namespace={this.props.appId.namespace}
              cluster={this.state.cluster}
              target={this.props.appId.app}
              targetKind={'app'}
            />
          </Tab>
        );
      } else {
        const service = this.props.tracingInfo.namespaceSelector
          ? this.props.appId.app + '.' + this.props.appId.namespace
          : this.props.appId.app;
        tabsArray.push(
          <Tab
            eventKey={4}
            href={this.props.tracingInfo.url + `/search?service=${service}`}
            target="_blank"
            title={
              <>
                Traces <ExternalLinkAltIcon />
              </>
            }
          />
        );
      }
    }

    return tabsArray;
  }

  private renderTabs() {
    // PF4 Tabs doesn't support static tabs followed of an array of tabs created dynamically.
    return this.staticTabs().concat(this.runtimeTabs());
  }

  render() {
    // set default to true: all dynamic tabs (unlisted below) are for runtimes dashboards, which uses custom time
    let useCustomTime = true;
    switch (this.state.currentTab) {
      case 'info':
      case 'traffic':
        useCustomTime = false;
        break;
      case 'in_metrics':
      case 'out_metrics':
      case 'traces':
        useCustomTime = true;
        break;
    }
    return (
      <>
        <RenderHeader location={history.location} rightToolbar={<TimeControl customDuration={useCustomTime} />} />
        {this.state.error && <ErrorSection error={this.state.error} />}
        {this.state.app && (
          <ParameterizedTabs
            id="basic-tabs"
            className={basicTabStyle}
            onSelect={tabValue => {
              this.setState({ currentTab: tabValue, cluster: this.state.cluster });
            }}
            tabMap={paramToTab}
            tabName={tabName}
            defaultTab={defaultTab}
            activeTab={this.state.currentTab}
            mountOnEnter={true}
            unmountOnExit={true}
          >
            {this.renderTabs()}
          </ParameterizedTabs>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: KialiAppState) => ({
  duration: durationSelector(state),
  timeRange: timeRangeSelector(state),
  tracingInfo: state.tracingState.info
});

export const AppDetailsPage = connectRefresh(connect(mapStateToProps)(AppDetails));