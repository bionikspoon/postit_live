import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as liveActions from '../../modules/live';
import * as socketActions from '../../modules/socket';
import LayoutRow from '../../components/LayoutRow';
import LayoutInnerRow from '../../components/LayoutInnerRow';
import Confirm from '../../components/Confirm';
import User from '../../components/User';
import FormGroupPermissions from '../../components/FormGroupPermissions';
import { currentUserSelector, contributorsSelector } from '../../selectors';
import { reduxForm } from 'redux-form';
import autobind from 'autobind-decorator';
import _ from 'lodash';
const debug = require('debug')('app:containers:LiveAppContributors');  // eslint-disable-line no-unused-vars

const PERMISSION_NAMES = {
  addMessage: 'add_channel_messages',
  closeChannel: 'change_channel_close',
  editContributors: 'change_channel_contributors',
  editMessage: 'change_channel_messages',
  editSettings: 'change_channel_settings',
};
export class LiveAppContributors extends Component {
  @autobind
  handleAddContributor({ permissions, ...data }) {
    const { actions } = this.props;

    const perms = _.keys(permissions).filter(key => permissions[key]).map(key => PERMISSION_NAMES[key]);
    actions.socket.addContributor({ permissions: perms, ...data });
  }

  @autobind
  handleUpdateContributor({ permissions, ...data }) {

  }

  renderContributorMessage({ show }) {
    if (!show) return null;

    return (
      <div className="alert alert-warning">
        you are a contributor to this live channel. |&nbsp;

        <Confirm value="leave" btnClass="btn btn-link" onClick={_.identity} />
      </div>
    );
  }

  @autobind
  renderContributorRow({ contributor }) {
    const { actions } = this.props;
    const deleteContributor = actions.socket.deleteContributor.bind(this, { username: contributor.username });
    return (
      <tr key={contributor.username}>
        <td><User user={contributor} /></td>
        <td><Confirm value="remove" btnClass="btn btn-link" onClick={deleteContributor} /></td>
        <td className="text-xs-right">{/*<FormGroupPermissions />*/}</td>
      </tr>
    );
  }

  @autobind
  renderContributorForm({ contributor }) {
    debug('contributor', contributor);
    const { actions } = this.props;
    return (
      <AddContributorForm
        key={contributor.username}
        formKey={contributor.username}
        action="update"
        onSubmit={this.handleAddContributor}
        form="update-contributor"
        initialValues={{ username: contributor.username, permissions: contributor.can }}
      />
    );
  }

  renderContributorRows() {
    const { contributors } = this.props;
    return (
      <tbody>
        {contributors.map(contributor => this.renderContributorRow({ contributor }))}
      </tbody>
    );
  }

  renderContributorForms() {
    const { contributors } = this.props;
    return (
      <div>
        {contributors.map(contributor => this.renderContributorForm({ contributor }))}
      </div>
    );
  }

  render() {
    const { currentUser } = this.props;
    const initialValues = {
      initialValues: {
        permissions: {
          closeChannel: true,
          editContributors: true,
          editSettings: true,
          editMessage: true,
          addMessage: true,
        },
      },
    };
    return (
      <LayoutRow className="LiveAppContributors">

        <LayoutInnerRow>
          <div>
            <h1>Contributors</h1>

            {this.renderContributorMessage({ show: currentUser.can.contribute })}

            <div>
              <h2>current contributors</h2>{this.renderContributorForms()}
              <table className="table table-sm table-hover">
                {this.renderContributorRows()}
              </table>
            </div>

            <div>
              <h2>add contributor</h2>
              <AddContributorForm onSubmit={this.handleAddContributor}
                form="add-contributor"
                action="create"
                initialValues={initialValues} />
            </div>
          </div>

        </LayoutInnerRow>

      </LayoutRow>
    );
  }
}

LiveAppContributors
  .propTypes = {
  contributors: PropTypes.array.isRequired,

  currentUser: PropTypes.shape({
    can: PropTypes.shape({
      contribute: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

class AddContributorForm extends Component {
  @autobind
  handleSubmit(...args) {
    const { resetForm, handleSubmit } = this.props;
    handleSubmit(...args);
    resetForm();
  }

  render() {
    const { fields:{ username, permissions }, values, action } = this.props;
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

              <td className="text-xs-right"><FormGroupPermissions {...permissions} values={values.permissions}
                onSave={action === 'update' ? () => null : null} /></td>

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
AddContributorForm = reduxForm({
  form: 'AddContributorForm',
  fields: [
    'username',
    'permissions.closeChannel',
    'permissions.editContributors',
    'permissions.editSettings',
    'permissions.editMessage',
    'permissions.addMessage',
  ],
})(AddContributorForm);

function mapStateToProps(state) {
  return {
    contributors: contributorsSelector(state),
    currentUser: currentUserSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      live: bindActionCreators(liveActions, dispatch),
      socket: bindActionCreators(socketActions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveAppContributors);
