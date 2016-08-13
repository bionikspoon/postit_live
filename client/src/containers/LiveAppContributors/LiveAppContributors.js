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
  handleAddContributor({ user, ...data }) {
    debug('add contributor user=%o data=', user, data);

    const { actions } = this.props;

    // actions.socket.addContributor({ permissions: perms, ...data });
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
    const { hasPerm, contributors } = this.props;
    debug('contributors', contributors);
    return (
      <LayoutRow className="LiveAppContributors">

        <LayoutInnerRow>
          <div>
            <h1>contributors</h1>

            <ContributorMessage
              show={hasPerm.canContribute}
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
  // contributors: PropTypes.array.isRequired,

  currentUser: PropTypes.shape({
    // can: PropTypes.shape({
    //   contribute: PropTypes.bool.isRequired,
    // }).isRequired,
  }).isRequired,

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
