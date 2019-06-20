import React, { PureComponent } from 'react';
import { Progress } from 'antd';
import Section from '../Section';

import styles from './index.less';

/**
 * description: 维保统计
 * author: sunkai
 * date: 2018年12月03日
 */
export default class App extends PureComponent {
  render() {
    const {
      model: { workOrderList1 = [], workOrderList2 = [], workOrderList7 = [] },
      // 显示工单
      handleShowOrder,
    } = this.props;
    const total = workOrderList2.length + workOrderList1.length;
    const percent = total === 0 ? 0 : Math.round((workOrderList1.length / total) * 100);

    return (
      <Section title="维保统计">
        <div className={styles.top}>
          <span className={styles.topName}>维保完成率</span>
          {workOrderList1.length === 0 ? (
            '--'
          ) : (
            <Progress
              width={document.body.offsetWidth < 1380 ? 65 : 100}
              type="circle"
              percent={percent}
              strokeColor="#04fdff"
              status="active"
              format={percent => <span style={{ color: '#04fdff' }}>{percent + '%'}</span>}
            />
          )}
        </div>
        <div className={styles.bottom}>
          <div className={styles.itemWrapper}>
            <div
              className={styles.item}
              onClick={() => {
                handleShowOrder('workOrder', { drawerType: 7 });
              }}
            >
              <div className={styles.itemValue} style={{ color: '#ff4848' }}>
                {workOrderList7.length}
              </div>
              <div className={styles.itemLabel}>已超期工单</div>
            </div>
          </div>
          <div className={styles.itemWrapper}>
            <div
              className={styles.item}
              onClick={() => {
                handleShowOrder('workOrder', { drawerType: 2 });
              }}
            >
              <div className={styles.itemValue} style={{ color: '#04fdff' }}>
                {workOrderList2.length}
              </div>
              <div className={styles.itemLabel}>待完成工单</div>
            </div>
          </div>
          <div className={styles.itemWrapper}>
            <div
              className={styles.item}
              onClick={() => {
                handleShowOrder('workOrder', { drawerType: 1 });
              }}
            >
              <div className={styles.itemValue} style={{ color: '#04fdff' }}>
                {workOrderList1.length}
              </div>
              <div className={styles.itemLabel}>已完成工单</div>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
