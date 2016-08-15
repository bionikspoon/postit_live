import './LiveAside.scss';
import React, { PropTypes } from 'react';

const styles = {
  wrapper: 'LiveAside',
  inner: 'LiveAside__inner',
};

export default function LiveAside({ title, children, show }) {
  return show
    ? (
    <div className={styles.wrapper}>
      <aside className={styles.inner}>
        {title ? <h2>{title}</h2> : null}

        {children}
      </aside>
    </div>
  )
    : null;
}
LiveAside.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};
LiveAside.defaultProps = { show: true };
