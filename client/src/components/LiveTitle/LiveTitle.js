import './LiveTitle.scss';
import React, { PropTypes, Component } from 'react';

export default function LiveTitle({ title, description_html }) {
  return (
    <div className="row flex-items-xs-right">
      <div className="col-xs-10">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: description_html }}></div>
      </div>
    </div>
  );
}
LiveTitle.propTypes = {
  title: PropTypes.string.isRequired,
  description_html: PropTypes.string.isRequired,
};
