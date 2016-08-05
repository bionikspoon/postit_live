import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as socketActions from '../../actions/socketActions';
import * as liveActions from '../../actions/liveActions';
import { reduxForm } from 'redux-form';
import LayoutRow from '../../components/LayoutRow';
import LayoutInnerRow from '../../components/LayoutInnerRow';
import autobind from 'autobind-decorator';
import FormGroupTextarea from '../../components/FormGroupTextarea';
import FormGroupText from '../../components/FormGroupText';
const debug = require('debug')('app:containers:LiveAppSettings');  // eslint-disable-line no-unused-vars
const MAX_DESC_CHARS = 120;

export class LiveAppSettings extends Component {

  @autobind
  handleSubmit(data) {
    const { slug, actions } = this.props;
    actions.updateChannel(data);
    actions.push(`/live/${slug}/`);
  }

  render() {
    const { handleSubmit, fields: { title, description, resources }, values } = this.props;
    const charsLeft = MAX_DESC_CHARS - (values.description || '').length;
    const descriptionHelp = (
      `one or two sentences (${MAX_DESC_CHARS} characters) saying what this channel is about (${charsLeft} left)`
    );
    const resourcesHelp = 'information and links that are useful at any point';
    return (
      <LayoutRow className="LivAppSettings">

        <LayoutInnerRow>
          <h1>Settings</h1>
          <form onSubmit={handleSubmit(this.handleSubmit)}>
            <FormGroupText id="title" label="title" {...title} />

            <FormGroupTextarea rows="2" id="description" label="description" help={descriptionHelp} {...description} />

            <FormGroupTextarea rows="10" id="resources" label="resources" help={resourcesHelp} {...resources} />

            <button className="btn btn-primary" type="submit">save settings</button>
          </form>

        </LayoutInnerRow>

      </LayoutRow>
    );
  }
}

LiveAppSettings.propTypes = {

  handleSubmit: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    title: PropTypes.object.isRequired,
    description: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
  }).isRequired,
  values: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    updateChannel: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  return {
    slug: props.params.slug,
    initialValues: state.live.channel,
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...liveActions, ...socketActions, push };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}
const formConfig = { form: 'LiveAppSettings', fields: ['title', 'description', 'resources'] };
export default reduxForm(formConfig, mapStateToProps, mapDispatchToProps)(LiveAppSettings);
