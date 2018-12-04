import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import VideoSurveillance from './VideoSurveillance';
import VideoPlay from '../FireControl/section/VideoPlay';
import PointInspectionCount from './PointInspectionCount';
import CompanyInfo from './CompanyInfo';
import Messages from './Messages';
import MaintenanceCount from './MaintenanceCount';
import FourColor from './FourColor';

import styles from './index.less';

import FireMonitoring from './Section/FireMonitoring';
import FireDevice from './Section/FireDevice';
import RiskDrawer from './Section/RiskDrawer';

const DELAY = 5 * 1000;
const CHART_DELAY = 10 * 60 * 1000;

/**
 * description: 新企业消防
 * author:
 * date: 2018年12月03日
 */
@connect(({ newUnitFireControl, monitor, loading }) => ({
  newUnitFireControl,
  monitor,
  loading: loading.models.newUnitFireControl,
}))
export default class App extends PureComponent {

  state = {
    videoVisible: false, // 重点部位监控视频弹窗
    showVideoList: false, // 是否展示视频弹窗右侧列表
    videoKeyId: undefined,
    riskDrawerVisible: true, // 是否显示对应弹框
  }

  componentDidMount() {
    const { dispatch, match: { params: { unitId: companyId } } } = this.props;

    // 获取企业信息
    dispatch({
      type: 'newUnitFireControl/fetchCompanyMessage',
      payload: {
        company_id: companyId,
        month: moment().format('YYYY-MM'),
      },
    });

    // 获取视频列表
    dispatch({
      type: 'newUnitFireControl/fetchVideoList',
      payload: { company_id: companyId },
    });

    // 获取点位信息
    dispatch({
      type: 'newUnitFireControl/fetchRiskPointInfo',
      payload: { company_id: companyId },
    });

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

    // 获取隐患详情
    dispatch({
      type: 'newUnitFireControl/fetchRiskDetail',
      payload: {
        company_id: companyId,
      },
    });

    // 轮询
    this.pollTimer = setInterval(this.polling, DELAY);
    this.chartPollTimer = setInterval(this.chartPolling, CHART_DELAY);
    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
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
  /**
   *  点击播放重点部位监控
   */
  handleShowVideo = (keyId, showList = true) => {
    this.setState({ videoVisible: true, videoKeyId: keyId, showVideoList: showList });
  };

  /**
   *  关闭重点部位监控
   */
  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: undefined });
  };

  handleDrawerVisibleChange = (name) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
    }));
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
    const { videoVisible, showVideoList, videoKeyId, riskDrawerVisible } = this.state
    const {
      monitor: { allCamera },
    } = this.props
    return (
      <BigPlatformLayout title="晶安智慧云消防展示系统" extra="无锡市 新吴区 晴 12℃">
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 企业基本信息 */}
                <CompanyInfo model={this.props.newUnitFireControl} />
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
                <Messages model={this.props.newUnitFireControl} />
              </div>
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
              <div className={styles.inner}>
                {/* 重点部位监控 */}
                <VideoSurveillance
                  handleShowVideo={this.handleShowVideo}
                  data={allCamera}
                />
              </div>
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
          <VideoPlay
            showList={showVideoList}
            videoList={allCamera}
            visible={videoVisible}
            keyId={videoKeyId} // keyId
            handleVideoClose={this.handleVideoClose}
          />
        </div>
        <RiskDrawer
          visible={riskDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
      </BigPlatformLayout>
    );
  }
}
