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
import { SettingModal, UnitDrawer, AlarmDrawer, BusinessDrawer } from './sections/Components';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';

import { genCardsInfo, genPendingCardsInfo, getAlarmUnits } from './utils';
import { GridSelect } from './components/Components';
import UnitMonitorDrawer from './sections/UnitMonitorDrawer';
import VideoPlay from '../Monitor/sections/VideoPlay';

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
@connect(({ gas, monitor }) => ({
  gas,
  monitor,
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
      unitMonitorDrawerVisible: false,
      // 企业信息
      unitInfo: {},
      unitAbnormalTrend: [],
      unitMonitorStatus: null,
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
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    // // 获取告警信息列表
    // dispatch({
    //   type: 'gas/fetchMessages',
    // });

    // 获取单位数据
    dispatch({
      type: 'gas/fetchUnitData',
      payload: { gridId },
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
        gridId,
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
        gridId,
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
        gridId,
      },
      callback: data => {
        if (!data) return;
        const {
          gasPendingUnitSet: { companyList = [] },
        } = data;
        this.pendingUnitsCardsInfo = genPendingCardsInfo(companyList);
      },
    });

    const params = {
      companyId: gridId,
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
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data).data;
        const { type, companyId, messageFlag } = data;
        const {
          gas: {
            // messages,
            unitIds,
            unitSet,
            unitSet: { units },
          },
        } = this.props;
        const { alarmIds } = this.state;
        const index = unitIds.indexOf(companyId);
        // 如果数据为告警或恢复，则将数据插入到列表的第一个
        if ([31, 32].includes(type)) {
          // dispatch({
          //   type: 'gas/save',
          //   payload: { messages: [data].concat(messages) },
          // });
          // 如果发生告警，弹出通知框，否则关闭通知框
          this.fetchAbnormal();
          if (type === 32) {
            // const sameItem = alarmIds.find(item=>item.companyId===companyId);
            let sameIndex;
            alarmIds.forEach((item, i) => {
              if (item.companyId === companyId) sameIndex = i;
            });
            const newList =
              sameIndex !== undefined
                ? [
                  ...alarmIds.slice(0, sameIndex),
                  { companyId, messageFlag },
                  ...alarmIds.slice(sameIndex + 1),
                ]
                : [...alarmIds, { companyId, messageFlag }];
            this.setState({ alarmIds: newList });
            this.showWarningNotification(data);
            // dispatch({
            //   type: 'gas/saveUnitData',
            //   payload: {
            //     unitSet: {
            //       ...unitSet,
            //       units: [
            //         ...units.slice(0, index),
            //         { ...units[index], unnormal: units[index].unnormal + 1 },
            //         ...units.slice(index + 1),
            //       ],
            //     },
            //   },
            // });
          } else {
            // dispatch({
            //   type: 'gas/saveUnitData',
            //   payload: {
            //     unitSet: {
            //       ...unitSet,
            //       units: [
            //         ...units.slice(0, index),
            //         { ...units[index], unnormal: units[index].unnormal - 1 },
            //         ...units.slice(index + 1),
            //       ],
            //     },
            //   },
            // });
            let sameIndex;
            alarmIds.forEach((item, i) => {
              if (item.messageFlag === messageFlag) sameIndex = i;
            });
            if (sameIndex !== undefined) {
              const newIds = [...alarmIds.slice(0, sameIndex), ...alarmIds.slice(sameIndex + 1)];
              this.setState({ alarmIds: newIds });
            }
          }
        }
        // 如果为33，则修改单位状态
        if (type === 33) {
          this.fetchAbnormal();
          // dispatch({
          //   type: 'gas/saveUnitData',
          //   payload: {
          //     unitSet: {
          //       ...unitSet,
          //       units: [
          //         ...units.slice(0, index),
          //         { ...units[index], faultNum: units[index].faultNum - 1 },
          //         ...units.slice(index + 1),
          //       ],
          //     },
          //   },
          // });
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };

    setInterval(() => {
      this.fetchPending();
    }, 10000);
  }

  fetchAbnormal = () => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;

    // 获取单位数据
    dispatch({
      type: 'gas/fetchUnitData',
      payload: { gridId },
      callback: data => {
        if (!data) return;
        const {
          unitSet: { units = [] },
        } = data;
        this.cardsInfo = genCardsInfo(units);
      },
    });

    // 获取异常单位统计
    dispatch({
      type: 'gas/fetchAbnormalingTotal',
      payload: {
        status,
        gridId,
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
    // this.fetchPending()
  };

  fetchPending = () => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    // 获取待处理业务
    dispatch({
      type: 'gas/fetchPendingMission',
      payload: {
        type: status,
        gridId,
      },
      callback: data => {
        if (!data) return;
        const {
          gasPendingUnitSet: { companyList = [] },
        } = data;
        this.pendingUnitsCardsInfo = genPendingCardsInfo(companyList);
      },
    });
  }

  /**
   * 更新后
   */
  componentDidUpdate() { }

  /**
   * 销毁前
   */
  componentWillUnmount() { }

  cardsInfo = [];
  importCardsInfo = [];
  errorUnitsCardsInfo = [];
  pendingUnitsCardsInfo = [];

  /**
   * 1.获取接口数据
   * 2.显示弹出框
   * 3.添加定时器
   */
  showUnitDetail = (unitDetail, deviceId) => {
    if (!unitDetail) {
      return;
    }
    const { mapInstance } = this.state;
    const { longitude, latitude } = unitDetail;
    mapInstance.setZoomAndCenter(18, [longitude, latitude]);
    this.mapChild.handleMapClick(unitDetail);
    this.hideTooltip();
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
            this.handleClickNotification(companyId);
            this.handleAlarmClick(messageFlag, companyId, companyName);
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

  handleClickNotification = companyId => {
    const {
      gas: {
        unitSet: { units },
      },
    } = this.props;
    this.mapChild.handleMapClick(units.filter(item => item.companyId === companyId)[0]);
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

  handleAlarmClick = (id, companyId, companyName, num) => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    this.setState({ companyName });
    dispatch({
      type: 'gas/fetchGasForMaintenance',
      payload: { companyId, id, gridId, num },
      success: () => {
        this.handleDrawerVisibleChange('maintenance');
      },
    });
  };

  onRef = ref => {
    this.mapChild = ref;
  };

  handleCloseUnitMonitor = () => {
    this.setState({ unitMonitorDrawerVisible: false, unitMonitorStatus: null })
  }

  // 点击打开企业实时监测数据弹窗
  hanldeViewUnitMonitor = (unitInfo) => {
    const { companyId } = unitInfo
    const { dispatch } = this.props
    const { unitMonitorStatus } = this.state
    this.setState({ unitInfo, unitMonitorDrawerVisible: true })
    // 获取单位实时监测数据
    dispatch({
      type: 'gas/fetchRealTimeMonitor',
      payload: { companyId, status: unitMonitorStatus },
    })
    // 获取异常趋势图数据
    dispatch({
      type: 'gas/fetchAbnormalTrend',
      payload: { companyId },
      callback: (list = []) => {
        const unitAbnormalTrend = list.map(item => {
          const [{ faultNum, month, outContact, unnormal }] = Object.values(item)
          return [month, unnormal, faultNum, outContact]
        })
        this.setState({ unitAbnormalTrend })
      },
    })
    // 获取视频
    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
  }

  // 单位监测数据弹窗筛选
  handleChangeMonitorStatus = unitMonitorStatus => {
    const { dispatch } = this.props
    const { unitInfo } = this.state
    this.setState({ unitMonitorStatus }, () => {
      dispatch({
        type: 'gas/fetchRealTimeMonitor',
        payload: { companyId: unitInfo.companyId, status: unitMonitorStatus },
      })
    })
  }

  handleViewVideo = () => {
    this.setState({ videoVisible: true })
  }

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
        gasForMaintenance = [],
      },
      match: {
        params: { gridId },
      },
      monitor: { allCamera: cameraList = [] },
    } = this.props;

    const {
      setttingModalVisible,
      unitDrawerVisible,
      alarmDrawerVisible,
      businessDrawerVisible,
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
      unitMonitorDrawerVisible,
      unitInfo,
      unitAbnormalTrend,
      unitMonitorStatus,
      videoVisible,
    } = this.state;

    const importCardsInfo = this.importCardsInfo;
    const pendingUnitsCardsInfo = this.pendingUnitsCardsInfo;
    const errorUnitsCardsInfo = this.errorUnitsCardsInfo;
    const extra = <GridSelect gridId={gridId} urlBase="/big-platform/gas" />;
    return (
      <BigPlatformLayout
        title="晶安智慧燃气平台"
        extra={extra}
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
          onRef={this.onRef}
          onInfoTitleClick={this.hanldeViewUnitMonitor}
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
          handleClickUnitStatistics={this.hanldeViewUnitMonitor}
        />
        <AlarmDrawer
          data={{ list: errorUnitsCardsInfo, companyStatus, graphList: AbnormalTrend }}
          visible={alarmDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          handleAlarmClick={this.handleAlarmClick}
          handleClickDeviceNumber={this.hanldeViewUnitMonitor}
        />
        <BusinessDrawer
          data={{ list: pendingUnitsCardsInfo, graphList: gasChartByMonth }}
          visible={businessDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
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
        <UnitMonitorDrawer
          title="单位监测信息"
          visible={unitMonitorDrawerVisible}
          onClose={this.handleCloseUnitMonitor}
          unitInfo={unitInfo}
          unitAbnormalTrend={unitAbnormalTrend}
          handleChangeStatus={this.handleChangeMonitorStatus}
          status={unitMonitorStatus}
          handleViewVideo={this.handleViewVideo}
          cameraList={cameraList}
        />
      </BigPlatformLayout>
    );
  }
}
