import './LiveAside.scss';
import React, { PropTypes, Component } from 'react';

export default function LiveAside({ title, children }) {
  return (
    <aside>
      <h2>{title}</h2>
      {children}
    </aside>
  );
}
LiveAside.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
