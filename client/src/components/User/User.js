import './User.scss';
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';

const debug = require('debug')('app:components:User');  // eslint-disable-line no-unused-vars

export default function User({ username, className, ...props }) {
  const wrapClass = classnames('User', className);
  const attrs = _.omit(props, ['isFetching', 'perms']);

  return (
    <span className={wrapClass} {...attrs}>/u/{username}</span>
  );
}

User.propTypes = {
  username: PropTypes.string.isRequired,
  className: PropTypes.string,
};

