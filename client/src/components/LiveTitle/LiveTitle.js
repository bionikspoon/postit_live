import './LiveTitle.scss';
import React, { PropTypes, Component } from 'react';
import LayoutInnerRow from '../LayoutInnerRow';

const styles = {
  wrapper: 'LiveTitle',
};

export default function LiveTitle({ channel: { title, description_html } }) {
  return (
    <LayoutInnerRow className={styles.wrapper}>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: description_html }}></div>
    </LayoutInnerRow>
  );
}
LiveTitle.propTypes = {
  channel: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description_html: PropTypes.string.isRequired,
  }).isRequired,

};
