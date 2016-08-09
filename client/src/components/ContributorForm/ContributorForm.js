import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Confirm from '../../components/Confirm';
import User from '../../components/User';
import FormGroupPermissions from '../../components/FormGroupPermissions';
import { reduxForm } from 'redux-form';
import autobind from 'autobind-decorator';

const debug = require('debug')('app:components:ContributorForm');  // eslint-disable-line no-unused-vars

export const INITIAL_VALUES = {
  permissions: {
    closeChannel: true,
    editContributors: true,
    editSettings: true,
    editMessage: true,
    addMessage: true,
  },
};

class ContributorForm extends Component {
  @autobind
  handleSubmit(...args) {
    const { resetForm, handleSubmit } = this.props;
    handleSubmit(...args);
    resetForm();
  }

  renderUserInput({ show }) {
    const { fields: { username } } = this.props;

    if (!show) return null;

    return (
      <input type="text" {...username} />
    );
  }

  renderUser({ show }) {
    const { values: { username } } = this.props;

    if (!show) return null;

    return (
      <User user={{ username }} />
    );
  }

  renderRemoveButton({ show }) {
    const { onDelete } = this.props;

    if (!show) return null;

    return (
      <div className="col-xs">
        <Confirm value="remove" btnClass="btn btn-link" onClick={onDelete} />
      </div>
    );
  }

  renderAddButton({ show }) {
    if (!show) return null;

    return (
      <div className="col-xs">
        <Confirm value="add" btnClass="btn btn-secondary" onClick={this.handleSubmit} />
      </div>
    );
  }

  render() {
    const { fields: { permissions }, values, action, onUpdate } = this.props;
    return (
      <form className="AddContributorForm" onSubmit={this.handleSubmit}>
        <div className="row">

          <div className="col-xs">
            {this.renderUserInput({ show: action === 'create' })}

            {this.renderUser({ show: values.username && values.username.length })}
          </div>

          {this.renderRemoveButton({ show: action === 'update' })}

          <div className="col-xs-8 text-xs-right">
            <FormGroupPermissions values={values.permissions} onSave={onUpdate} {...permissions} />
          </div>

          {this.renderAddButton({ show: action === 'create' })}


        </div>
      </form>
    );
  }
}
ContributorForm.propTypes = {
  resetForm: PropTypes.func,

  handleSubmit: PropTypes.func,

  fields: PropTypes.shape({
    username: PropTypes.string,
    permissions: PropTypes.array,
  }),

  values: PropTypes.shape({
    username: PropTypes.string,
    permissions: PropTypes.array,
  }),

  form: PropTypes.string,

  formKey: PropTypes.string,

  initialValues: PropTypes.object,

  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,

  onSubmit: PropTypes.func.isRequired,

  action: PropTypes.oneOf(['create', 'update']).isRequired,
};

export default reduxForm({
  form: 'ContributorForm',
  fields: [
    'username',
    'permissions.closeChannel',
    'permissions.editContributors',
    'permissions.editSettings',
    'permissions.editMessage',
    'permissions.addMessage',
  ],
  initialValues: INITIAL_VALUES,
})(ContributorForm);
