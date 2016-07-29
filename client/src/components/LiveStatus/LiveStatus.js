import './LiveStatus.scss';
import React, { PropTypes, Component } from 'react';
import { CONNECTED } from '../../constants/LiveStatusTypes';

export default function LiveTitle({ status, viewers }) {
  return (
    <div className="row">
      <div className="col-md-10 col-md-offset-2">
        <div className="alert alert-success">
          <span>{status === CONNECTED ? 'live' : 'not live'}</span> <span>~{viewers} viewers</span>
        </div>
      </div>
    </div>
  );
}
LiveTitle.propTypes = {
  status: PropTypes.string.isRequired,
  viewers: PropTypes.number.isRequired,
};
