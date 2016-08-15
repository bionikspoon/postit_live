import './LiveStatus.scss';
import React, { PropTypes, Component } from 'react';
import * as chanTypes from '../../constants/channelStatus';
import * as connTypes from '../../constants/connectionStatus';
import LayoutInnerRow from '../LayoutInnerRow';
import _ from 'lodash';

const styles = {
  wrapper: 'LiveStatus',
  alert: 'LiveStatus__alert',
  alertSuccess: 'LiveStatus__alert LiveStatus__alert--success',
  alertWarning: 'LiveStatus__alert LiveStatus__alert--warning',
  alertDanger: 'LiveStatus__alert LiveStatus__alert--danger',
};

const ALERT_CLASS = {
  [connTypes.CONNECTION_OPENED]: styles.alertSuccess,
  [connTypes.CONNECTION_RECONNECTING]: styles.alertWarning,
  [connTypes.CONNECTION_CLOSED]: styles.alertDanger,
};

export default class LiveStatus extends Component {
  renderOpened() {
    const { channel, meta } = this.props;
    const alertClass = ALERT_CLASS[meta.connectionStatus];

    return (
      <LayoutInnerRow className={styles.wrapper}>
        <div className={alertClass}>live ~{channel.subscribers} viewers</div>
      </LayoutInnerRow>
    );
  }

  renderClosed() {
    return (
      <LayoutInnerRow className={styles.wrapper}>
        <div className={styles.alert}>This channel is closed.</div>
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
