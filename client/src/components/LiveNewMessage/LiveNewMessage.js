import './LiveNewMessage.scss';
import React, { PropTypes, Component } from 'react';
import LayoutInnerRow from '../LayoutInnerRow';
import { reduxForm } from 'redux-form';
import autobind from 'autobind-decorator';
import FormGroupTextarea from '../FormGroupTextarea';
const debug = require('debug')('app:components:LiveNewMessage');  // eslint-disable-line no-unused-vars

class LiveNewMessage extends Component {
  @autobind
  handleSubmit(...args) {
    const { handleSubmit, resetForm } = this.props;
    resetForm();
    return handleSubmit(...args);
  }

  render() {
    const { show, submitting, fields: { body } } = this.props;
    if (!show) return null;
    return (
      <LayoutInnerRow className="LiveNewMessage">
        <form className="form" onSubmit={this.handleSubmit}>
          <FormGroupTextarea {...body} id="new-message-body" title="message body" rows="5" />
          <div className="clearfix">
            <button
              className="btn btn-outline-primary pull-xs-left"
              disabled={submitting}
              type="submit"
            >
              make update
            </button>
            <small className="pull-xs-right">
              <a href="#" role="button">contenty policy</a> <a href="#" role="button">formatting help</a>
            </small>
          </div>
        </form>
      </LayoutInnerRow>
    );
  }
}

export default reduxForm({ form: 'LiveNewMessage', fields: ['body'] })(LiveNewMessage);
LiveNewMessage.propTypes = {
  show: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func,
  form: PropTypes.string,

  handleSubmit: PropTypes.func,
  resetForm: PropTypes.func,
  submitting: PropTypes.bool,
  fields: PropTypes.shape({ body: PropTypes.object.isrequired }),
};
