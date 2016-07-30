import './LiveStatus.scss';
import React, { PropTypes, Component } from 'react';
import { OPENED } from '../../constants/LiveStatusTypes';

export default function LiveStatus({ status, viewers }) {
  return (
    <div className="row flex-items-xs-right">
      <div className="col-xs-10">
        <div className="alert alert-success">
          <span>{status === OPENED ? 'live' : 'not live'}</span> <span>~{viewers} viewers</span>
        </div>
      </div>
    </div>
  );
}
LiveStatus.propTypes = {
  status: PropTypes.string.isRequired,
  viewers: PropTypes.number.isRequired,
};
