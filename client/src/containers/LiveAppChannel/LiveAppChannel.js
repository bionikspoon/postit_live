import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as socketActions from '../../actions/socketActions';
import * as liveActions from '../../actions/liveActions';
import { OPENED, CONNECTING, CLOSED } from '../../constants/LiveStatusTypes';
import LiveTitle from '../../components/LiveTitle';
import LiveStatus from '../../components/LiveStatus';
import LiveNewMessage from '../../components/LiveNewMessage';
import LiveMessage from '../../components/LiveMessage';
import LiveAside from '../../components/LiveAside';
import LayoutRow from '../../components/LayoutRow';
import { getSortedMessages } from '../../selectors';

export class LiveAppChannel extends Component {
  constructor(props) {
    super(props);
    this.createMessage = this.createMessage.bind(this);
  }

  createMessage(body) {
    const { actions } = this.props;

    actions.createMessage({
      body,
    });
  }

  renderSidebar() {
    const { channel } = this.props;

    return (
      <div>
        <LiveAside>
          <label><input type="checkbox" />popup notifications</label>
        </LiveAside>

        <LiveAside title="resources">
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
    const { channel, messages, activity, actions } = this.props;

    return (
      <div>
        <LayoutRow ><LiveTitle {...channel} /></LayoutRow>

        <LayoutRow ><LiveStatus status={channel.status} {...activity} /></LayoutRow>

        <LayoutRow sidebar={this.renderSidebar()}>

          <LiveNewMessage makeUpdate={this.createMessage} />

          {messages.map(message => (<LiveMessage key={message.id} actions={actions} {...message} />))}
        </LayoutRow>

      </div>
    );
  }
}

LiveAppChannel.propTypes = {

  messages: PropTypes.arrayOf(PropTypes.shape({
    author: PropTypes.object.isRequired,
    body: PropTypes.string.isRequired,
    body_html: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  })).isRequired,

  activity: PropTypes.shape({
    viewers: PropTypes.number.isRequired,
  }).isRequired,

  channel: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.oneOf([OPENED, CONNECTING, CLOSED]).isRequired,
    resources: PropTypes.string.isRequired,
    resources_html: PropTypes.string.isRequired,
    discussions: PropTypes.string.isRequired,
    discussions_html: PropTypes.string.isRequired,
    contributors: PropTypes.string.isRequired,
    contributors_html: PropTypes.string.isRequired,
  }).isRequired,

  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,

  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    messages: getSortedMessages(state),
    channel: state.live.channel,
    activity: state.live.activity,
    user: { username: 'admin' },
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...liveActions, ...socketActions };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveAppChannel);
