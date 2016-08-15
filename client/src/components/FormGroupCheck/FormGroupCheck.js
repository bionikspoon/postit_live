import './FormGroupCheck.scss';
import React, { PropTypes } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
const debug = require('debug')('app:components:FormGroupCheck');  // eslint-disable-line no-unused-vars

const style = {
  wrapper: 'FormGroupCheck',
  label: 'FormGroupCheck__label',
  input: 'FormGroupCheck__input',
};

export default function FormGroupCheck(props) {
  const field = _.omit(props, [
    'initialValue', 'autofill', 'valid', 'dirty', 'pristine', 'active', 'touched', 'visited', 'autofilled',
    'onUpdate', 'invalid', 'help', 'className', 'tabIndex',
  ]);
  field['aria-label'] = field.label || field.title || field.name;
  const checkClass = classnames(style.wrapper, props.className);
  return (
    <div className={checkClass}>
      <label htmlFor={field.id} className={style.label} tabIndex={props.tabIndex}>
        <input type="checkbox" className={style.input} {...field} /> {field.label}
      </label>
    </div>
  );
}

FormGroupCheck.propTypes = {
  tabIndex: PropTypes.number,
  label: PropTypes.string,
  help: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
};

