import './FormGroupPermissions.scss';
import React, { PropTypes, Component } from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import _ from 'lodash';
const debug = require('debug')('app:components:FormGroupPermissions');  // eslint-disable-line no-unused-vars

export default class FormGroupPermissions extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  @autobind
  expand() {
    this.setState({ expanded: true });
  }

  @autobind
  collapse() {
    this.setState({ expanded: false });
  }

  @autobind
  handleBlur(event) {
    const { currentTarget } = event;
    this.interval = setTimeout(() => (currentTarget.contains(document.activeElement) ? null : this.collapse(event)), 0);
  }

  renderPermission({ permission, index }) {
    return (
      <div key={index} className="form-check">
        <label className="form-check-label" tabIndex={index}>
          <input className="form-check-input" type="checkbox" {...permission} /> {permission.label}
        </label>
      </div>
    );
  }

  renderDropdown() {
    const { expanded } = this.state;
    if (!expanded) return null;
    const { onSave } = this.props;

    const permissions = this.props;
    permissions.addMessage.label = 'message ← add';
    permissions.closeChannel.label = 'channel ← close';
    permissions.editContributors.label = 'contributors ← edit';
    permissions.editMessage.label = 'message ← edit';
    permissions.editSettings.label = 'settings ← edit';

    return (
      <div className="form-group dropdown-menu dropdown-menu-right">

        {_.values(permissions)
          .filter(permission => permission && permission.label && permission.label.length)
          .map((permission, index) => this.renderPermission({ permission, index }))}

        {onSave ? <button>save</button> : null}
      </div>
    );
  }

  renderSummary() {
    const values = this.props.values;
    const names = {
      addMessage: 'add message',
      closeChannel: 'close channel',
      editContributors: 'edit contributors',
      editMessage: 'edit message',
      editSettings: 'edit settings',
    };
    const summaryText = _.values(values).every(_.identity)
      ? 'full permissions'
      : _.keys(values).filter(key => values[key]).map(key => names[key]).join(', ');
    return (
      <span>{summaryText}</span>
    );
  }

  render() {
    const { expanded } = this.state;
    const divClass = classnames('dropdown', { open: expanded }, 'FormGroupPermissions');

    return (
      <div className={divClass} onBlur={this.handleBlur}>
        <div>
          {this.renderSummary()}&nbsp;

          (
          <button
            className="btn btn-link"
            type="button"
            onClick={expanded ? this.collapse : this.expand}
          >change
          </button>
          )
        </div>
        {this.renderDropdown()}
      </div>
    );
  }
}

FormGroupPermissions.propTypes = {
  addMessage: PropTypes.object.isRequired,
  closeChannel: PropTypes.object.isRequired,
  editContributors: PropTypes.object.isRequired,
  editMessage: PropTypes.object.isRequired,
  editSettings: PropTypes.object.isRequired,

  values: PropTypes.shape({
    addMessage: PropTypes.object.isRequired,
    closeChannel: PropTypes.object.isRequired,
    editContributors: PropTypes.object.isRequired,
    editMessage: PropTypes.object.isRequired,
  }).isRequired,
};

