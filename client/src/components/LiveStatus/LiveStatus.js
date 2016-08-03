import './LiveStatus.scss';
import React, { PropTypes, Component } from 'react';
import { OPENED } from '../../constants/LiveStatusTypes';
import LayoutInnerRow from '../LayoutInnerRow';

export default function LiveStatus({ status, viewers }) {
  return (
    <LayoutInnerRow>

      <div className="alert alert-success">
        <span>{status === OPENED ? 'live' : 'not live'}</span> <span>~{viewers} viewers</span>
      </div>

    </LayoutInnerRow>
  );
}
LiveStatus.propTypes = {
  status: PropTypes.string.isRequired,
  viewers: PropTypes.number.isRequired,
};
