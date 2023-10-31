import * as React from 'react';
import { SummaryTable, SummaryTableRenderer } from './BaseTable';
import { ICell, ISortBy, sortable, SortByDirection } from '@patternfly/react-table';
import { ClusterSummary } from '../../../types/IstioObjects';
import { ActiveFilter, FILTER_ACTION_APPEND, FilterType, AllFilterTypes } from '../../../types/Filters';
import { SortField } from '../../../types/SortFilters';
import { Namespace } from '../../../types/Namespace';
import { defaultFilter, istioConfigLink, serviceLink } from '../../../helpers/EnvoyHelpers';
import { Tooltip } from '@patternfly/react-core';
import { PFColors } from 'components/Pf/PfColors';
import { KialiIcon } from 'config/KialiIcon';
import { kialiStyle } from 'styles/StyleUtils';
import { isParentKiosk } from '../../Kiosk/KioskActions';

export class ClusterTable implements SummaryTable {
  summaries: ClusterSummary[];
  sortingIndex: number;
  sortingDirection: 'asc' | 'desc';
  namespaces: Namespace[] | undefined;
  namespace: string;
  kiosk: string;

  constructor(summaries: ClusterSummary[], sortBy: ISortBy, namespaces: Namespace[], namespace: string, kiosk: string) {
    this.summaries = summaries;
    this.sortingIndex = sortBy.index || 0;
    this.sortingDirection = sortBy.direction || SortByDirection.asc;
    this.namespaces = namespaces;
    this.namespace = namespace;
    this.kiosk = kiosk;
  }

  availableFilters = (): FilterType[] => {
    return [
      {
        category: 'FQDN',
        placeholder: 'FQDN',
        filterType: AllFilterTypes.text,
        action: FILTER_ACTION_APPEND,
        filterValues: []
      },
      {
        category: 'Port',
        placeholder: 'Port',
        filterType: AllFilterTypes.text,
        action: FILTER_ACTION_APPEND,
        filterValues: []
      },
      {
        category: 'Subset',
        placeholder: 'Subset',
        filterType: AllFilterTypes.text,
        action: FILTER_ACTION_APPEND,
        filterValues: []
      },
      {
        category: 'Direction',
        placeholder: 'Direction',
        filterType: AllFilterTypes.select,
        action: FILTER_ACTION_APPEND,
        filterValues: [
          { id: 'inbound', title: 'inbound' },
          { id: 'outbound', title: 'outbound' }
        ]
      }
    ];
  };

  filterMethods = (): { [filter_id: string]: (ClusterSummary, ActiveFilter) => boolean } => {
    return {
      FQDN: (entry: ClusterSummary, filter: ActiveFilter): boolean => {
        return [entry.service_fqdn.service, entry.service_fqdn.namespace, entry.service_fqdn.cluster]
          .join('.')
          .includes(filter.value);
      },
      Port: (entry: ClusterSummary, filter: ActiveFilter): boolean => {
        return entry.port.toString().includes(filter.value);
      },
      Subset: (entry: ClusterSummary, filter: ActiveFilter): boolean => {
        return entry.subset.toString().includes(filter.value);
      },
      Direction: (entry: ClusterSummary, filter: ActiveFilter): boolean => {
        return entry.direction.toString().includes(filter.value);
      }
    };
  };

  sortFields = (): SortField<ClusterSummary>[] => {
    return [
      {
        id: 'fqdn',
        title: 'FQDN',
        isNumeric: false,
        param: 'fqdn',
        compare: (a, b) => {
          return [a.service_fqdn.service, a.service_fqdn.namespace, a.service_fqdn.cluster]
            .join('.')
            .localeCompare([b.service_fqdn.service, b.service_fqdn.namespace, b.service_fqdn.cluster].join('.'));
        }
      },
      {
        id: 'port',
        title: 'Port',
        isNumeric: true,
        param: 'port',
        compare: (a, b) => {
          return a.port - b.port;
        }
      },
      {
        id: 'subset',
        title: 'Subset',
        isNumeric: false,
        param: 'subset',
        compare: (a, b) => {
          return a.subset.localeCompare(b.subset);
        }
      },
      {
        id: 'direction',
        title: 'Direction',
        isNumeric: false,
        param: 'direction',
        compare: (a, b) => {
          return a.direction.localeCompare(b.direction);
        }
      },
      {
        id: 'type',
        title: 'Type',
        isNumeric: true,
        param: 'type',
        compare: (a, b) => {
          return a.type - b.type;
        }
      },
      {
        id: 'dr',
        title: 'Destination Rule',
        isNumeric: true,
        param: 'dr',
        compare: (a, b) => {
          return a.destination_rule.localeCompare(b.destination_rule);
        }
      }
    ];
  };

  render_cluster_type = (): React.ReactNode => {
    return (
      <ul className={kialiStyle({ textAlign: 'left' })}>
        <li>
          <b>{$t('STATIC')}</b>: {$t('tip302')}
        </li>
        <li>
          <b>{$t('STRICT_DNS')}</b>: {$t('tip216')}
        </li>
        <li>
          <b>{$t('LOGICAL_DNS')}</b>: {$t('tip217')}
        </li>
        <li>
          <b>EDS</b>: {$t('tip218')}
        </li>
        <li>
          <b>{$t('ORIGINAL_DST')}</b>: {$t('tip303')}
        </li>
      </ul>
    );
  };

  head = (): ICell[] => {
    return [
      {
        title: 'Service FQDN',
        transforms: [sortable],
        header: { info: { tooltip: <>{$t('tip220')}</> } }
      },
      { title: 'Port', transforms: [sortable] },
      { title: 'Subset', transforms: [sortable] },
      {
        title: 'Direction',
        transforms: [sortable],
        header: {
          info: {
            tooltip: (
              <ul className={kialiStyle({ textAlign: 'left' })}>
                <li>
                  <b>{$t('inbound')}</b>: {$t('tip221')}
                </li>
                <li>
                  <b>{$t('outbound')}</b>: {$t('tip222')}
                </li>
              </ul>
            )
          }
        }
      },
      { title: 'Type', transforms: [sortable], header: { info: { tooltip: this.render_cluster_type() } } },
      { title: 'DestinationRule', transforms: [sortable] }
    ];
  };

  resource = (): string => 'clusters';

  setSorting = (columnIndex: number, direction: 'asc' | 'desc') => {
    this.sortingIndex = columnIndex;
    this.sortingDirection = direction;
  };

  sortBy = (): ISortBy => {
    return {
      index: this.sortingIndex,
      direction: this.sortingDirection || 'asc'
    };
  };

  tooltip = (): React.ReactNode => {
    return (
      <Tooltip content={<div className={kialiStyle({ textAlign: 'left' })}>{$t('tip223')}</div>}>
        <KialiIcon.Help className={kialiStyle({ width: '14px', height: '14px', color: PFColors.Info })} />
      </Tooltip>
    );
  };

  rows(): (string | number | JSX.Element)[][] {
    const parentKiosk = isParentKiosk(this.kiosk);
    return this.summaries
      .filter((value: ClusterSummary): boolean => {
        return defaultFilter(value, this.filterMethods());
      })
      .sort((a: ClusterSummary, b: ClusterSummary): number => {
        const sortField = this.sortFields().find((value: SortField<ClusterSummary>): boolean => {
          return value.id === this.sortFields()[this.sortingIndex].id;
        });
        return this.sortingDirection === 'asc' ? sortField!.compare(a, b) : sortField!.compare(b, a);
      })
      .map((value: ClusterSummary): (string | number | JSX.Element)[] => {
        return [
          serviceLink(value.service_fqdn, this.namespaces, this.namespace, false, parentKiosk),
          value.port,
          value.subset,
          value.direction,
          value.type,
          istioConfigLink(value.destination_rule, 'destinationrule')
        ];
      });
  }
}

export const ClusterSummaryTable = SummaryTableRenderer<ClusterTable>();
