import * as React from 'react';
import { FormGroup, FormHelperText, HelperText, HelperTextItem, Switch, TextInput } from '@patternfly/react-core';
import { ConnectionPoolSettings } from '../../../types/IstioObjects';
import { CONNECTION_POOL_TOOLTIP, wizardTooltip } from '../WizardHelp';

type Props = {
  isConnectionPool: boolean;
  connectionPool: ConnectionPoolSettings;
  onConnectionPool: (isConnectionPool: boolean, connectionPool: ConnectionPoolSettings) => void;
};

export class ConnectionPool extends React.Component<Props> {
  render() {
    return (
      <>
        <FormGroup label={$t('AddConnectionPool')} fieldId="cpSwitch">
          <Switch
            id="cpSwitch"
            label={' '}
            labelOff={' '}
            isChecked={this.props.isConnectionPool}
            onChange={() => this.props.onConnectionPool(!this.props.isConnectionPool, this.props.connectionPool)}
          />
          <span>{wizardTooltip(CONNECTION_POOL_TOOLTIP)}</span>
        </FormGroup>
        {this.props.isConnectionPool && (
          <FormGroup label={$t('MaxConnections')} fieldId="maxConnections">
            <TextInput
              value={this.props.connectionPool.tcp?.maxConnections}
              id="maxConnections"
              name="maxConnections"
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                const cp = this.props.connectionPool;
                if (!cp.tcp) {
                  cp.tcp = {};
                }
                cp.tcp.maxConnections = newValue;
                this.props.onConnectionPool(this.props.isConnectionPool, cp);
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>Maximum number of HTTP1 /TCP connections to a destination host</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
        {this.props.isConnectionPool && (
          <FormGroup label={$t('helpTip2')} fieldId="http1MaxPendingRequests">
            <TextInput
              value={this.props.connectionPool.http?.http1MaxPendingRequests}
              id="http1MaxPendingRequests"
              name="http1MaxPendingRequests"
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                const cp = this.props.connectionPool;
                if (!cp.http) {
                  cp.http = {};
                }
                cp.http.http1MaxPendingRequests = newValue;
                this.props.onConnectionPool(this.props.isConnectionPool, cp);
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>{$t('helpTip3')}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
      </>
    );
  }
}
