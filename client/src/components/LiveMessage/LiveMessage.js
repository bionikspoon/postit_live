import './LiveMessage.scss';
import React, { PropTypes, Component } from 'react';
import Moment from '../Moment';
import Confirm from '../Confirm';
import LayoutInnerRow from '../LayoutInnerRow';
import User from '../User';

const styles = {
  wrapper: 'LiveMessage',
  buttons: 'LiveMessage__buttons',
  strikeButton: 'LiveMessage__strike-button',
  deleteButton: 'LiveMessage__delete-button',
  visible: 'LiveMessage__content LiveMessage__status LiveMessage__status--visible',
  stricken: 'LiveMessage__content LiveMessage__status LiveMessage__status--stricken',
};
export default class LiveMessage extends Component {
  constructor(props) {
    super(props);

    const { message: { pk }, actions } = this.props;
    this.strikeMessage = actions.strikeMessage.bind(this, { pk });
    this.deleteMessage = actions.deleteMessage.bind(this, { pk });
  }

  renderStrikeButton() {
    const { message: { status } } = this.props;

    return status === 'stricken'
      ? <span>stricken</span>
      : <Confirm onClick={this.strikeMessage} btnClass={styles.strikeButton} value="strike" />;
  }

  renderDeleteButton() {
    return (
      <Confirm onClick={this.deleteMessage} btnClass={styles.deleteButton} value="delete" />
    );
  }

  renderButtons({ show }) {
    if (!show) return null;
    return (
      <div className={styles.buttons}>
        {this.renderStrikeButton()} {this.renderDeleteButton()}
      </div>
    );
  }

  render() {
    const { editable, message: { created, body_html, author, status } } = this.props;
    const moment = <Moment date={created} />;

    return (
      <LayoutInnerRow sidebar={moment} className={styles.wrapper}>
          <div className={styles[status]} dangerouslySetInnerHTML={{ __html: body_html }} />

          <User user={author} />

          {this.renderButtons({ show: editable })}
      </LayoutInnerRow>
    );
  }
}
LiveMessage.propTypes = {
  editable: PropTypes.bool.isRequired,

  message: PropTypes.shape({
    pk: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    body_html: PropTypes.string.isRequired,
    author: PropTypes.object.isRequired,
    status: PropTypes.oneOf(['stricken', 'visible']).isRequired,
  }).isRequired,

  actions: PropTypes.shape({
    strikeMessage: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
  }).isRequired,
};
