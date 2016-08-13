import './ContributorMessage.scss';
import Confirm from '../Confirm';
import React, { PropTypes, Component } from 'react';

export default function ContributorMessage({ show, onDelete, currentUser }) {
  if (!show) return null;

  const handleClick = () => onDelete({ user: currentUser });

  return (
    <div className="alert alert-warning ContributorMessage">
      you are a contributor to this live channel. |&nbsp;

      <Confirm value="leave" btnClass="btn btn-link" align="right" onClick={handleClick} />
    </div>
  );
}
ContributorMessage.propTypes = {
  show: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};
