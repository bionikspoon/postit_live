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

  renderStrikeButton() {
    const { stricken } = this.props;
    return stricken
      ? <span>stricken</span>
      : <ButtonConfirm onClick={this.strikeMessage} value="strike" />;
  }

  renderDeleteButton() {
    return <ButtonConfirm onClick={this.deleteMessage} value="delete" />;
  }

  render() {
    const { created, body_html, author, stricken } = this.props;
    return (
      <div className="row flex-items-xs-right">
        <div className="col-xs-2">
          <Moment date={created} href="#" />
        </div>
        <div className="col-xs-10">
          <div className="body">
            <span
              className={stricken ? 'strike' : null}
              dangerouslySetInnerHTML={{ __html: body_html }}
            />
            <a href="#" className="author">/u/{author.username}</a>
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
  created: PropTypes.string.isRequired,
  body_html: PropTypes.string.isRequired,
  author: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
  stricken: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    strikeMessage: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
  }).isRequired,
};
