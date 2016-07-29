import './ButtonConfirm.scss';
import React, { PropTypes, Component } from 'react';

export default class ButtonConfirm extends Component {
  constructor(props) {
    super(props);
    this.openConfirmation = this.openConfirmation.bind(this);
    this.closeConfirmation = this.closeConfirmation.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = { showDialogue: false }
  }

  openConfirmation() {
    this.setState({ showDialogue: true })
  }

  closeConfirmation() {
    this.setState({ showDialogue: false });
  }

  handleClick(event) {
    this.closeConfirmation();
    this.props.onClick(event);
  }

  render() {
    return this.state.showDialogue ? this.renderConfirm() : this.renderButton();
  }

  renderConfirm() {
    const { className } = this.props;
    return (
      <span className="confirmation">
        <span>are you sure?</span>
        <button onClick={this.handleClick} className={className}>yes</button>
        <span> / </span>
        <button onClick={this.closeConfirmation} className={className}>no</button>
      </span>
    )
  }

  renderButton() {
    const { className, value } = this.props;
    return (
      <button onClick={this.openConfirmation} className={className}>{value}</button>
    );
  }

}
ButtonConfirm.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
