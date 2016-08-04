import './LiveStatus.scss';
import React, { PropTypes, Component } from 'react';
import { OPENED } from '../../constants/LiveChannelStatus';
import LayoutInnerRow from '../LayoutInnerRow';

export default function LiveStatus({ status, subscribers }) {
  return (
    <LayoutInnerRow>

      <div className="alert alert-success">
        <span>{status === OPENED ? 'live' : 'not live'}</span> <span>~{subscribers} viewers</span>
      </div>

    </LayoutInnerRow>
  );
}
LiveStatus.propTypes = {
  status: PropTypes.string.isRequired,
  subscribers: PropTypes.number.isRequired,
};
