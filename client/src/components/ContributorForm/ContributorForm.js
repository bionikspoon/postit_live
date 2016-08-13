import React, { Component, PropTypes } from 'react';
import Confirm from '../../components/Confirm';
import User from '../../components/User';
import FormGroupText from '../../components/FormGroupText';
import FormGroupPermissions from '../../components/FormGroupPermissions';
import { reduxForm, propTypes } from 'redux-form';
import autobind from 'autobind-decorator';
const debug = require('debug')('app:components:ContributorForm');  // eslint-disable-line no-unused-vars

class ContributorForm extends Component {
  @autobind
  handleSubmit(...args) {
    const { resetForm, handleSubmit } = this.props;
    handleSubmit(...args);
    resetForm();
  }

  renderUser({ showInput }) {
    const { values } = this.props;
    return (
      <div className="col-xs-3">
        {this.renderUserInput({ show: showInput })}

        <User user={values.user} />
      </div>
    );
  }

  renderUserInput({ show }) {
    const { fields: { user: { username } } } = this.props;

    if (!show) return null;

    return (
      <FormGroupText id="ContributorForm-user" {...username} />
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

  renderPermissions() {
    const { fields: { user: { channel_permissions } } } = this.props;
    return (
      <div className="col-xs-7 text-xs-right">
        <FormGroupPermissions{...channel_permissions} />
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
    const { action } = this.props;

    return (
      <form className="AddContributorForm" onSubmit={this.handleSubmit}>
        <div className="row">

          {this.renderUser({ showInput: action === 'create' })}

          {this.renderRemoveButton({ show: action === 'update' })}

          {this.renderPermissions()}

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
    user: PropTypes.shape({
      username: PropTypes.object,
      can: PropTypes.object,
    }),
  }),
  values: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string,
      permissions: PropTypes.string,
    }),
  }),
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  action: PropTypes.oneOf(['create', 'update']),
};

export default reduxForm({
  form: 'ContributorForm',
  fields: [
    'user.username',
    'user.channel_permissions',
  ],
})(ContributorForm);
