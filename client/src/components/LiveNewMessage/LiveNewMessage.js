import './LiveNewMessage.scss';
import React, { PropTypes, Component } from 'react';
import LayoutInnerRow from '../LayoutInnerRow';

export default class LiveNewMessage extends Component {
  constructor(props) {
    super(props);
    this.state = { input: '' };
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleOnClick(event) {
    this.props.createMessage(this.state.input);
    this.setState({ input: '' });
  }

  handleInputChange(event) {
    this.setState({ input: event.target.value });
  }

  render() {
    const { input } = this.state;
    return (
      <LayoutInnerRow className="LiveNewMessage">
        <div className="form-group">
          <textarea onChange={this.handleInputChange} className="form-control" rows="5" value={input} />
        </div>
        <div className="clearfix">
          <button className="btn btn-outline-primary pull-xs-left" onClick={this.handleOnClick}>make update</button>
          <p className="pull-xs-right"><a href="#">contenty policy</a> <a href="#">formatting help</a></p>

        </div>
      </LayoutInnerRow>
    );
  }
}
LiveNewMessage.propTypes = {
  createMessage: PropTypes.func.isRequired,
};
