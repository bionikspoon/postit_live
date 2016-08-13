import './Confirm.scss';
import React, { PropTypes, Component } from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
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
    this.setTimeout(() => this.yes.focus(), 0);
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

  renderConfirm({ show }) {
    const { btnClass, align } = this.props;
    if (!show) return null;
    const divClass = classnames(
      'dropdown-menu',
      { 'dropdown-menu-left': align === 'left', 'dropdown-menu-right': align === 'right' },
      'Confirm__dropdown'
    );
    const ref = yes => (this.yes = yes);
    return (
      <div className={divClass}>
        <span className="dropdown-item">
          are you sure?&nbsp;
          <button type="button" onClick={this.handleClick} ref={ref} className={btnClass}>yes</button>
          &nbsp;/&nbsp;
          <button type="button" onClick={this.collapse} className={btnClass}>no</button>
        </span>
      </div>
    );
  }

  render() {
    const { value, btnClass } = this.props;
    const { expanded } = this.state;
    const divClass = classnames('dropdown', { open: expanded }, 'Confirm');
    return (
      <div className={divClass} onBlur={this.handleBlur}>
        <button type="button" onClick={this.expand} className={btnClass}>{value}</button>

        {this.renderConfirm({ show: expanded })}
      </div>
    );
  }

}
Confirm.propTypes = {
  btnClass: PropTypes.string,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  align: PropTypes.oneOf(['left', 'right']),
};
