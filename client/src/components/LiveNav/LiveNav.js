import './LiveNav.scss';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import Confirm from '../Confirm';
import User from '../User';

const debug = require('debug')('app:containers:LiveNav');  // eslint-disable-line no-unused-vars

const styles = {
  wrapper: 'LiveNav',
  container: 'LiveNav__container',
  link: 'LiveNav__link',
  linkText: 'LiveNav__link LiveNav__link--text',
  linkTitle: 'LiveNav__link LiveNav__link--title LiveNav__link--text',
  active: 'LiveNav__link--active',
  item: 'LiveNav__item',
  itemPullRight: 'LiveNav__item LiveNav__item--pull-right',
  confirmButton: 'LiveNav__confirm-button',
};

export default class LiveNav extends Component {
  base(...paths) {
    const { slug } = this.props;
    return ['', 'live', slug, ...paths, ''].join('/');
  }

  renderChannelTab() {
    const { pathname } = this.props;
    const baseClass = classnames(styles.link, { [styles.active]: pathname === this.base() });

    return (
      <li className={styles.item}>
        <Link to={this.base()} className={baseClass}>channel</Link>
      </li>
    );
  }

  renderContributorsTab({ show }) {
    if (!show) return null;
    return (
      <li className={styles.item}>
        <Link to={this.base('contributors')} activeClassName={styles.active} className={styles.link}>contributors</Link>
      </li>
    );
  }

  renderSettingsTab({ show }) {
    if (!show) return null;
    return (
      <li className={styles.item}>
        <Link to={this.base('settings')} activeClassName={styles.active} className={styles.link}>settings</Link>
      </li>
    );
  }

  renderLogout({ show }) {
    if (!show) return null;
    const { currentUser } = this.props;
    const handleClick = () => (window ? (window.location.pathname = '/logout/') : null);

    return (
      <span>
        <li className={styles.itemPullRight}>
          <Confirm
            value="logout"
            btnClass={styles.confirmButton}
            className={styles.link}
            align="right"
            onClick={handleClick}
          />
        </li>

        <li className={styles.itemPullRight}>
          <span className={styles.linkText}>logged in as <User user={currentUser} /></span>
        </li>
      </span>
    );
  }

  renderLogin({ show }) {
    if (!show) return null;
    const loginLink = `/login/?next=${this.base()}`;
    return (
      <li className={styles.itemPullRight}>
        <a href={loginLink} className={styles.link}>login</a>
      </li>

    );
  }

  render() {
    const { hasPerm, currentUser } = this.props;

    return (
      <nav className={styles.wrapper} role="navigation">
        <ul className={styles.container}>
          <li className={styles.item}>
            <h1 className={styles.linkTitle}>PostIt Live</h1>
          </li>
          {this.renderChannelTab()}

          {this.renderSettingsTab({ show: hasPerm.editSettings })}

          {this.renderContributorsTab({ show: hasPerm.editContributors })}

          {this.renderLogout({ show: !!currentUser.username.length })}

          {this.renderLogin({ show: !currentUser.username.length })}
        </ul>
      </nav>

    );
  }
}

LiveNav.propTypes = {

  slug: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  hasPerm: PropTypes.shape({
    editSettings: PropTypes.bool.isRequired,
    editContributors: PropTypes.bool.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

