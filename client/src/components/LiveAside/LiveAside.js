import styles from './LiveAside.scss';
import React, { PropTypes } from 'react';

export default function LiveAside({ title, children, show }) {
  return show
    ? (
    <div className={styles.wrapper}>
      <aside className={styles.wrapperInner}>
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
