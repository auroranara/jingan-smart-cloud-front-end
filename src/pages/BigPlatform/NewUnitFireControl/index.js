import React, { PureComponent } from 'react';
import { connect } from 'dva';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
// import PointInspectionCount from './PointInspectionCount';

import styles from './index.less';

import FireMonitoring from './Section/FireMonitoring';
import FireDevice from './Section/FireDevice';

const DELAY = 5 * 1000;
const CHART_DELAY = 10 * 60 * 1000;

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
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取消防主机监测
    dispatch({
      type: 'newUnitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });
    // 获取消防设施评分
    dispatch({
      type: 'newUnitFireControl/fetchSystemScore',
      payload: {
        companyId,
      },
    });

    // 轮询
    this.pollTimer = setInterval(this.polling, DELAY);
    this.chartPollTimer = setInterval(this.chartPolling, CHART_DELAY);
  }

  componentWillUnmount() {
    clearInterval(this.pollTimer);
    clearInterval(this.chartPollTimer);
  }

  pollTimer = null;
  chartPollTimer = null;

  polling = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取消防主机监测
    dispatch({
      type: 'newUnitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });
    // 获取消防设施评分
    dispatch({
      type: 'newUnitFireControl/fetchSystemScore',
      payload: {
        companyId,
      },
    });
  };
  render() {
    // 从props中获取数据
    const {
      fireAlarmSystem: {
        fire_state = 0,
        fault_state = 0,
        start_state = 0,
        supervise_state = 0,
        shield_state = 0,
        feedback_state = 0,
      },
      systemScore,
    } = this.props.newUnitFireControl;
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
                <FireMonitoring
                  fire={fire_state}
                  fault={fault_state}
                  shield={shield_state}
                  linkage={start_state}
                  supervise={supervise_state}
                  feedback={feedback_state}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>{/* 重点部位监控 */}</div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 消防设施情况 */}
                <FireDevice systemScore={systemScore} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 点位巡查统计 */}
                {/* <PointInspectionCount model={this.props.newUnitFireControl} /> */}
              </div>
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
