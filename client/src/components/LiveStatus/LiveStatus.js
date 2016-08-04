import './LiveStatus.scss';
import React, { PropTypes, Component } from 'react';
import * as chanTypes from '../../constants/ChannelStatus';
import * as connTypes from '../../constants/ConnectionStatus';
import LayoutInnerRow from '../LayoutInnerRow';
import classnames from 'classnames';
import _ from 'lodash';

export default function LiveStatus({ subscribers, channelStatus, connectionStatus }) {
  const alertClass = classnames('alert', {
    'alert-success': connectionStatus === connTypes.CONNECTION_OPENED,
    'alert-warning': connectionStatus === connTypes.CONNECTION_RECONNECTING,
    'alert-danger': connectionStatus === connTypes.CONNECTION_CLOSED,
  });
  return (
    <LayoutInnerRow>

      <div className={alertClass}>
        <span>{channelStatus === chanTypes.CHANNEL_OPENED ? 'live' : 'not live'}</span>
        <span>~{subscribers} viewers</span>
      </div>

    </LayoutInnerRow>
  );
}
LiveStatus.propTypes = {
  channelStatus: PropTypes.oneOf(_.values(chanTypes)).isRequired,
  connectionStatus: PropTypes.oneOf(_.values(connTypes)).isRequired,
  subscribers: PropTypes.number.isRequired,
};
