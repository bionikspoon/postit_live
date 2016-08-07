import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as liveActions from '../../modules/live';
import * as socketActions from '../../modules/socket';
import LiveTitle from '../../components/LiveTitle';
import LiveStatus from '../../components/LiveStatus';
import LiveNewMessage from '../../components/LiveNewMessage';
import LiveMessage from '../../components/LiveMessage';
import LiveAside from '../../components/LiveAside';
import LayoutRow from '../../components/LayoutRow';
import { sortedMessagesSelector, currentUserSelector } from '../../selectors';
import autobind from 'autobind-decorator';
const debug = require('debug')('app:containers:LiveAppChannel');  // eslint-disable-line no-unused-vars

export class LiveAppChannel extends Component {
  @autobind
  createMessage({ body }) {
    const { actions } = this.props;

    actions.socket.createMessage({ body });
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

        <LiveAside title="resources" show={!!channel.resources.length}>
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
    const { channel, messages, meta, actions, currentUser } = this.props;

    return (
      <div className="LiveAppChannel">
        <LayoutRow ><LiveTitle channel={channel} /></LayoutRow>

        <LayoutRow sidebar={this.renderSidebar()}>

          <LiveStatus channel={channel} meta={meta} />

          <LiveNewMessage form="new-message" onSubmit={this.createMessage} show={currentUser.can.addMessage} />


          {messages.map(message => (
            <LiveMessage key={message.id} actions={actions.socket} editable={currentUser.can.editMessage} message={message} />
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
    socket: PropTypes.shape({
      createMessage: PropTypes.func.isRequired,
    }).isRequired,
    live: PropTypes.object.isRequired,
  }).isRequired,

  currentUser: PropTypes.shape({
    can: PropTypes.shape({
      addMessage: PropTypes.bool.isRequired,
      editMessage: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,

};

function mapStateToProps(state) {
  return {
    meta: state.live.meta,
    messages: sortedMessagesSelector(state),
    channel: state.live.channel,

    currentUser: currentUserSelector(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveAppChannel);
