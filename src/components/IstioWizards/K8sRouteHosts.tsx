import * as React from 'react';
import { Form, FormGroup, FormHelperText, HelperText, HelperTextItem, TextInput } from '@patternfly/react-core';
import { K8sGatewaySelectorState } from './K8sGatewaySelector';
import { isValid } from 'utils/Common';
import { isK8sGatewayHostValid } from '../../utils/IstioConfigUtils';

type Props = {
  valid: boolean;
  k8sRouteHosts: string[];
  gateway?: K8sGatewaySelectorState;
  onK8sRouteHostsChange: (valid: boolean, k8sRouteHosts: string[]) => void;
};

export class K8sRouteHosts extends React.Component<Props> {
  isK8sRouteHostsValid = (k8sRouteHosts: string[]): boolean => {
    // All k8s route hosts must be valid
    return k8sRouteHosts.every(host => {
      return isK8sGatewayHostValid(host);
    });
  };

  render() {
    const k8sRouteHosts = this.props.k8sRouteHosts.length > 0 ? this.props.k8sRouteHosts.join(',') : '';
    return (
      <Form isHorizontal={true}>
        <FormGroup label={$t('K8sHTTPRouteHosts')} fieldId="advanced-k8sRouteHosts">
          <TextInput
            value={k8sRouteHosts}
            id="advanced-k8sRouteHosts"
            name="advanced-k8sRouteHosts"
            onChange={(_event, value) => {
              const k8sRouteHosts = value.split(',');
              const isValid = this.isK8sRouteHostsValid(k8sRouteHosts);
              this.props.onK8sRouteHostsChange(isValid, k8sRouteHosts);
            }}
            validated={isValid(this.props.valid)}
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem>{isValid(this.props.valid) ? $t('helpTip13') : $t('helpTip11')}</HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      </Form>
    );
  }
}
