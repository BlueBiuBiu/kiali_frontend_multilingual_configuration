import { Tooltip, TooltipPosition, Label } from '@patternfly/react-core';
import { KialiIcon } from 'config/KialiIcon';
import * as React from 'react';
import { OutboundTrafficPolicy } from 'types/IstioObjects';
import { NamespaceInfo } from './NamespaceInfo';
import { infoStyle } from './OverviewCardControlPlaneNamespace';

type Props = {
  namespace: NamespaceInfo;
  outboundTrafficPolicy?: OutboundTrafficPolicy;
};

export class ControlPlaneNamespaceStatus extends React.Component<Props> {
  render() {
    let maxProxyPushTime: number | undefined = undefined;
    if (this.props.namespace.controlPlaneMetrics && this.props.namespace.controlPlaneMetrics.istiod_proxy_time) {
      maxProxyPushTime =
        this.props.namespace.controlPlaneMetrics?.istiod_proxy_time[0].datapoints.reduce((a, b) =>
          a[1] < b[1] ? a : b
        )[1] * 1000;
    }
    let showProxyPushTime = false;
    if (maxProxyPushTime && !isNaN(maxProxyPushTime)) {
      showProxyPushTime = true;
    }

    return (
      <div style={{ textAlign: 'left' }}>
        {this.props.outboundTrafficPolicy && (
          <div>
            <div style={{ display: 'inline-block', width: '125px', whiteSpace: 'nowrap' }}>{$t('OutboundPolicy')}</div>
            <Tooltip position={TooltipPosition.right} content={<div style={{ textAlign: 'left' }}>{$t('tip95')}</div>}>
              <Label isCompact color="blue">
                {this.props.outboundTrafficPolicy.mode}
                <KialiIcon.Info className={infoStyle} />
              </Label>
            </Tooltip>
          </div>
        )}
        {showProxyPushTime && (
          <div>
            <div style={{ display: 'inline-block', width: '125px', whiteSpace: 'nowrap' }}>{$t('ProxyPushTime')}</div>
            <Tooltip position={TooltipPosition.right} content={<div style={{ textAlign: 'left' }}>{$t('tip96')}</div>}>
              <Label isCompact color="blue">
                {maxProxyPushTime?.toFixed(2)} ms
                <KialiIcon.Info className={infoStyle} />
              </Label>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}
