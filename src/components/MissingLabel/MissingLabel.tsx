import * as React from 'react';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { icons, serverConfig } from '../../config';
import { KialiIcon } from '../../config/KialiIcon';
import { kialiStyle } from 'styles/StyleUtils';
import { PFBadge } from '../Pf/PfBadges';

type MissingLabelProps = {
  missingApp: boolean;
  missingVersion: boolean;
  tooltip: boolean;
  style?: React.CSSProperties;
};

const infoStyle = kialiStyle({
  margin: '0px 5px 2px 4px',
  verticalAlign: '-5px !important'
});

export class MissingLabel extends React.Component<MissingLabelProps, {}> {
  render() {
    const appLabel = serverConfig.istioLabels.appLabelName;
    const versionLabel = serverConfig.istioLabels.versionLabelName;
    const icon = icons.istio.missingLabel.icon;
    const color = icons.istio.missingLabel.color;
    const tooltipContent = (
      <div style={{ textAlign: 'left' }}>
        {this.props.missingApp && (
          <>
            <div>
              <PFBadge badge={{ badge: appLabel }} isRead={true} style={{ marginRight: '0px' }} /> {$t('tip252')} <br />
            </div>
            <div>{$t('tip251')}</div>
          </>
        )}
        {this.props.missingVersion && (
          <>
            <div>
              <PFBadge badge={{ badge: versionLabel }} isRead={true} style={{ marginRight: '0px' }} /> {$t('tip252')}{' '}
              <br />
            </div>
            <div>{$t('tip253')}</div>
          </>
        )}
        <div>{$t('tip254')}</div>
      </div>
    );
    const iconComponent = (
      <span style={this.props.style}>
        {React.createElement(icon, { style: { color: color, verticalAlign: '-2px' } })}
        {!this.props.tooltip && (
          <span style={{ marginLeft: '8px' }}>
            Missing {this.props.missingApp ? 'App' : this.props.missingVersion ? 'Version' : 'Label'}
            <Tooltip key={`tooltip_missing_label`} position={TooltipPosition.top} content={tooltipContent}>
              <KialiIcon.Info className={infoStyle} />
            </Tooltip>
          </span>
        )}
      </span>
    );
    return this.props.tooltip ? (
      <Tooltip key={`tooltip_missing_label`} position={TooltipPosition.right} content={tooltipContent}>
        {iconComponent}
      </Tooltip>
    ) : (
      iconComponent
    );
  }
}
