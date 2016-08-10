import './User.scss';
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

const debug = require('debug')('app:components:User');  // eslint-disable-line no-unused-vars

export default function User(props) {
  const wrapClass = classnames('User', props.className);
  if (!props.user.username || !props.user.username.length) return null;

  return (
    <code className={wrapClass}>/u/{props.user.username}</code>
  );
}

User.propTypes = {
  user: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
  className: PropTypes.string,
};

