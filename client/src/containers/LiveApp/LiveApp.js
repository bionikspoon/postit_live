import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SocketActions from '../../actions/socketActions';
import { OPENED, CONNECTING, CLOSED } from '../../constants/LiveStatusTypes';
import LiveTitle from '../../components/LiveTitle';
import LiveStatus from '../../components/LiveStatus';
import LiveNewMessage from '../../components/LiveNewMessage';
import LiveMessage from '../../components/LiveMessage';
import LiveAside from '../../components/LiveAside';

export class LiveApp extends Component {
  constructor(props) {
    super(props);
    this.createMessage = this.createMessage.bind(this);
  }

  createMessage(body) {
    const { user, messages, actions } = this.props;
    const id = messages.length.toString();

    actions.createMessage({
      body,
    });
  }

  render() {
    const { channel, messages, activity, actions } = this.props;

    return (
      <div className="container-fluid" role="main">

        <div className="row">
          <div className="col-md-9">
            <LiveTitle {...channel} />
          </div>
        </div>

        <div className="row">

          <div className="col-xs-12 col-md-9">
            <LiveStatus status={channel.status} {...activity} />

            <LiveNewMessage makeUpdate={this.createMessage} />

            {messages.map(message => (<LiveMessage key={message.id} actions={actions} {...message} />))}
          </div>

          <div className="col-xs-9 col-md-3">

            <LiveAside>
              <label><input type="checkbox" />popup notifications</label>
            </LiveAside>

            <LiveAside title="resources">
              <div dangerouslySetInnerHTML={channel.resources_html} />
            </LiveAside>

            <LiveAside title="discussions">
              <div dangerouslySetInnerHTML={channel.discussions_html} />
            </LiveAside>

            <LiveAside title="updated by">
              <div dangerouslySetInnerHTML={channel.contributors_html} />
            </LiveAside>

            <LiveAside>
              <button className="btn btn-secondary btn-sm">report a rule violation</button>
            </LiveAside>
          </div>
        </div>
      </div>
    );
  }
}

LiveApp.propTypes = {

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
    resources_html: PropTypes.object.isRequired,
    discussions: PropTypes.string.isRequired,
    discussions_html: PropTypes.object.isRequired,
    contributors: PropTypes.string.isRequired,
    contributors_html: PropTypes.object.isRequired,
  }).isRequired,

  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,

  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    messages: state.live.messages,
    channel: state.live.channel,
    activity: state.live.activity,
    user: { username: 'admin' },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SocketActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveApp);
