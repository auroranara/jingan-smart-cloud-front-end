import React, { PureComponent } from 'react';

import styles from './GraphSwitch.less';
import lineIcon from '../img/line.png';
import lineGreyIcon from '../img/lineGrey.png';
import barIcon from '../img/bar.png';
import barGreyIcon from '../img/barGrey.png';

export default class GraphSwitch extends PureComponent {
  state = { index: 0 };

  handleClick = i => {
    this.setState({ index: i });
  };

  render() {
    const { index } = this.state;
    const isLineChosen = index === 0;
    const isBarChosen = index === 1;

    return (
      <div className={styles.container}>
        <span
          onClick={e => this.handleClick(0)}
          className={`${styles.line} ${isLineChosen ? styles.chosen : ''}`}
          style={{ backgroundImage: `url(${isLineChosen ? lineIcon : lineGreyIcon})` }}
        />
        <span
          onClick={e => this.handleClick(1)}
          className={`${styles.bar} ${isBarChosen ? styles.chosen : ''}`}
          style={{ backgroundImage: `url(${isBarChosen ? barIcon : barGreyIcon})` }}
        />
      </div>
    );
  }
}
