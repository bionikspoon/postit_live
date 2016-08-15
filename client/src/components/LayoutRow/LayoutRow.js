import './LayoutRow.scss';
import React, { PropTypes, Component, Children } from 'react';
import classnames from 'classnames';

const styles = {
  wrapper: 'LayoutRow',
  sidebar: 'LayoutRow__sidebar',
  inner: 'LayoutRow__inner',
};

export default class LayoutRow extends Component {
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
        <div className={styles.inner}>
          {Children.map(children, child => child)}
        </div>

        {this.renderSidebar()}
      </div>
    );
  }
}
LayoutRow.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  sidebar: PropTypes.element,
};
