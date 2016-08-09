import './ContributorList.scss';
import React, { PropTypes, Component } from 'react';
import ContributorForm from '../ContributorForm';
const debug = require('debug')('app:components:ContributorList');  // eslint-disable-line no-unused-vars

export default function ContributorList({ contributors, onUpdate, onDelete }) {
  debug('contributors', contributors);
  return (
    <div>
      <h2>current contributors</h2>

      {contributors.map(contributor => (
        <ContributorForm
          key={contributor.username}
          formKey={contributor.username}
          action="update"
          onSubmit={onUpdate}
          onDelete={onDelete}
          form="update-contributor"
          initialValues={getInitialValues(contributor)}
        />
      ))}
    </div>
  );
}
ContributorList.propTypes = {
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,

  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

function getInitialValues({ username, can }) { return { username, permissions: can }; }
