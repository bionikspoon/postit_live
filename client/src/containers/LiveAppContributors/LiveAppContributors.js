import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as socketActions from '../../actions/socketActions';
import * as liveActions from '../../actions/liveActions';
import LayoutRow from '../../components/LayoutRow';
import LayoutInnerRow from '../../components/LayoutInnerRow';
import Confirm from '../../components/Confirm';
import User from '../../components/User';
export class LiveAppContributors extends Component {
  render() {
    return (
      <LayoutRow className="LiveAppContributors">

        <LayoutInnerRow>
          <h1>Contributors</h1>
          <div className="alert alert-warning">
            you are a contributor to this live channel. | <Confirm value="leave" btnClass="btn btn-link" />
          </div>

          <div>
            <h2>current contributors</h2>
            <table className="table table-sm table-hover">
              <tbody>
                <tr>
                  <td><User username="user" /></td>
                  <td><Confirm value="remove" btnClass="btn btn-link" /></td>
                  <td className="text-xs-right">full permissions (<a href="#">change</a>)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2>invite contributor</h2>
            <table className="table  table-sm">
              <tbody>
                <tr>
                  <td><input type="text" /></td>
                  <td className="text-xs-right">full permissions (<a href="#">change</a>)</td>
                  <td className="text-xs-center">
                    <Confirm value="invite" btnClass="btn btn-secondary" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


        </LayoutInnerRow>

      </LayoutRow>
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
