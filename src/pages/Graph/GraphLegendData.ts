// Node Shapes
import workloadImage from '../../assets/img/legend/node.svg';
import appImage from '../../assets/img/legend/app.svg';
import serviceImage from '../../assets/img/legend/service.svg';
import aggregateImage from '../../assets/img/legend/aggregate.svg';
import serviceEntryImage from '../../assets/img/legend/service-entry.svg';
// Node Colors
import nodeColorNormalImage from '../../assets/img/legend/node-color-normal.svg';
import nodeColorWarningImage from '../../assets/img/legend/node-color-warning.svg';
import nodeColorDangerImage from '../../assets/img/legend/node-color-danger.svg';
import nodeColorIdleImage from '../../assets/img/legend/node-color-idle.svg';
// Node Background
import externalNamespaceImage from '../../assets/img/legend/external-namespace.svg';
import restrictedNamespaceImage from '../../assets/img/legend/restricted-namespace.svg';
// Edges
import edgeSuccessImage from '../../assets/img/legend/edge-success.svg';
import edgeDangerImage from '../../assets/img/legend/edge-danger.svg';
import edgeWarnImage from '../../assets/img/legend/edge-warn.svg';
import edgeIdlemage from '../../assets/img/legend/edge-idle.svg';
import edgeTcpImage from '../../assets/img/legend/edge-tcp.svg';
import edgeMtlsImage from '../../assets/img/legend/mtls-badge.svg';
// Traffic Animation
import trafficNormalImage from '../../assets/img/legend/traffic-normal-request.svg';
import trafficFailedImage from '../../assets/img/legend/traffic-failed-request.svg';
import trafficTcpImage from '../../assets/img/legend/traffic-tcp.svg';
// Badges
import badgeCircuitBreakerImage from '../../assets/img/legend/node-badge-circuit-breaker.svg';
import badgeFaultInjectionImage from '../../assets/img/legend/node-badge-fault-injection.svg';
import badgeGatewaysImage from '../../assets/img/legend/node-badge-gateways.svg';
import badgeMirroringImage from '../../assets/img/legend/node-badge-mirroring.svg';
import badgeMissingSidecarImage from '../../assets/img/legend/node-badge-missing-sidecar.svg';
import badgeRequestTimeoutImage from '../../assets/img/legend/node-badge-request-timeout.svg';
import badgeTrafficShiftingSourceImage from '../../assets/img/legend/node-badge-traffic-shifting.svg';
import badgeTrafficSourceImage from '../../assets/img/legend/node-badge-traffic-source.svg';
import badgeVirtualServicesImage from '../../assets/img/legend/node-badge-virtual-services.svg';
import badgeWorkloadEntryImage from '../../assets/img/legend/node-badge-workload-entry.svg';

export interface GraphLegendItem {
  title: string;
  data: GraphLegendItemRow[];
}

export interface GraphLegendItemRow {
  label: string;
  icon: string;
}

export const legendData: GraphLegendItem[] = [
  {
    title: 'NodeShapes',
    data: [
      { label: 'Workload', icon: workloadImage },
      { label: 'App', icon: appImage },
      { label: 'Operation', icon: aggregateImage },
      { label: 'Service', icon: serviceImage },
      { label: 'Service Entry', icon: serviceEntryImage }
    ]
  },
  {
    title: 'NodeColors',
    data: [
      { label: 'Normal', icon: nodeColorNormalImage },
      { label: 'Warn', icon: nodeColorWarningImage },
      { label: 'Unhealthy', icon: nodeColorDangerImage },
      { label: 'Idle', icon: nodeColorIdleImage }
    ]
  },
  {
    title: 'NodeBackground',
    data: [
      { label: 'UnselectedNamespace', icon: externalNamespaceImage },
      { label: 'title10', icon: restrictedNamespaceImage }
    ]
  },
  {
    title: 'Edges',
    data: [
      { label: 'Failure', icon: edgeDangerImage },
      { label: 'Degraded', icon: edgeWarnImage },
      { label: 'Healthy', icon: edgeSuccessImage },
      { label: 'TCPConnection', icon: edgeTcpImage },
      { label: 'Idle', icon: edgeIdlemage },
      { label: 'title11', icon: edgeMtlsImage }
    ]
  },
  {
    title: 'TrafficAnimation',
    data: [
      { label: 'NormalRequest', icon: trafficNormalImage },
      { label: 'FailedRequest', icon: trafficFailedImage },
      { label: 'TCPTraffic', icon: trafficTcpImage }
    ]
  },
  {
    title: 'NodeBadges',
    data: [
      { label: 'CircuitBreaker', icon: badgeCircuitBreakerImage },
      { label: 'FaultInjection', icon: badgeFaultInjectionImage },
      { label: 'Gateway', icon: badgeGatewaysImage },
      { label: 'Mirroring', icon: badgeMirroringImage },
      { label: 'MissingSidecar', icon: badgeMissingSidecarImage },
      { label: 'RequestTimeout', icon: badgeRequestTimeoutImage },
      { label: 'title12', icon: badgeTrafficShiftingSourceImage },
      { label: 'TrafficSource', icon: badgeTrafficSourceImage },
      { label: 'title13', icon: badgeVirtualServicesImage },
      { label: 'Workload_Entry', icon: badgeWorkloadEntryImage }
    ]
  }
];
