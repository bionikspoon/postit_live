import './ContributorMessage.scss';
import Confirm from '../Confirm';
import React, { PropTypes, Component } from 'react';

export default function ContributorMessage({ show, onSubmit }) {
  if (!show) return null;

  return (
    <div className="alert alert-warning ContributorMessage">
      you are a contributor to this live channel. |&nbsp;

      <Confirm value="leave" btnClass="btn btn-link" onClick={onSubmit} />
    </div>
  );
}
ContributorMessage.propTypes = {
  show: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
