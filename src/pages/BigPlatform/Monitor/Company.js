import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import Header from '../UnitFireControl/components/Header/Header';

import styles from './Company.less';
import FcModule from '../FireControl/FcModule';
import VideoSection from './sections/VideoSection';
import GasSection from './sections/GasSection';
import GasBackSection from './sections/GasBackSection';
import VideoPlay from './sections/VideoPlay';
import { ALL } from './components/gasStatus';

/**
 * 动态监测
 */
@connect(({ monitor }) => ({
  monitor,
}))
export default class App extends PureComponent {
  state = {
    gasRotated: false,
    gasStatus: ALL,
    videoVisible: false,
    videoKeyId: undefined,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } =  this.props;

    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
    dispatch({ type: 'monitor/fetchGasCount', payload: { companyId, type: 2 }});
    dispatch({ type: 'monitor/fetchGasList', payload: { companyId, type: 2 } });
  }

  /**
   * 实时报警
   */
  renderRealTimeAlarm() {
    return (
      <div></div>
    );
  }

  /**
   * 视频监控
   */
  // renderVideoMonitor() {
  //   return (
  //     <div></div>
  //   );
  // }

  /**
   * 当前状态
   */
  renderCurrentState() {
    return (
      <div></div>
    );
  }

  /**
   * 设备总数
   */
  renderDeviceTotalNumber() {
    return (
      <div></div>
    );
  }

  /**
   * 失联设备
   */
  renderMissingDevice() {
    return (
      <div></div>
    );
  }

  /**
   * 异常设备
   */
  renderAbnormalDevice() {
    return (
      <div></div>
    );
  }

  /**
   * 用电安全监测
   */
  renderElectricitySafetyMonitor() {
    return (
      <div></div>
    );
  }

  /**
   * 可燃/有毒气体监测
   */
  // renderGasMonitor() {
  //   return (
  //     <div></div>
  //   );
  // }

  /**
   * 废水监测
   */
  renderEffluentMonitor() {
    return (
      <div></div>
    );
  }

  /**
   * 废气监测
   */
  renderExhaustMonitor() {
    return (
      <div></div>
    );
  }

  handleGasNumClick = (status) => {
    this.setState({ gasRotated: true, gasStatus: status });
  };

  handleGasLabelClick = (status) => {
    this.setState({ gasStatus: status });
  };

  handleGasBack = () => {
    this.setState({ gasRotated: false });
  };

  handleVideoShow = keyId => {
    this.setState({ videoVisible: true, videoKeyId: keyId });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: undefined });
  };

  render() {
    // 从props中获取企业名称
    const {
      monitor: {
        allCamera = [],
        gasCount,
        gasList,
      },
      dispatch,
    } = this.props;

    const {
      gasRotated,
      gasStatus,
      videoVisible,
      videoKeyId,
    } = this.state;

    const companyName = '无锡晶安智慧';

    return (
      <div className={styles.main}>
        <Header title="晶安智慧安全云平台" extraContent={companyName} />
        <div className={styles.mainBody}>
          <Row gutter={12} style={{ height: '100%' }}>
            <Col span={6} style={{ height: '100%' }}>
              <div className={styles.realTimeAlarmContainer}>{this.renderRealTimeAlarm()}</div>
              <div className={styles.videoMonitorContainer}>
              <VideoSection
                data={allCamera}
                showVideo={this.handleVideoShow}
                style={{ transform: 'none' }}
                backTitle="更多"
                handleBack={() => this.handleVideoShow()}
              />
              </div>
            </Col>
            <Col span={18} style={{ height: '100%' }}>
              <Row gutter={12} style={{ paddingBottom: 6, height: '50%' }}>
                <Col span={13} style={{ height: '100%' }}>
                  <Row gutter={12} style={{ paddingBottom: 6, height: '50%' }}>
                    <Col span={12} style={{ height: '100%' }}>{this.renderCurrentState()}</Col>
                    <Col span={12} style={{ height: '100%' }}>{this.renderDeviceTotalNumber()}</Col>
                  </Row>
                  <Row gutter={12} style={{ paddingTop: 6, height: '50%' }}>
                    <Col span={12} style={{ height: '100%' }}>{this.renderMissingDevice()}</Col>
                    <Col span={12} style={{ height: '100%' }}>{this.renderAbnormalDevice()}</Col>
                  </Row>
                </Col>
                <Col span={11} style={{ height: '100%' }}>{this.renderElectricitySafetyMonitor()}</Col>
              </Row>
              <Row gutter={12} style={{ paddingTop: 6, height: '50%' }}>
                <Col span={8} style={{ height: '100%' }}>
                  <FcModule isRotated={gasRotated} style={{ height: '100%' }}>
                    <GasSection handleClick={this.handleGasNumClick} data={gasCount} />
                    <GasBackSection
                      dispatch={dispatch}
                      status={gasStatus}
                      data={{gasCount, gasList}}
                      handleLabelClick={this.handleGasLabelClick}
                      handleBack={this.handleGasBack}
                    />
                  </FcModule>
                </Col>
                <Col span={8} style={{ height: '100%' }}>{this.renderEffluentMonitor()}</Col>
                <Col span={8} style={{ height: '100%' }}>{this.renderExhaustMonitor()}</Col>
              </Row>
            </Col>
          </Row>
        </div>
        <VideoPlay
          dispatch={dispatch}
          actionType="monitor/fetchStartToPlay"
          videoList={allCamera}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
        />
      </div>
    );
  }
}
