import './ContributorAdd.scss';
import React, { PropTypes, Component } from 'react';
import ContributorForm from '../ContributorForm';
import * as userUtils from '../../utils/user';
const debug = require('debug')('app:components:ContributorAdd');  // eslint-disable-line no-unused-vars

const initialValues = userUtils.withFullPermissions();

export default function ContributorAdd({ onSave }) {
  debug('initialValues', initialValues);
  return (
    <div>
      <h2>add contributor</h2>
      <ContributorForm
        onSubmit={onSave}
        formKey="create"
        action="create"
        initialValues={initialValues}
      />
    </div>
  );
}
ContributorAdd.propTypes = {
  onSave: PropTypes.func.isRequired,
};
