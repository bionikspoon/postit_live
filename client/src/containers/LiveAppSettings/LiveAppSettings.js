import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as socketActions from '../../actions/socketActions';
import * as liveActions from '../../actions/liveActions';
export class LiveAppSettings extends Component {
  render() {
    return (
      <div >
        <h1>Settings</h1>
      </div>
    );
  }
}

LiveAppSettings.propTypes = {};

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  const actions = { ...liveActions, ...socketActions };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveAppSettings);
