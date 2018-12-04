import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';

import styles from './PointPositionName.less';
import DrawerContainer from '../components/DrawerContainer';
import PointError from '../imgs/pointError.png';

const TYPE = 'point';

export default class PointPositionName extends PureComponent {
  render() {
    const { visible, isUnit, handleDrawerVisibleChange, ...restProps } = this.props;

    const left = (
      <div className={styles.container}>
        <div className={styles.circleContainer}>
          <Col span={12} className={styles.currentTitle}>
            <span>当前状态</span>
          </Col>
          <Col span={12} className={styles.statusIcon}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${PointError})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              }}
            />
          </Col>
        </div>
        <div className={styles.cards}>
          <div className={styles.cardsTitle}>
            <p className={styles.titleP}>
              当前隐患
              <span className={styles.titleSpan}>(2)</span>
            </p>
          </div>
          <div className={styles.cardsMain}>1111</div>
        </div>
        <div className={styles.record}>
          <div className={styles.recordTitle}>
            <p className={styles.titleP}>
              巡查记录
              <span className={styles.titleSpan}>(共9次，异常2次)</span>
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title="点位名称"
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
