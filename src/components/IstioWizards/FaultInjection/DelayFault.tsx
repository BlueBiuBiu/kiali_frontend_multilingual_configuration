import * as React from 'react';
import { FormGroup, FormHelperText, HelperText, HelperTextItem, Switch, TextInput } from '@patternfly/react-core';
import { Delay } from '../../../types/IstioObjects';
import { HTTP_DELAY_TOOLTIP, wizardTooltip } from '../WizardHelp';
import { isValid } from 'utils/Common';

export type DelayFaultProps = {
  delayed: boolean;
  delay: Delay;
  isValid: boolean;
  onDelay: (delayed: boolean, delay: Delay) => void;
};


export class DelayFault extends React.Component<DelayFaultProps> {
  render() {
    return (
      <>
        <FormGroup label={$t('AddHTTPDelay')} fieldId="delaySwitch">
          <Switch
            id="delaySwitch"
            label={' '}
            labelOff={' '}
            isChecked={this.props.delayed}
            onChange={() => this.props.onDelay(!this.props.delayed, this.props.delay)}
          />
          <span>{wizardTooltip(HTTP_DELAY_TOOLTIP)}</span>
        </FormGroup>
        {this.props.delayed && (
          <FormGroup label={$t('DelayPercentage')} fieldId="delay-percentage">
            <TextInput
              value={this.props.delay.percentage?.value}
              type="text"
              id="delay-percentage"
              name="delay-percentage"
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                newValue = newValue < 0 ? 0 : newValue > 100 ? 100 : newValue;
                this.props.onDelay(this.props.delayed, {
                  percentage: {
                    value: newValue
                  },
                  fixedDelay: this.props.delay.fixedDelay
                });
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>{$t('helpTip7')}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
        {this.props.delayed && (
          <FormGroup label={$t('FixedDelay')} fieldId="fixed-delay">
            <TextInput
              value={this.props.delay.fixedDelay}
              id="fixed-delay"
              name="fixed-delay"
              validated={isValid(this.props.isValid)}
              onChange={(_event, value) =>
                this.props.onDelay(this.props.delayed, {
                  percentage: this.props.delay.percentage,
                  fixedDelay: value
                })
              }
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>{$t('helpTip6')}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
      </>
    );
  }
}
