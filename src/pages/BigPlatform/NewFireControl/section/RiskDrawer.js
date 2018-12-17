import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';

import styles from './RiskDrawer.less';
import DrawerContainer from '../components/DrawerContainer';

// const CARDS = [...Array(10).keys()].map(i => ({
//   id: i,
//   point: '配电柜及其输配线路',
//   examiner: '张三',
//   date: '2018/08/08',
//   status: Math.random() > 0.5 ? '正常' : '异常',
// }));

const NORMALS = [1, 3];
const NO_DATA = '暂无信息';
const STATUS = ['', '正常', '异常', '待检查', '已超时'];

function RiskCard(props) {
  const { point, examiner, date, status } = props;

  return (
    <div className={styles.outer}>
      <div className={styles.card}>
        <p>
          <span className={styles.point}>风险点</span>
          {point}
        </p>
        <p>
          <span className={styles.point}>检查人</span>
          {examiner}
        </p>
        <p>
          <span className={styles.date}>检查时间</span>
          {date}
        </p>
        <p>
          <span className={styles.status}>状态</span>
          <span className={NORMALS.includes(status) ? styles.normal : styles.abnormal}>{STATUS[status]}</span>
        </p>
      </div>
    </div>
  );
}

const TYPE = 'risk';

export default class RiskDrawer extends PureComponent {
  render() {
    const { visible, data: list=[], handleDrawerVisibleChange } = this.props;

    const left = (
      <div className={styles.container}>
        <div className={styles.circleContainer}>
          <div className={styles.circle}>
            <p className={styles.num}>{list.length}</p>
            <p className={styles.total}>总计</p>
          </div>
        </div>
        <div className={styles.cards}>
          {list.map(({ item_id, object_title, user_name, check_date, status }) => (
            <RiskCard
              key={item_id}
              point={object_title || NO_DATA}
              examiner={user_name || NO_DATA}
              date={check_date || NO_DATA}
              status={status}
            />
          ))}
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title="风险点"
        width={485}
        visible={visible}
        left={left}
        onClose={() => handleDrawerVisibleChange(TYPE)}
      />
    );
  }
}
