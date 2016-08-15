import './User.scss';
import React, { PropTypes } from 'react';
import classnames from 'classnames';

const debug = require('debug')('app:components:User');  // eslint-disable-line no-unused-vars

const styles = {
  wrapper: 'User',
};

export default function User({ user: { username }, className }) {
  const wrapClass = classnames(styles.wrapper, className);
  if (!username || !username.length) return null;

  return (
    <code className={wrapClass}>/u/{username}</code>
  );
}

User.propTypes = {
  user: PropTypes.shape({ username: PropTypes.string }).isRequired,
  className: PropTypes.string,
};
