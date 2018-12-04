import React, { PureComponent } from 'react';
// import { Col, Row } from 'antd';

import styles from './CheckingDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import CheckLabel from '../components/CheckLabel';

const TYPE = 'check';

// 检查点状态
const waitCheck = 0; // 待检查
const lastCheck = 1; // 超时检查
const normal = 2; // 正常
const error = 3; // 异常

export default class CheckingDrawer extends PureComponent {
  state = {
    status: '',
  };

  // 处理标签
  handleLabelOnClick = s => {
    console.log(s);
    this.setState({
      status: s,
    });
  };

  render() {
    const { status } = this.state;
    const { visible, isUnit, handleDrawerVisibleChange, ...restProps } = this.props;
    const statusTotal = [];
    const nums = [waitCheck, lastCheck, normal, error].map((status, index) => [
      status,
      statusTotal[index],
    ]);

    const left = (
      <div className={styles.container}>
        <div className={styles.circleContainer}>
          <div className={styles.circle}>
            <p className={styles.num}>4</p>
            <p className={styles.total}>总计</p>
          </div>
        </div>
        <div className={styles.checkBtn}>
          {nums.map(([s, n]) => (
            <CheckLabel
              key={s}
              num={n}
              status={s}
              selected={+status === s}
              onClick={() => this.handleLabelOnClick(s)}
            />
          ))}
        </div>
        <div className={styles.cards}>1111</div>
      </div>
    );

    return (
      <DrawerContainer
        title="检查点详情"
        width={485}
        visible={visible}
        left={left}
        placement="right"
        onClose={() => handleDrawerVisibleChange(TYPE)}
        {...restProps}
      />
    );
  }
}
