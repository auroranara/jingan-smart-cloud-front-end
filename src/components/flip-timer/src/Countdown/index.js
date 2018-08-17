import React from 'react';
import cn from 'classnames';
import Flipper from './Flipper';
import schema from './schema.js';
import st from './style.less';

let count = 0;
class Countdown extends React.Component {
  constructor(props) {
    super(props);

    /**
     * @type {object}
     * @property {object} diff - initial diff object
     */
    count = this.props.stop;
    this.state = {
      diff: this.getDiffObject(count),
    };
  }

  /**
   * Create second interval
   */
  componentDidMount() {}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('prevProps', prevProps);
    console.log('this.props', this.props);
    return this.props !== prevProps && this.props.start;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('snapshot', snapshot);
    if (snapshot) {
      this.handleStart();
    }
  }
  /**
   * Clears interval and drop notification
   */
  stopCount() {
    window.clearInterval(this.interval);
    this.props.onStop && this.props.onStop();
  }

  /**
   * Destroy second interval
   */
  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  /**
   * Calculate diff object between stop and current date
   * @return {Object} formatted value
   */
  getDiffObject(ms) {
    var s = Math.floor(ms / 1000),
      m = Math.floor(s / 60),
      h = Math.floor(m / 60),
      d = Math.floor(h / 24);

    return {
      // days: Math.floor(h / 24),
      // hours: h % 24,
      minutes: m % 60,
      seconds: s % 60,
    };
  }

  /**
   * Return flag stop date reached
   * @return {Boolean}
   */
  isTimeOver() {
    return count < 0;
  }

  /**
   * Returns formated to 2 digits string
   * @param {Number} data - raw value
   * @return {String} formatted value
   */
  getFormattedVal(data) {
    return (data < 10 ? '0' + data : data) + '';
  }

  handleStart() {
    this.interval = window.setInterval(() => {
      count = count - 1000;
      this.setState({
        diff: this.getDiffObject(count),
      });
      console.log(this.state.diff.seconds);
      this.isTimeOver() && this.stopCount();
    }, 1000);
  }
  /**
   * Render Flipper component for each digit of diff object vals
   * @return {ReactElement} markup
   */
  render() {
    let forks = {
        days: [[0, 9], [0, 9]],
        hours: [[0, 2], [0, 4]],
        minutes: [[0, 5], [0, 9]],
        seconds: [[0, 5], [0, 9]],
      },
      isOver = this.isTimeOver();
    return (
      <div className={cn(st.countdown, this.props.className)}>
        {Object.keys(this.state.diff).map(key => (
          <div key={key} className={cn(st[`countdown-${key}`], this.props.slotClassName)}>
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <Flipper
                  key={`${key}${i}`}
                  reverse
                  className={this.props.cardsClassName}
                  cardClassName={this.props.cardClassName}
                  sidesWrapClassName={this.props.sidesWrapClassName}
                  sideClassName={this.props.sideClassName}
                  numClassName={this.props.numClassName}
                  now={!isOver ? +this.getFormattedVal(this.state.diff[key])[i] : 0}
                  min={forks[key][i][0]}
                  max={forks[key][i][1]}
                />
              ))}
          </div>
        ))}
      </div>
    );
  }
}

Countdown.propTypes = schema.types;

Countdown.defaultProps = schema.defaults;

export default Countdown;
