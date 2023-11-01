import { PopoverPosition } from '@patternfly/react-core';
import { TourStopInfo, TourInfo } from 'components/Tour/TourStop';
import { GraphShortcuts } from './GraphToolbar/GraphShortcuts';

export const GraphTourStops: { [name: string]: TourStopInfo } = {
         ContextualMenu: {
           name: 'Contextual Menu',
           description: $t('description1'),
           position: PopoverPosition.left,
           distance: 250
         },
         ContextualMenuPF: {
           name: 'Contextual Menu',
           description: $t('description2'),
           position: PopoverPosition.left,
           distance: 250
         },
         Display: {
           name: 'Display',
           description: $t('description3'),
           position: PopoverPosition.rightStart
         },
         Find: {
           name: 'Find and Hide',
           description: $t('description4'),
           position: PopoverPosition.bottom
         },
         Graph: {
           name: 'Graph',
           description: $t('description5'),
           position: PopoverPosition.left,
           distance: 250
         },
         GraphPF: {
           name: 'Graph',
           description: $t('description6'),
           position: PopoverPosition.left,
           distance: 250
         },
         GraphTraffic: {
           name: 'Graph Traffic',
           description: $t('description7'),
           position: PopoverPosition.bottom
         },
         GraphType: {
           name: 'Graph Type',
           description: $t('description8'),
           position: PopoverPosition.right
         },
         Layout: {
           name: 'Layout selection',
           description: $t('description9'),
           position: PopoverPosition.right
         },
         Legend: {
           name: 'Legend',
           description: $t('description10'),
           position: PopoverPosition.rightEnd
         },
         Namespaces: {
           name: 'Namespaces',
           description: $t('description11'),
           position: PopoverPosition.bottomStart
         },
         Shortcuts: {
           name: 'Shortcuts',
           htmlDescription: GraphShortcuts,
           position: PopoverPosition.leftStart
         },
         SidePanel: {
           name: 'Side Panel',
           description: $t('description12'),
           position: PopoverPosition.left
         },
         TimeRange: {
           name: 'Time Range & Replay',
           description: $t('description13'),
           position: PopoverPosition.bottomEnd
         }
       };

export const GraphTour: TourInfo = {
  name: 'GraphTour',
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
  name: 'GraphTour',
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
