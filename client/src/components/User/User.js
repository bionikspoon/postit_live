import './User.scss';
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

const debug = require('debug')('app:components:User');  // eslint-disable-line no-unused-vars

export default function User({ user: { username }, className, ...props }) {
  const wrapClass = classnames('User', className);

  return (
    <span className={wrapClass} {...props}>/u/{username}</span>
  );
}

User.propTypes = {
  user: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
  className: PropTypes.string,
};

