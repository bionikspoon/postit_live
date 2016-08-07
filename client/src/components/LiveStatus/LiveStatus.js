import './LiveStatus.scss';
import React, { PropTypes, Component } from 'react';
import * as chanTypes from '../../constants/channelStatus';
import * as connTypes from '../../constants/connectionStatus';
import LayoutInnerRow from '../LayoutInnerRow';
import classnames from 'classnames';
import _ from 'lodash';

const ALERT_CLASS = {
  [connTypes.CONNECTION_OPENED]: 'alert-success',
  [connTypes.CONNECTION_RECONNECTING]: 'alert-warning',
  [connTypes.CONNECTION_CLOSED]: 'alert-danger',
};

export default class LiveStatus extends Component {
  renderOpened() {
    const { channel, meta } = this.props;
    const alertClass = classnames('alert', ALERT_CLASS[meta.connectionStatus]);

    return (
      <LayoutInnerRow className="LiveStatus">
        <div className={alertClass}>live ~{channel.subscribers} viewers</div>
      </LayoutInnerRow>
    );
  }

  renderClosed() {
    const alertClass = classnames('alert');

    return (
      <LayoutInnerRow className="LiveStatus">
        <div className={alertClass}>This channel is closed.</div>
      </LayoutInnerRow>
    );
  }

  render() {
    const { channel } = this.props;
    return channel.status === chanTypes.CHANNEL_OPENED
      ? this.renderOpened()
      : this.renderClosed();
  }
}

LiveStatus.propTypes = {
  channel: PropTypes.shape({
    subscribers: PropTypes.number.isRequired,
    status: PropTypes.oneOf(_.values(chanTypes)).isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    connectionStatus: PropTypes.oneOf(_.values(connTypes)).isRequired,
  }).isRequired,
};
