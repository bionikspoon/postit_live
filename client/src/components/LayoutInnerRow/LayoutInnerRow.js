import './LayoutInnerRow.scss';
import React, { PropTypes, Component, Children } from 'react';
import classnames from 'classnames';

const styles = {
  wrapper: 'LayoutInnerRow',
  sidebar: 'LayoutInnerRow__sidebar',
  inner: 'LayoutInnerRow__inner',
};

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

        <div className={styles.inner}>
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
