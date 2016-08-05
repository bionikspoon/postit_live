import './LiveNewMessage.scss';
import React, { PropTypes, Component } from 'react';
import LayoutInnerRow from '../LayoutInnerRow';
import { reduxForm } from 'redux-form';
import autobind from 'autobind-decorator';
import _ from 'lodash';
const debug = require('debug')('app:components:LiveNewMessage');  // eslint-disable-line no-unused-vars

class LiveNewMessage extends Component {
  @autobind
  handleSubmit(...args) {
    const { handleSubmit, resetForm } = this.props;
    resetForm(...args);
    return handleSubmit(...args);
  }

  render() {
    const { submitting, fields: { body } } = this.props;

    const bodyProps = _.omit(body, ['initialValue', 'autofill', 'valid', 'dirty', 'pristine', 'active', 'touched', 'visited', 'autofilled', 'onUpdate', 'invalid']);

    return (
      <LayoutInnerRow className="LiveNewMessage">
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <textarea className="form-control" rows="5" {...bodyProps} value={body.value || ''} />
          </div>
          <div className="clearfix">
            <button
              className="btn btn-outline-primary pull-xs-left"
              disabled={submitting}
              type="submit"
            >
              make update
            </button>
            <small className="pull-xs-right"><a href="#">contenty policy</a> <a href="#">formatting help</a></small>
          </div>
        </form>
      </LayoutInnerRow>
    );
  }
}
LiveNewMessage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  fields: PropTypes.shape({ body: PropTypes.object.isRequired }).isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({ form: 'LiveNewMessage', fields: ['body'] })(LiveNewMessage);
