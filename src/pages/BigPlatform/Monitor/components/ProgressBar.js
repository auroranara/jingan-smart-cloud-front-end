import React, { PureComponent } from 'react';
import { Progress } from 'antd';

import styles from './ProgressBar.less';

const STATUS_CN = ['正常', '报警', '失联'];
const COLORS = ['rgb(0, 161, 129)', 'rgb(232, 103, 103)', 'rgb(198, 193, 129)'];
const COLORS_HOVER = ['#00e6b8', '#ff9999', '#fff9a6'];

export default class ProgressBar extends PureComponent {
  state = { hover: false };

  handleHover = () => {
    this.setState(({ hover }) => ({ hover: !hover }));
  };

  render() {
    const { status = 0, num = 0, percent = 0, strokeWidth = 10, handleClick } = this.props;
    const { hover } = this.state;

    const strokeColor = COLORS[status];
    const hoverColor = COLORS_HOVER[status];

    return (
      <div className={styles.progress}>
        <div className={styles.container}>
          <span className={styles.status}>{STATUS_CN[status]}</span>
          <span
            className={styles.num}
            onClick={handleClick}
            onMouseEnter={this.handleHover}
            onMouseLeave={this.handleHover}
            style={{ color: hover ? hoverColor : strokeColor }}
          >{num}</span>
          <span className={styles.percent}>{percent}%</span>
        </div>
        <Progress percent={percent} strokeColor={strokeColor} strokeWidth={strokeWidth} showInfo={false} />
      </div>
    );
  }
}
