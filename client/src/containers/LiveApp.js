import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LiveActions from '../actions/liveActions';

export class LiveApp extends Component {
  handleMakeUpdate() {
    this.props.actions.createMessage('hello, world');
  }

  render() {
    const messages = this.props.messages.map(message => (
      <div className="row" key={message.id}>
        <div className="col-md-2">
          <a href="#">
            <time dateTime={message.created} title={message.crated}>{message.created}</time>
          </a>
        </div>
        <div className="col-md-7"><span>{message.body}</span>
          <a href="#" className="author">/u/{message.author}</a>
        </div>
      </div>
    ));

    return (
      <div className="container-fluid" role="main">
        <div className="row">
          <div className="col-md-7 col-md-offset-2"><h1>Temp</h1></div>
        </div>

        <div className="row">
          <div className="col-md-7 col-md-offset-2">
            <div className="alert alert-success">
              <span>live</span> <span>~4 viewers</span>
            </div>
          </div>
          <div className="col-md-3">
            <label><input type="checkbox" />popup notifications</label>
          </div>
        </div>


        <div className="row">
          <div className="col-md-7 col-md-offset-2">
            <div className="form-group">
              <textarea className="form-control" rows="5"></textarea>
            </div>
            <div>
              <button className="btn btn-default" onClick={this.handleMakeUpdate}>make update</button>
              <a href="#">contenty policy</a>
              &nbsp;
              <a href="#">formatting help</a>
            </div>
          </div>
        </div>

        {messages}
      </div>
    );
  }
}

LiveApp.propTypes = {
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    messages: state.live.messages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(LiveActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveApp);
