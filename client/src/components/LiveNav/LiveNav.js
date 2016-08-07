import './LiveNav.scss';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import User from '../User';

const debug = require('debug')('app:containers:LiveNav');  // eslint-disable-line no-unused-vars

export default class LiveNav extends Component {
  base(...paths) {
    const { slug } = this.props;
    return ['', 'live', slug, ...paths, ''].join('/');
  }

  renderChannelTab() {
    const { pathname } = this.props;
    const baseClass = classnames('nav-link', { active: pathname === this.base() });

    return (
      <li className="nav-item">
        <Link to={this.base()} className={baseClass}>channel</Link>
      </li>
    );
  }

  renderContributorsTab({ show }) {
    if (!show) return null;
    return (
      <li className="nav-item">
        <Link to={this.base('contributors')} activeClassName="active" className="nav-link">contributors</Link>
      </li>
    );
  }

  renderSettingsTab({ show }) {
    if (!show) return null;
    return (
      <li className="nav-item">
        <Link to={this.base('settings')} activeClassName="active" className="nav-link">settings</Link>
      </li>
    );
  }

  renderLogout({ show }) {
    if (!show) return null;

    const { currentUser } = this.props;

    return (
      <span>
        <li className="nav-item pull-xs-right">
          <a href="/logout/" className="nav-link">logout</a>
        </li>

        <li className="nav-item pull-xs-right">
          <span className="nav-link">logged in as <User {...currentUser} /></span>
        </li>
      </span>
    );
  }

  renderLogin({ show }) {
    if (!show) return null;
    const loginLink = `/login/?next=${this.base()}`;
    return (
      <li className="nav-item pull-xs-right">
        <a href={loginLink} className="nav-link">login</a>
      </li>

    );
  }

  render() {
    const { can } = this.props;

    return (
      <ul className="nav nav-tabs LiveNav">
        {this.renderChannelTab()}

        {this.renderSettingsTab({ show: can.editSettings })}

        {this.renderContributorsTab({ show: can.editContributors })}

        {this.renderLogout({ show: can.logout })}

        {this.renderLogin({ show: can.login })}
      </ul>
    );
  }
}

LiveNav.propTypes = {
  can: PropTypes.shape({
    editSettings: PropTypes.bool.isRequired,
    editContributors: PropTypes.bool.isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
};

