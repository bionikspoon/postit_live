import './LiveTitle.scss';
import React, { PropTypes, Component } from 'react';
import LayoutInnerRow from '../LayoutInnerRow';

export default function LiveTitle({ title, description_html }) {
  return (
    <LayoutInnerRow className="LiveTitle">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: description_html }}></div>
    </LayoutInnerRow>
  );
}
LiveTitle.propTypes = {
  title: PropTypes.string.isRequired,
  description_html: PropTypes.string.isRequired,
};
