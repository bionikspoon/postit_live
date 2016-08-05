import './LiveNav.scss';
import React, { PropTypes, Component } from 'react';

export default class FormGroupTextarea extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.defaultValue };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

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
    const { id, rows } = this.props;
    const { value } = this.state;
    return (
      <div className="form-group FormGroupTextarea">
        {this.renderLabel()}

        {this.renderHelp()}

        <textarea
          id={id}
          name={id}
          rows={rows}
          className="form-control"
          onChange={this.handleChange}
          value={value}
        />
      </div>
    );
  }
}

FormGroupTextarea.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  help: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  rows: PropTypes.number.isRequired,
};

