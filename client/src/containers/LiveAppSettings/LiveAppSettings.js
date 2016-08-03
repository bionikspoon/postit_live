import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as socketActions from '../../actions/socketActions';
import * as liveActions from '../../actions/liveActions';

export class LiveAppSettings extends Component {
  constructor(props) {
    super(props);
    const { title, description, resources } = this.props.channel;
    this.state = { title, description, resources };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange(field) {
    return event => {
      this.setState({ [field]: event.target.value });
    };
  }

  handleSave() {
    const { slug, actions } = this.props;
    actions.updateChannel(this.state);
    actions.push(`/live/${slug}/`);
  }

  render() {
    const { title, description, resources } = this.state;

    return (
      <div className="row">
        <div className="col-xs-12 col-md-9">
          <div className="row flex-items-xs-right">
            <div className="col-xs-10">
              <h2>Settings</h2>
              <div className="form-group">
                <label htmlFor="title">title</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  onChange={this.handleChange('title')}
                  value={title}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">description</label>
                <small className="form-text text-muted">
                  one or two sentences (120 characters) saying what this channel is about
                </small>
                <textarea
                  id="description"
                  rows="10"
                  className="form-control"
                  onChange={this.handleChange('description')}
                  value={description}
                />
              </div>


              <div className="form-group">
                <label htmlFor="resources">resources</label>
                <small className="form-text text-muted">information and links that are useful at any point</small>
                <textarea
                  id="resources"
                  rows="10"
                  className="form-control"
                  onChange={this.handleChange('resources')}
                  value={resources}
                />
              </div>

              <button className="btn btn-primary" onClick={this.handleSave}>save settings</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LiveAppSettings.propTypes = {
  channel: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    resources: PropTypes.string.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    updateChannel: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

function mapStateToProps(state, props) {
  return {
    channel: state.live.channel,
    slug: props.params.slug,
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...liveActions, ...socketActions, push };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveAppSettings);
