import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as liveActions from '../../modules/live';
import * as socketActions from '../../modules/socket';
import { PERMISSION_METHOD_NAMES } from '../../constants/permissions';
import LayoutRow from '../../components/LayoutRow';
import LayoutInnerRow from '../../components/LayoutInnerRow';
import Confirm from '../../components/Confirm';
import { currentUserSelector, contributorsSelector } from '../../selectors';
import ContributorForm from '../../components/ContributorForm';
import autobind from 'autobind-decorator';
import _ from 'lodash';
const debug = require('debug')('app:containers:LiveAppContributors');  // eslint-disable-line no-unused-vars

export class LiveAppContributors extends Component {
  @autobind
  handleAddContributor({ permissions, ...data }) {
    const { actions } = this.props;

    const perms = _.keys(permissions).filter(key => permissions[key]).map(key => PERMISSION_METHOD_NAMES[key]);
    actions.socket.addContributor({ permissions: perms, ...data });
  }

  @autobind
  handleUpdateContributor({ permissions, ...data }) {
    debug('permissions=%o data=', permissions, data);
  }

  @autobind
  handleDeleteContributor({ permissions, ...data }) {
    debug('permissions=%o data=', permissions, data);
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

  renderContributorForms() {
    const { contributors } = this.props;
    return (
      <div>
        {contributors.map(contributor => (
          <ContributorForm
            key={contributor.username}
            formKey={contributor.username}
            action="update"
            onSubmit={this.handleUpdateContributor}
            onDelete={this.handleDeleteContributor}
            form="update-contributor"
            initialValues={{ username: contributor.username, permissions: contributor.can }}
          />
        ))}
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
              <h2>current contributors</h2>

              {this.renderContributorForms()}
            </div>

            <div>
              <h2>add contributor</h2>
              <ContributorForm
                onSubmit={this.handleAddContributor}
                form="add-contributor"
                action="create"
                initialValues={initialValues}
              />
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

  actions: PropTypes.shape({
    socket: PropTypes.shape({
      addContributor: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

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
