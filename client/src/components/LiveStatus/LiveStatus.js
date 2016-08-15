import './LiveStatus.scss';
import React, { PropTypes, Component } from 'react';
import * as chanTypes from '../../constants/channelStatus';
import * as connTypes from '../../constants/connectionStatus';
import LayoutInnerRow from '../LayoutInnerRow';
import _ from 'lodash';

const styles = {
  wrapper: 'LiveStatus',
  message: 'LiveStatus__message',
  [connTypes.CONNECTION_OPENED]: 'LiveStatus__message LiveStatus__message--success',
  [connTypes.CONNECTION_RECONNECTING]: 'LiveStatus__message LiveStatus__message--warning',
  [connTypes.CONNECTION_CLOSED]: 'LiveStatus__message LiveStatus__message--danger',
};

export default class LiveStatus extends Component {
  renderOpened() {
    const { channel, meta } = this.props;

    return (
      <LayoutInnerRow className={styles.wrapper}>
        <div className={styles[meta.connectionStatus]}>live ~{channel.subscribers} viewers</div>
      </LayoutInnerRow>
    );
  }

  renderClosed() {
    return (
      <LayoutInnerRow className={styles.wrapper}>
        <div className={styles.message}>This channel is closed.</div>
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
