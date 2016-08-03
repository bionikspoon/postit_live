import './LayoutRow.scss';
import React, { PropTypes, Component, Children } from 'react';

export default class LayoutRow extends Component {
  renderSidebar() {
    const { sidebar } = this.props;
    if (!sidebar) return null;
    return (
      <div className="col-xs-9 col-md-3 col-md-offset-9">
        {sidebar}
      </div>
    );
  }

  render() {
    const { children } = this.props;
    return (
      <div className="row">
        <div className="col-xs-12 col-md-9">
          {Children.map(children, child => child)}
        </div>

        {this.renderSidebar()}
      </div>
    );
  }
}
LayoutRow.propTypes = {
  children: PropTypes.any.isRequired,
  sidebar: PropTypes.element,
};
