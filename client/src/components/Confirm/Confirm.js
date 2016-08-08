import './Confirm.scss';
import React, { PropTypes, Component } from 'react';
import autobind from 'autobind-decorator';
const debug = require('debug')('app:components:Confirm');  // eslint-disable-line no-unused-vars
export default class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false };
    this.intervals = [];
  }

  componentWillUnmount() {
    this.intervals.forEach(interval => clearInterval(interval));
  }

  @autobind
  setTimeout(func, delay) {
    this.intervals.push(setTimeout(func.bind(this), delay));
  }

  @autobind
  expand() {
    this.setState({ expanded: true });
    this.setTimeout(() => this.refs.yes.focus(), 0);
  }

  @autobind
  collapse() {
    this.setState({ expanded: false });
  }

  @autobind
  handleClick(event) {
    const { onClick } = this.props;
    this.collapse();
    onClick(event);
  }

  @autobind
  handleBlur(event) {
    const { currentTarget } = event;
    this.setTimeout(() => (currentTarget.contains(document.activeElement) ? null : this.collapse(event)), 0);
  }

  renderConfirm() {
    const { btnClass } = this.props;
    return (
      <span className="confirmation">
        <span>are you sure? </span>
        <button type="button" onClick={this.handleClick} ref="yes" className={btnClass}>yes</button>
        <span> / </span>
        <button type="button" onClick={this.collapse} className={btnClass}>no</button>
      </span>
    );
  }

  renderButton() {
    const { value, btnClass } = this.props;
    return (
      <button type="button" onClick={this.expand} className={btnClass}>{value}</button>
    );
  }

  render() {
    return (
      <div className="Confirm" onBlur={this.handleBlur}>
        {this.state.expanded ? this.renderConfirm() : this.renderButton()}
      </div>
    );
  }

}
Confirm.propTypes = {
  btnClass: PropTypes.string,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
