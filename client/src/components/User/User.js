import './User.scss';
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
const debug = require('debug')('app:components:User');  // eslint-disable-line no-unused-vars

export default function User({ username, className, ...props }) {
  const pClass = classnames('User', className);

  return (
    <p className={pClass} {...props}>/u/{username}</p>
  );
}

User.propTypes = {
  username: PropTypes.string.isRequired,
  className: PropTypes.string,
};

