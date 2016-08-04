import './LiveStatus.scss';
import React, { PropTypes, Component } from 'react';
import * as chanTypes from '../../constants/ChannelStatus';
import * as connTypes from '../../constants/ConnectionStatus';
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
    const { subscribers, connectionStatus } = this.props;
    const alertClass = classnames('alert', ALERT_CLASS[connectionStatus]);

    return (
      <LayoutInnerRow className="LiveStatus">
        <div className={alertClass}>live ~{subscribers} viewers</div>
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
    const { channelStatus } = this.props;
    return channelStatus === chanTypes.CHANNEL_OPENED
      ? this.renderOpened()
      : this.renderClosed();
  }
}

LiveStatus.propTypes = {
  channelStatus: PropTypes.oneOf(_.values(chanTypes)).isRequired,
  connectionStatus: PropTypes.oneOf(_.values(connTypes)).isRequired,
  subscribers: PropTypes.number.isRequired,
};
