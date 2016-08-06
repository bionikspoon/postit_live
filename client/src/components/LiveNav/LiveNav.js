import './LiveNav.scss';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

export default function LiveNav({ slug, pathname, can }) {
  const base = `/live/${slug}`;
  const baseClass = classnames('nav-link', { active: pathname === `${base}/` });

  return (
    <ul className="nav nav-tabs LiveNav">
      <li className="nav-item">
        <Link to={`${base}/`} className={baseClass}>channel</Link>
      </li>

      {renderSettingsTab({ base, perms: can.editSettings })}

      {renderContributorsTab({ base, perms: can.editContributors })}
    </ul>
  );
}
LiveNav.propTypes = {
  can: PropTypes.shape({
    editSettings: PropTypes.bool.isRequired,
    editContributors: PropTypes.bool.isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
};

function renderSettingsTab({ perms, base }) {
  if (!perms) return null;
  return (
    <li className="nav-item">
      <Link to={`${base}/settings/`} activeClassName="active" className="nav-link">settings</Link>
    </li>
  );
}
renderSettingsTab.propTypes = {
  perms: PropTypes.bool.isRequired,
  base: PropTypes.string.isRequired,
};

function renderContributorsTab({ perms, base }) {
  if (!perms) return null;
  return (
    <li className="nav-item">
      <Link to={`${base}/contributors/`} activeClassName="active" className="nav-link">contributors</Link>
    </li>
  );
}
renderContributorsTab.propTypes = {
  perms: PropTypes.bool.isRequired,
  base: PropTypes.string.isRequired,
};
