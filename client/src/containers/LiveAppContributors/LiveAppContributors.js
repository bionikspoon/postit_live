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
import autobind from 'autobind-decorator';
import * as selector from '../../selectors';

const debug = require('debug')('app:containers:LiveAppContributors');  // eslint-disable-line no-unused-vars

export class LiveAppContributors extends Component {
  @autobind
  handleAddContributor(data) {
    const { actions } = this.props;
    actions.socket.addContributor(data.user);
  }

  @autobind
  handleUpdateContributor(data) {
    const { actions } = this.props;
    actions.socket.updateContributor(data.user);
  }

  @autobind
  handleDeleteContributor(data) {
    const { actions } = this.props;
    actions.socket.deleteContributor(data.user);
  }

  render() {
    const { hasPerm, contributors, currentUser } = this.props;
    return (
      <LayoutRow className="LiveAppContributors">

        <LayoutInnerRow>
          <div>
            <h1>contributors</h1>

            <ContributorMessage
              show={hasPerm.canContribute}
              onDelete={this.handleDeleteContributor}
              currentUser={currentUser}
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
  hasPerm: PropTypes.shape({ canContribute: PropTypes.bool.isRequired }).isRequired,

  contributors: PropTypes.array.isRequired,

  currentUser: PropTypes.object.isRequired,

  actions: PropTypes.shape({
    socket: PropTypes.shape({
      addContributor: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    currentUser: state.live.currentUser,
    hasPerm: selector.hasPerm(state),
    contributors: selector.contributors(state),
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
