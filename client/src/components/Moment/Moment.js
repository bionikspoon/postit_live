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
    return this.props.date !== nextProps.date || this.state.fromNow !== nextState.fromNow;
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    const { title, iso, fromNow } = this.state;
    return (
      <time dateTime={iso} title={title} className="Moment">{fromNow}</time>
    );
  }
}
Moment.propTypes = {
  date: PropTypes.string.isRequired,
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
