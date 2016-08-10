import './ContributorList.scss';
import React, { PropTypes, Component } from 'react';
import ContributorForm from '../ContributorForm';
const debug = require('debug')('app:components:ContributorList');  // eslint-disable-line no-unused-vars

export default function ContributorList({ contributors, onUpdate, onDelete }) {
  return (
    <div>
      <h2>current contributors</h2>

      {contributors.map(user => {
        debug('user', user);
        debug('user.can', user.can);
        return (
          <ContributorForm
            key={user.username}
            formKey={user.username}
            action="update"
            onSubmit={onUpdate}
            onDelete={onDelete}
            initialValues={{ user }}
          />
        );
      })}
    </div>
  );
}
ContributorList.propTypes = {
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      can: PropTypes.object.isRequired,
    }).isRequired
  ).isRequired,

  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

