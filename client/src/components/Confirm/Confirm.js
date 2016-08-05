import './Confirm.scss';
import React, { PropTypes, Component } from 'react';
const BUTTON_CLASS = 'btn btn-secondary btn-sm Confirm';

export default class ButtonConfirm extends Component {
  constructor(props) {
    super(props);
    this.openConfirmation = this.openConfirmation.bind(this);
    this.closeConfirmation = this.closeConfirmation.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = { showDialogue: false };
  }

  openConfirmation() {
    this.setState({ showDialogue: true });
  }

  closeConfirmation() {
    this.setState({ showDialogue: false });
  }

  handleClick(event) {
    this.closeConfirmation();
    this.props.onClick(event);
  }

  renderConfirm() {
    const { btnClass } = this.props;
    return (
      <span className="confirmation">
        <span>are you sure? </span>
        <button onClick={this.handleClick} className={btnClass}>yes</button>
        <span> / </span>
        <button onClick={this.closeConfirmation} className={btnClass}>no</button>
      </span>
    );
  }

  renderButton() {
    const { value, btnClass } = this.props;
    return (
      <button onClick={this.openConfirmation} className={btnClass}>{value}</button>
    );
  }

  render() {
    return this.state.showDialogue ? this.renderConfirm() : this.renderButton();
  }

}
ButtonConfirm.propTypes = {
  btnClass: PropTypes.string,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
