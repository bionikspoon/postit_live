import styles from './Confirm.scss';
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
  focus(...args) { return this.expand(...args); }

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

  renderConfirmDropdown({ show }) {
    const { btnClass, align } = this.props;
    if (!show) return null;
    const divClass = classnames(
      styles.dropdown,
      { [styles.dropdownLeft]: align === 'left', [styles.dropdownRight]: align === 'right' }
    );
    const ref = yes => (this.yes = yes);
    return (
      <div className={divClass}>
        <span className={styles.dropdownItem}>
          are you sure?&nbsp;
          <button type="button" onClick={this.handleClick} ref={ref} className={btnClass}>yes</button>
          &nbsp;/&nbsp;
          <button type="button" onClick={this.collapse} className={btnClass}>no</button>
        </span>
      </div>
    );
  }

  render() {
    const { value, btnClass, className } = this.props;
    const { expanded } = this.state;
    const divClass = classnames(styles.wrapper, { [styles.wrapperOpen]: expanded });
    const buttonClass = classnames(btnClass, className);
    return (
      <div className={divClass} onBlur={this.handleBlur}>
        <button type="button" onClick={this.expand} className={buttonClass}>{value}</button>

        {this.renderConfirmDropdown({ show: expanded })}
      </div>
    );
  }

}
Confirm.propTypes = {
  btnClass: PropTypes.string,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right']),
};
