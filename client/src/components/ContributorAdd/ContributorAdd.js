import './ContributorAdd.scss';
import React, { PropTypes, Component } from 'react';
import ContributorForm from '../ContributorForm';
const debug = require('debug')('app:components:ContributorAdd');  // eslint-disable-line no-unused-vars

const styles = {
  wrapper: 'ContributorAdd',
};
const initialValues = {
  user: {
    username: '',
    channel_permissions: [
      'change_channel_close',
      'change_channel_contributors',
      'change_channel_settings',
      'change_channel_messages',
      'add_channel_messages',
    ],
  },
};

export default function ContributorAdd({ onSave }) {
  return (
    <div className={styles.wrapper}>
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
