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

import ElectricityCharts from './Sections/ElectricityCharts';

const DELAY = 5 * 1000;
const CHART_DELAY = 10 * 60 * 1000;

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
    chartSelectVal: '',
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;

    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
    dispatch({ type: 'monitor/fetchGasCount', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchGasList', payload: { companyId, type: 2 } });

    // 根据传感器类型获取企业传感器列表 1 电 2 表示可燃有毒气体 3 水质 4 废气
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

    dispatch({
      type: 'monitor/fetchCompanyDevices',
      payload: { companyId, type: 1 },
      callback: firstDeviceId => {
        this.setState({ chartSelectVal: firstDeviceId });
        // 获取传感器历史
        dispatch({
          type: 'monitor/fetchGsmsHstData',
          payload: { deviceId: firstDeviceId },
        });
        // 获取上下线的区块
        dispatch({
          type: 'monitor/fetchPieces',
          payload: { deviceId: firstDeviceId, code: 'v1' },
        });
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
        params: { companyId },
      },
    } = this.props;

    const { waterSelectVal } = this.state;
    dispatch({ type: 'monitor/fetchRealTimeAlarm', payload: { companyId, overFlag: 0 } })
    dispatch({ type: 'monitor/fetchCountAndExponent', payload: { companyId } })
    dispatch({ type: 'monitor/fetchGasCount', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchGasList', payload: { companyId, type: 2 } });

    waterSelectVal && dispatch({ type: 'monitor/fetchRealTimeData', payload: { deviceId: waterSelectVal } });
  };

  chartPolling = () => {
    const { dispatch } = this.props;
    const { chartSelectVal } = this.state;

    if (!chartSelectVal)
      return;

    dispatch({
      type: 'monitor/fetchGsmsHstData',
      payload: { deviceId: chartSelectVal },
    });
    dispatch({
      type: 'monitor/fetchPieces',
      payload: { deviceId: chartSelectVal, code: 'v1' },
    });
  };

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

  handleChartSelect = value => {
    const { dispatch } = this.props;
    this.setState({ chartSelectVal: value });
    // 获取传感器历史
    dispatch({
      type: 'monitor/fetchGsmsHstData',
      payload: { deviceId: value },
      error: () => {
        dispatch({
          type: 'monitor/gsmsHstData',
          payload: {},
        });
      },
    });
    // 获取上下线的区块
    dispatch({
      type: 'monitor/fetchPieces',
      payload: { deviceId: value, code: 'v1' },
    });
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
        chartDeviceList,
        gsmsHstData,
        electricityPieces,
      },
      dispatch,
    } = this.props;

    const {
      gasRotated,
      gasStatus,
      videoVisible,
      videoKeyId,
      waterSelectVal,
      chartSelectVal,
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
                <Col span={11} style={{ height: '100%' }}>
                  <div style={{ height: '100%', width: '100%' }}>
                    <ElectricityCharts
                      data={{ chartDeviceList, gsmsHstData, electricityPieces }}
                      selectVal={chartSelectVal}
                      handleSelect={this.handleChartSelect}
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={12} style={{ paddingTop: 6, height: '50%' }}>
                <Col span={8} style={{ height: '100%' }}>
                  <FcModule isRotated={gasRotated} style={{ height: '100%' }}>
                    <GasSection handleClick={this.handleGasNumClick} data={gasCount} />
                    <GasBackSection
                      dispatch={dispatch}
                      status={gasStatus}
                      data={{ gasCount, gasList }}
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
