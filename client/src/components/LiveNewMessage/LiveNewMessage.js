import './LiveNewMessage.scss';
import React, { PropTypes, Component } from 'react';

export default class LiveNewMessage extends Component {
  constructor(props) {
    super(props);
    this.state = { input: '' };
    this.handleMakeUpdate = this.handleMakeUpdate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleMakeUpdate(event) {
    this.props.makeUpdate(this.state.input);
    this.setState({ input: '' });
  }

  handleInputChange(event) {
    this.setState({ input: event.target.value });
  }

  render() {
    const { input } = this.state;
    return (
      <div className="row flex-items-xs-right">
        <div className="col-xs-10">
          <div className="form-group">
            <textarea onChange={this.handleInputChange} className="form-control" rows="5" value={input} />
          </div>
          <div className="clearfix">
            <button className="btn btn-outline-primary pull-xs-left" onClick={this.handleMakeUpdate}>make update</button>
            <p className="pull-xs-right">
              <a href="#">contenty policy</a><span>&nbsp;</span><a href="#">formatting help</a>
            </p>

          </div>
        </div>
      </div>
    );
  }
}
LiveNewMessage.propTypes = {
  makeUpdate: PropTypes.func.isRequired,
};
