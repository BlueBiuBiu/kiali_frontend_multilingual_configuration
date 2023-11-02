import * as React from 'react';

import { MTLSIconTypes } from './MTLSIcon';
import { MTLSStatus, emptyDescriptor, StatusDescriptor } from './MTLSStatus';
import { kialiStyle } from 'styles/StyleUtils';
import { MTLSStatuses } from '../../types/TLSStatus';

type Props = {
  status: string;
};

const statusDescriptors = new Map<string, StatusDescriptor>([
  [
    MTLSStatuses.ENABLED,
    {
      message: $t('tip241'),
      icon: MTLSIconTypes.LOCK_FULL_DARK,
      showStatus: true
    }
  ],
  [
    MTLSStatuses.ENABLED_EXTENDED,
    {
      message: $t('tip242'),
      icon: MTLSIconTypes.LOCK_FULL_DARK,
      showStatus: true
    }
  ],
  [
    MTLSStatuses.PARTIALLY,
    {
      message: $t('tip243'),
      icon: MTLSIconTypes.LOCK_HOLLOW_DARK,
      showStatus: true
    }
  ],
  [MTLSStatuses.DISABLED, emptyDescriptor],
  [MTLSStatuses.NOT_ENABLED, emptyDescriptor]
]);

// Magic style to align Istio Config icons on top of status overview
const iconStyle = kialiStyle({
  marginTop: -3,
  marginRight: 18,
  marginLeft: 2,
  width: 10
});

export class NamespaceMTLSStatus extends React.Component<Props> {
  render() {
    return <MTLSStatus status={this.props.status} className={iconStyle} statusDescriptors={statusDescriptors} />;
  }
}
