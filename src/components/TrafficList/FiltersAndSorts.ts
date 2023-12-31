import { FilterType } from '../../types/Filters';
import { SortField } from '../../types/SortFilters';
import { TrafficListItem } from './TrafficListComponent';

// Don't alter the index order without also updating TrafficListComponent.onSort
export const sortFields: SortField<TrafficListItem>[] = [
  {
    // index 0 is default sort
    id: 'trafficstatus',
    title: $t('Traffic_Status'),
    isNumeric: false,
    param: 'ts',
    compare: (a: TrafficListItem, b: TrafficListItem) => b.healthStatus.status.priority - a.healthStatus.status.priority // worst health first asc
  },
  {
    id: 'name',
    title: $t('Name'),
    isNumeric: false,
    param: 'na',
    compare: (a: TrafficListItem, b: TrafficListItem) => a.node.name.localeCompare(b.node.name)
  },
  {
    id: 'rate',
    title: $t('Rate'),
    isNumeric: false,
    param: 'ra',
    compare: (a: TrafficListItem, b: TrafficListItem) => a.trafficRate.localeCompare(b.trafficRate)
  },
  {
    id: 'percent',
    title: $t('PercentSuccess'),
    isNumeric: false,
    param: 'pe',
    compare: (a: TrafficListItem, b: TrafficListItem) => a.trafficPercentSuccess.localeCompare(b.trafficPercentSuccess)
  },
  {
    id: 'protocol',
    title: $t('Protocol'),
    isNumeric: false,
    param: 'pr',
    compare: (a: TrafficListItem, b: TrafficListItem) => a.protocol.localeCompare(b.protocol)
  }
];

export const availableFilters: FilterType[] = [];
