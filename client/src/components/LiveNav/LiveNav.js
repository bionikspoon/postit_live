import './LiveNav.scss';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default function LiveNav({ slug }) {
  const base = `/live/${slug}`;
  return (
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <Link to={`${base}/`} activeClassName="active" className="nav-link">channel</Link>
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
};

