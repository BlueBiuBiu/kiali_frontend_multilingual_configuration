import { PopoverPosition } from '@patternfly/react-core';
import { TourStopInfo, TourInfo } from 'components/Tour/TourStop';
import { GraphShortcuts } from './GraphToolbar/GraphShortcuts';

export const GraphTourStops: { [name: string]: TourStopInfo } = {
  ContextualMenu: {
    name: $t('ContextualMenu'),
    description: $t('description1'),
    position: PopoverPosition.left,
    distance: 250
  },
  ContextualMenuPF: {
    name: $t('ContextualMenu'),
    description: $t('description2'),
    position: PopoverPosition.left,
    distance: 250
  },
  Display: {
    name: $t('Display'),
    description: $t('description3'),
    position: PopoverPosition.rightStart
  },
  Find: {
    name: $t('FindAndHide'),
    description: $t('description4'),
    position: PopoverPosition.bottom
  },
  Graph: {
    name: $t('Graph'),
    description: $t('description5'),
    position: PopoverPosition.left,
    distance: 250
  },
  GraphPF: {
    name: $t('Graph'),
    description: $t('description6'),
    position: PopoverPosition.left,
    distance: 250
  },
  GraphTraffic: {
    name: $t('GraphTraffic'),
    description: $t('description7'),
    position: PopoverPosition.bottom
  },
  GraphType: {
    name: $t('GraphType'),
    description: $t('description8'),
    position: PopoverPosition.right
  },
  Layout: {
    name: $t('LayoutSelection'),
    description: $t('description9'),
    position: PopoverPosition.right
  },
  Legend: {
    name: $t('Legend'),
    description: $t('description10'),
    position: PopoverPosition.rightEnd
  },
  Namespaces: {
    name: $t('Namespaces'),
    description: $t('description11'),
    position: PopoverPosition.bottomStart
  },
  Shortcuts: {
    name: $t('Shortcuts'),
    htmlDescription: GraphShortcuts,
    position: PopoverPosition.leftStart
  },
  SidePanel: {
    name: $t('SidePanel'),
    description: $t('description12'),
    position: PopoverPosition.left
  },
  TimeRange: {
    name: $t('TimeRange&Replay'),
    description: $t('description13'),
    position: PopoverPosition.bottomEnd
  }
};

export const GraphTour: TourInfo = {
  name: $t('GraphTour'),
  stops: [
    GraphTourStops.Shortcuts,
    GraphTourStops.Namespaces,
    GraphTourStops.GraphTraffic,
    GraphTourStops.GraphType,
    GraphTourStops.Display,
    GraphTourStops.Find,
    GraphTourStops.TimeRange,
    GraphTourStops.Graph,
    GraphTourStops.ContextualMenu,
    GraphTourStops.SidePanel,
    GraphTourStops.Layout,
    GraphTourStops.Legend
  ]
};

export const GraphTourPF: TourInfo = {
  name: $t('GraphTour'),
  stops: [
    GraphTourStops.Shortcuts,
    GraphTourStops.Namespaces,
    GraphTourStops.GraphTraffic,
    GraphTourStops.GraphType,
    GraphTourStops.Display,
    GraphTourStops.Find,
    GraphTourStops.TimeRange,
    GraphTourStops.GraphPF,
    GraphTourStops.ContextualMenuPF,
    GraphTourStops.SidePanel,
    GraphTourStops.Layout,
    GraphTourStops.Legend
  ]
};
