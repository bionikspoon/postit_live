import './LiveMessage.scss';
import React, { PropTypes, Component } from 'react';

export default function LiveMessage({ created, body, author }) {
  return (
    <div className="row">
      <div className="col-md-2">
        <a href="#">
          <time dateTime={created} title={created}>{created}</time>
        </a>
      </div>
      <div className="col-md-10"><span>{body}</span>
        <a href="#" className="author">/u/{author}</a>
      </div>
    </div>
  );
}
LiveMessage.propTypes = {
  created: PropTypes.number.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};
