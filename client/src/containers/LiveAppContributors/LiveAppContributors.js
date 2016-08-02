import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as socketActions from '../../actions/socketActions';
import * as liveActions from '../../actions/liveActions';

export class LiveAppContributors extends Component {
  render() {
    return (
      <div >
        <h1>Contributors</h1>
      </div>
    );
  }
}

LiveAppContributors.propTypes = {};

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  const actions = { ...liveActions, ...socketActions };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveAppContributors);
