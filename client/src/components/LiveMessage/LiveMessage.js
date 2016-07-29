import './LiveMessage.scss';
import React, { PropTypes, Component } from 'react';
import Moment from '../Moment';
import ButtonConfirm from '../ButtonConfirm';

export default class LiveMessage extends Component {
  constructor(props) {
    super(props);

    const { actions, id } = this.props;
    this.strikeMessage = actions.strikeMessage.bind(this, { id });
    this.deleteMessage = actions.deleteMessage.bind(this, { id });
  }

  renderStrikeButton(className = 'btn btn-secondary btn-sm') {
    const { stricken } = this.props;
    return stricken
      ? <span>stricken</span>
      : <ButtonConfirm onClick={this.strikeMessage} value="strike" className={className} />;
  }

  renderDeleteButton(className = 'btn btn-secondary btn-sm') {
    return <ButtonConfirm onClick={this.deleteMessage} value="delete" className={className} />;
  }

  render() {
    const { created, body, author, stricken } = this.props;
    return (
      <div className="row flex-items-xs-right">
        <div className="col-xs-2">
          <Moment date={created} href="#" />
        </div>
        <div className="col-xs-10">
          <div className="body">
            <span className={stricken ? 'strike' : null}>{body}</span>
            <a href="#" className="author">/u/{author}</a>
          </div>
          <div className="buttonrow">
            {this.renderStrikeButton()} {this.renderDeleteButton()}
          </div>
        </div>
      </div>
    );
  }
}
LiveMessage.propTypes = {
  id: PropTypes.string.isRequired,
  created: PropTypes.number.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  stricken: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    strikeMessage: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
  }).isRequired,
};
