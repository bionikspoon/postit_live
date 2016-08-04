import './LiveNav.scss';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

export default function LiveNav({ slug, pathname }) {
  const base = `/live/${slug}`;
  const baseClass = classnames('nav-link', { active: pathname === `${base}/` });
  
  return (
    <ul className="nav nav-tabs LiveNav">
      <li className="nav-item">
        <Link to={`${base}/`} className={baseClass}>channel</Link>
      </li>
      <li className="nav-item">
        <Link to={`${base}/settings/`} activeClassName="active" className="nav-link">settings</Link>
      </li>
      <li className="nav-item">
        <Link to={`${base}/contributors/`} activeClassName="active" className="nav-link">contributors</Link>
      </li>
    </ul>
  );
}
LiveNav.propTypes = {
  slug: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
};

