import './Moment.scss';
import React, { PropTypes, Component } from 'react';
import moment from 'moment';

export default class Moment extends Component {
  constructor(props) {
    super(props);
    this.state = createDate(this.props.date);
  }

  componentWillMount() {
    const intervalId = setInterval(() => {
      this.setState({ fromNow: this.state.date.fromNow() });
    }, 10 * 1000);
    this.setState({ intervalId });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.date !== nextProps.date
      || this.props.href !== nextProps.href
      || this.state.fromNow !== nextState.fromNow;
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    const { title, iso, fromNow } = this.state;
    const { href } = this.props;
    return (
      <a href={href} className="Moment">
        <time dateTime={iso} title={title}>{fromNow}</time>
      </a>
    );
  }
}
Moment.propTypes = {
  date: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

function createDate(epoch) {
  const date = moment(epoch);
  return {
    date,
    title: date.format('LLLL'),
    iso: date.toISOString(),
    fromNow: date.fromNow(),
  };
}
