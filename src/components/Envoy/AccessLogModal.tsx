import * as React from 'react';
import { Button, ButtonVariant, Modal, Split, SplitItem } from '@patternfly/react-core';
import { kialiStyle } from 'styles/StyleUtils';
import { AccessLog } from 'types/IstioObjects';
import { PFColors } from 'components/Pf/PfColors';
import { classes } from 'typestyle';

export interface AccessLogModalProps {
  accessLog: AccessLog;
  accessLogMessage: string;
  className?: string;
  onClose?: () => void;
}

const fieldStyle = kialiStyle({
  color: PFColors.Gold400,
  display: 'inline-block'
});

const modalStyle = kialiStyle({
  height: '70%',
  width: '50%'
});

const prefaceStyle = kialiStyle({
  fontFamily: 'monospace',
  fontSize: 'var(--kiali-global--font-size)',
  backgroundColor: PFColors.Black1000,
  color: PFColors.Gold400,
  margin: '10px 10px 15px 10px',
  overflow: 'auto',
  resize: 'none',
  padding: '10px',
  whiteSpace: 'pre',
  width: 'calc(100% - 15px)'
});

const splitStyle = kialiStyle({
  overflow: 'auto',
  width: '50%'
});

const contentStyle = kialiStyle({
  marginRight: '10px'
});

const descriptionStyle = kialiStyle({
  backgroundColor: PFColors.BackgroundColor200,
  padding: '15px 20px',
  $nest: {
    '& dt': {
      fontWeight: 'bold'
    }
  }
});

type AccessLogModalState = {
  description: React.ReactFragment;
};

export class AccessLogModal extends React.Component<AccessLogModalProps, AccessLogModalState> {
  constructor(props) {
    super(props);

    this.state = {
      description: (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <dt>{$t('tip170')}</dt>
        </div>
      )
    };
  }

  render() {
    return (
      <Modal
        className={modalStyle}
        style={{ overflow: 'auto', overflowY: 'hidden' }}
        disableFocusTrap={true}
        title={$t('EnvoyAccessLogEntry')}
        isOpen={true}
        onClose={this.props.onClose}
      >
        <div style={{ height: '85%' }}>
          <div className={prefaceStyle}>{this.props.accessLogMessage} </div>
          <Split style={{ height: '100%' }}>
            <SplitItem className={classes(splitStyle, contentStyle)}>
              {this.accessLogContent(this.props.accessLog)}
            </SplitItem>
            <SplitItem className={classes(splitStyle, descriptionStyle)}>{this.state.description}</SplitItem>
          </Split>
        </div>
      </Modal>
    );
  }

  private accessLogContent = (al: AccessLog): any => {
    return (
      <div style={{ textAlign: 'left' }}>
        {this.accessLogField('authority', al.authority)}
        {this.accessLogField('bytes received', al.bytes_received)}
        {this.accessLogField('bytes sent', al.bytes_sent)}
        {this.accessLogField('downstream local', al.downstream_local)}
        {this.accessLogField('downstream remote', al.downstream_remote)}
        {this.accessLogField('duration', al.duration)}
        {this.accessLogField('forwarded for', al.forwarded_for)}
        {this.accessLogField('method', al.method)}
        {this.accessLogField('protocol', al.protocol)}
        {this.accessLogField('request id', al.request_id)}
        {this.accessLogField('requested server', al.requested_server)}
        {this.accessLogField('response flags', al.response_flags)}
        {this.accessLogField('route name', al.route_name)}
        {this.accessLogField('status code', al.status_code)}
        {this.accessLogField('tcp service time', al.tcp_service_time)}
        {this.accessLogField('timestamp', al.timestamp)}
        {this.accessLogField('upstream cluster', al.upstream_cluster)}
        {this.accessLogField('upstream failure reason', al.upstream_failure_reason)}
        {this.accessLogField('upstream local', al.upstream_local)}
        {this.accessLogField('upstream service', al.upstream_service)}
        {this.accessLogField('upstream service time', al.upstream_service_time)}
        {this.accessLogField('uri param', al.uri_param)}
        {this.accessLogField('uri path', al.uri_path)}
        {this.accessLogField('user agent', al.user_agent)}
      </div>
    );
  };

  private accessLogField = (key: string, val: string): any => {
    return (
      <>
        <Button key={key} className={fieldStyle} variant={ButtonVariant.link} onClick={() => this.handleClick(key)}>
          {key}:&nbsp;
        </Button>
        <span>{val ? val : '-'}</span>
        <br />
      </>
    );
  };

  private handleClick = (alFieldName: string) => {
    this.setState({ description: this.getDescription(alFieldName) });
  };

  private getDescription = (alFieldName: string): React.ReactFragment => {
    console.log(`fetch docs(${alFieldName})`);
    switch (alFieldName) {
      case 'authority':
        return (
          <>
            <dt>%REQ(X?Y):Z%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip171')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip172')}</p>
                </dd>
              </dl>
            </dd>
          </>
        );
      case 'bytes received':
        return (
          <>
            <dt>%{$t('BYTES_RECEIVED')}%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip173')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip174')}</p>
                </dd>
              </dl>
              <p>{$t('tip182')}</p>
            </dd>
          </>
        );
      case 'bytes sent':
        return (
          <>
            <dt>%{$t('BYTES_SENT')}%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip175')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip176')}</p>
                </dd>
              </dl>
              <p>{$t('tip182')}</p>
            </dd>
          </>
        );
      case 'downstream local':
        return (
          <>
            <dt>%{$t('DOWNSTREAM_LOCAL_ADDRESS')}%</dt>
            <dd>
              <p>
                {$t('tip177')}{' '}
                <a
                  className="reference internal"
                  href="/docs/envoy/latest/configuration/listeners/listener_filters/original_dst_filter#config-listener-filters-original-dst"
                >
                  <span className="std std-ref">{$t('tip178')}</span>
                </a>{' '}
                {$t('tip179')}
              </p>
            </dd>
          </>
        );
      case 'downstream remote':
        return (
          <>
            <dt>%{$t('DOWNSTREAM_REMOTE_ADDRESS')}%</dt>
            <dd>
              <p>{$t('tip336')}</p>
              <div className="admonition note">
                <p className="admonition-title">{$t('Note')}</p>
                <p>
                  This may not be the physical remote address of the peer if the address has been inferred from{' '}
                  <a
                    className="reference internal"
                    href="/docs/envoy/latest/configuration/listeners/listener_filters/proxy_protocol#config-listener-filters-proxy-protocol"
                  >
                    <span className="std std-ref">Proxy Protocol filter</span>
                  </a>{' '}
                  or{' '}
                  <a
                    className="reference internal"
                    href="/docs/envoy/latest/configuration/http/http_conn_man/headers#config-http-conn-man-headers-x-forwarded-for"
                  >
                    <span className="std std-ref">x-forwarded-for</span>
                  </a>
                  .
                </p>
              </div>
            </dd>
          </>
        );
      case 'duration':
        return (
          <>
            <dt>%{$t('DURATION')}%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip180')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip181')}</p>
                </dd>
              </dl>
              <p>{$t('tip182')}</p>
            </dd>
          </>
        );
      case 'forwarded for':
        return (
          <>
            <dt>%REQ(X?Y):Z%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip183')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip184')}</p>
                </dd>
              </dl>
            </dd>
          </>
        );
      case 'method':
        return (
          <>
            <dt>%REQ(X?Y):Z%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip185')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip184')}</p>
                </dd>
              </dl>
            </dd>
          </>
        );
      case 'protocol':
        return (
          <>
            <dt>%{$t('PROTOCOL')}%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>
                    Protocol. Currently either <em>HTTP/1.1</em> or <em>HTTP/2</em>.
                  </p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip172')}</p>
                </dd>
              </dl>
              <p>
                {$t('tip354')}{' '}
                <code className="docutils literal notranslate">
                  <span className="pre">&quot;-&quot;</span>
                </code>{' '}
                {$t('tip355')}
              </p>
            </dd>
          </>
        );
      case 'request id':
        return (
          <>
            <dt>%REQ(X?Y):Z%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip186')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('172')}</p>
                </dd>
              </dl>
            </dd>
          </>
        );
      case 'requested server':
        return (
          <>
            <dt>%{$t('REQUESTED_SERVER_NAME')}%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip187')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip188')}</p>
                </dd>
              </dl>
            </dd>
          </>
        );
      case 'response flags':
        return (
          <>
            <dt>%{$t('RESPONSE_FLAGS')}%</dt>
            <dd>
              <p>{$t('tip189')}:</p>
              <dl className="simple">
                <dt>HTTP and TCP</dt>
                <dd>
                  <ul className="simple">
                    <li>
                      <p>
                        <strong>UH</strong>: {$t('tip190')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>UF</strong>: {$t('tip191')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>UO</strong>: Upstream overflow (
                        <a
                          className="reference internal"
                          href="/docs/envoy/latest/intro/arch_overview/upstream/circuit_breaking#arch-overview-circuit-break"
                        >
                          <span className="std std-ref">circuit breaking</span>
                        </a>
                        ) in addition to 503 response code.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>NR</strong>: No{' '}
                        <a
                          className="reference internal"
                          href="/docs/envoy/latest/intro/arch_overview/http/http_routing#arch-overview-http-routing"
                        >
                          <span className="std std-ref">route configured</span>
                        </a>{' '}
                        for a given request in addition to 404 response code, or no matching filter chain for a
                        downstream connection.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>URX</strong>: The request was rejected because the{' '}
                        <a
                          className="reference internal"
                          href="/docs/envoy/latest/api-v3/config/route/v3/route_components.proto#envoy-v3-api-field-config-route-v3-retrypolicy-num-retries"
                        >
                          <span className="std std-ref">upstream retry limit (HTTP)</span>
                        </a>{' '}
                        or{' '}
                        <a
                          className="reference internal"
                          href="/docs/envoy/latest/api-v3/extensions/filters/network/tcp_proxy/v3/tcp_proxy.proto#envoy-v3-api-field-extensions-filters-network-tcp-proxy-v3-tcpproxy-max-connect-attempts"
                        >
                          <span className="std std-ref">maximum connect attempts (TCP)</span>
                        </a>{' '}
                        was reached.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>NC</strong>: {$t('tip337')}
                      </p>
                    </li>
                  </ul>
                </dd>
                <dt>HTTP only</dt>
                <dd>
                  <ul className="simple">
                    <li>
                      <p>
                        <strong>DC</strong>: {$t('tip338')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>LH</strong>: {$t('tip339')}{' '}
                        <a
                          className="reference internal"
                          href="/docs/envoy/latest/intro/arch_overview/upstream/health_checking#arch-overview-health-checking"
                        >
                          <span className="std std-ref">{$t('tip340')}</span>
                        </a>{' '}
                        in addition to 503 response code.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>UT</strong>: {$t('tip341')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>LR</strong>: {$t('tip193')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>UR</strong>: {$t('tip194')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>UC</strong>: {$t('tip195')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>DI</strong>: {$t('tip342')}{' '}
                        <a
                          className="reference internal"
                          href="/docs/envoy/latest/configuration/http/http_filters/fault_filter#config-http-filters-fault-injection"
                        >
                          <span className="std std-ref">{$t('faultInjection')}</span>
                        </a>
                        .
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>FI</strong>: {$t('tip343')}{' '}
                        <a
                          className="reference internal"
                          href="/docs/envoy/latest/configuration/http/http_filters/fault_filter#config-http-filters-fault-injection"
                        >
                          <span className="std std-ref">{$t('FaultInjection')}</span>
                        </a>
                        .
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>RL</strong>: The request was ratelimited locally by the{' '}
                        <a
                          className="reference internal"
                          href="/docs/envoy/latest/configuration/http/http_filters/rate_limit_filter#config-http-filters-rate-limit"
                        >
                          <span className="std std-ref">HTTP rate limit filter</span>
                        </a>{' '}
                        in addition to 429 response code.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>UAEX</strong>: {$t('tip196')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>RLSE</strong>: {$t('tip197')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>IH</strong>: The request was rejected because it set an invalid value for a{' '}
                        <a
                          className="reference internal"
                          href="/docs/envoy/latest/api-v3/extensions/filters/http/router/v3/router.proto#envoy-v3-api-field-extensions-filters-http-router-v3-router-strict-check-headers"
                        >
                          <span className="std std-ref">strictly-checked header</span>
                        </a>{' '}
                        in addition to 400 response code.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>SI</strong>: {$t('tip198')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>DPE</strong>: {$t('tip199')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>UPE</strong>: {$t('tip200')}
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>UMSDR</strong>: {$t('tip201')}
                      </p>
                    </li>
                  </ul>
                </dd>
              </dl>
            </dd>
          </>
        );
      case 'route name':
        return (
          <>
            <dt>%{$t('ROUTE_NAME')}%</dt>
            <dd>
              <p>{$t('tip202')}</p>
            </dd>
          </>
        );
      case 'status code':
        return (
          <>
            <dt>%{$t('RESPONSE_CODE')}%</dt>
            <dd>
              <dl>
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip203')}</p>
                  <p>{$t('tip204')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip172')}</p>
                </dd>
              </dl>
              <p>{$t('tip182')}</p>
            </dd>
          </>
        );
      case 'tcp service time':
        return (
          <>
            <dt>%REQ(X?Y):Z%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip344')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip172')}</p>
                </dd>
              </dl>
            </dd>
          </>
        );
      case 'timestamp':
        return (
          <>
            <dt>%{$t('START_TIME')}%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip205')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip206')}</p>
                </dd>
              </dl>
              <p>
                START_TIME can be customized using a{' '}
                <a className="reference external" href="https://en.cppreference.com/w/cpp/io/manip/put_time">
                  format string
                </a>
                . In addition to that, START_TIME also accepts following specifiers:
              </p>
              <table className="docutils align-default">
                <colgroup>
                  <col style={{ width: '28%' }} />
                  <col style={{ width: '72%' }} />
                </colgroup>
                <thead>
                  <tr className="row-odd">
                    <th className="head">
                      <p>{$t('Specifier')}</p>
                    </th>
                    <th className="head">
                      <p>{$t('Explanation')}</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row-even">
                    <td>
                      <p>
                        <code className="docutils literal notranslate">
                          <span className="pre">%s</span>
                        </code>
                      </p>
                    </td>
                    <td>
                      <p>{$t('tip207')}</p>
                    </td>
                  </tr>
                  <tr className="row-odd">
                    <td rowSpan={2}>
                      <p>
                        <code className="docutils literal notranslate">
                          <span className="pre">%f</span>
                        </code>
                        ,{' '}
                        <code className="docutils literal notranslate">
                          <span className="pre">%[1-9]f</span>
                        </code>
                      </p>
                    </td>
                    <td>
                      <p>{$t('tip208')}</p>
                    </td>
                  </tr>
                  <tr className="row-even">
                    <td>
                      <ul className="simple">
                        <li>
                          <p>
                            <code className="docutils literal notranslate">
                              <span className="pre">%3f</span>
                            </code>{' '}
                            {$t('millisecond')}
                          </p>
                        </li>
                        <li>
                          <p>
                            <code className="docutils literal notranslate">
                              <span className="pre">%6f</span>
                            </code>{' '}
                            {$t('microsecond')}
                          </p>
                        </li>
                        <li>
                          <p>
                            <code className="docutils literal notranslate">
                              <span className="pre">%9f</span>
                            </code>{' '}
                            {$t('nanosecond')}
                          </p>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>{$t('tip209')}:</p>
              <div className="highlight-none notranslate">
                <div className="highlight">
                  <pre>
                    <span></span>
                    {$t('tip210')}
                  </pre>
                </div>
              </div>
              <p>{$t('tip211')}</p>
            </dd>
          </>
        );
      case 'upstream cluster':
        return (
          <>
            <dt>%{$t('UPSTREAM_CLUSTER')}%</dt>
            <dd>
              <p>
                Upstream cluster to which the upstream host belongs to. If runtime feature
                <cite>envoy.reloadable_features.use_observable_cluster_name</cite> is enabled, then{' '}
                <a
                  className="reference internal"
                  href="/docs/envoy/latest/api-v3/config/cluster/v3/cluster.proto#envoy-v3-api-field-config-cluster-v3-cluster-alt-stat-name"
                >
                  <span className="std std-ref">alt_stat_name</span>
                </a>{' '}
                will be used if provided.
              </p>
            </dd>
          </>
        );
      case 'upstream failure reason':
        return (
          <>
            <dt>%{$t('UPSTREAM_TRANSPORT_FAILURE_REASON')}%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>
                    If upstream connection failed due to transport socket (e.g. TLS handshake), provides the failure
                    reason from the transport socket. The format of this field depends on the configured upstream
                    transport socket. Common TLS failures are in{' '}
                    <a
                      className="reference internal"
                      href="/docs/envoy/latest/intro/arch_overview/security/ssl#arch-overview-ssl-trouble-shooting"
                    >
                      <span className="std std-ref">TLS trouble shooting</span>
                    </a>
                    .
                  </p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('172')}</p>
                </dd>
              </dl>
            </dd>
          </>
        );
      case 'upstream local':
        return (
          <>
            <dt>%{$t('UPSTREAM_LOCAL_ADDRESS')}%</dt>
            <dd>
              <p>{$t('tip212')}</p>
            </dd>
          </>
        );
      case 'upstream service':
        return (
          <>
            <dt>%{$t('UPSTREAM_HOST')}%</dt>
            <dd>
              <p>
                Upstream host URL (e.g.,{' '}
                <a className="reference external" href="tcp://ip:port">
                  tcp://ip:port
                </a>{' '}
                for TCP connections).
              </p>
            </dd>
          </>
        );
      case 'uri path':
        return (
          <>
            <dt>%REQ(X?Y):Z%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip345')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip172')}</p>
                </dd>
              </dl>
            </dd>
          </>
        );
      case 'user agent':
        return (
          <>
            <dt>%REQ(X?Y):Z%</dt>
            <dd>
              <dl className="simple">
                <dt>HTTP</dt>
                <dd>
                  <p>{$t('tip346')}</p>
                </dd>
                <dt>TCP</dt>
                <dd>
                  <p>{$t('tip172')}</p>
                </dd>
              </dl>
            </dd>
          </>
        );
      default:
        return <>{$t('tip213')}</>;
    }
  };
}
