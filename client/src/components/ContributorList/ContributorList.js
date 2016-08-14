import styles from  './ContributorList.scss';
import React, { PropTypes, Component } from 'react';
import ContributorForm from '../ContributorForm';
const debug = require('debug')('app:components:ContributorList');  // eslint-disable-line no-unused-vars

export default function ContributorList({ contributors, onUpdate, onDelete }) {
  return (
    <div className={styles.wrapper}>
      <h2>current contributors</h2>

      {contributors.map(user => (
        <ContributorForm
          key={user.username}
          formKey={user.username}
          action="update"
          onSubmit={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
          initialValues={{ user }}
        />
      ))}
    </div>
  );
}
ContributorList.propTypes = {
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      channel_permissions: PropTypes.array.isRequired,
    }).isRequired
  ).isRequired,

  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

