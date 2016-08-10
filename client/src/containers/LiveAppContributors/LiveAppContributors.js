import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as liveActions from '../../modules/live';
import * as socketActions from '../../modules/socket';
import LayoutRow from '../../components/LayoutRow';
import LayoutInnerRow from '../../components/LayoutInnerRow';
import ContributorMessage from '../../components/ContributorMessage';
import ContributorList from '../../components/ContributorList';
import ContributorAdd from '../../components/ContributorAdd';
import * as userUtils from '../../utils/user';
import { currentUserSelector, contributorsSelector } from '../../selectors';
import autobind from 'autobind-decorator';
const debug = require('debug')('app:containers:LiveAppContributors');  // eslint-disable-line no-unused-vars

export class LiveAppContributors extends Component {
  @autobind
  handleAddContributor({ user, ...data }) {
    debug('add contributor user=%o data=', user, data);

    const { actions } = this.props;

    const perms = userUtils.toPermissionNames(user);
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

  render() {
    const { currentUser, contributors } = this.props;

    return (
      <LayoutRow className="LiveAppContributors">

        <LayoutInnerRow>
          <div>
            <h1>Contributors</h1>

            <ContributorMessage
              show={currentUser.can.contribute}
              onSubmit={this.handleDeleteContributor}
            />

            <ContributorList
              contributors={contributors}
              onUpdate={this.handleUpdateContributor}
              onDelete={this.handleDeleteContributor}
            />

            <ContributorAdd onSave={this.handleAddContributor} />

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
