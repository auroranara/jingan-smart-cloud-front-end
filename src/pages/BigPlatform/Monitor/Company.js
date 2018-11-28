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
import RealTimeAlarm from './sections/RealTimeAlarm.js';
import TopCenter from './sections/TopCenter.js';
import AlarmHistory from './sections/AlarmHistory.js';

import ElectricityCharts from './Sections/ElectricityCharts';

const DELAY = 5 * 1000;
// const WATER_DELAY = 5 * 60 * 1000;
const CHART_DELAY = 10 * 60 * 1000;
const { projectName } = global.PROJECT_CONFIG;
/**
 * 动态监测
 */
@connect(({ monitor, unitFireControl, loading }) => ({
  monitor,
  unitFireControl,
  historyAlarmLoading: loading.effects['monitor/fetchHistoryAlarm'],
}))
export default class App extends PureComponent {
  state = {
    gasRotated: false,
    gasStatus: ALL,
    videoVisible: false,
    videoKeyId: undefined,
    waterSelectVal: '',
    chartSelectVal: '',
    selectedDeviceType: 1,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;

    // console.log(companyId);
    // dispatch({ type: 'monitor/fetchCompanyInfo', payload: companyId });
    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
    dispatch({ type: 'monitor/fetchGasCount', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchGasList', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchSmokeCount', payload: { companyId, type: 6 } });
    dispatch({ type: 'monitor/fetchSmokeList', payload: { companyId, type: 6 } });
    // 获取火灾自动报警监测
    dispatch({ type: 'unitFireControl/fetchFireAlarmSystem', payload: { companyId } });

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
        this.fetchPieces(firstDeviceId);
      },
    });

    // 获取监测指数和设备数量
    dispatch({
      type: 'monitor/fetchCountAndExponent',
      payload: { companyId },
    });
    // 获取实时警报信息
    dispatch({
      type: 'monitor/fetchRealTimeAlarm',
      payload: { companyId, overFlag: 0 },
    });

    // 轮询
    this.pollTimer = setInterval(this.polling, DELAY);
    // this.waterTimer = setInterval(this.waterPolling, WATER_DELAY);
    this.chartPollTimer = setInterval(this.chartPolling, CHART_DELAY);
  }

  componentWillUnmount() {
    clearInterval(this.pollTimer);
    clearInterval(this.chartPollTimer);
    // clearInterval(this.waterTimer);
  }

  fetchPieces = firstDeviceId => {
    const { dispatch } = this.props;
    const codes = ['v1', 'v2', 'v3', 'v4', 'v5', 'ia', 'ib', 'ic', 'ua', 'ub', 'uc'];
    codes.forEach(code => {
      dispatch({
        type: 'monitor/fetchPieces',
        payload: { deviceId: firstDeviceId, code },
      });
    });

    // 获取参数
    dispatch({
      type: 'monitor/fetchChartParams',
      payload: { deviceId: firstDeviceId },
    });
  };

  pollTimer = null;
  waterTimer = null;
  chartPollTimer = null;

  polling = () => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const { waterSelectVal } = this.state;

    dispatch({ type: 'monitor/fetchRealTimeAlarm', payload: { companyId, overFlag: 0 } });
    dispatch({ type: 'monitor/fetchCountAndExponent', payload: { companyId } });
    dispatch({ type: 'monitor/fetchGasCount', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchGasList', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchSmokeCount', payload: { companyId, type: 6 } });
    dispatch({ type: 'monitor/fetchSmokeList', payload: { companyId, type: 6 } });
    // 获取火灾自动报警监测
    dispatch({ type: 'unitFireControl/fetchFireAlarmSystem', payload: { companyId } });

    waterSelectVal &&
      dispatch({ type: 'monitor/fetchRealTimeData', payload: { deviceId: waterSelectVal } });
  };

  waterPolling = () => {
    const { dispatch } = this.props;
    const { waterSelectVal } = this.state;

    waterSelectVal &&
      dispatch({ type: 'monitor/fetchRealTimeData', payload: { deviceId: waterSelectVal } });
  };

  chartPolling = () => {
    const { dispatch } = this.props;
    const { chartSelectVal } = this.state;

    if (!chartSelectVal) return;

    dispatch({
      type: 'monitor/fetchGsmsHstData',
      payload: { deviceId: chartSelectVal },
    });
    dispatch({
      type: 'monitor/fetchPieces',
      payload: { deviceId: chartSelectVal, code: 'v1' },
    });
  };

  handleAlarmCardClick = () => {
    this.setState({ videoVisible: true, videoKeyId: undefined });
  };

  handleGasNumClick = status => {
    this.setState({ gasRotated: true, gasStatus: status });
  };

  handleGasLabelClick = status => {
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
    this.fetchPieces(value);
  };

  // 获取报警设备、失联设备列表
  fetchErrorDevices = status => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'monitor/fetchErrorDevices',
      payload: { companyId, status },
    });
  };
  // 查看报警历史纪录
  handleViewHistory = () => {
    const {
      match: {
        params: { companyId },
      },
      dispatch,
    } = this.props;
    this.leftSection.style.opacity = 0;
    this.historyAlarm.style.right = 0;
    this.setState({
      selectedDeviceType: 1,
    });
    dispatch({
      type: 'monitor/clearHistoryAlarm',
    });
    dispatch({ type: 'monitor/fetchAlarmInfoTypes' });
    dispatch({
      type: 'monitor/fetchHistoryAlarm',
      payload: {
        pageNum: 1,
        pageSize: 20,
        companyId,
        overFlag: 1,
        deviceType: 1,
      },
    });
  };

  handleFilterHistory = deviceType => {
    const {
      match: {
        params: { companyId },
      },
      dispatch,
    } = this.props;
    this.setState({
      selectedDeviceType: deviceType,
    });
    dispatch({
      type: 'monitor/fetchHistoryAlarm',
      payload: {
        pageNum: 1,
        pageSize: 20,
        companyId,
        overFlag: 1,
        deviceType,
      },
    });
  };

  handleLoadMore = ({ deviceType }) => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
      monitor: {
        historyAlarm: {
          isLast,
          pagination: { pageNum },
        },
      },
    } = this.props;

    if (isLast) {
      return;
    }
    dispatch({
      type: 'monitor/fetchHistoryAlarm',
      payload: {
        pageNum: pageNum + 1,
        pageSize: 20,
        companyId,
        overFlag: 1,
        deviceType,
      },
    });
  };

  render() {
    // 从props中获取企业名称
    const {
      monitor: {
        companyInfo: { name: companyName },
        allCamera = [],
        gasCount,
        gasList,
        waterCompanyDevicesData,
        waterDeviceConfig,
        waterRealTimeData,
        countAndExponent,
        realTimeAlarm,
        historyAlarm,
        chartDeviceList,
        gsmsHstData,
        electricityPieces,
        chartParams,
        errorDevice,
        smokeCount,
      },
      unitFireControl: { fireAlarmSystem },
      dispatch,
      historyAlarmLoading,
    } = this.props;

    const {
      gasRotated,
      gasStatus,
      videoVisible,
      videoKeyId,
      waterSelectVal,
      chartSelectVal,
      selectedDeviceType,
    } = this.state;

    // let companyName = '暂无信息';
    // if (allCamera.length) companyName = allCamera[0].company_name;

    return (
      <div className={styles.main}>
        <Header title={projectName} extraContent={companyName ? companyName : '暂无信息'} />
        <div className={styles.mainBody}>
          <Row gutter={12} style={{ height: '100%' }}>
            <Col span={6} style={{ height: '100%' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  transition: 'opacity 0.5s',
                }}
                ref={leftSection => {
                  this.leftSection = leftSection;
                }}
              >
                <div className={styles.realTimeAlarmContainer}>
                  <RealTimeAlarm
                    realTimeAlarm={realTimeAlarm}
                    handleClick={this.handleAlarmCardClick}
                    handleViewHistory={this.handleViewHistory}
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
              </div>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  right: '110%',
                  transition: 'top 0.5s, left 0.5s, right 0.5s, bottom 0.5s',
                }}
                ref={historyAlarm => {
                  this.historyAlarm = historyAlarm;
                }}
              >
                <AlarmHistory
                  historyAlarm={historyAlarm}
                  loading={historyAlarmLoading}
                  handleLoadMore={this.handleLoadMore}
                  handleFilterHistory={this.handleFilterHistory}
                  selectedDeviceType={selectedDeviceType}
                  handleClose={() => {
                    this.leftSection.style.opacity = 1;
                    this.historyAlarm.style.right = '110%';
                  }}
                />
              </div>
            </Col>
            <Col span={18} style={{ height: '100%' }}>
              <Row gutter={12} style={{ paddingBottom: 6, height: '50%' }}>
                <TopCenter
                  countAndExponent={countAndExponent}
                  realTimeAlarm={realTimeAlarm}
                  fireAlarmSystem={fireAlarmSystem}
                  fetchErrorDevices={this.fetchErrorDevices}
                  errorDevice={errorDevice}
                  smokeCountData={smokeCount}
                />
                <Col span={11} style={{ height: '100%' }}>
                  <div style={{ height: '100%', width: '100%' }}>
                    <ElectricityCharts
                      data={{ chartDeviceList, gsmsHstData, electricityPieces, chartParams }}
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
          showList={true}
          videoList={allCamera}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
        />
      </div>
    );
  }
}
