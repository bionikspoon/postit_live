import './LiveApp.scss';
import React, { PropTypes, Component } from 'react';
import LiveNav from '../../components/LiveNav';
import * as liveActions from '../../modules/live';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { currentUserSelector } from '../../selectors';

class LiveApp extends Component {
  componentDidMount() {
    const { slug, actions, meta } = this.props;

    if (meta.synced && window) return;

    const { location } = window;
    actions.live.fetchChannel({ slug, location });
    actions.live.fetchCurrentUser({ slug, location });
  }

  render() {
    const { slug, pathname, currentUser } = this.props;
    return (
      <div className="container-fluid LiveApp" role="main">
        <LiveNav {...{ slug, pathname, currentUser }} />

        {this.props.children}
      </div>
    );
  }
}

LiveApp.propTypes = {
  meta: PropTypes.shape({ synced: PropTypes.bool.isRequired }).isRequired,
  children: PropTypes.element.isRequired,
  slug: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    live: PropTypes.shape({
      fetchChannel: PropTypes.func.isRequired,
      fetchCurrentUser: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

function mapStateToProps(state, props) {
  return {
    meta: state.live.meta,
    slug: props.params.slug,
    pathname: props.location.pathname,
    currentUser: currentUserSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      live: bindActionCreators(liveActions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveApp);
