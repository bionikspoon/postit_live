import './Moment.scss';
import React, { PropTypes, Component } from 'react';
import moment from 'moment';

const styles = {
  wrapper: 'Moment',
};

export default class Moment extends Component {
  constructor(props) {
    super(props);
    this.state = createDate(this.props.date);
  }

  componentWillMount() {
    this.setInterval(recalculate, 10 * 1000);

    function recalculate() {
      this.setState({ fromNow: this.state.date.fromNow() });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.date !== nextProps.date || this.state.fromNow !== nextState.fromNow;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setInterval(func, time) {
    clearInterval(this.interval);
    this.interval = setInterval(func.bind(this), time);
  }

  render() {
    const { title, iso, fromNow } = this.state;
    return (
      <time dateTime={iso} title={title} className={styles.wrapper}>{fromNow}</time>
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
