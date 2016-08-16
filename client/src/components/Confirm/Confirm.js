import './Confirm.scss';
import React, { PropTypes, Component } from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
const debug = require('debug')('app:components:Confirm');  // eslint-disable-line no-unused-vars

const styles = {
  wrapper: 'Confirm',
  open: 'Confirm--open',
  dropdown: 'Confirm__dropdown',
  dropdownLeft: 'Confirm__dropdown--left',
  dropdownRight: 'Confirm__dropdown--right',
  dropdownItem: 'Confirm__dropdown__item',
};
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
  expand(event) {
    if (event) event.preventDefault();
    this.setState({ expanded: true });
    this.setTimeout(() => this.yes.focus(), 0);
  }

  @autobind
  focus(...args) { return this.expand(...args); }

  @autobind
  collapse(event) {
    if (event) event.preventDefault();

    this.setState({ expanded: false });
  }

  @autobind
  handleClick(event) {
    if (event) event.preventDefault();

    const { onClick } = this.props;
    this.collapse();
    onClick(event);
  }

  @autobind
  handleBlur(event) {
    event.persist();
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
          <a href="#" role="button" onClick={this.handleClick} ref={ref} className={btnClass}>yes</a>
          &nbsp;/&nbsp;
          <a href="#" role="button" onClick={this.collapse} className={btnClass}>no</a>
        </span>
      </div>
    );
  }

  render() {
    const { value, btnClass, className } = this.props;
    const { expanded } = this.state;
    const divClass = classnames(styles.wrapper, { [styles.open]: expanded });
    const buttonClass = classnames(btnClass, className);
    return (
      <div className={divClass} onBlur={this.handleBlur}>
        <a href="#" role="button" onClick={this.expand} className={buttonClass}>{value}</a>

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
