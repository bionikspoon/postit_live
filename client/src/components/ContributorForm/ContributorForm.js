import React, { Component, PropTypes } from 'react';
import Confirm from '../../components/Confirm';
import User from '../../components/User';
import FormGroupText from '../../components/FormGroupText';
import FormGroupPermissions from '../../components/FormGroupPermissions';
import * as userUtils from '../../utils/user';
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

  renderAddButton({ show }) {
    if (!show) return null;

    return (
      <div className="col-xs">
        <Confirm value="add" btnClass="btn btn-secondary" onClick={this.handleSubmit} />
      </div>
    );
  }

  render() {
    const { fields, action, onUpdate } = this.props;
    const user = userUtils.fromForm(fields.user);
    debug('user', user);

    return (
      <form className="AddContributorForm" onSubmit={this.handleSubmit}>
        <div className="row">

          <div className="col-xs">
            {this.renderUserInput({ show: action === 'create' })}

            <User user={user} />
          </div>

          {this.renderRemoveButton({ show: action === 'update' })}

          <div className="col-xs-8 text-xs-right">
            <FormGroupPermissions values={{ user }} onSave={onUpdate} user={fields.user} />
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
    'user.can.closeChannel',
    'user.can.editContributors',
    'user.can.editSettings',
    'user.can.editMessage',
    'user.can.addMessage',
  ],
})(ContributorForm);
