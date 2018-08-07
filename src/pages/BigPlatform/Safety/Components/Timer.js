import React, { Component } from 'react';
import moment from 'moment';

class Timer extends Component {
  state = {
    time: '0000-00-00 星期一 00:00:00',
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.getTime();
    }, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getTime = () => {
    const now = moment();
    const myday = now.weekday();
    const weekday = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

    const dayText = moment(now).format('YYYY-MM-DD');
    const timeText = moment(now).format('HH:mm:ss');

    this.setState({
      time: `${dayText}  ${weekday[myday]}  ${timeText}`,
    });
  };


  render() {
    const { time } = this.state;

    return (
      <span>{time}</span>
    );
  }
}

export default Timer;
