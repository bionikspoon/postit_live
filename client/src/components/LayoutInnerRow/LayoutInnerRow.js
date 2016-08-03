import './LayoutInnerRow.scss';
import React, { PropTypes, Component, Children } from 'react';

export default class LayoutInnerRow extends Component {
  renderSidebar() {
    const { sidebar } = this.props;
    if (!sidebar) return null;
    return (
      <div className="col-xs-2">
        {sidebar}
      </div>
    );
  }

  render() {
    const { children } = this.props;
    return (
      <div className="row flex-items-xs-right">
        {this.renderSidebar()}

        <div className="col-xs-10">
          {Children.map(children, child => child)}
        </div>
      </div>
    );
  }
}
LayoutInnerRow.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element.isRequired), PropTypes.element.isRequired]).isRequired,
  sidebar: PropTypes.element,
};
