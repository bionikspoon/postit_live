import './LiveMessage.scss';
import React, { PropTypes, Component } from 'react';
import Moment from '../Moment';

export default function LiveMessage({ created, body, author }) {
  return (
    <div className="row flex-items-xs-right">
      <div className="col-xs-2">
        <Moment date={created} href="#" />
      </div>
      <div className="col-xs-10">
        <div className="body">
          <span>{body}</span>
          <a href="#" className="author">/u/{author}</a>
        </div>
        <div className="buttonrow">
          <button className="btn btn-secondary btn-sm">strike</button>
          <button className="btn btn-secondary btn-sm">delete</button>
        </div>
      </div>
    </div>
  );
}
LiveMessage.propTypes = {
  created: PropTypes.number.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};
