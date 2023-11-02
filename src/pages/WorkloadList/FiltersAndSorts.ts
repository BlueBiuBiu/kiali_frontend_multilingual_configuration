import {
  ActiveFiltersInfo,
  FILTER_ACTION_APPEND,
  FILTER_ACTION_UPDATE,
  FilterType,
  AllFilterTypes,
  ToggleType
} from '../../types/Filters';
import { WorkloadListItem, WorkloadType } from '../../types/Workload';
import { SortField } from '../../types/SortFilters';
import { hasHealth } from '../../types/Health';
import {
  presenceValues,
  istioSidecarFilter,
  healthFilter,
  labelFilter,
  getFilterSelectedValues,
  getPresenceFilterValue,
  filterByHealth
} from '../../components/Filters/CommonFilters';
import { hasMissingSidecar } from '../../components/VirtualList/Config';
import { TextInputTypes } from '@patternfly/react-core';
import { filterByLabel } from '../../helpers/LabelFilterHelper';
import { calculateErrorRate } from '../../types/ErrorRate';
import { istioConfigTypeFilter } from '../IstioConfigList/FiltersAndSorts';
import { compareObjectReferences } from '../AppList/FiltersAndSorts';
import { serverConfig } from 'config';

const missingLabels = (r: WorkloadListItem): number => {
  return r.appLabel && r.versionLabel ? 0 : r.appLabel || r.versionLabel ? 1 : 2;
};

export const sortFields: SortField<WorkloadListItem>[] = [
  {
    id: 'namespace',
    title: $t('Namespace'),
    isNumeric: false,
    param: 'ns',
    compare: (a: WorkloadListItem, b: WorkloadListItem) => {
      let sortValue = a.namespace.localeCompare(b.namespace);
      if (sortValue === 0) {
        sortValue = a.name.localeCompare(b.name);
      }
      return sortValue;
    }
  },
  {
    id: 'workloadname',
    title: $t('WorkloadName'),
    isNumeric: false,
    param: 'wn',
    compare: (a: WorkloadListItem, b: WorkloadListItem) => a.name.localeCompare(b.name)
  },
  {
    id: 'workloadtype',
    title: $t('WorkloadType'),
    isNumeric: false,
    param: 'wt',
    compare: (a: WorkloadListItem, b: WorkloadListItem) => a.type.localeCompare(b.type)
  },
  {
    id: 'details',
    title: $t('Details'),
    isNumeric: false,
    param: 'is',
    compare: (a: WorkloadListItem, b: WorkloadListItem) => {
      // First sort by missing sidecar
      const aSC = hasMissingSidecar(a) ? 1 : 0;
      const bSC = hasMissingSidecar(b) ? 1 : 0;
      if (aSC !== bSC) {
        return aSC - bSC;
      }

      // Second by Details
      const iRefA = a.istioReferences;
      const iRefB = b.istioReferences;
      const cmpRefs = compareObjectReferences(iRefA, iRefB);
      if (cmpRefs !== 0) {
        return cmpRefs;
      }

      // Then by additional details
      const iconA = a.additionalDetailSample && a.additionalDetailSample.icon;
      const iconB = b.additionalDetailSample && b.additionalDetailSample.icon;
      if (iconA || iconB) {
        if (iconA && iconB) {
          const cmp = iconA.localeCompare(iconB);
          if (cmp !== 0) {
            return cmp;
          }
        } else {
          // Make asc => icon absence is last
          return iconA ? -1 : 1;
        }
      }
      // Second by  missing labels
      const missingA = missingLabels(a);
      const missingB = missingLabels(b);
      if (missingA !== missingB) {
        return missingA > missingB ? 1 : -1;
      }
      // Finally by name
      return a.name.localeCompare(b.name);
    }
  },
  {
    id: 'applabel',
    title: $t('AppLabel'),
    isNumeric: false,
    param: 'al',
    compare: (a: WorkloadListItem, b: WorkloadListItem) => {
      if (a.appLabel && !b.appLabel) {
        return -1;
      } else if (!a.appLabel && b.appLabel) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    }
  },
  {
    id: 'versionlabel',
    title: $t('VersionLabel'),
    isNumeric: false,
    param: 'vl',
    compare: (a: WorkloadListItem, b: WorkloadListItem) => {
      if (a.versionLabel && !b.versionLabel) {
        return -1;
      } else if (!a.versionLabel && b.versionLabel) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    }
  },
  {
    id: 'labelValidation',
    title: $t('LabelValidation'),
    isNumeric: false,
    param: 'lb',
    compare: (a: WorkloadListItem, b: WorkloadListItem) => {
      if (a.versionLabel && a.appLabel && !(b.versionLabel && b.appLabel)) {
        return -1;
      } else if (!(a.versionLabel && a.appLabel) && b.versionLabel && b.appLabel) {
        return 1;
      } else {
        if (a.appLabel && !b.appLabel) {
          return 1;
        } else if (!a.appLabel && b.appLabel) {
          return -1;
        } else {
          if (a.versionLabel && !b.versionLabel) {
            return 1;
          } else if (!a.versionLabel && b.versionLabel) {
            return -1;
          } else {
            return a.name.localeCompare(b.name);
          }
        }
      }
    }
  },
  {
    id: 'health',
    title: $t('Health'),
    isNumeric: false,
    param: 'he',
    compare: (a, b) => {
      if (hasHealth(a) && hasHealth(b)) {
        const statusForA = a.health.getGlobalStatus();
        const statusForB = b.health.getGlobalStatus();

        if (statusForA.priority === statusForB.priority) {
          // If both workloads have same health status, use error rate to determine order.
          const ratioA = calculateErrorRate(a.namespace, a.name, 'workload', a.health.requests).errorRatio.global.status
            .value;
          const ratioB = calculateErrorRate(b.namespace, b.name, 'workload', b.health.requests).errorRatio.global.status
            .value;
          return ratioA === ratioB ? a.name.localeCompare(b.name) : ratioB - ratioA;
        }

        return statusForB.priority - statusForA.priority;
      } else {
        return 0;
      }
    }
  },
  {
    id: 'cluster',
    title: $t('Cluster'),
    isNumeric: false,
    param: 'cl',
    compare: (a: WorkloadListItem, b: WorkloadListItem) => {
      if (a.cluster && b.cluster) {
        let sortValue = a.cluster.localeCompare(b.cluster);
        if (sortValue === 0) {
          sortValue = a.name.localeCompare(b.name);
        }
        return sortValue;
      } else {
        return 0;
      }
    }
  }
];

const workloadNameFilter: FilterType = {
  category: 'Workload Name',
  placeholder: $t('placeholder29'),
  filterType: TextInputTypes.text,
  action: FILTER_ACTION_APPEND,
  filterValues: []
};

export const appLabelFilter: FilterType = {
  category: 'App Label',
  placeholder: $t('placeholder30'),
  filterType: AllFilterTypes.select,
  action: FILTER_ACTION_UPDATE,
  filterValues: presenceValues
};

export const versionLabelFilter: FilterType = {
  category: 'Version Label',
  placeholder: $t('placeholder44'),
  filterType: AllFilterTypes.select,
  action: FILTER_ACTION_UPDATE,
  filterValues: presenceValues
};

const workloadTypeFilter: FilterType = {
  category: 'Workload Type',
  placeholder: $t('placeholder31'),
  filterType: AllFilterTypes.typeAhead,
  action: FILTER_ACTION_APPEND,
  filterValues: [
    {
      id: WorkloadType.CronJob,
      title: $t('WorkloadTypeLabel.CronJob')
    },
    {
      id: WorkloadType.DaemonSet,
      title: $t('WorkloadTypeLabel.DaemonSet')
    },
    {
      id: WorkloadType.Deployment,
      title: $t('WorkloadTypeLabel.Deployment')
    },
    {
      id: WorkloadType.DeploymentConfig,
      title: $t('WorkloadTypeLabel.DeploymentConfig')
    },
    {
      id: WorkloadType.Job,
      title: $t('WorkloadTypeLabel.Job')
    },
    {
      id: WorkloadType.Pod,
      title: $t('WorkloadTypeLabel.Pod')
    },
    {
      id: WorkloadType.ReplicaSet,
      title: $t('WorkloadTypeLabel.ReplicaSet')
    },
    {
      id: WorkloadType.ReplicationController,
      title: $t('WorkloadTypeLabel.ReplicationController')
    },
    {
      id: WorkloadType.StatefulSet,
      title: $t('WorkloadTypeLabel.StatefulSet')
    }
  ]
};

export const availableFilters: FilterType[] = [
  workloadNameFilter,
  workloadTypeFilter,
  istioConfigTypeFilter,
  istioSidecarFilter,
  healthFilter,
  appLabelFilter,
  versionLabelFilter,
  labelFilter
];

/** Filter Method */
const includeName = (name: string, names: string[]) => {
  for (let i = 0; i < names.length; i++) {
    if (name.includes(names[i])) {
      return true;
    }
  }
  return false;
};

const filterByType = (items: WorkloadListItem[], filter: string[]): WorkloadListItem[] => {
  if (filter && filter.length === 0) {
    return items;
  }
  return items.filter(item => includeName(item.type, filter));
};

const filterByLabelPresence = (
  items: WorkloadListItem[],
  istioSidecar: boolean | undefined,
  app: boolean | undefined,
  version: boolean | undefined
): WorkloadListItem[] => {
  let result = items;
  if (istioSidecar !== undefined) {
    result = result.filter(item => item.istioSidecar === istioSidecar);
  }
  if (app !== undefined) {
    result = result.filter(item => item.appLabel === app);
  }
  if (version !== undefined) {
    result = result.filter(item => item.versionLabel === version);
  }
  return result;
};

const filterByName = (items: WorkloadListItem[], names: string[]): WorkloadListItem[] => {
  if (names.length === 0) {
    return items;
  }
  return items.filter(item => names.some(name => item.name.includes(name)));
};

const filterByIstioType = (items: WorkloadListItem[], istioTypes: string[]): WorkloadListItem[] => {
  return items.filter(item => item.istioReferences.filter(ref => istioTypes.includes(ref.objectType)).length !== 0);
};

export const filterBy = (items: WorkloadListItem[], filters: ActiveFiltersInfo): WorkloadListItem[] => {
  const workloadTypeFilters = getFilterSelectedValues(workloadTypeFilter, filters);
  const workloadNamesSelected = getFilterSelectedValues(workloadNameFilter, filters);
  const istioSidecar = getPresenceFilterValue(istioSidecarFilter, filters);
  const appLabel = getPresenceFilterValue(appLabelFilter, filters);
  const versionLabel = getPresenceFilterValue(versionLabelFilter, filters);
  const labelFilters = getFilterSelectedValues(labelFilter, filters);

  let ret = items;
  ret = filterByType(ret, workloadTypeFilters);
  ret = filterByName(ret, workloadNamesSelected);
  ret = filterByLabelPresence(ret, istioSidecar, appLabel, versionLabel);
  ret = filterByLabel(ret, labelFilters, filters.op) as WorkloadListItem[];

  // We may have to perform a second round of filtering, using data fetched asynchronously (health)
  // If not, exit fast
  const healthSelected = getFilterSelectedValues(healthFilter, filters);
  if (healthSelected.length > 0) {
    return filterByHealth(ret, healthSelected);
  }

  const istioTypeSelected = getFilterSelectedValues(istioConfigTypeFilter, filters);
  if (istioTypeSelected.length > 0) {
    return filterByIstioType(ret, istioTypeSelected);
  }
  return ret;
};

/** Column Toggle Method */

const healthToggle: ToggleType = {
  label: $t('Health'),
  name: 'health',
  isChecked: true
};

const istioResourcesToggle: ToggleType = {
  label: $t('IstioResourcesDetail'),
  name: 'istioResources',
  isChecked: true
};

export const getAvailableToggles = (): ToggleType[] => {
  healthToggle.isChecked = serverConfig.kialiFeatureFlags.uiDefaults.list.includeHealth;
  istioResourcesToggle.isChecked = serverConfig.kialiFeatureFlags.uiDefaults.list.includeIstioResources;
  return [healthToggle, istioResourcesToggle];
};

/** Sort Method */

export const sortWorkloadsItems = (
  unsorted: WorkloadListItem[],
  sortField: SortField<WorkloadListItem>,
  isAscending: boolean
): WorkloadListItem[] => {
  return unsorted.sort(isAscending ? sortField.compare : (a, b) => sortField.compare(b, a));
};
