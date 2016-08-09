import './ContributorAdd.scss';
import React, { PropTypes, Component } from 'react';
import ContributorForm, { INITIAL_VALUES } from '../ContributorForm';

export default function ContributorAdd({ onSave }) {
  return (
    <div>
      <h2>add contributor</h2>
      <ContributorForm
        onSubmit={onSave}
        form="add-contributor"
        action="create"
        initialValues={INITIAL_VALUES}
      />
    </div>
  );
}
ContributorAdd.propTypes = {
  onSave: PropTypes.func.isRequired,
};
