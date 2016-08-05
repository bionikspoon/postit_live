import './FormGroupTextarea.scss';
import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
const debug = require('debug')('app:components:FormGroupTextarea');  // eslint-disable-line no-unused-vars

export default class FormGroupTextarea extends Component {
  renderHelp() {
    const { help } = this.props;
    return help && help.length
      ? (<small className="form-text text-muted">{help}</small>)
      : null;
  }

  renderLabel() {
    const { label, id } = this.props;
    return label && label.length
      ? (<label htmlFor={id}>{label}</label>)
      : null;
  }

  render() {
    const props = _.omit(this.props, [
      'initialValue', 'autofill', 'valid', 'dirty', 'pristine', 'active', 'touched', 'visited', 'autofilled', 'onUpdate', 'invalid', 'help'
    ]);
    return (
      <div className="form-group FormGroupTextarea">
        {this.renderLabel()}

        {this.renderHelp()}

        <textarea className="form-control" {...props} value={props.value || ''} />
      </div>
    );
  }
}

FormGroupTextarea.propTypes = {
  rows: PropTypes.string.isRequired,
  label: PropTypes.string,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
};

