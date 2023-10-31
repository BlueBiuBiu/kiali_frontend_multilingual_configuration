import * as React from 'react';
import { FormGroup, FormHelperText, HelperText, HelperTextItem, Switch, TextInput } from '@patternfly/react-core';
import { Abort } from '../../../types/IstioObjects';
import { HTTP_ABORT_TOOLTIP, wizardTooltip } from '../WizardHelp';
import { isValid } from 'utils/Common';

type Props = {
  aborted: boolean;
  abort: Abort;
  isValid: boolean;
  onAbort: (aborted: boolean, abort: Abort) => void;
};

export class AbortFault extends React.Component<Props> {
  render() {
    return (
      <>
        <FormGroup label={$t('AddHTTPAbort')} fieldId="abortSwitch">
          <Switch
            id="abortSwitch"
            label={' '}
            labelOff={' '}
            isChecked={this.props.aborted}
            onChange={() => this.props.onAbort(!this.props.aborted, this.props.abort)}
          />
          <span>{wizardTooltip(HTTP_ABORT_TOOLTIP)}</span>
        </FormGroup>
        {this.props.aborted && (
          <FormGroup label={$t('AbortPercentage')} fieldId="abort-percentage">
            <TextInput
              value={this.props.abort.percentage?.value}
              id="abort-percentage"
              name="abort-percentage"
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                newValue = newValue < 0 ? 0 : newValue > 100 ? 100 : newValue;
                this.props.onAbort(this.props.aborted, {
                  percentage: {
                    value: newValue
                  },
                  httpStatus: this.props.abort.httpStatus
                });
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>{$t('helpTip5')}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
        {this.props.aborted && (
          <FormGroup label={$t('HTTPStatusCode')} fieldId="abort-status-code">
            <TextInput
              value={this.props.abort.httpStatus}
              id="abort-status-code"
              name="abort-status-code"
              validated={isValid(this.props.isValid)}
              onChange={(_event, value) => {
                let newValue = Number(value || 0);
                newValue = Number.isNaN(newValue) ? 0 : newValue;
                this.props.onAbort(this.props.aborted, {
                  percentage: this.props.abort.percentage,
                  httpStatus: newValue
                });
              }}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  {isValid(this.props.isValid) ? $t('httpStatusMsg') : $t('httpStatusMsg')}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
      </>
    );
  }
}
