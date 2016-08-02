import './LiveApp.scss';
import React, { PropTypes, Component } from 'react';
import LiveNav from '../../components/LiveNav';
import * as liveActions from '../../actions/liveActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class LiveApp extends Component {
  constructor(props) {
    super(props);

    const { slug, meta, actions } = this.props;
    const { location } = window;
    if (!meta.synced) actions.fetchMessages({ slug, location });
  }

  render() {
    const { children, slug } = this.props;
    return (
      <div className="container-fluid" role="main">
        <LiveNav slug={slug} />

        {children}
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
  actions: PropTypes.shape({ fetchMessages: PropTypes.func.isRequired }).isRequired,
};

function mapStateToProps(state, props) {
  return {
    meta: state.live.meta,
    slug: props.params.slug,
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...liveActions };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveApp);
