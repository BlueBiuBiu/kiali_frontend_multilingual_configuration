import * as React from 'react';
import { Alert, Card, CardBody } from '@patternfly/react-core';
import { ErrorBoundary } from './ErrorBoundary';

interface MessageProps {
  message: string;
}

export class ErrorBoundaryWithMessage extends React.Component<MessageProps> {
  alert() {
    return (
      <Card>
        <CardBody>
          <Alert variant="warning" title={this.props.message || $t('tip227')}>
            {' '}
          </Alert>
        </CardBody>
      </Card>
    );
  }

  render() {
    return <ErrorBoundary fallBackComponent={this.alert()}>{this.props.children}</ErrorBoundary>;
  }
}
