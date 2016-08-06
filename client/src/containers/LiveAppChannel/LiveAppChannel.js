import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as socketActions from '../../actions/socketActions';
import * as liveActions from '../../actions/liveActions';
import LiveTitle from '../../components/LiveTitle';
import LiveStatus from '../../components/LiveStatus';
import LiveNewMessage from '../../components/LiveNewMessage';
import LiveMessage from '../../components/LiveMessage';
import LiveAside from '../../components/LiveAside';
import LayoutRow from '../../components/LayoutRow';
import { sortedMessagesSelector, permissionSelector } from '../../selectors';
import autobind from 'autobind-decorator';
const debug = require('debug')('app:containers:LiveAppChannel');  // eslint-disable-line no-unused-vars

export class LiveAppChannel extends Component {
  @autobind
  createMessage({ body }) {
    const { actions } = this.props;

    actions.createMessage({ body });
  }

  renderSidebar() {
    const { channel } = this.props;

    return (
      <div className="LiveAppChannel--sidebar">
        <LiveAside>
          <div className="form-check">
            <label htmlFor="popup" id="popup-label" className="form-check-label">
              <input type="checkbox" id="popup" className="form-check-input" aria-labelledby="popup-label" />

              popup notifications
            </label>
          </div>
        </LiveAside>

        <LiveAside title="resources" render={!!channel.resources.length}>
          <div dangerouslySetInnerHTML={{ __html: channel.resources_html }} />
        </LiveAside>

        <LiveAside title="discussions">
          <div dangerouslySetInnerHTML={{ __html: channel.discussions_html }} />
        </LiveAside>

        <LiveAside title="updated by">
          <div dangerouslySetInnerHTML={{ __html: channel.contributors_html }} />
        </LiveAside>

        <LiveAside>
          <button className="btn btn-secondary btn-sm">report a rule violation</button>
        </LiveAside>
      </div>
    );
  }

  render() {
    const { channel, messages, meta, actions, can } = this.props;

    return (
      <div className="LiveAppChannel">
        <LayoutRow ><LiveTitle {...channel} /></LayoutRow>

        <LayoutRow sidebar={this.renderSidebar()}>

          <LiveStatus channelStatus={channel.status} {...meta} />

          <LiveNewMessage form="new-message" onSubmit={this.createMessage} perm={can.addMessage} />


          {messages.map(message => (
            <LiveMessage key={message.id} actions={actions} perms={can.editMessage} {...message} />
          ))}
        </LayoutRow>

      </div>
    );
  }
}

LiveAppChannel.propTypes = {

  meta: PropTypes.object.isRequired,

  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,

  channel: PropTypes.shape({
    status: PropTypes.string.isRequired,
    resources: PropTypes.string.isRequired,
    resources_html: PropTypes.string.isRequired,
    discussions_html: PropTypes.string.isRequired,
    contributors_html: PropTypes.string.isRequired,
  }).isRequired,

  actions: PropTypes.shape({
    createMessage: PropTypes.func.isRequired,
  }).isRequired,

};

function mapStateToProps(state) {
  return {
    meta: state.live.meta,
    messages: sortedMessagesSelector(state),
    channel: state.live.channel,
    user: { username: 'admin' },

    can: permissionSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...liveActions, ...socketActions };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveAppChannel);
