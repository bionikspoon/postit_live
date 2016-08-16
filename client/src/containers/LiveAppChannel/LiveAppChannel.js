import './LiveAppChannel.scss';
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
import User from '../../components/User';
import FormGroupCheck from '../../components/FormGroupCheck';
import autobind from 'autobind-decorator';
import * as selector from '../../selectors';

const debug = require('debug')('app:containers:LiveAppChannel');  // eslint-disable-line no-unused-vars

const styles = {
  wrapper: 'LiveAppChannel',
  sidebar: 'LiveAppChannel__sidebar',
  reportButton: 'LiveAppChannel__report-button',
};

export class LiveAppChannel extends Component {
  @autobind
  createMessage({ body }) {
    const { actions } = this.props;

    actions.socket.createMessage({ body });
  }

  renderSidebar() {
    const { channel, contributors } = this.props;

    return (
      <div className={styles.sidebar}>
        <LiveAside><FormGroupCheck id="popup" label="popup notifications" /></LiveAside>

        <LiveAside title="resources" show={!!channel.resources.length}>
          <div dangerouslySetInnerHTML={{ __html: channel.resources_html }} />
        </LiveAside>

        <LiveAside title="discussions">
          <div dangerouslySetInnerHTML={{ __html: channel.discussions_html }} />
        </LiveAside>

        <LiveAside title="updated by">
          <div style={{ display: 'inline' }}>
            {contributors.map(contributor => (
              <p key={contributor.username}>
                <User user={contributor} />
              </p>
            ))}
          </div>
        </LiveAside>

        <LiveAside>
          <button className={styles.reportButton}>report a rule violation</button>
        </LiveAside>
      </div>
    );
  }

  render() {
    const { channel, messages, meta, actions, hasPerm } = this.props;

    return (
      <div className={styles.wrapper}>
        <LayoutRow ><LiveTitle channel={channel} /></LayoutRow>

        <LayoutRow sidebar={this.renderSidebar()}>

          <LiveStatus channel={channel} meta={meta} />

          <LiveNewMessage form="new-message" onSubmit={this.createMessage} show={hasPerm.addMessage} />


          {messages.map(message => (
            <LiveMessage key={message.pk} actions={actions.socket} editable={hasPerm.editMessage} message={message} />
          ))}
        </LayoutRow>

      </div>
    );
  }
}

LiveAppChannel.propTypes = {

  meta: PropTypes.object.isRequired,

  messages: PropTypes.arrayOf(PropTypes.shape({
    pk: PropTypes.string.isRequired,
  })).isRequired,

  channel: PropTypes.shape({
    status: PropTypes.string.isRequired,
    resources: PropTypes.string.isRequired,
    resources_html: PropTypes.string.isRequired,
    discussions_html: PropTypes.string.isRequired,
  }).isRequired,

  actions: PropTypes.shape({
    socket: PropTypes.shape({
      createMessage: PropTypes.func.isRequired,
    }).isRequired,
    live: PropTypes.object.isRequired,
  }).isRequired,

  hasPerm: PropTypes.shape({
    addMessage: PropTypes.bool.isRequired,
    editMessage: PropTypes.bool.isRequired,
  }).isRequired,

  contributors: PropTypes.arrayOf(
    PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired
  ).isRequired,

};

function mapStateToProps(state) {
  return {
    meta: state.live.meta,
    messages: selector.sortedMessages(state),
    channel: state.live.channel,
    contributors: selector.contributors(state),

    currentUser: state.live.currentUser,
    hasPerm: selector.hasPerm(state),
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
