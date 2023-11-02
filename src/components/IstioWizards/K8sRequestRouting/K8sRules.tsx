import * as React from 'react';
import { cellWidth, ICell } from '@patternfly/react-table';
import { Table, TableHeader, TableBody } from '@patternfly/react-table/deprecated';
import { kialiStyle } from 'styles/StyleUtils';
import { PFColors } from '../../Pf/PfColors';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  TooltipPosition,
  EmptyStateHeader
} from '@patternfly/react-core';
import { PFBadge, PFBadges } from 'components/Pf/PfBadges';
import { ROUTE_RULES_TOOLTIP, wizardTooltip } from '../WizardHelp';
import { K8sRouteBackendRef } from '../K8sTrafficShifting';

export enum MOVE_TYPE {
  UP,
  DOWN
}

export type K8sRule = {
  matches: string[];
  filters: string[];
  backendRefs: K8sRouteBackendRef[];
};

type Props = {
  k8sRules: K8sRule[];
  onRemoveRule: (index: number) => void;
  onMoveRule: (index: number, move: MOVE_TYPE) => void;
};

const validationStyle = kialiStyle({
  marginTop: 15,
  color: PFColors.Red100
});

const noRulesStyle = kialiStyle({
  marginTop: 15,
  color: PFColors.Red100,
  textAlign: 'center',
  width: '100%'
});

export class K8sRules extends React.Component<Props> {
  matchAllIndex = (k8sRules: K8sRule[]): number => {
    let matchAll: number = -1;
    for (let index = 0; index < k8sRules.length; index++) {
      const rule = k8sRules[index];
      if (!rule.matches || rule.matches.length === 0) {
        matchAll = index;
        break;
      }
    }
    return matchAll;
  };

  // @ts-ignore
  actionResolver = (rowData, { rowIndex }) => {
    const removeAction = {
      title: 'RemoveRule',
      // @ts-ignore
      onClick: (event, rowIndex, rowData, extraData) => this.props.onRemoveRule(rowIndex)
    };
    const moveUpAction = {
      title: 'MoveUp',
      // @ts-ignore
      onClick: (event, rowIndex, rowData, extraData) => this.props.onMoveRule(rowIndex, MOVE_TYPE.UP)
    };
    const moveDownAction = {
      title: 'MoveDown',
      // @ts-ignore
      onClick: (event, rowIndex, rowData, extraData) => this.props.onMoveRule(rowIndex, MOVE_TYPE.DOWN)
    };

    const actions: any[] = [];
    if (this.props.k8sRules.length > 0) {
      actions.push(removeAction);
    }
    if (rowIndex > 0) {
      actions.push(moveUpAction);
    }
    if (rowIndex + 1 < this.props.k8sRules.length) {
      actions.push(moveDownAction);
    }
    return actions;
  };

  render() {
    // TODO: Casting 'as any' because @patternfly/react-table@2.22.19 has a typing bug. Remove the casting when PF fixes it.
    // https://github.com/patternfly/patternfly-next/issues/2373
    const headerCells: ICell[] = [
      {
        title: 'RuleOrder',
        transforms: [cellWidth(10) as any],
        props: {}
      },
      {
        title: 'RequestMatching',
        props: {}
      },
      {
        title: 'RouteFiltering',
        props: {}
      },
      {
        title: 'RouteTo',
        props: {}
      }
    ];

    let isValid: boolean = true;
    const matchAll: number = this.matchAllIndex(this.props.k8sRules);
    const routeRules =
      this.props.k8sRules.length > 0
        ? this.props.k8sRules.map((rule, order) => {
            isValid = matchAll === -1 || order <= matchAll;
            return {
              cells: [
                <>{order + 1}</>,
                <>
                  {!rule.matches || rule.matches.length === 0
                    ? $t('AnyRequest')
                    : rule.matches.map((match, i) => <div key={'match_' + i}>{match}</div>)}
                  {!isValid && (
                    <div className={validationStyle}>
                      {$t('tip6')}
                      <br />
                      {$t('tip7')}
                    </div>
                  )}
                </>,
                <>
                  {!rule.filters || rule.filters.length === 0
                    ? $t('NoRequestFilter')
                    : rule.filters.map((filter, i) => <div key={'filter_' + i}>{filter}</div>)}
                </>,
                <>
                  <div key={'br_' + order}>
                    {rule.backendRefs &&
                      rule.backendRefs.map((bRef, i) => {
                        return (
                          <div key={'br_' + order + '_' + bRef.name + '_' + i}>
                            <PFBadge badge={PFBadges.Workload} position={TooltipPosition.top} />
                            {bRef.name} ({bRef.weight}% {$t('routedTraffic')})
                          </div>
                        );
                      })}
                  </div>
                </>
              ]
            };
          })
        : [
            {
              key: 'rowEmpty',
              cells: [
                {
                  title: (
                    <EmptyState variant={EmptyStateVariant.full}>
                      <EmptyStateHeader titleText={$t('tip8')} headingLevel="h5" />
                      <EmptyStateBody className={noRulesStyle}>{$t('tip9')}</EmptyStateBody>
                    </EmptyState>
                  ),
                  props: { colSpan: 3 }
                }
              ]
            }
          ];

    return (
      <>
        {$t('RouteK8sRules')}
        {wizardTooltip(ROUTE_RULES_TOOLTIP)}
        <Table
          aria-label="K8sRules Created"
          cells={headerCells}
          rows={routeRules}
          // @ts-ignore
          actionResolver={this.actionResolver}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </>
    );
  }
}
