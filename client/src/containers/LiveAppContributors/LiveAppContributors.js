import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as socketActions from '../../actions/socketActions';
import * as liveActions from '../../actions/liveActions';
import LayoutRow from '../../components/LayoutRow';
import LayoutInnerRow from '../../components/LayoutInnerRow';
import Confirm from '../../components/Confirm';
import User from '../../components/User';
import { permissionSelector } from '../../selectors';

export class LiveAppContributors extends Component {
  renderContributorMessage({ show }) {
    if (!show) return null;

    return (
      <div className="alert alert-warning">
        you are a contributor to this live channel. | <Confirm value="leave" btnClass="btn btn-link" />
      </div>
    );
  }

  renderContributorRow({ contributor }) {
    return (
      <tr key={contributor.id}>
        <td><User {...contributor} /></td>
        <td><Confirm value="remove" btnClass="btn btn-link" /></td>
        <td className="text-xs-right">full permissions (<a href="#">change</a>)</td>
      </tr>
    );
  }

  render() {
    const { can, contributors } = this.props;
    return (
      <LayoutRow className="LiveAppContributors">

        <LayoutInnerRow>
          <h1>Contributors</h1>

          {this.renderContributorMessage({ show: can.contribute })}

          <div>
            <h2>current contributors</h2>
            <table className="table table-sm table-hover">
              <tbody>
                {contributors.map(contributor => this.renderContributorRow({ contributor }))}
              </tbody>
            </table>
          </div>

          <div>
            <h2>add contributor</h2>
            <table className="table  table-sm">
              <tbody>
                <tr>
                  <td><input type="text" /></td>
                  <td className="text-xs-right">full permissions (<a href="#">change</a>)</td>
                  <td className="text-xs-center">
                    <Confirm value="add" btnClass="btn btn-secondary" />
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

LiveAppContributors.propTypes = {
  contributors: PropTypes.array.isRequired,
  can: PropTypes.shape({
    contribute: PropTypes.bool.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    contributors: state.live.contributors,
    can: permissionSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...liveActions, ...socketActions };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveAppContributors);
