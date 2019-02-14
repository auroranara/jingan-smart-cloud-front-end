import React, { PureComponent } from 'react';
import { notification, Icon } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { stringify } from 'qs';
import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import NewSection from '@/components/NewSection';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import headerBg from '@/assets/new-header-bg.png';
// 接入单位统计
import AccessUnitStatistics from './AccessUnitStatistics';
// 异常单位统计
import AbnormalUnitStatistics from './AbnormalUnitStatistics';
// 待处理业务
import ProcessingBusiness from './ProcessingBusiness';

// 告警信息
// import WarningMessage from './WarningMessage';
import MyTooltip from './components/Tooltip';
// 故障/报警处理动态
import MaintenanceDrawer from './sections/MaintenanceDrawer';

// import AlarmChart from './AlarmChart';
import ElectricityMap from './ElectricityMap';
import MapSearch from './ElectricityMap/MapSearch';
// 引入样式文件
import styles from './index.less';
import {
  SettingModal,
  UnitDrawer,
  AlarmDrawer,
  BusinessDrawer,
  MonitorDrawer,
} from './sections/Components';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';

import { genCardsInfo, genPendingCardsInfo, getAlarmUnits } from './utils';

// websocket配置
const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

// const ids = [
//   'JIQ6gDpvQZipWzxz_OPHkw',
//   'q2gaRblYQWyVOWb009ssAA',
//   '2Msqxm1tT1CYSZP72kYhuA',
//   'tnWeDmZxQK6mFhBZp7uaQw',
//   'Fj_1XoafSjKGo3WJDhHsDw',
//   '417MvXHqTK_Es0n2I9C3eg',
//   'ehhHqz8gRn_X_ka7007WCw',
//   '7KhsYnGqTNCK0P15xh2KYA',
// ];

/**
 * description: 用电监测
 * author:
 * date: 2019年01月08日
 */
@connect(({ gas }) => ({
  gas,
}))
export default class Gas extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      setttingModalVisible: false,
      unitDrawerVisible: false,
      alarmDrawerVisible: false,
      businessDrawerVisible: false,
      monitorDrawerVisible: false,
      monitorDrawerTitleIndex: 0,
      videoVisible: false,
      selectList: [],
      searchValue: '',
      mapInstance: undefined,
      // 企业详情
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
      maintenanceDrawerVisible: false,
      // drawerType: '', // alarm,fault
      alarmIds: [],
      companyName: '',
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
    this.number = 0;
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const { dispatch } = this.props;
    // // 获取告警信息列表
    dispatch({
      type: 'gas/fetchMessages',
    });

    // 获取单位数据
    dispatch({
      type: 'gas/fetchUnitData',
      callback: data => {
        if (!data) return;
        const {
          unitSet: { units = [] },
        } = data;
        this.cardsInfo = genCardsInfo(units);
      },
    });

    // 获取接入单位统计
    dispatch({
      type: 'gas/fetchImportingTotal',
      payload: {
        status,
      },
      callback: data => {
        if (!data) return;
        const {
          gasUnitSet: { importingUnits = [] },
        } = data;
        this.importCardsInfo = genCardsInfo(importingUnits);
      },
    });

    // 获取异常单位统计
    dispatch({
      type: 'gas/fetchAbnormalingTotal',
      payload: {
        status,
      },
      callback: data => {
        if (!data) return;
        const {
          gasErrorUnitSet: { errorUnits = [] },
        } = data;
        this.errorUnitsCardsInfo = genCardsInfo(errorUnits);
      },
    });

    // 获取待处理业务
    dispatch({
      type: 'gas/fetchPendingMission',
      payload: {
        type: status,
      },
      callback: data => {
        if (!data) return;
        const {
          gasPendingUnitSet: { companyList = [] },
        } = data;
        this.pendingUnitsCardsInfo = genPendingCardsInfo(companyList);
      },
    });

    // 获取网格点id
    dispatch({
      type: 'gas/fetchCompanyId',
      callback: companyId => {
        if (!companyId) {
          return;
        }
        const params = {
          companyId,
          env,
          type: 4,
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
          // if (!e.data || e.data.indexOf('heartbeat') > -1) {
          //   if (this.number < ids.length)
          //     this.setState({ alarmIds: [...this.state.alarmIds, ids[this.number]] });
          //   this.number += 1;
          // }
          // 判断是否是心跳
          if (!e.data || e.data.indexOf('heartbeat') > -1) return;
          try {
            const data = JSON.parse(e.data).data;
            const { type, messageFlag, companyName, companyId: id } = data;
            // 如果数据为告警或恢复，则将数据插入到列表的第一个
            if ([31, 32].includes(type)) {
              const {
                gas: {
                  // messages,
                  unitIds,
                  unitSet,
                  unitSet: { units },
                },
              } = this.props;
              const index = unitIds.indexOf(id);

              // dispatch({
              //   type: 'gas/save',
              //   payload: { messages: [data].concat(messages) },
              // });
              // 如果发生告警，弹出通知框，否则关闭通知框
              if (type === 32) {
                // const {
                //   gas: { deviceRealTimeData: { deviceId: selectedDeviceId } = {} },
                // } = this.props;
                // const {
                //   monitorDrawerVisible,
                //   unitDetail: { companyId: selectedCompanyId } = {},
                // } = this.state;
                // const { companyId, messageFlag: deviceId } = data;
                // const {
                //   gas: {
                //     unitIds,
                //     unitSet: { units },
                //   },
                // } = this.props;
                this.setState({ alarmIds: [...this.state.alarmIds, id] });
                this.showWarningNotification(data);
                dispatch({
                  type: 'gas/saveUnitData',
                  payload: {
                    unitSet: {
                      ...unitSet,
                      units: [
                        ...units.slice(0, index),
                        { ...units[index], unnormal: units[index].unnormal + 1 },
                        ...units.slice(index + 1),
                      ],
                    },
                  },
                });
              } else {
                dispatch({
                  type: 'gas/saveUnitData',
                  payload: {
                    unitSet: {
                      ...unitSet,
                      units: [
                        ...units.slice(0, index),
                        { ...units[index], unnormal: units[index].unnormal - 1 },
                        ...units.slice(index + 1),
                      ],
                    },
                  },
                });
                const newIds = [...this.state.alarmIds];
                newIds.splice(index, 1);
                this.setState({ alarmIds: newIds });
              }
              // else {
              //   this.hideWarningNotification(data);
              // }
            }
            // 如果为33，则修改单位状态
            if (type === 33) {
              const { companyId, status } = data;
              const {
                gas: {
                  unitIds,
                  unitSet: { units },
                },
              } = this.props;
              const index = unitIds.indexOf(companyId);
              if (index > -1 && units[index].status !== status) {
                dispatch({
                  type: 'gas/saveUnitData',
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
      },
    });
  }

  /**
   * 更新后
   */
  componentDidUpdate() {}

  /**
   * 销毁前
   */
  componentWillUnmount() {}

  cardsInfo = [];
  importCardsInfo = [];
  errorUnitsCardsInfo = [];
  pendingUnitsCardsInfo = [];

  getDeviceStatusCount = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gas/fetchDeviceStatusCount',
      payload: { companyId },
    });
  };

  getDeviceRealTimeData = deviceId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gas/fetchDeviceRealTimeData',
      payload: { deviceId },
    });
  };

  getDeviceHistoryData = deviceId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gas/fetchDeviceHistoryData',
      payload: { deviceId, type: 1 },
    });
  };

  getDeviceConfig = deviceId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gas/fetchDeviceConfig',
      payload: { deviceId },
    });
  };

  /**
   * 1.获取接口数据
   * 2.显示弹出框
   * 3.添加定时器
   */
  showUnitDetail = (unitDetail, deviceId) => {
    if (!unitDetail) {
      return;
    }
    const { dispatch } = this.props;
    const { mapInstance } = this.state;
    const { companyId, longitude, latitude } = unitDetail;
    mapInstance.setZoomAndCenter(18, [longitude, latitude]);
    this.getDeviceStatusCount(companyId);
    this.getCameraList(companyId);
    this.hideTooltip();
    // 如果deviceId存在，则为点击通知框
    if (deviceId) {
      dispatch({
        type: 'gas/fetchDevices',
        payload: {
          companyId,
          type: 1,
        },
      });
      this.handleSelectDevice(deviceId);
      dispatch({
        type: 'gas/fetchDeviceConfig',
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
    }
    // 否则为点击企业，取第一个设备id
    else {
      dispatch({
        type: 'gas/fetchDevices',
        payload: {
          companyId,
          type: 1,
        },
        callback: ([data]) => {
          if (data) {
            const { deviceId } = data;
            this.handleSelectDevice(deviceId);
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
          } else {
            dispatch({
              type: 'gas/save',
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
    this.setState({ unitDetail, monitorDrawerTitleIndex: +!!deviceId, monitorDrawerVisible: true });
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
      gas: {
        unitSet: { units },
      },
    } = this.props;
    const options = {
      key: `${messageFlag}_${paramCode}`,
      duration: null,
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
            this.setState({ companyName });
            this.handleAlarmClick(messageFlag, undefined, companyName);
            // this.showUnitDetail(
            //   units.filter(({ companyId: id }) => id === companyId)[0],
            //   messageFlag
            // );
          }}
        >
          <div className={styles.notificationText}>
            <div className={styles.notificationTextFirst}>{moment(addTime).format('HH:mm:ss')}</div>
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
      type: 'gas/fetchDeviceStatusCount',
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
      gas: {
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
      gas: {
        unitSet: { units },
      },
    } = this.props;
    this.handleMapClick(companyId, units.filter(item => item.companyId === companyId)[0]);
  };

  handleSelectDevice = deviceId => {
    clearInterval(this.deviceRealTimeDataTimer);
    clearInterval(this.deviceHistoryDataTimer);
    clearInterval(this.deviceConfigTimer);
    this.getDeviceRealTimeData(deviceId);
    this.getDeviceHistoryData(deviceId);
    this.getDeviceConfig(deviceId);
  };

  getCameraList = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'gas/fetchCameraList', payload: { company_id: id } });
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
    this.setState({
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
    });
  };

  handleMapParentChange = newState => {
    this.setState({ ...newState });
  };

  handleAlarmClick = (id, companyId, companyName) => {
    const { dispatch } = this.props;
    this.setState({ companyName });
    dispatch({
      type: 'gas/fetchGasForMaintenance',
      payload: { companyId, id },
      success: () => {
        this.handleDrawerVisibleChange('maintenance');
      },
    });
  };

  /**
   * 渲染
   */
  render() {
    const {
      gas: {
        statisticsData,
        AccessStatistics,
        AccessCount,
        companyStatus,
        AbnormalTrend,
        unitSet,
        allGasFire,
        gasChartByMonth,
        deviceStatusCount,
        devices,
        deviceRealTimeData,
        deviceConfig,
        deviceHistoryData,
        cameraList,
        gasForMaintenance = [],
      },
    } = this.props;

    const {
      setttingModalVisible,
      unitDrawerVisible,
      alarmDrawerVisible,
      businessDrawerVisible,
      monitorDrawerVisible,
      monitorDrawerTitleIndex,
      selectList,
      searchValue,
      unitDetail,
      tooltipName,
      tooltipVisible,
      tooltipPosition,
      maintenanceDrawerVisible,
      // drawerType,
      alarmIds,
      companyName,
    } = this.state;

    const importCardsInfo = this.importCardsInfo;
    const pendingUnitsCardsInfo = this.pendingUnitsCardsInfo;
    const errorUnitsCardsInfo = this.errorUnitsCardsInfo;

    return (
      <BigPlatformLayout
        title="晶安智慧燃气平台"
        extra="无锡市"
        style={{ backgroundImage: 'none' }}
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
        settable
        onSet={this.handleClickSetButton}
      >
        {/* 地图 */}
        <ElectricityMap
          units={Array.isArray(unitSet.units) ? unitSet.units : []}
          deviceStatusCount={deviceStatusCount}
          showTooltip={this.showTooltip}
          hideTooltip={this.hideTooltip}
          unitDetail={unitDetail}
          alarmIds={alarmIds}
          handleParentChange={this.handleMapParentChange}
          handleAlarmClick={this.handleAlarmClick}
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
          onClick={e => this.handleDrawerVisibleChange('unit')}
        />
        {/* 异常单位统计 */}
        <AbnormalUnitStatistics
          data={statisticsData}
          className={`${styles.left} ${styles.realTimeAlarmStatistics}`}
          onClick={e => this.handleDrawerVisibleChange('alarm')}
        />
        {/* 待处理业务 */}
        <NewSection
          title="待处理业务"
          className={styles.left}
          style={{ top: 'calc(45.184444% + 92px)', height: '23.5926%', cursor: 'pointer' }}
          onClick={e => this.handleDrawerVisibleChange('business')}
        >
          <ProcessingBusiness allGasFire={allGasFire} />
        </NewSection>

        {/* extra info */}
        <SettingModal
          visible={setttingModalVisible}
          handleOk={this.handleSettingOk}
          handleCancel={this.handleSettingCancel}
        />
        <UnitDrawer
          data={{ list: importCardsInfo, AccessStatistics, AccessCount }}
          visible={unitDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <AlarmDrawer
          data={{ list: errorUnitsCardsInfo, companyStatus, graphList: AbnormalTrend }}
          visible={alarmDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <BusinessDrawer
          data={{ list: pendingUnitsCardsInfo, graphList: gasChartByMonth }}
          visible={businessDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <MonitorDrawer
          data={{
            unitDetail,
            deviceStatusCount,
            devices,
            deviceRealTimeData,
            deviceConfig,
            deviceHistoryData,
            cameraList,
          }}
          titleIndex={monitorDrawerTitleIndex}
          visible={monitorDrawerVisible}
          handleClose={this.hideUnitDetail}
          handleSelect={this.handleSelectDevice}
          handleClickCamera={this.handleClickCamera}
        />
        <MaintenanceDrawer
          title="报警处理动态"
          // type={drawerType}
          type={'alarm'}
          data={gasForMaintenance}
          visible={maintenanceDrawerVisible}
          companyName={companyName}
          onClose={() => this.handleDrawerVisibleChange('maintenance')}
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
          style={{ zIndex: 150 }}
        />
      </BigPlatformLayout>
    );
  }
}