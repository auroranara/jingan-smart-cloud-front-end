import React, { PureComponent } from 'react';
import { connect } from 'dva';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';

import styles from './index.less';

import FireMonitoring from './sections/FireMonitoring';
import FireDevice from './sections/FireDevice';

/**
 * description: 新企业消防
 * author:
 * date: 2018年12月03日
 */
@connect(({ newUnitFireControl, loading }) => ({
  newUnitFireControl,
  loading: loading.models.newUnitFireControl,
}))
export default class App extends PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    console.log(id);
  }

  render() {
    return (
      <BigPlatformLayout title="晶安智慧云消防展示系统" extra="无锡市 新吴区 晴 12℃">
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.item}>
              <div className={styles.inner}>{/* 企业基本信息 */}</div>
            </div>
            <div className={styles.item} style={{ flex: '3' }}>
              <div className={styles.inner}>{/* 四色图 */}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>{/* 实时消息 */}</div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 消防主机监测 */}
                <FireMonitoring />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>{/* 重点部位监控 */}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 消防设施情况 */}
                {/* <FireDevice /> */}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>{/* 点位巡查统计 */}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>{/* 维保统计 */}</div>
            </div>
          </div>
        </div>
      </BigPlatformLayout>
    );
  }
}
