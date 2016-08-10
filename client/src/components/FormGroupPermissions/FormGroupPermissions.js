import './FormGroupPermissions.scss';
import React, { PropTypes, Component } from 'react';
import autobind from 'autobind-decorator';
import * as userUtils from '../../utils/user';
import _ from 'lodash';
import classnames from 'classnames';
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

  renderPermission({ permission, label, index }) {
    const attrs = _.omit(permission, [
      'initialValue', 'autofill', 'onUpdate', 'valid', 'invalid', 'dirty', 'pristine', 'active', 'touched', 'visited',
      'autofilled',
    ]);
    return (
      <div key={index} className="form-check">
        <label className="form-check-label" tabIndex={index}>
          <input className="form-check-input" type="checkbox" {...attrs} /> {label}
        </label>
      </div>
    );
  }

  renderDropdown() {
    const { expanded } = this.state;
    if (!expanded) return null;
    const { onSubmit, user } = this.props;

    return (
      <div className="form-group dropdown-menu dropdown-menu-right">

        {userUtils.mapField(user).map(field => this.renderPermission(field))}

        {onSubmit ? <button>save</button> : null}
      </div>
    );
  }

  render() {
    const { expanded } = this.state;
    const { user } = this.props.values;
    const divClass = classnames('dropdown', { open: expanded }, 'FormGroupPermissions');
    debug('this.props.values.user.can', this.props.values.user.can);
    debug('this.props.values.user.can.closeChannel', this.props.values.user.can.closeChannel);
    debug('user.can', user.can);
    return (
      <div className={divClass} onBlur={this.handleBlur}>
        <div>
          {userUtils.permissionSummary(user)}&nbsp;

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
  values: PropTypes.shape({
    user: userUtils.propTypes(),
  }).isRequired,

  onSubmit: PropTypes.func,
  user: PropTypes.object.isRequired,
};

