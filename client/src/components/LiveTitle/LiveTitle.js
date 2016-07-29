import './LiveTitle.scss';
import React, { PropTypes, Component } from 'react';

export default function LiveTitle({ title }) {
  return (
    <div className="row">
      <div className="col-md-10 col-md-offset-2">
        <h1>{title}</h1>
      </div>
    </div>
  );
}
LiveTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
