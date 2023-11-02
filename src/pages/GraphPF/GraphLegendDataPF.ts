// Node Shapes
import workloadImage from '../../assets/img/legend-pf/node.svg';
import appImage from '../../assets/img/legend-pf/app.svg';
import serviceImage from '../../assets/img/legend-pf/service.svg';
import aggregateImage from '../../assets/img/legend-pf/aggregate.svg';
import serviceEntryImage from '../../assets/img/legend-pf/service-entry.svg';
// Node Colors
import nodeColorHealthyImage from '../../assets/img/legend-pf/node-color-healthy.svg';
import nodeColorWarningImage from '../../assets/img/legend-pf/node-color-warning.svg';
import nodeColorDangerImage from '../../assets/img/legend-pf/node-color-danger.svg';
import nodeColorIdleImage from '../../assets/img/legend-pf/node-color-idle.svg';
// Node Background
import externalNamespaceImage from '../../assets/img/legend-pf/external-namespace.svg';
import restrictedNamespaceImage from '../../assets/img/legend-pf/restricted-namespace.svg';
// Edges
import edgeSuccessImage from '../../assets/img/legend-pf/edge-success.svg';
import edgeDangerImage from '../../assets/img/legend-pf/edge-danger.svg';
import edgeWarnImage from '../../assets/img/legend-pf/edge-warn.svg';
import edgeIdlemage from '../../assets/img/legend-pf/edge-idle.svg';
import edgeTcpImage from '../../assets/img/legend-pf/edge-tcp.svg';
import edgeMtlsImage from '../../assets/img/legend-pf/mtls-badge.svg';
// Traffic Animation
import trafficHealthyImage from '../../assets/img/legend-pf/traffic-healthy-request.svg';
import trafficFailedImage from '../../assets/img/legend-pf/traffic-failed-request.svg';
import trafficTcpImage from '../../assets/img/legend-pf/traffic-tcp.svg';
// Badges
import badgeCircuitBreakerImage from '../../assets/img/legend-pf/node-badge-circuit-breaker.svg';
import badgeFaultInjectionImage from '../../assets/img/legend-pf/node-badge-fault-injection.svg';
import badgeGatewaysImage from '../../assets/img/legend-pf/node-badge-gateways.svg';
import badgeMirroringImage from '../../assets/img/legend-pf/node-badge-mirroring.svg';
import badgeMissingSidecarImage from '../../assets/img/legend-pf/node-badge-missing-sidecar.svg';
import badgeRequestTimeoutImage from '../../assets/img/legend-pf/node-badge-request-timeout.svg';
import badgeTrafficShiftingSourceImage from '../../assets/img/legend-pf/node-badge-traffic-shifting.svg';
import badgeTrafficSourceImage from '../../assets/img/legend-pf/node-badge-traffic-source.svg';
import badgeVirtualServicesImage from '../../assets/img/legend-pf/node-badge-virtual-services.svg';
import badgeWorkloadEntryImage from '../../assets/img/legend-pf/node-badge-workload-entry.svg';

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
    title: $t('NodeShapes'),
    data: [
      { label: $t('Workload'), icon: workloadImage },
      { label: $t('App'), icon: appImage },
      { label: $t('Operation'), icon: aggregateImage },
      { label: $t('Service'), icon: serviceImage },
      { label: $t('Service Entry'), icon: serviceEntryImage }
    ]
  },
  {
    title: $t('NodeColors'),
    data: [
      { label: $t('Healthy'), icon: nodeColorHealthyImage },
      { label: $t('Warn'), icon: nodeColorWarningImage },
      { label: $t('Unhealthy'), icon: nodeColorDangerImage },
      { label: $t('Idle'), icon: nodeColorIdleImage }
    ]
  },
  {
    title: $t('NodeBackground'),
    data: [
      { label: $t('UnselectedNamespace'), icon: externalNamespaceImage },
      { label: $t('title10'), icon: restrictedNamespaceImage }
    ]
  },
  {
    title: $t('Edges'),
    data: [
      { label: $t('Failure'), icon: edgeDangerImage },
      { label: $t('Degraded'), icon: edgeWarnImage },
      { label: $t('Healthy'), icon: edgeSuccessImage },
      { label: $t('TCPConnection'), icon: edgeTcpImage },
      { label: $t('Idle'), icon: edgeIdlemage },
      { label: $t('title11'), icon: edgeMtlsImage }
    ]
  },
  {
    title: $t('TrafficAnimation'),
    data: [
      { label: $t('HealthyRequest'), icon: trafficHealthyImage },
      { label: $t('FailedRequest'), icon: trafficFailedImage },
      { label: $t('TCPTraffic'), icon: trafficTcpImage }
    ]
  },
  {
    title: $t('NodeBadges'),
    data: [
      { label: $t('CircuitBreaker'), icon: badgeCircuitBreakerImage },
      { label: $t('FaultInjection'), icon: badgeFaultInjectionImage },
      { label: $t('Gateway'), icon: badgeGatewaysImage },
      { label: $t('Mirroring'), icon: badgeMirroringImage },
      { label: $t('MissingSidecar'), icon: badgeMissingSidecarImage },
      { label: $t('RequestTimeout'), icon: badgeRequestTimeoutImage },
      { label: $t('title12'), icon: badgeTrafficShiftingSourceImage },
      { label: $t('TrafficSource'), icon: badgeTrafficSourceImage },
      { label: $t('title13'), icon: badgeVirtualServicesImage },
      { label: $t('Workload_Entry'), icon: badgeWorkloadEntryImage }
    ]
  }
];
