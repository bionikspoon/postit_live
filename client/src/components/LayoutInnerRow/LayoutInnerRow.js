import styles from './LayoutInnerRow.scss';
import React, { PropTypes, Component, Children } from 'react';
import classnames from 'classnames';

export default class LayoutInnerRow extends Component {
  renderSidebar() {
    const { sidebar } = this.props;
    if (!sidebar) return null;
    return (
      <div className={styles.sidebar}>
        {sidebar}
      </div>
    );
  }

  render() {
    const { children, className } = this.props;
    const wrapClass = classnames(styles.wrapper, className);
    return (
      <div className={wrapClass}>
        {this.renderSidebar()}

        <div className={styles.wrapperInner}>
          {Children.map(children, child => child)}
        </div>
      </div>
    );
  }
}
LayoutInnerRow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element.isRequired),
    PropTypes.element.isRequired,
  ]).isRequired,
  sidebar: PropTypes.element,
};
