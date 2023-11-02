import * as React from 'react';
import { SummaryTable, SummaryTableRenderer } from './BaseTable';
import { ICell, ISortBy, sortable } from '@patternfly/react-table';
import { ListenerSummary } from '../../../types/IstioObjects';
import { ActiveFilter, FILTER_ACTION_APPEND, FilterType, AllFilterTypes } from '../../../types/Filters';
import { SortField } from '../../../types/SortFilters';
import { Namespace } from '../../../types/Namespace';
import { defaultFilter, routeLink } from '../../../helpers/EnvoyHelpers';
import { Tooltip } from '@patternfly/react-core';
import { PFColors } from 'components/Pf/PfColors';
import { KialiIcon } from 'config/KialiIcon';
import { kialiStyle } from 'styles/StyleUtils';

export class ListenerTable implements SummaryTable {
  summaries: ListenerSummary[];
  sortingIndex: number;
  sortingDirection: 'asc' | 'desc';
  namespaces: Namespace[];
  namespace: string;
  workload: string | undefined;
  routeLinkHandler: () => void;

  constructor(
    summaries: ListenerSummary[],
    sortBy: ISortBy,
    namespaces: Namespace[],
    namespace: string,
    workload: string | undefined,
    routeLinkHandler: () => void
  ) {
    this.summaries = summaries;
    this.sortingIndex = sortBy.index || 0;
    this.sortingDirection = sortBy.direction || 'asc';
    this.namespaces = namespaces;
    this.namespace = namespace;
    this.workload = workload;
    this.routeLinkHandler = routeLinkHandler;
  }

  availableFilters = (): FilterType[] => {
    return [
      {
        category: 'Address',
        placeholder: $t('Address'),
        filterType: AllFilterTypes.text,
        action: FILTER_ACTION_APPEND,
        filterValues: []
      },
      {
        category: 'Port',
        placeholder: $t('Port'),
        filterType: AllFilterTypes.text,
        action: FILTER_ACTION_APPEND,
        filterValues: []
      },
      {
        category: 'Match',
        placeholder: $t('Match'),
        filterType: AllFilterTypes.text,
        action: FILTER_ACTION_APPEND,
        filterValues: []
      },
      {
        category: 'Destination',
        placeholder: $t('Destination'),
        filterType: AllFilterTypes.text,
        action: FILTER_ACTION_APPEND,
        filterValues: []
      }
    ];
  };

  filterMethods = (): { [filter_id: string]: (summary, activeFilter) => boolean } => {
    return {
      Address: (entry: ListenerSummary, filter: ActiveFilter): boolean => {
        return entry.address.includes(filter.value);
      },
      Port: (entry: ListenerSummary, filter: ActiveFilter): boolean => {
        return entry.port.toString().includes(filter.value);
      },
      Match: (entry: ListenerSummary, filter: ActiveFilter): boolean => {
        return entry.match.includes(filter.value);
      },
      Destination: (entry: ListenerSummary, filter: ActiveFilter): boolean => {
        return entry.destination.includes(filter.value);
      }
    };
  };

  sortFields = (): SortField<ListenerSummary>[] => {
    return [
      {
        id: 'address',
        title: $t('Address'),
        isNumeric: false,
        param: 'addess',
        compare: (a, b) => {
          return a.address.localeCompare(b.address);
        }
      },
      {
        id: 'port',
        title: $t('Port'),
        isNumeric: true,
        param: 'port',
        compare: (a, b) => {
          return a.port - b.port;
        }
      },
      {
        id: 'match',
        title: $t('Match'),
        isNumeric: false,
        param: 'match',
        compare: (a, b) => {
          return a.match.localeCompare(b.match);
        }
      },
      {
        id: 'destination',
        title: $t('Destination'),
        isNumeric: false,
        param: 'destination',
        compare: (a, b) => {
          return a.destination.localeCompare(b.destination);
        }
      }
    ];
  };

  head = (): ICell[] => {
    return [
      {
        title: $t('Address'),
        transforms: [sortable],
        header: {
          info: {
            tooltip: <div className={kialiStyle({ textAlign: 'left' })}>{$t('tip224')}</div>
          }
        }
      },
      { title: $t('Port'), transforms: [sortable] },
      { title: $t('Match'), transforms: [sortable] },
      {
        title: $t('Destination'),
        transforms: [sortable],
        header: {
          info: {
            tooltip: <div className={kialiStyle({ textAlign: 'left' })}>{$t('tip225')}</div>
          }
        }
      }
    ];
  };

  resource = (): string => 'listeners';

  setSorting = (columnIndex: number, direction: 'asc' | 'desc') => {
    this.sortingDirection = direction;
    this.sortingIndex = columnIndex;
  };

  sortBy = (): ISortBy => {
    return {
      index: this.sortingIndex,
      direction: this.sortingDirection
    };
  };

  tooltip = (): React.ReactNode => {
    return (
      <Tooltip content={<div className={kialiStyle({ textAlign: 'left' })}>{$t('tip226')}</div>}>
        <KialiIcon.Help className={kialiStyle({ width: '14px', height: '14px', color: PFColors.Info })} />
      </Tooltip>
    );
  };

  rows(): (string | number | JSX.Element)[][] {
    return this.summaries
      .filter((value: ListenerSummary) => {
        return defaultFilter(value, this.filterMethods());
      })
      .sort((a: ListenerSummary, b: ListenerSummary) => {
        const sortField = this.sortFields().find((value: SortField<ListenerSummary>): boolean => {
          return value.id === this.sortFields()[this.sortingIndex].id;
        });
        return this.sortingDirection === 'asc' ? sortField!.compare(a, b) : sortField!.compare(b, a);
      })
      .map((summary: ListenerSummary) => {
        return [
          summary.address,
          summary.port,
          summary.match,
          routeLink(summary.destination, this.namespace, this.workload, this.routeLinkHandler)
        ];
      });
  }
}

export const ListenerSummaryTable = SummaryTableRenderer<ListenerTable>();
