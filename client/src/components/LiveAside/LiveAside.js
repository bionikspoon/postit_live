import './LiveAside.scss';
import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

export default function LiveAside({ title, children, render }) {
  render = _.isUndefined(render) ? true : render; // eslint-disable-line no-param-reassign
  return render
    ? (
    <div className="row LiveAside">
      <aside className="col-xs">
        {title ? <h2>{title}</h2> : null}

        {children}
      </aside>
    </div>
  )
    : null;
}
LiveAside.propTypes = {
  render: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};
