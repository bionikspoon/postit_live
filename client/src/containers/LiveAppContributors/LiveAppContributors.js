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
export class LiveAppContributors extends Component {
  @autobind
  handleAddContributor({ permissions, ...data }) {
    const { actions } = this.props;

    const names = {
      addMessage: 'add_channel_messages',
      closeChannel: 'change_channel_close',
      editContributors: 'change_channel_contributors',
      editMessage: 'change_channel_messages',
      editSettings: 'change_channel_settings',
    };
    const perms = _.keys(permissions).filter(key => permissions[key]).map(key => names[key]);
    actions.socket.addContributor({ permissions: perms, ...data });
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

  renderContributorRows() {
    const { contributors } = this.props;
    return (
      <tbody>
        {contributors.map(contributor => this.renderContributorRow({ key: contributor.username, contributor }))}
      </tbody>
    );
  }

  render() {
    const { currentUser } = this.props;
    return (
      <LayoutRow className="LiveAppContributors">

        <LayoutInnerRow>
          <div>
            <h1>Contributors</h1>

            {this.renderContributorMessage({ show: currentUser.can.contribute })}

            <div>
              <h2>current contributors</h2>
              <table className="table table-sm table-hover">
                {this.renderContributorRows()}
              </table>
            </div>

            <div>
              <h2>add contributor</h2>
              <AddContributorForm onSubmit={this.handleAddContributor} form="add-contributor" />
            </div>
          </div>

        </LayoutInnerRow>

      </LayoutRow>
    );
  }
}

LiveAppContributors.propTypes = {
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
    debug('this.props', this.props);

    // resetForm();
    return handleSubmit(...args);
  }

  render() {
    const { fields:{ username, permissions }, values } = this.props;
    return (
      <form className="AddContributorForm" onSubmit={this.handleSubmit}>
        <table className="table  table-sm">
          <tbody>
            <tr>
              <td><input type="text" {...username} /></td>
              <td className="text-xs-right"><FormGroupPermissions {...permissions} values={values.permissions} /></td>

              <td className="text-xs-center">

                <Confirm value="add" btnClass="btn btn-secondary" onClick={this.handleSubmit} />
              </td>
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
}, () => ({
  initialValues: {
    permissions: {
      closeChannel: true,
      editContributors: true,
      editSettings: true,
      editMessage: true,
      addMessage: true,
    },
  },
}))(AddContributorForm);

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
