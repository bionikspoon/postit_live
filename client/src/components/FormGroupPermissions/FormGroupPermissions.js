import './FormGroupPermissions.scss';
import React, { PropTypes, Component } from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import FormGroupCheck from '../FormGroupCheck';
import _ from 'lodash';

const debug = require('debug')('app:components:FormGroupPermissions');  // eslint-disable-line no-unused-vars
const styles = {
  wrapper: 'FormGroupPermissions',
  open: 'FormGroupPermissions--open',
  dropdown: 'FormGroupPermissions__dropdown',
  dropdownCheck: 'FormGroupPermissions__dropdown__check',
  dropdownItem: 'FormGroupPermissions__dropdown__item',
  updateButton: 'FormGroupPermissions__update-button',
  changeButton: 'FormGroupPermissions__change-button',
};

const PERMISSIONS = [
  { value: 'change_channel_close', label: 'close channel' },
  { value: 'change_channel_contributors', label: 'edit contributors' },
  { value: 'change_channel_settings', label: 'edit settings' },
  { value: 'change_channel_messages', label: 'edit messages' },
  { value: 'add_channel_messages', label: 'add messages' },
];
export default class FormGroupPermissions extends Component {
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  @autobind
  handleBlur(event) {
    const { currentTarget } = event;

    this.interval = setTimeout(() => {
      if (currentTarget.contains(document.activeElement)) return;
      const { onBlur, value } = this.props;

      onBlur(value);
    }, 0);
  }

  @autobind
  handleChange(event) {
    const { onChange, value } = this.props;
    const { target } = event;

    if (value.includes(target.value)) return onChange(_.uniq(_.without(value, target.value)));

    return onChange(_.uniq(_.concat(value, target.value)));
  }

  renderSummary() {
    const { value } = this.props;
    const summary = () => {
      if (value.length === PERMISSIONS.length) return 'full';
      if (value.length === 0) return 'none';
      return PERMISSIONS
        .filter((permission) => value.includes(permission.value))
        .map(({ label }) => label)
        .join(', ');
    };
    return (
      <small>{summary()}</small>
    );
  }

  renderDropdown() {
    const { active } = this.props;
    if (!active) return null;
    const { onUpdate, name, value } = this.props;

    return (
      <div className={styles.dropdown}>

        {PERMISSIONS.map((permission, index) => (
          <FormGroupCheck
            key={index}
            className={styles.dropdownCheck}
            id={`permissions-${permission.value}`}
            label={permission.label}
            name={`${name}[]`}
            tabIndex={index}
            checked={value.includes(permission.value)}
            value={permission.value}
            onChange={this.handleChange}
          />

        ))}

        {onUpdate
          ? (
          <div className={styles.dropdownItem}>
            <button className={styles.updateButton} onClick={onUpdate}>save</button>
          </div>
        )
          : null}

      </div>
    );
  }

  render() {
    // const { expanded } = this.state;
    const { onFocus, active } = this.props;
    const divClass = classnames(styles.wrapper, { [styles.open]: active });
    return (
      <div className={divClass} onBlur={this.handleBlur} onFocus={onFocus}>
        <div>
          {this.renderSummary()}&nbsp;

          (
          <button className={styles.changeButton} type="button">change</button>
          )
        </div>

        {this.renderDropdown()}
      </div>
    );
  }
}

FormGroupPermissions.propTypes = {
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  name: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  active: PropTypes.bool.isRequired,
};

