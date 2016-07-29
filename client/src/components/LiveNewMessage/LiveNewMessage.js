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
      <div className="row">
        <div className="col-md-10 col-md-offset-2">
          <div className="form-group">
            <textarea onChange={this.handleInputChange} className="form-control" rows="5" value={input} />
          </div>
          <div>
            <button className="btn btn-default" onClick={this.handleMakeUpdate}>make update</button>
            <a href="#">contenty policy</a>
            &nbsp;
            <a href="#">formatting help</a>
          </div>
        </div>
      </div>
    );
  }
}
LiveNewMessage.propTypes = {
  makeUpdate: PropTypes.func.isRequired,
};
