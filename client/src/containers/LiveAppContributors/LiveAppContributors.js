import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as socketActions from '../../actions/socketActions';
import * as liveActions from '../../actions/liveActions';
import LayoutRow from '../../components/LayoutRow';
import LayoutInnerRow from '../../components/LayoutInnerRow';

export class LiveAppContributors extends Component {
  render() {
    return (
      <LayoutRow > <LayoutInnerRow>
        <h1>Contributors</h1>
      </LayoutInnerRow></LayoutRow>
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
