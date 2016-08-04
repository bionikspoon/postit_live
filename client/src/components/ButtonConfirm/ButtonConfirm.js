import './ButtonConfirm.scss';
import React, { PropTypes, Component } from 'react';
const BUTTON_CLASS = 'btn btn-secondary btn-sm ButtonConfirm';

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
    return (
      <span className="confirmation">
        <span>are you sure? </span>
        <button onClick={this.handleClick} className={BUTTON_CLASS}>yes</button>
        <span> / </span>
        <button onClick={this.closeConfirmation} className={BUTTON_CLASS}>no</button>
      </span>
    );
  }

  renderButton() {
    const { value } = this.props;
    return (
      <button onClick={this.openConfirmation} className={BUTTON_CLASS}>{value}</button>
    );
  }

  render() {
    return this.state.showDialogue ? this.renderConfirm() : this.renderButton();
  }

}
ButtonConfirm.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
