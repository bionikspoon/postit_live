import './LiveMessage.scss';
import React, { PropTypes, Component } from 'react';
import Moment from '../Moment';
import ButtonConfirm from '../ButtonConfirm';
import LayoutInnerRow from '../LayoutInnerRow';
export default class LiveMessage extends Component {
  constructor(props) {
    super(props);

    const { actions, id } = this.props;
    this.strikeMessage = actions.strikeMessage.bind(this, { id });
    this.deleteMessage = actions.deleteMessage.bind(this, { id });
  }

  renderStrikeButton() {
    const { status } = this.props;
    return status === 'stricken'
      ? <span>stricken</span>
      : <ButtonConfirm onClick={this.strikeMessage} value="strike" />;
  }

  renderDeleteButton() {
    return <ButtonConfirm onClick={this.deleteMessage} value="delete" />;
  }

  render() {
    const { created, body_html, author, status } = this.props;
    const moment = <Moment date={created} href="#" />;
    return (
      <LayoutInnerRow sidebar={moment}>
        <div className="body">
          <span className={status} dangerouslySetInnerHTML={{ __html: body_html }} />
          <a href="#" className="author">/u/{author.username}</a>
        </div>
        <div className="buttonrow">
          {this.renderStrikeButton()} {this.renderDeleteButton()}
        </div>
      </LayoutInnerRow>
    );
  }
}
LiveMessage.propTypes = {
  id: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  body_html: PropTypes.string.isRequired,
  author: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
  status: PropTypes.oneOf(['visible', 'stricken']).isRequired,
  actions: PropTypes.shape({
    strikeMessage: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
  }).isRequired,
};
