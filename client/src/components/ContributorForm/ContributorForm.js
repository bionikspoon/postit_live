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

  render() {
    const { fields: { username, permissions }, values, action } = this.props;
    return (
      <form className="AddContributorForm" onSubmit={this.handleSubmit}>
        <table className="table  table-sm">
          <tbody>
            <tr>
              <td>
                {action === 'create' ? <input type="text" {...username} /> : null}

                {values.username && values.username.length ? <User user={{ username: values.username }} /> : null}
              </td>

              {action === 'update'
                ? <td><Confirm value="remove" btnClass="btn btn-link" onClick={() => null} /></td>
                : null}

              <td className="text-xs-right">

                <FormGroupPermissions

                  {...permissions}
                  values={values.permissions}
                  onSave={action === 'update' ? () => null : null}
                />
              </td>

              {action === 'create'
                ? (
                <td className="text-xs-center">
                  <Confirm value="add" btnClass="btn btn-secondary" onClick={this.handleSubmit} />
                </td>
              )
                : null}

            </tr>
          </tbody>
        </table>
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
