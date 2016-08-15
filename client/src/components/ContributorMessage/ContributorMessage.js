import './ContributorMessage.scss';
import Confirm from '../Confirm';
import React, { PropTypes } from 'react';

const styles = {
  wrapper: 'ContributorMessage',
  confirmButton: 'ContributorMessage__confirm-button',
};

export default function ContributorMessage({ show, onDelete, currentUser }) {
  if (!show) return null;

  const handleClick = () => onDelete({ user: currentUser });

  return (
    <div className={styles.wrapper}>
      you are a contributor to this live channel. |&nbsp;

      <Confirm value="leave" btnClass={styles.confirmButton} align="right" onClick={handleClick} />
    </div>
  );
}
ContributorMessage.propTypes = {
  show: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};
