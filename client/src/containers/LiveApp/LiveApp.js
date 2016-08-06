import './LiveApp.scss';
import React, { PropTypes, Component } from 'react';
import LiveNav from '../../components/LiveNav';
import * as liveActions from '../../actions/liveActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { permissionSelector } from '../../selectors';

class LiveApp extends Component {
  componentDidMount() {
    const { slug, meta, actions } = this.props;
    const { location } = window;
    if (!meta.synced) {
      actions.fetchChannel({ slug, location });
      actions.fetchCurrentUser({ slug, location });
    }
  }

  render() {
    return (
      <div className="container-fluid LiveApp" role="main">
        <LiveNav {...this.props} />

        {this.props.children}
      </div>
    );
  }
}

LiveApp.propTypes = {
  meta: PropTypes.shape({
    synced: PropTypes.bool.isRequired,
  }).isRequired,
  children: PropTypes.element.isRequired,
  slug: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    fetchChannel: PropTypes.func.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps(state, props) {
  return {
    meta: state.live.meta,
    slug: props.params.slug,
    pathname: props.location.pathname,
    can: permissionSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...liveActions };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveApp);
