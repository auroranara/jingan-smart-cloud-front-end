import React, { PureComponent } from 'react';
import { Input, notification, Icon } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { stringify } from 'qs';
import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import NewSection from '@/components/NewSection';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
// import headerBg from '@/assets/new-header-bg.png';
// 接入单位统计
import AccessUnitStatistics from './AccessUnitStatistics';
// 实时报警统计
import RealTimeAlarmStatistics from './RealTimeAlarmStatistics';
// 告警信息
import WarningMessage from './WarningMessage';
import MyTooltip from './components/Tooltip';
// 设备故障统计
import EquipmentStatistics from './EquipmentStatistics';

import AlarmChart from './AlarmChart';
import ElectricityMap from './ElectricityMap';
import MapSearch from './ElectricityMap/MapSearch';
// 引入样式文件
import styles from './index.less';
import { AlarmDrawer, MonitorDrawer, SettingModal, UnitDrawer } from './sections/Components';
import { GridSelect } from './components/Components';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';

import { genCardsInfo, getAlarmUnits } from './utils';

const headerBg = 'http://data.jingan-china.cn/v2/chem/assets/new-header-bg.png';
// websocket配置
const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

/**
 * description: 用电监测
 * author:
 * date: 2019年01月08日
 */
@connect(({ electricityMonitor }) => ({
  electricityMonitor,
}))
export default class ElectricityMonitor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      setttingModalVisible: false,
      unitDrawerVisible: false,
      alarmDrawerVisible: false,
      monitorDrawerVisible: false,
      monitorDrawerTitleIndex: 0,
      videoVisible: false,
      infoWindowShow: false,
      infoWindow: {
        address: '',
        aqy1Name: '',
        aqy1Phone: '',
        companyName: '',
        comapnyId: '',
        longitude: 0,
        latitude: 0,
      },
      selectList: [],
      searchValue: '',
      mapInstance: undefined,
      // 企业详情
      unitDetail: undefined,
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
      cardsInfo: [], // 抽屉中的企业列表卡片信息
    };
    this.debouncedFetchData = debounce(this.fetchMapSearchData, 500);
    // 设备状态统计数定时器
    this.deviceStatusCountTimer = null;
    // 设备实时数据定时器
    this.deviceRealTimeDataTimer = null;
    // 设备历史数据定时器
    this.deviceHistoryDataTimer = null;
    // 设备配置策略定时器
    this.deviceConfigTimer = null;
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      match: {
        params: { gridId },
      },
    } = this.props;
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const { dispatch } = this.props;
    // // 获取告警信息列表
    dispatch({
      type: 'electricityMonitor/fetchMessages',
      payload: { gridId },
    });

    // 获取单位数据
    dispatch({
      type: 'electricityMonitor/fetchUnitData',
      payload: { gridId },
      callback: data => {
        if (!data) return;
        const {
          unitSet: { units = [] },
          allCompanyList,
        } = data;
        const cardsInfo = genCardsInfo(units, allCompanyList);
        this.setState({ cardsInfo });
      },
    });

    // 品牌故障统计
    dispatch({
      type: 'electricityMonitor/fetchFaultByBrand',
      payload: {
        gridId,
        classType: 1,
      },
    });

    // 获取报警趋势
    dispatch({ type: 'electricityMonitor/fetchWarningTrend', payload: { queryMonth: 12, gridId } });

    const params = {
      companyId: gridId,
      env,
      type: 3,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;
    // const url = `ws://192.168.10.19:10036/websocket?${stringify(params)}`;

    // 链接webscoket
    const ws = new WebsocketHeartbeatJs({ url, ...options });

    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data).data;
        // console.log(data);
        const { type } = data;
        // 如果数据为告警或恢复，则将数据插入到列表的第一个
        if ([32, 42, 43, 44].includes(type)) {
          const {
            electricityMonitor: { messages },
          } = this.props;
          dispatch({
            type: 'electricityMonitor/save',
            payload: { messages: [data].concat(messages) },
          });
          // 如果发生告警，弹出通知框，否则关闭通知框
          if (type === 32) {
            const {
              electricityMonitor: { deviceRealTimeData: { deviceId: selectedDeviceId } = {} },
            } = this.props;
            const {
              monitorDrawerVisible,
              unitDetail: { companyId: selectedCompanyId } = {},
            } = this.state;
            const { companyId, messageFlag: deviceId } = data;
            this.showWarningNotification(data);
            if (companyId === selectedCompanyId && monitorDrawerVisible) {
              this.getDeviceStatusCount(companyId);
              if (deviceId === selectedDeviceId) {
                this.getDeviceRealTimeData(deviceId);
                this.getDeviceHistoryData(deviceId);
                this.getDeviceConfig(deviceId);
                this.getDeviceCamera(deviceId, 3);
              }
            }
          }
          // else {
          //   this.hideWarningNotification(data);
          // }
        }
        // 如果为33，则修改单位状态
        if ([32, 42, 43, 44].includes(type)) {
          const { companyId, status } = data;
          const {
            electricityMonitor: {
              unitIds,
              unitSet: { units },
            },
          } = this.props;
          const index = unitIds.indexOf(companyId);
          if (index > -1 && units[index].status !== status) {
            dispatch({
              type: 'electricityMonitor/saveUnitData',
              payload: [
                ...units.slice(0, index),
                { ...units[index], status },
                ...units.slice(index + 1),
              ],
            });
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  }

  getCardsInfo = () => {
    const {
      match: {
        params: { gridId },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchUnitData',
      payload: { gridId },
      callback: data => {
        if (!data) return;
        const {
          unitSet: { units = [] },
          allCompanyList,
        } = data;
        const cardsInfo = genCardsInfo(units, allCompanyList);
        this.setState({ cardsInfo });
      },
    });
  };

  getDeviceStatusCount = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceStatusCount',
      payload: { companyId },
    });
  };

  getDeviceRealTimeData = (deviceId, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceRealTimeData',
      payload: { deviceId },
      callback,
    });
  };

  getDeviceHistoryData = deviceId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceHistoryData',
      payload: { deviceId, historyDataType: 1 },
    });
  };

  getDeviceConfig = deviceId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceConfig',
      payload: { deviceId },
    });
  };

  setAlertedLabelIndexFn = f => {
    this.setAlertedLabelIndex = f;
  };

  /**
   * 1.获取接口数据
   * 2.显示弹出框
   * 3.添加定时器
   */
  showUnitDetail = (unitDetail, deviceId, monitorDrawerTitleIndex, paramName) => {
    if (!unitDetail) {
      return;
    }

    // 可能同时有多个警报，会来回点，会在未清定时器的情况下调用好几次这个函数，所以把之前的先清掉
    clearInterval(this.deviceStatusCountTimer);
    clearInterval(this.deviceRealTimeDataTimer);
    clearInterval(this.deviceHistoryDataTimer);
    clearInterval(this.deviceConfigTimer);

    const {
      dispatch,
      electricityMonitor: {
        messages,
        unitSet: { units },
      },
    } = this.props;
    // 如果传的是个companyId
    if (typeof unitDetail === 'string')
      unitDetail = units.find(({ companyId }) => companyId === unitDetail);
    // 如果deviceId不存在，则是点击地图，此时判断当前企业是否有报警，有报警的修正deviceId，没有的不修正
    if (!deviceId) {
      const alarmedMsg = messages.find(({ companyId: id }) => id === companyId);
      if (alarmedMsg && alarmedMsg.type === 32) deviceId = alarmedMsg.messageFlag;
    }

    const selectDeviceCallback = () => this.setAlertedLabelIndex(paramName);
    const { mapInstance } = this.state;
    const { companyId, longitude, latitude } = unitDetail;
    // console.log('unitDetail', unitDetail, deviceId);
    // console.log('mapInstance', mapInstance);
    mapInstance.setZoomAndCenter(18, [longitude, latitude]);
    this.getDeviceStatusCount(companyId);
    this.getCameraList(companyId);
    this.hideTooltip();
    // 如果deviceId存在，则为点击通知框
    if (deviceId) {
      dispatch({
        type: 'electricityMonitor/fetchDevices',
        payload: {
          companyId,
          type: 1,
        },
      });
      this.handleSelectDevice(deviceId, selectDeviceCallback);
      dispatch({
        type: 'electricityMonitor/fetchDeviceConfig',
        payload: { deviceId },
      });
      // 添加定时器
      this.deviceStatusCountTimer = setInterval(() => {
        this.getDeviceStatusCount(companyId);
      }, 2 * 1000);
      this.deviceRealTimeDataTimer = setInterval(() => {
        this.getDeviceRealTimeData(deviceId);
      }, 2 * 1000);
      this.deviceHistoryDataTimer = setInterval(() => {
        this.getDeviceHistoryData(deviceId);
      }, 30 * 60 * 1000);
      this.deviceConfigTimer = setInterval(() => {
        this.getDeviceConfig(deviceId);
      }, 30 * 60 * 1000);
      this.getDeviceCamera(deviceId, 3);
    }
    // 否则为点击企业，取第一个设备id
    else {
      dispatch({
        type: 'electricityMonitor/fetchDevices',
        payload: {
          companyId,
          type: 1,
        },
        callback: ([data]) => {
          if (data) {
            const { deviceId } = data;
            this.handleSelectDevice(deviceId, selectDeviceCallback);
            // 添加定时器
            this.deviceStatusCountTimer = setInterval(() => {
              this.getDeviceStatusCount(companyId);
            }, 2 * 1000);
            this.deviceRealTimeDataTimer = setInterval(() => {
              this.getDeviceRealTimeData(deviceId);
            }, 2 * 1000);
            this.deviceHistoryDataTimer = setInterval(() => {
              this.getDeviceHistoryData(deviceId);
            }, 30 * 60 * 1000);
            this.deviceConfigTimer = setInterval(() => {
              this.getDeviceConfig(deviceId);
            }, 30 * 60 * 1000);
            this.getDeviceCamera(deviceId, 3);
          } else {
            dispatch({
              type: 'electricityMonitor/save',
              payload: {
                deviceRealTimeData: {},
                deviceConfig: [],
                deviceHistoryData: [],
              },
            });
          }
        },
      });
    }
    // 显示弹出框
    this.setState({
      unitDetail,
      monitorDrawerTitleIndex:
        monitorDrawerTitleIndex === undefined ? +!!deviceId : monitorDrawerTitleIndex,
      monitorDrawerVisible: true,
    });
  };

  /**
   * 1.取消定时器
   * 2.隐藏弹出框
   */
  hideUnitDetail = () => {
    clearInterval(this.deviceStatusCountTimer);
    clearInterval(this.deviceRealTimeDataTimer);
    clearInterval(this.deviceHistoryDataTimer);
    clearInterval(this.deviceConfigTimer);
    this.setState({ unitDetail: undefined, monitorDrawerVisible: false });
  };

  /**
   * 显示告警通知提醒框
   */
  showWarningNotification = ({
    companyId,
    addTime,
    companyName,
    area,
    location,
    paramName,
    messageFlag,
    paramCode,
  }) => {
    const {
      electricityMonitor: {
        unitSet: { units },
      },
    } = this.props;
    const options = {
      key: `${messageFlag}_${paramCode}`,
      duration: 30,
      placement: 'bottomLeft',
      className: styles.notification,
      message: (
        <div className={styles.notificationTitle}>
          <Icon type="warning" theme="filled" className={styles.notificationIcon} />
          警情提示
        </div>
      ),
      description: (
        <div
          className={styles.notificationContent}
          onClick={() => {
            this.showUnitDetail(
              units.filter(({ companyId: id }) => id === companyId)[0],
              messageFlag,
              undefined,
              paramName
            );
          }}
        >
          <div className={styles.notificationText}>
            {/* <div className={styles.notificationTextFirst}>{moment(addTime).format('HH:mm:ss')}</div> */}
            <div className={styles.notificationTextFirst}>刚刚</div>
            <div className={styles.notificationTextSecond}>{companyName}</div>
          </div>
          <div className={styles.notificationText}>
            <div className={styles.notificationTextFirst}>{`${area}${location}${paramName}`}</div>
            <div className={styles.notificationTextSecond}>发生报警！</div>
          </div>
        </div>
      ),
    };
    notification.open(options);
  };

  /**
   * 关闭通知框
   */
  hideWarningNotification = ({ messageFlag, paramCode }) => {
    notification.close(`${messageFlag}_${paramCode}`);
  };

  /**
   * 点击设置按钮
   */
  handleClickSetButton = () => {
    this.setState({ setttingModalVisible: true });
  };

  handleSettingOk = e => {
    this.setState({ setttingModalVisible: false });
  };

  handleSettingCancel = e => {
    this.setState({ setttingModalVisible: false });
  };

  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  // 地图点击
  handleMapClick = (companyId, item) => {
    const { dispatch } = this.props;
    const { mapInstance } = this.state;
    dispatch({
      type: 'electricityMonitor/fetchDeviceStatusCount',
      payload: { companyId },
      success: res => {
        this.setState({
          infoWindowShow: true,
          infoWindow: {
            ...item,
          },
        });
        mapInstance.setZoomAndCenter(18, [item.longitude, item.latitude]);
      },
    });
  };

  // 地图搜索
  fetchMapSearchData = value => {
    const {
      electricityMonitor: {
        unitSet: { units },
      },
    } = this.props;
    const list = units;
    const selectList = value ? list.filter(item => item.companyName.includes(value)) : [];
    this.setState({
      searchValue: value,
      selectList: selectList.length > 10 ? selectList.slice(0, 9) : selectList,
    });
  };

  handleMapSearchChange = value => {
    this.debouncedFetchData(value);
    this.setState({
      searchValue: value,
    });
  };

  handleMapSearchSelect = item => {
    this.handleMapClick(item.companyId, item);
  };

  handleClickNotification = companyId => {
    const {
      electricityMonitor: {
        unitSet: { units },
      },
    } = this.props;
    this.handleMapClick(companyId, units.filter(item => item.companyId === companyId)[0]);
  };

  handleSelectDevice = (deviceId, callback) => {
    clearInterval(this.deviceRealTimeDataTimer);
    clearInterval(this.deviceHistoryDataTimer);
    clearInterval(this.deviceConfigTimer);
    this.getDeviceRealTimeData(deviceId, callback);
    this.getDeviceHistoryData(deviceId);
    this.getDeviceConfig(deviceId);
    this.getDeviceCamera(deviceId, 3);
  };

  getDeviceCamera = (deviceId, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceCamera',
      payload: { deviceId, type },
    });
  };

  getCameraList = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'electricityMonitor/fetchCameraList', payload: { company_id: id } });
  };

  handleClickCamera = () => {
    this.setState({ videoVisible: true });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false });
  };

  showTooltip = (e, name) => {
    const offset = e.target.getBoundingClientRect();
    this.setState({
      tooltipName: name,
      tooltipVisible: true,
      tooltipPosition: [offset.left, offset.top],
    });
  };

  hideTooltip = () => {
    // console.log('hideTooltip');

    this.setState({
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
    });
  };

  handleMapParentChange = newState => {
    this.setState({ ...newState });
  };

  handleUnitStatisticsClick = e => {
    this.getCardsInfo();
    this.handleDrawerVisibleChange('unit');
  };

  handleAlarmStatisticsClick = e => {
    this.getCardsInfo();
    this.handleDrawerVisibleChange('alarm');
  };

  /**
   * 渲染
   */
  render() {
    const {
      match: {
        params: { gridId },
      },
      electricityMonitor: {
        messages,
        statisticsData,
        unitSet,
        deviceStatusCount,
        devices,
        deviceRealTimeData,
        deviceConfig,
        deviceHistoryData,
        // cameraList,
        videoByDevice,
        warningTrendList, // 12个月报警趋势
        warningTrendList1, // 6个月报警趋势
        brandData,
      },
    } = this.props;
    const {
      setttingModalVisible,
      unitDrawerVisible,
      alarmDrawerVisible,
      monitorDrawerVisible,
      monitorDrawerTitleIndex,
      // videoVisible,
      // infoWindowShow,
      selectList,
      searchValue,
      // infoWindow,
      unitDetail,
      tooltipName,
      tooltipVisible,
      tooltipPosition,
      cardsInfo,
    } = this.state;

    // console.log(messages);
    const extra = <GridSelect gridId={gridId} urlBase="/big-platform/electricity-monitor" />;

    return (
      <BigPlatformLayout
        settable
        title="智慧用电监测平台"
        extra={extra}
        style={{ backgroundImage: 'none' }}
        extraStyle={{ padding: '10px 0' }}
        headerStyle={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          fontSize: 16,
          zIndex: 99,
          backgroundImage: `url(${headerBg})`,
          backgroundSize: '100% 100%',
        }}
        titleStyle={{ fontSize: 46 }}
        contentStyle={{ position: 'relative', height: '100%', zIndex: 0 }}
        onSet={this.handleClickSetButton}
      >
        {/* 地图 */}
        <ElectricityMap
          // mapData={unitSet}
          units={Array.isArray(unitSet.units) ? unitSet.units : []}
          handleMapClick={this.showUnitDetail}
          // infoWindowShow={infoWindowShow}
          // infoWindow={infoWindow}
          // deviceStatusCount={deviceStatusCount}
          showTooltip={this.showTooltip}
          hideTooltip={this.hideTooltip}
          unitDetail={unitDetail}
          handleParentChange={this.handleMapParentChange}
        />
        {/* 搜索框 */}
        <MapSearch
          className={styles.mapSearch}
          style={{
            top: 'calc(9.62963% + 24px)',
            position: 'absolute',
            left: '24px',
            width: '25.46875%',
            zIndex: 9999,
          }}
          selectList={selectList}
          value={searchValue}
          handleChange={this.handleMapSearchChange}
          handleSelect={this.showUnitDetail}
        />
        {/* 接入单位统计 */}
        <AccessUnitStatistics
          data={statisticsData}
          className={`${styles.left} ${styles.accessUnitStatistics}`}
          onClick={this.handleUnitStatisticsClick}
        />
        {/* 实时报警统计 */}
        <RealTimeAlarmStatistics
          data={unitSet}
          className={`${styles.left} ${styles.realTimeAlarmStatistics}`}
          onClick={this.handleAlarmStatisticsClick}
        />
        {/* 近半年内告警统计 */}
        <NewSection
          // title="近半年内告警统计"
          title="近半年内报警统计"
          className={styles.left}
          style={{ top: 'calc(45.184444% + 92px)', height: '27.5926%' }}
        >
          <AlarmChart
            data={warningTrendList1.map(({ count }) => count)}
            xLabels={warningTrendList1.map(({ timeFlag }) => `${moment(timeFlag).format('M')}月`)}
          />
        </NewSection>
        <div className={styles.right}>
          {/* 告警信息 */}
          <WarningMessage
            className={styles.child}
            data={messages}
            units={unitSet ? unitSet.units : []}
            showUnitDetail={this.showUnitDetail}
          />
          {/* 设备故障统计 */}
          {/* <NewSection
            title="设备故障统计"
            style={{ width: '100%', height: '250px', cursor: 'pointer', marginTop: 15 }}
          >
            <EquipmentStatistics brandData={brandData} />
          </NewSection> */}
        </div>
        <SettingModal
          visible={setttingModalVisible}
          handleOk={this.handleSettingOk}
          handleCancel={this.handleSettingCancel}
        />
        <UnitDrawer
          data={{ list: cardsInfo, statisticsData }}
          visible={unitDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          showUnitDetail={this.showUnitDetail}
        />
        <AlarmDrawer
          data={{ list: cardsInfo, ...getAlarmUnits(unitSet), graphList: warningTrendList }}
          visible={alarmDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          showUnitDetail={this.showUnitDetail}
        />
        <MonitorDrawer
          data={{
            unitDetail,
            deviceStatusCount,
            devices,
            deviceRealTimeData,
            deviceConfig,
            deviceHistoryData,
            cameraList: videoByDevice,
          }}
          titleIndex={monitorDrawerTitleIndex}
          visible={monitorDrawerVisible}
          handleClose={this.hideUnitDetail}
          handleSelect={this.handleSelectDevice}
          handleClickCamera={this.handleClickCamera}
          setAlertedLabelIndexFn={this.setAlertedLabelIndexFn}
        />
        {/* <VideoPlay
          showList={true}
          videoList={cameraList}
          visible={videoVisible}
          keyId={cameraList.length ? cameraList[0].key_id : ''}
          style={{ position: 'fixed', zIndex: 99999 }}
          handleVideoClose={this.handleVideoClose}
        /> */}
        <MyTooltip
          visible={tooltipVisible}
          title={tooltipName}
          position={tooltipPosition}
          offset={[15, 42]}
        />
      </BigPlatformLayout>
    );
  }
}
