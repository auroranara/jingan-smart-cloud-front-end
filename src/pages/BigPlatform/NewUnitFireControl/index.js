import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import PointInspectionCount from './PointInspectionCount';
import MaintenanceCount from './MaintenanceCount';
import FourColor from './FourColor';

import styles from './index.less';

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
    const { dispatch, match: { params: { unitId } } } = this.props;

    // 获取企业信息
    dispatch({
      type: 'newUnitFireControl/fetchCompanyMessage',
      payload: {
        company_id: unitId,
        month: moment().format('YYYY-MM'),
      },
    });

    // 获取视频列表
    dispatch({
      type: 'newUnitFireControl/fetchVideoList',
      payload: { company_id: unitId },
    });

    // 获取点位信息
    dispatch({
      type: 'newUnitFireControl/fetchRiskPointInfo',
      payload: { company_id: unitId },
    });
  }

  render() {
    return (
      <BigPlatformLayout
        title="晶安智慧云消防展示系统"
        extra="无锡市 新吴区 晴 12℃"
      >
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 企业基本信息 */}
              </div>
            </div>
            <div className={styles.item} style={{ flex: '3' }}>
              <div className={styles.inner}>
                {/* 四色图 */}
                <FourColor model={this.props.newUnitFireControl} dispatch />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 实时消息 */}
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 消防主机监测 */}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 重点部位监控 */}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 消防设施情况 */}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 点位巡查统计 */}
                <PointInspectionCount model={this.props.newUnitFireControl} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 维保统计 */}
                <MaintenanceCount model={this.props.newUnitFireControl} />
              </div>
            </div>
          </div>
        </div>
      </BigPlatformLayout>
    );
  }
}
