import './LiveAside.scss';
import React, { PropTypes, Component } from 'react';

export default function LiveAside({ title, children }) {
  return (
    <div className="row">
      <aside className="col-xs">
        {title ? <h2>{title}</h2> : null}
        {children}
      </aside>
    </div>
  );
}
LiveAside.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};
