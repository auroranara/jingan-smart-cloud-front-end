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

import ExhaustMonitor from './sections/ExhaustMonitor';
import EffluentMonitor from './sections/EffluentMonitor';

// 实时报警
import RealTimeAlarm from './sections/RealTimeAlarm.js'
import TopCenter from './sections/TopCenter.js'

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
    waterSelectVal: '',
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

    // 根据传感器类型获取企业传感器列表
    dispatch({
      type: 'monitor/fetchCompanyDevices',
      payload: { companyId, type: 3 },
      callback: firstDeviceId => {
        // console.log(firstDeviceId);
        this.setState({ waterSelectVal: firstDeviceId });
        // 获取传感器监测参数
        dispatch({ type: 'monitor/fetchDeviceConfig', payload: { deviceId: firstDeviceId } });
        // 获取传感器实时数据和状态
        dispatch({ type: 'monitor/fetchRealTimeData', payload: { deviceId: firstDeviceId } });
      },
    });

    // 获取监测指数和设备数量
    dispatch({
      type: 'monitor/fetchCountAndExponent',
      payload: { companyId },
    })
    // 获取实时警报信息
    dispatch({
      type: 'monitor/fetchRealTimeAlarm',
      payload: { companyId, overFlag: 0 },
    })
    this.alarmInternal = setInterval(() => {
      dispatch({
        type: 'monitor/fetchRealTimeAlarm',
        payload: { companyId, overFlag: 0 },
      })
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.alarmInternal)
  }

  /**
   * 实时报警
   */
  renderRealTimeAlarm() {
    return <div />;
  }
  /**
   * 当前状态
   */
  renderCurrentState() {
    return <div />;
  }

  /**
   * 设备总数
   */
  renderDeviceTotalNumber() {
    return <div />;
  }

  /**
   * 失联设备
   */
  renderMissingDevice() {
    return <div />;
  }

  /**
   * 异常设备
   */
  renderAbnormalDevice() {
    return <div />;
  }

  /**
   * 用电安全监测
   */
  renderElectricitySafetyMonitor() {
    return <div />;
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

  handleWaterSelect = value => {
    const { dispatch } = this.props;
    this.setState({ waterSelectVal: value });
    dispatch({ type: 'monitor/fetchDeviceConfig', payload: { deviceId: value } });
    dispatch({ type: 'monitor/fetchRealTimeData', payload: { deviceId: value } });
  };

  render() {
    // 从props中获取企业名称
    const {
      monitor: {
        allCamera = [],
        gasCount,
        gasList,
        waterCompanyDevicesData,
        waterDeviceConfig,
        waterRealTimeData,
        countAndExponent,
        realTimeAlarm,
      },
      dispatch,
    } = this.props;

    const {
      gasRotated,
      gasStatus,
      videoVisible,
      videoKeyId,
      waterSelectVal,
    } = this.state;

    const companyName = '无锡晶安智慧';

    return (
      <div className={styles.main}>
        <Header title="晶安智慧安全云平台" extraContent={companyName} />
        <div className={styles.mainBody}>
          <Row gutter={12} style={{ height: '100%' }}>
            <Col span={6} style={{ height: '100%' }}>
              <div className={styles.realTimeAlarmContainer}>
                <RealTimeAlarm
                  realTimeAlarm={realTimeAlarm}
                />
              </div>
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
                <TopCenter
                  countAndExponent={countAndExponent}
                  realTimeAlarm={realTimeAlarm}
                />
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
                <Col span={8} style={{ height: '100%' }}>
                  <EffluentMonitor
                    selectVal={waterSelectVal}
                    handleSelect={this.handleWaterSelect}
                    data={{ waterCompanyDevicesData, waterDeviceConfig, waterRealTimeData }}
                  />
                </Col>
                <Col span={8} style={{ height: '100%' }}>
                  <ExhaustMonitor />
                </Col>
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
