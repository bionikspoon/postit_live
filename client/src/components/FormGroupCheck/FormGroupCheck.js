import style from './FormGroupCheck.scss';
import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
const debug = require('debug')('app:components:FormGroupCheck');  // eslint-disable-line no-unused-vars

export default class FormGroupCheck extends Component {
  render() {
    const props = _.omit(this.props, [
      'initialValue', 'autofill', 'valid', 'dirty', 'pristine', 'active', 'touched', 'visited', 'autofilled',
      'onUpdate', 'invalid', 'help', 'className', 'tabIndex',
    ]);
    props['aria-label'] = props.label || props.title || props.name;
    const checkClass = classnames(style.wrapper, this.props.className);
    return (
      <div className={checkClass}>
        <label htmlFor={props.id} className={style.label} tabIndex={this.props.tabIndex}>
          <input type="checkbox" className={style.input} {...props} /> {props.label}
        </label>
      </div>
    );
  }
}

FormGroupCheck.propTypes = {
  label: PropTypes.string,
  help: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
};

