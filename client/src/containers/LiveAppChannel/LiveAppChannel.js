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
    const { channel, messages, meta, actions } = this.props;

    return (
      <div>
        <LayoutRow ><LiveTitle {...channel} /></LayoutRow>

        <LayoutRow sidebar={this.renderSidebar()}>

          <LiveStatus channelStatus={channel.status} {...meta} />

          <LiveNewMessage createMessage={this.createMessage} />

          {messages.map(message => (<LiveMessage key={message.id} actions={actions} {...message} />))}
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
    messages: getSortedMessages(state),
    channel: state.live.channel,
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
