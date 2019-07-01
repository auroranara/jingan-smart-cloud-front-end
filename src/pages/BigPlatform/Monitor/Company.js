import React, { PureComponent } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { connect } from 'dva';
import Header from '../UnitFireControl/components/Header/Header';
import styles from './Company.less';
import FcModule from '../FireControl/FcModule';
// import VideoSection from './sections/VideoSection';
import GasSection from './sections/GasSection';
import GasBackSection from './sections/GasBackSection';
import StorageTankMonitor from './sections/StorageTankMonitor';
import StorageTankDrawer from './sections/StorageTankDrawer';
// import VideoPlay from './sections/VideoPlay';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import { ALL } from './components/gasStatus';
import { findFirstVideo } from '@/utils/utils';

import ExhaustMonitor from './sections/ExhaustMonitor';
import EffluentMonitor from './sections/EffluentMonitor';

// 实时报警
import RealTimeAlarm from './sections/RealTimeAlarm.js';
import TopCenter from './sections/TopCenter.js';
import AlarmHistory from './sections/AlarmHistory.js';

import ElectricityCharts from './Sections/ElectricityCharts';

import videoBtn from './imgs/videoBtn.png';

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
    exhaustSelectVal: '',
    chartSelectVal: '',
    selectedDeviceType: 1,
    smokeStatus: ALL,
    storageDrawerVisible: false,
    storageStatus: undefined,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;

    // dispatch({ type: 'monitor/fetchCompanyInfo', payload: companyId });
    dispatch({ type: 'monitor/fetchCameraTree', payload: { company_id: companyId } });
    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
    dispatch({ type: 'monitor/fetchGasCount', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchGasList', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchSmokeCount', payload: { companyId, type: 6 } });
    // 获取火灾自动报警监测
    dispatch({ type: 'unitFireControl/fetchFireAlarmSystem', payload: { companyId } });

    // 根据传感器类型获取企业传感器列表 1 电 2 表示可燃有毒气体 3 水质 4 废气
    dispatch({
      type: 'monitor/fetchCompanyDevices',
      payload: { companyId, type: 3 },
      callback: firstDeviceId => {
        this.setState({ waterSelectVal: firstDeviceId });
        // 获取传感器监测参数
        dispatch({ type: 'monitor/fetchDeviceConfig', payload: { deviceId: firstDeviceId } });
        // 获取传感器实时数据和状态
        dispatch({ type: 'monitor/fetchRealTimeData', payload: { deviceId: firstDeviceId } });
      },
    });

    // 获取废气监测数据 4 废气
    dispatch({
      type: 'monitor/fetchCompanyDevices',
      payload: { companyId, type: 4 },
      callback: firstDeviceId => {
        this.setState({ exhaustSelectVal: firstDeviceId });
        // 获取传感器监测参数
        dispatch({ type: 'monitor/fetchExhaustConfig', payload: { deviceId: firstDeviceId } });
        // 获取传感器实时数据和状态
        dispatch({
          type: 'monitor/fetchExhaustRealTimeData',
          payload: { deviceId: firstDeviceId },
        });
      },
    });

    dispatch({
      type: 'monitor/fetchCompanyDevices',
      payload: { companyId, type: 1 },
      callback: firstDeviceId => {
        this.setState({ chartSelectVal: firstDeviceId });
        // 获取传感器历史
        // dispatch({
        //   type: 'monitor/fetchGsmsHstData',
        //   payload: { deviceId: firstDeviceId },
        // });
        // 获取上下线的区块
        this.fetchPieces(firstDeviceId);

        // 获取实时警报信息
        dispatch({
          type: 'monitor/fetchDeviceDataHistory',
          payload: { deviceId: firstDeviceId },
        });
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
      payload: { companyId, overFlag: 0, screenType: 1 },
    });

    // 获取储罐统计
    dispatch({
      type: 'monitor/fetchTankMessageData',
      payload: { companyId },
    });

    // 储罐统计下钻
    // dispatch({
    //   type: 'monitor/fetchTankMessageList',
    //   payload: { companyId },
    // });

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
    const { waterSelectVal, exhaustSelectVal } = this.state;

    dispatch({ type: 'monitor/fetchRealTimeAlarm', payload: { companyId, overFlag: 0, screenType: 1 } });
    dispatch({ type: 'monitor/fetchCountAndExponent', payload: { companyId } });
    dispatch({ type: 'monitor/fetchGasCount', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchGasList', payload: { companyId, type: 2 } });
    // 获取火灾自动报警监测
    dispatch({ type: 'unitFireControl/fetchFireAlarmSystem', payload: { companyId } });
    // 获取独立烟感监测数据
    dispatch({ type: 'monitor/fetchSmokeCount', payload: { companyId, type: 6 } });
    // 获取废水监测数据
    waterSelectVal &&
      dispatch({ type: 'monitor/fetchRealTimeData', payload: { deviceId: waterSelectVal } });
    // 获取废气监测数据
    exhaustSelectVal &&
      dispatch({
        type: 'monitor/fetchExhaustRealTimeData',
        payload: { deviceId: exhaustSelectVal },
      });
    // 获取储罐统计
    dispatch({
      type: 'monitor/fetchTankMessageData',
      payload: { companyId },
    });

    // 储罐统计下钻
    // dispatch({
    //   type: 'monitor/fetchTankMessageList',
    //   payload: { companyId },
    // });
  };

  waterPolling = () => {
    const { dispatch } = this.props;
    const { waterSelectVal } = this.state;

    waterSelectVal &&
      dispatch({ type: 'monitor/fetchRealTimeData', payload: { deviceId: waterSelectVal } });
  };

  exhaustPolling = () => {
    const { dispatch } = this.props;
    const { exhaustSelectVal } = this.state;

    exhaustSelectVal &&
      dispatch({
        type: 'monitor/fetchExhaustRealTimeData',
        payload: { deviceId: exhaustSelectVal },
      });
  };

  chartPolling = () => {
    const { dispatch } = this.props;
    const { chartSelectVal } = this.state;

    if (!chartSelectVal) return;
    // 获取实时警报信息
    dispatch({
      type: 'monitor/fetchDeviceDataHistory',
      payload: { deviceId: chartSelectVal },
    });
    // dispatch({
    //   type: 'monitor/fetchGsmsHstData',
    //   payload: { deviceId: chartSelectVal },
    // });
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
  // handleSmokeLabelClick = status => {
  //   this.setState({ smokeStatus: status });
  // };

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

  handleExhaustSelect = value => {
    const { dispatch } = this.props;
    this.setState({ exhaustSelectVal: value });
    dispatch({ type: 'monitor/fetchExhaustConfig', payload: { deviceId: value } });
    dispatch({ type: 'monitor/fetchExhaustRealTimeData', payload: { deviceId: value } });
  };

  handleChartSelect = value => {
    const { dispatch } = this.props;
    this.setState({ chartSelectVal: value });
    // 获取传感器历史
    // dispatch({
    //   type: 'monitor/fetchGsmsHstData',
    //   payload: { deviceId: value },
    //   error: () => {
    //     dispatch({
    //       type: 'monitor/gsmsHstData',
    //       payload: {},
    //     });
    //   },
    // });
    // 获取实时警报信息
    dispatch({
      type: 'monitor/fetchDeviceDataHistory',
      payload: { deviceId: value },
      error: () => {
        dispatch({
          type: 'monitor/deviceDataHistory',
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

  // 查看储罐监测
  handleStorageDrawer = (status = 'all') => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    this.setState({ storageDrawerVisible: true, storageStatus: status });
    // 获取储罐下钻数据
    dispatch({
      type: 'monitor/fetchTankMessageList',
      payload: { companyId, status: status === 'all' ? null : status },
    });
  };

  handleStorageFilter = (status = 'all') => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    this.setState({ storageStatus: status });
    // 获取储罐下钻数据
    dispatch({
      type: 'monitor/fetchTankMessageList',
      payload: { companyId, status: status === 'all' ? null : status },
    });
  };

  render() {
    // 从props中获取企业名称
    const {
      match: {
        params: { companyId },
      },
      monitor: {
        companyInfo: { name: companyName },
        allCamera = [],
        cameraTree = [],
        gasCount,
        gasList,
        waterCompanyDevicesData,
        waterDeviceConfig,
        waterRealTimeData,
        exhaustCompanyDevicesData,
        exhaustDeviceConfig,
        exhaustRealTimeData,
        countAndExponent,
        realTimeAlarm,
        historyAlarm,
        chartDeviceList,
        gsmsHstData,
        electricityPieces,
        chartParams,
        errorDevice,
        smokeCount,
        smokeList,
        tankData,
        tankDataList,
        deviceDataHistory,
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
      exhaustSelectVal,
      chartSelectVal,
      selectedDeviceType,
      storageDrawerVisible,
      storageStatus,
    } = this.state;

    // let companyName = '暂无信息';
    // if (allCamera.length) companyName = allCamera[0].company_name;

    return (
      <div className={styles.main}>
        <Header title={projectName} extraContent={companyName ? companyName : '暂无信息'} />
        <div className={styles.mainBody}>
          <Row gutter={12} style={{ height: '100%' }}>
            <Tooltip placement="bottomLeft" overlayClassName={styles.tooltip} title="视频监控">
              <div
                className={styles.videoBtn}
                style={{
                  backgroundImage: `url(${videoBtn})`,
                  backgroundRepeat: 'no-repeat',
                  groundPosition: 'center center',
                  backgroundSize: '100% 100%',
                  transform: 'none',
                }}
                onClick={() => this.handleVideoShow(findFirstVideo(cameraTree).id)}
              />
            </Tooltip>
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
                    title="实时报警"
                    showTotal={true}
                    list={realTimeAlarm}
                    handleClick={this.handleAlarmCardClick}
                    handleViewHistory={this.handleViewHistory}
                    showVideo={cameraTree && cameraTree.length > 0}
                  />
                </div>
                <div className={styles.videoMonitorContainer}>
                  <StorageTankMonitor
                    tankData={tankData}
                    handleStorageDrawer={this.handleStorageDrawer}
                  />
                  {/* <VideoSection
                    data={allCamera}
                    showVideo={this.handleVideoShow}
                    style={{ transform: 'none' }}
                    backTitle="更多"
                    handleBack={() => this.handleVideoShow()}
                  /> */}
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
                  title="历史报警"
                  data={historyAlarm}
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
                  smokeList={smokeList}
                  smokeCountData={smokeCount}
                  companyId={companyId}
                />
                {/* 电气火灾监测 */}
                <Col span={11} style={{ height: '100%' }}>
                  <div style={{ height: '100%', width: '100%' }}>
                    <ElectricityCharts
                      title="电气火灾监测"
                      data={{
                        chartDeviceList,
                        gsmsHstData,
                        electricityPieces,
                        chartParams,
                        deviceDataHistory,
                      }}
                      selectVal={chartSelectVal}
                      handleSelect={this.handleChartSelect}
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={12} style={{ paddingTop: 6, height: '50%' }}>
                {/* 可燃/有毒气体监测 */}
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
                {/* 废水监测 */}
                <Col span={8} style={{ height: '100%' }}>
                  <EffluentMonitor
                    selectVal={waterSelectVal}
                    handleSelect={this.handleWaterSelect}
                    data={{ waterCompanyDevicesData, waterDeviceConfig, waterRealTimeData }}
                  />
                </Col>
                {/* 废气监测 */}
                <Col span={8} style={{ height: '100%' }}>
                  <ExhaustMonitor
                    selectVal={exhaustSelectVal}
                    handleSelect={this.handleExhaustSelect}
                    data={{ exhaustCompanyDevicesData, exhaustDeviceConfig, exhaustRealTimeData }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        {/* <VideoPlay
          showList={true}
          videoList={allCamera}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
        /> */}
        <NewVideoPlay
          showList={true}
          videoList={cameraTree}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
          isTree={true}
        />
        <StorageTankDrawer
          tankDataList={tankDataList}
          visible={storageDrawerVisible}
          onClose={() => {
            this.setState({
              storageDrawerVisible: false,
            });
          }}
          storageStatus={storageStatus}
          handleFilter={this.handleStorageFilter}
          statistics={tankData}
        />
      </div>
    );
  }
}
