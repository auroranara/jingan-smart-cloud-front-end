import React, { PureComponent } from 'react';
import { notification, Icon } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { stringify } from 'qs';
import moment from 'moment';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import headerBg from '@/assets/new-header-bg.png';
import styles from './index.less';
import styles1 from '@/pages/BigPlatform/NewUnitFireControl/index.less';
import {
  BackMap,
  ElectricalFireMonitoringDetailDrawer,
  FireStatisticsDrawer,
  GasDrawer,
  Messages,
  SettingModal,
  UnitListDrawer,
  WaterItemDrawer,
} from './sections/Components';
import {
  MapSearch,
  Tooltip as MyTooltip,
  TaskDrawer,
  TaskCount,
  FireCount,
} from './components/Components';
import { findAggUnit, GAS, PAGE_SIZE } from './utils';
import { WATER_TYPES, getWaterTotal } from '@/pages/BigPlatform/GasStation/utils';
import { redLight as iconFire } from '@/pages/BigPlatform/GasStation/imgs/links';
import iconFault from '@/assets/icon-fault-msg.png';
import { FireFlowDrawer, OnekeyFlowDrawer, SmokeFlowDrawer } from '@/pages/BigPlatform/NewUnitFireControl/Section/Components';

const OPE = 3; // 运营或管理员unitType对应值
const COMPANY_ALL = 'companyIdAll';
const TYPE_CLICK_LIST = [7, 9, 11, 32, 36, 37, 38, 39, 40, 42, 43, 44, 48, 49];
// const TYPE_CLICK_LIST = [7, 9, 11, 32, 36, 37, 38, 39, 40, 42, 43, 44, 45, 48, 49];
const SHOW_TYPES = [1, 2, 3, 4, 7, 9, 11, 13, 14, 15, 16, 17, 18, 32, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 54, 55, 56, 57];
const ALARM_TYPES = [7, 32, 36, 38, 39];

// websocket配置
const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

const NOTIFICATION_MAX = 4;

const FIRE_DICT = {
  今日: 0,
  本周: 1,
  本月: 2,
};

const MAP_SEARCH_STYLE = {
  top: 'calc(9.62963% + 24px)',
  position: 'absolute',
  left: '24px',
  width: '25.46875%',
  zIndex: 9999,
};

const HEADER_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  fontSize: 16,
  zIndex: 99,
  backgroundImage: `url(${headerBg})`,
  backgroundSize: '100% 100%',
};

const CONTENT_STYLE = { position: 'relative', height: '100%', zIndex: 0 };

const MSG_INFO = [
  {
    title: '报警提示',
    icon: iconFire,
    color: '#f83329',
    body: '发生报警，',
    bottom: '情况危急，请立即处理！',
    animation: styles.redShadow,
  },
  {
    title: '故障提示',
    icon: iconFault,
    color: '#f4710f',
    body: '发生故障，',
    bottom: '请及时维修！',
    animation: styles.orangeShadow,
  },
];

const DRAWER_VISIBLES = [
  'fireFlowDrawerVisible',
  'smokeFlowDrawerVisible',
  'gasDrawerVisible',
  'onekeyFlowDrawerVisible',
];

const switchMsgType = type => {
  const alarmTypes = ALARM_TYPES;
  const faultTypes = [9, 40];
  if (alarmTypes.indexOf(type) >= 0) return MSG_INFO[0];
  else if (faultTypes.indexOf(type) >= 0) return MSG_INFO[1];
};

notification.config({
  placement: 'bottomLeft',
  duration: null,
  bottom: 8,
});

const popupVisible = {
  videoVisible: false, // 重点部位监控视频弹窗
  riskDrawerVisible: false, // 是否显示对应弹框
  workOrderDrawerVisible: false,
  alarmMessageDrawerVisible: false,
  faultMessageDrawerVisible: false,
  alarmDynamicDrawerVisible: false,
  alarmHistoryDrawerVisible: false,
  maintenanceDrawerVisible: false,
  checkDrawerVisible: false, // 检查点抽屉是否显示
  pointDrawerVisible: false, // 点位名称抽屉是否显示
  faultDrawerVisible: false,
  currentDrawerVisible: false, // 当前隐患抽屉可见
  dangerDetailVisible: false, // 隐患详情抽屉可见
  pointInspectionDrawerVisible: false, // 点位巡查抽屉是否显示
  maintenanceMsgDrawerVisible: false,
  alarmDynamicMsgDrawerVisible: false,
  fireAlarmVisible: false,
  maintenanceCheckDrawerVisible: false,
  smokeDrawerVisible: false,
  electricityDrawerVisible: false,
  resetHostsDrawerVisible: false,
  checksDrawerVisible: false,
  newWorkOrderDrawerVisible: false,
  onekeyFlowDrawerVisible: false,
  unitListDrawerVisible: false,
  electricalFireMonitoringDetailDrawerVisible: false,
  waterItemDrawerVisible: false,
  gasDrawerVisible: false,
};

@connect(({ loading, operation, user, unitSafety, newUnitFireControl, gasStation }) => ({
  operation,
  user,
  unitSafety,
  newUnitFireControl,
  gasStation,
  loading: loading.models.operation,
  fireListLoading: loading.effects['operation/fetchFireList'],
  messageInformListLoading: loading.effects['newUnitFireControl/fetchMessageInformList'],
}))
export default class Operation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      taskDrawerVisible: false, // 任务抽屉
      taskDrawerProcess: undefined, // 任务处理状态
      fireStatisticsDrawerVisible: false, // 火警抽屉
      dateType: undefined, // 火警抽屉日期类型
      setttingModalVisible: false,
      selectList: [],
      searchValue: '',
      mapInstance: undefined,
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
      alarmIds: [],
      companyName: '',
      // unitList: [], // 地图显示的企业列表
      unitDetail: {},
      deviceType: 0, // 地图中间根据设备显示企业列表
      fireListHasMore: true, // 火警统计抽屉右边列表是否有更多
      alarmMessageDrawerVisible: false,
      faultMessageDrawerVisible: false,
      alarmHistoryDrawerVisible: false,
      fireFlowDrawerVisible: false,
      flowRepeat: {
        times: 0,
        lastreportTime: 0,
      },
      msgFlow: 0, // 0报警 1故障
      smokeFlowDrawerVisible: false,
      fireVideoVisible: false,
      videoVisible: false,
      onekeyFlowDrawerVisible: false,
      unitListType: 0, // 0 企业类别 1 聚合点列表
      unitListDrawerVisible: false, // 企业列表抽屉
      // showVideoList: false,
      videoList: [],
      videoKeyId: undefined,
      dynamicType: null,
      company: {},
      electricalFireMonitoringDetailDrawerVisible: false, // 电气火灾监测详情抽屉是否显示
      electricalFireMonitoringDetailDrawerValue: null, // 电气火灾监测详情抽屉参数
      electricalFireMonitoringDetailDrawerActiveKey: '漏电电流', // 电气火灾监测详情抽屉选中参数
      waterItem: {},
      waterItemDrawerVisible: false, // 水系统详情抽屉
      gasDrawerVisible: false, // 燃气
    };
    this.debouncedFetchData = debounce(this.fetchMapSearchData, 500);
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const {
      dispatch,
      user: {
        currentUser: { userId, unitType },
      },
    } = this.props;

    // 烟感地图数据
    this.fetchMapUnitList();
    // 获取实时消息
    this.fetchScreenMessage();

    const isAdmin = +unitType === OPE;
    const params = {
      companyId: isAdmin ? COMPANY_ALL : userId,
      env,
      type: 7,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;
    // const url = `ws://192.168.10.19:10036/websocket?${stringify(params)}`;

    const ws = new WebsocketHeartbeatJs({ url, ...options });

    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;

      try {
        const data = JSON.parse(e.data);
        const { companyId } = data.data;
        this.fetchStatistics();
        this.fetchMapUnitList(companyId);

        this.handleShowFireMsg(data.data);

        this.fetchScreenMessage();
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  }

  handleShowFireMsg = result => {
    const { type, enterSign, isOver } = result;

    if (ALARM_TYPES.includes(+type)) {
      // 水系统，电气火灾不用判断isOver，主机和独立烟感需要判断isOver是否为0
      if ([32, 36].includes(type) || (+isOver === 0 && (type === 7 && enterSign === '1' || type !== 7)))
        this.showFireMsg(result);
    }
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const {
  //     operation: { unitList },
  //   } = this.props;
  //   const { deviceType } = this.state;
  //   const {
  //     operation: { unitList: prevUnitList },
  //   } = prevProps;
  //   const { deviceType: prevDeviceType } = prevState;
  //   if (unitList !== prevUnitList || deviceType !== prevDeviceType) {
  //     this.setState({ unitList: getUnitList(unitList, deviceType) });
  //   }
  // }

  messageIds = [];
  messageTimers = [];
  messageCloseTimers = [];

  fetchElecDeviceList = (companyId, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gasStation/fetchDistributionBoxClassification',
      payload: { companyId, type: 1 },
      callback,
    });
  };

  hiddeAllPopup = () => {
    this.setState({ ...popupVisible });
  };

  fetchStatistics = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'operation/fetchFireCount' });
    dispatch({ type: 'operation/fetchTaskCount' });
  };

  /**
   * 获取大屏消息
   */
  fetchScreenMessage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operation/fetchAllScreenMessage',
    });
  };

  fireListPageNum = 1;

  showUnitDetail = (unitDetail, deviceType) => { // 地图显示某个企业详情，这里传入的参数可能是企业详情或者聚合的点，若是企业详情则找到对应的聚合点
    if (!unitDetail)
      return;

    const { operation: { aggregationUnitLists } } = this.props;
    const { deviceType: stateDeviceType, mapInstance } =  this.state;
    const dType = deviceType === undefined ? stateDeviceType : deviceType; // deviceType不传就从state中获取
    const units = aggregationUnitLists[dType];

    const { isAgg } = unitDetail;
    const unitDetailTemp = unitDetail;
    let unitIndex;
    if (!isAgg) {
      unitDetail = findAggUnit(unitDetail, units);
      unitIndex = unitDetail.list.indexOf(unitDetailTemp);
      // console.log(unitDetail, unitDetailTemp, unitIndex);
    }

    const { longitude, latitude } = unitDetail;
    this.setState({ unitDetail });
    setTimeout(() => {
      mapInstance.setZoomAndCenter(18, [longitude, latitude]);
      this.mapChild.handleMapClick(unitDetail, unitIndex);
    }, 400); // 解决点击时无法居中的问题
    this.hideTooltip();
  };

  // hideUnitDetail = () => {
  //   // this.setState({ monitorDrawerVisible: false });
  // };

  // hideWarningNotification = ({ messageFlag, paramCode }) => {
  //   notification.close(`${messageFlag}_${paramCode}`);
  // };

  showFireMsg = item => {
    const { type, messageId } = item;
    const msgItem = switchMsgType(+type);
    const style = {
      boxShadow: `0px 0px 20px ${msgItem.color}`,
    };
    const styleAnimation = {
      ...style,
      animation: `${msgItem.animation} 2s linear 0s infinite alternate`,
    };
    const options = {
      key: messageId,
      className: styles1.notification,
      message: this.renderNotificationTitle(item),
      description: this.renderNotificationMsg(item),
      style: this.fireNode ? { ...style, width: this.fireNode.clientWidth - 8 } : { ...style },
    };
    notification.open({
      ...options,
    });

    const timer = setTimeout(() => {
      // 解决加入animation覆盖notification自身显示动效时长问题
      notification.open({
        ...options,
        style: this.fireNode
          ? { ...styleAnimation, width: this.fireNode.clientWidth - 8 }
          : { ...styleAnimation },
        onClose: () => {
          notification.open({
            ...options,
          });
          setTimeout(() => {
            this.closeNotification(messageId);
          }, 200);
        },
      });
    }, 800);

    const closeTimer = setTimeout(() => {
      this.closeNotification(messageId);
    }, 30000);

    this.messageIds.push(messageId);
    this.messageTimers.push(timer);
    this.messageCloseTimers.push(closeTimer);
    this.closeExcessNotification();
  };

  closeNotification = id => {
    notification.close(id);
    const index = this.messageIds.indexOf(id);
    [this.messageIds, this.messageTimers, this.messageCloseTimers] = [
      this.messageIds,
      this.messageTimers,
      this.messageCloseTimers,
    ].map(list => list.filter((n, i) => i !== index));
  };

  closeExcessNotification = () => {
    if (this.messageIds.length <= NOTIFICATION_MAX) return;

    const [restId, restTimer, restCloseTimer] = [
      this.messageIds,
      this.messageTimers,
      this.messageCloseTimers,
    ].map(list => list[NOTIFICATION_MAX]);
    this.closeNotification(restId);
    [restTimer, restCloseTimer].forEach(timer => clearTimeout(timer));
  };

  renderNotificationTitle = item => {
    const { type } = item;
    const msgItem = switchMsgType(+type);
    return (
      <div className={styles1.notificationTitle} style={{ color: msgItem.color }}>
        <span className={styles1.iconFire}>
          <img src={msgItem.icon} alt="fire" />
        </span>
        {msgItem.title}
      </div>
    );
  };

  renderNotificationMsg = item => {
    const {
      messageId,
      companyId,
      type,
      addTime,
      installAddress,
      unitTypeName,
      messageFlag,
      area,
      location,
      cameraMessage,
      componentType,
      workOrder,
      systemTypeValue,
      createBy,
      createByPhone,
      faultName,
      companyName,
      component,
      trueOver = null,
      deviceId,
      deviceType,
      deviceTypeName,
      paramName,
    } = item;
    const msgItem = switchMsgType(+type);
    const occurData = [
      {
        create_time: addTime,
        create_date: addTime,
        firstTime: addTime,
        lastTime: addTime,
        area,
        location,
        install_address: installAddress,
        label: componentType,
        work_order: workOrder,
        systemTypeValue,
        createByName: createBy,
        createByPhone,
        faultName,
        realtime: addTime,
      },
    ];
    const msgFlag =
      messageFlag && (messageFlag[0] === '[' ? JSON.parse(messageFlag)[0] : messageFlag);
    const restParams = [cameraMessage, occurData, companyId];
    const param = {
      deviceId,
      dataId: +trueOver === 0 ? msgFlag : undefined,
      id: +trueOver !== 0 ? msgFlag : undefined,
      companyName: companyName || undefined,
      component: component || undefined,
      unitTypeName: unitTypeName || undefined,
      companyId: companyId || undefined,
    };

    let handleClick = null;
    switch(type) {
      case 7:
        handleClick = () => this.handleClickMsgFlow(param, 0, 0, ...restParams);
        break;
      case 32:
        handleClick = () => this.handleClickElecMsg(deviceId, paramName, companyId, cameraMessage);
        break;
      case 36:
        handleClick = () => this.handleClickWater(undefined, WATER_TYPES.indexOf(deviceType), deviceId, companyId, cameraMessage);
        break;
      case 38:
        handleClick = () => this.handleClickMsgFlow(param, 1, 0, ...restParams);
        break;
      case 39:
        handleClick = () => this.handleClickMsgFlow(param, 2, 0, ...restParams);
        break;
      default:
        console.log('no click');
    }

    const onClick = e => {
      handleClick();
      this.closeNotification(messageId);
    };
    return (
      <div
        className={styles1.notificationBody}
        onClick={onClick}
      >
        <div>
          <span className={styles1.time}>
            {/* {moment(addTime).format('YYYY-MM-DD HH:mm')} */}
            刚刚
          </span>{' '}
          {/* <span className={styles.time}>{addTimeStr}</span>{' '} */}
          <span className={styles1.address}>{installAddress || area + location}</span>
        </div>
        {companyName && <div>【{companyName}】</div>}
        <div>
          {type === 7 && unitTypeName && (
              <span className={styles1.device} style={{ color: msgItem.color }}>
                【{unitTypeName}】
              </span>
            )}
          {(type === 38 || type === 39 || type === 40) && (
            <span className={styles1.device} style={{ color: msgItem.color }}>
              {type === 39 ? `【可燃气体探测器】` : `【独立烟感探测器】`}
            </span>
          )}
          {type === 36 && (
            <span className={styles.device} style={{ color: msgItem.color }}>
              {`【水系统探测器】${deviceTypeName}`}
            </span>
          )}
          {type === 32 && (
            <span className={styles.device} style={{ color: msgItem.color }}>
              {`【电气火灾探测器】${paramName}`}
            </span>
          )}
          {msgItem.body}
        </div>
        <div>{msgItem.bottom}</div>
      </div>
    );
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
      operation: { unitList, unitLists },
    } = this.props;
    const { deviceType } = this.state;
    // const list = getUnitList(unitList, deviceType);
    const list = unitLists[deviceType];
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

  handleVideoOpen = () => {
    const {
      videoList = [],
    } = this.state;
    if (videoList && videoList.length) {
      this.setState({
        videoVisible: true,
        // videoList,
        videoKeyId: videoList && videoList[0] && videoList[0].key_id,
        // showVideoList: false,
      });
      return;
    }
    // dispatch({
    //   type: 'operation/fetchVideoList',
    //   payload: {
    //     company_id: companyId,
    //   },
    //   callback: (response) => {
    //     const { list = [] } = response || {};
    //     this.setState({
    //       videoVisible: true,
    //       videoList: list,
    //       videoKeyId: list && list[0] && list[0].key_id,
    //     });
    //   },
    // });
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

  // handleAlarmClick = (id, companyId, companyName, num) => {
  //   const {
  //     dispatch,
  //     match: {
  //       params: { gridId },
  //     },
  //   } = this.props;
  //   this.setState({ companyName });
  //   dispatch({
  //     type: 'smoke/fetchSmokeForMaintenance',
  //     payload: { companyId, id, gridId, num, type: '1' },
  //     success: () => {
  //       this.handleDrawerVisibleChange('alarmDynamic');
  //     },
  //   });
  // };

  // handleFaultClick = (id, companyId, companyName, num) => {
  //   // return null;
  //   const {
  //     dispatch,
  //     match: {
  //       params: { gridId },
  //     },
  //   } = this.props;
  //   this.setState({ companyName });
  //   dispatch({
  //     type: 'smoke/fetchSmokeForMaintenance',
  //     payload: { companyId, id, gridId, num, type: '2' },
  //     success: () => {
  //       this.handleDrawerVisibleChange('maintenance');
  //     },
  //   });
  // };

  onRef = ref => {
    this.mapChild = ref;
  };

  handleCompanyClick = companyId => {
    window.open(`${window.publicPath}#/big-platform/fire-control/new-company/${companyId}`);
  };

  fetchMapUnitList = unitId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operation/fetchUnitList',
      payload: { unitId },
    });
  };

  handleFireDrawerOpen = dateType => {
    const dType = FIRE_DICT[dateType];
    this.setState({ fireStatisticsDrawerVisible: true, dateType: dType });
    this.getFirePie(dType);
    this.getFireTrend();
    this.getFireList({ dateType: dType });
  };

  getFirePie = dateType => {
    const { dispatch } = this.props;
    dispatch({ type: 'operation/fetchFirePie', payload: { type: dateType + 1 } });
  };

  getFireTrend = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'operation/fetchFireTrend' });
  };

  getFireList = ({ deviceType, fireType, searchValue, dateType } = {}, initial = true) => {
    const { dispatch } = this.props;
    const [dType, fType, name] = [deviceType, fireType, searchValue].map(v => (v ? v : undefined));

    if (initial) {
      this.fireListPageNum = 1;
      this.setState({ fireListHasMore: true });
    }

    dispatch({
      type: 'operation/fetchFireList',
      payload: {
        name,
        deviceType: dType,
        fireType: fType,
        type: dateType + 1,
        pageNum: this.fireListPageNum,
        pageSize: PAGE_SIZE,
      },
      callback: total => {
        if (this.fireListPageNum++ * PAGE_SIZE >= total) this.setState({ fireListHasMore: false });
      },
    });
  };

  handleDateTypeChange = dateType => {
    this.setState({ dateType });
  };

  handleTaskDrawerOpen = taskDrawerProcess => {
    this.setState({ taskDrawerVisible: true, taskDrawerProcess });
  };

  handleTaskDrawerClose = () => {
    this.setState({ taskDrawerVisible: false });
  };

  handleTaskCardClick = data => {
    const { dispatch } = this.props;
    const {
      id,
      gasId,
      proceId,
      companyName,
      rcompanyName,
      companyId,
      componentRegion,
      componentNo,
      componentName,
      reportType,
      // proceStatus,
      fireType,
      installAddress,
      area,
      location,
      workOrder,
      faultName,
      createByName,
      createByPhone,
      systemTypeValue,
      realtime,
      createDate,
      firstTime,
      lastTime,
      createTime,
      rcompanyId = null,
    } = data;
    const dataId = { 1: id, 4: id || gasId, 2: proceId }[reportType];
    const cId = (+reportType !== 2 ? companyId : rcompanyId) || undefined;
    dispatch({
      type: 'operation/fetchCameraMessage',
      payload: {
        id: dataId,
        reportType,
      },
      callback: cameraMessage => {
        const param = {
          dataId: +reportType !== 2 ? dataId : undefined,
          id: +reportType === 2 ? dataId : undefined,
          proceId,
          companyName: (+reportType !== 2 ? companyName : rcompanyName) || undefined,
          component:
            `${
              componentRegion || typeof componentRegion === 'number' ? `${componentRegion}回路` : ''
            }${componentNo || typeof componentNo === 'number' ? `${componentNo}号` : ''}` ||
            undefined,
          unitTypeName: componentName || undefined,
          companyId: cId,
        };
        const type = { 1: 0, 4: 1, 3: 2, 2: 3 }[reportType];
        const flow = fireType - 1;
        const occurData = [
          {
            create_time: createTime,
            create_date: createDate,
            firstTime,
            lastTime,
            area,
            location,
            install_address: installAddress,
            label: componentName,
            work_order: workOrder,
            systemTypeValue,
            createByName,
            createByPhone,
            faultName,
            realtime,
          },
        ];

        this.handleClickMsgFlow(param, type, flow, cameraMessage, occurData, cId);
      },
    });
  };

  handleDeviceTypeChange = (v, callback) => {
    const {
      operation: { unitList, unitLists },
    } = this.props;
    const { unitDetail } = this.state;
    // const list = getUnitList(unitList, v);
    const list = unitLists[v];
    this.setState({ deviceType: v });
    callback(!!list.find(({ companyId }) => companyId === unitDetail.companyId), !!unitDetail);
  };

  // 获取消息人员列表
  fetchMessageInformList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMessageInformList',
      payload: { ...params },
    });
  };

  handleClickMsgFlow = (
    param,
    type,
    flow,
    cameraMessage = [],
    occurData,
    cId
  ) => {
    // type 0/1/2/3 主机/烟感/燃气/一键报修
    // flow 0/1 报警/故障
    const {
      dispatch,
      operation: { unitList },
    } = this.props;

    const { deviceId, proceId } = param;
    this.setState({ company: { ...param } });
    ['deviceId', 'proceId', 'companyName', 'unitTypeName', 'component'].forEach(p => delete param[p]);

    const reportTypes = [1, 4, 3, 2];
    this.hiddeAllPopup();
    let workOrderPayload = { companyId: cId, reportType: reportTypes[type], ...param };
    if (proceId)
      workOrderPayload = { ...workOrderPayload, id: proceId, dataId: undefined };
    this.fetchMessageInformList({
      id: proceId || param.id,
      // dataId: param.dataId,
    });
    if (type !== 3) {
      dispatch({
        type: 'operation/fetchCountNumAndTimeById',
        payload: {
          id: param.dataId || param.id,
          reportType: reportTypes[type],
          fireType: flow + 1,
        },
        callback: res => {
          if (res) {
            const { num, lastTime, firstTime, sdeviceName = null } = res;
            dispatch({
              type: 'operation/saveWorkOrderDetail',
              payload: [{ ...occurData[0], firstTime, num, lastTime, sdeviceName }],
            });
          } else {
            dispatch({
              type: 'operation/fetchWorkOrder',
              // payload: { companyId: cId, reportType: reportTypes[type], ...param },
              payload: workOrderPayload,
            });
          }
        },
      });
    } else {
      // 一键报修没有重复上报
      dispatch({
        type: 'operation/fetchWorkOrder',
        // payload: { companyId: cId, reportType: reportTypes[type], ...param },
        payload: workOrderPayload,
        callback: res => {
          if (!(res.data && Array.isArray(res.data.list))) return;
          if (res.data.list.length === 0) {
            dispatch({
              type: 'operation/saveWorkOrderDetail',
              payload: occurData,
            });
          }
        },
      });
    }

    if (type === 2) // 燃气
      this.fetchGasData(deviceId);

    // 企业负责人和维保员信息
    dispatch({
      type: 'operation/fetchMaintenanceCompany',
      payload: {
        companyId: cId,
      },
    });
    // dispatch({
    //   type: 'newUnitFireControl/fetchWorkOrder',
    //   payload: { companyId, reportType: reportTypes[type], ...param },
    //   callback: res => {
    //     if (!(res.data && Array.isArray(res.data.list))) return;
    //     if (res.data.list.length === 0) {
    //       dispatch({
    //         type: 'newUnitFireControl/saveWorkOrderDetail',
    //         payload: occurData,
    //       });
    //     }
    //   },
    // });
    this.setState({
      [DRAWER_VISIBLES[type]]: true,
      msgFlow: flow,
      dynamicType: type,
    });

    if (type !== 3)
      this.setCameraMessage(cameraMessage);
    // if (cameraMessage && cameraMessage.length && type !== 3) {
    //   this.setState({
    //     videoVisible: true,
    //     videoKeyId: cameraMessage && cameraMessage[0] && cameraMessage[0].key_id,
    //   });
    // }

    this.locateCompany(cId, type<=2 ? type <=1 ? type + 1 : GAS : undefined);
  };

  setCameraMessage = cameraMessage => {
    if (cameraMessage && cameraMessage.length) {
      this.setState({
        videoVisible: true,
        videoList: cameraMessage,
        videoKeyId: cameraMessage && cameraMessage[0] && cameraMessage[0].key_id,
      });
    } else {
      this.setState({
        // videoVisible: false,
        videoList: [],
        videoKeyId: '',
      });
    }
  };

  locateCompany = (cId, deviceType) => {
    const {
      operation: { unitList },
    } = this.props;

    const detail = unitList.find(({ companyId }) => companyId === cId);
    if (deviceType !== undefined)
      this.setState({ deviceType });
    this.showUnitDetail(detail);
    this.hideTooltip();
  };

  fetchGasData = deviceId => {
    const { dispatch } =  this.props;
    dispatch({
      type: 'operation/fetchGasHistory',
      payload: { deviceId, historyType: 1, queryDate: moment().format('YYYY/MM/DD HH:mm:ss') },
    });
    dispatch({
      type: 'operation/fetchGasRealtimeData',
      payload: { deviceId },
    });
    this.fetchGasTotal(deviceId, 1);
  };

  fetchGasTotal = (deviceId, dateType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operation/fetchGasTotal',
      payload: { deviceId, type: dateType },
    });
  };

  /**
   *  点击播放重点部位监控
   */
  handleShowFireVideo = videoList => {
    if (!Array.isArray(videoList) || videoList.length === 0) return null;
    this.setState({ fireVideoVisible: true });
  };

  handleClickElecMsg = (deviceId, paramName, companyId, cameraMessage) => {
    this.fetchElecDeviceList(companyId, distributionBoxClassification => {
      const { alarm = [], loss = [], normal = [] } = distributionBoxClassification;
      const data = [...alarm, ...loss, ...normal].filter(({ id }) => id === deviceId)[0];
      if (data)
        this.showElectricalFireMonitoringDetailDrawer(data, paramName);
      else
        console.log('未找到设备对应的数据');
    });
    this.setCameraMessage(cameraMessage);
    this.locateCompany(companyId, 3);
  };

  showElectricalFireMonitoringDetailDrawer = (
    electricalFireMonitoringDetailDrawerValue,
    paramName = '漏电电流'
  ) => {
    this.setState({
      electricalFireMonitoringDetailDrawerVisible: true,
      electricalFireMonitoringDetailDrawerValue,
      electricalFireMonitoringDetailDrawerActiveKey:
        paramName === '漏电电流' ? '漏电电流' : paramName.slice(-2),
    });
  };

  hideElectricalFireMonitoringDetailDrawer = () => {
    this.setState({
      electricalFireMonitoringDetailDrawerVisible: false,
    });
  };

  handleClickWater = (index, typeIndex, deviceId, companyId, cameraMessage) => {
    // const { waterTabItem } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'gasStation/fetchWaterSystem',
      payload: {
        companyId,
        type: WATER_TYPES[typeIndex],
      },
      callback: list => {
        const item = list.find(({ deviceDataList }) => {
          if (Array.isArray(deviceDataList) && deviceDataList[0])
            return deviceDataList[0].deviceId === deviceId;
          return false;
        });
        item && this.showWaterItemDrawer(item);
      },
    });
    this.setCameraMessage(cameraMessage);
    this.locateCompany(companyId, 5);
  };

  showWaterItemDrawer = (item, tabIndex) => {
    const { dispatch } = this.props;
    const {
      deviceDataList: [{ deviceId }],
    } = item;
    this.setState({ waterItem: item, waterItemDrawerVisible: true });
    dispatch({
      type: 'gasStation/fetchWaterHistory',
      payload: { deviceId, historyType: 1, queryDate: moment().format('YYYY/MM/DD HH:mm:ss') },
    });
    this.fetchAlarmCount(deviceId, 1);
  };

  fetchAlarmCount = (deviceId, type) => {
    const { dispatch } = this.props;
    dispatch({ type: 'gasStation/fetchWaterHistoryAlarm', payload: { deviceId, type } });
  };

  hdieWaterItemDrawer = () => {
    this.setState({ waterItemDrawerVisible: false });
  };

  showUnitListDrawer = (type=0) => {
    this.setState({ unitListType: type, unitListDrawerVisible: true });
  };

  /**
   * 渲染
   */
  render() {
    const {
      fireListLoading,
      operation: {
        // unitList,
        unitLists,
        aggregationUnitLists,
        firePie,
        fireTrend,
        fireList,
        workOrderDetail, // 只有一个元素的数组
        maintenanceCompany: {
          name: maintenanceCompanys = [],
          PrincipalName = '', // 安全管理员
          PrincipalPhone = '', // 安全管理员电话
        },
        gasHistory,
        gasRealtimeData,
        gasTotal,
      },
      user: {
        currentUser: { unitName },
      },
      unitSafety: { points, phoneVisible },
      newUnitFireControl: { messageInformList },
      gasStation: { waterAlarmCount, waterHistory },
      messageInformListLoading,
    } = this.props;
    const {
      setttingModalVisible,
      selectList,
      searchValue,
      unitDetail,
      tooltipName,
      tooltipVisible,
      tooltipPosition,
      alarmIds,
      dateType,
      deviceType,
      fireListHasMore,
      fireStatisticsDrawerVisible,
      flowRepeat,
      fireFlowDrawerVisible,
      msgFlow,
      smokeFlowDrawerVisible,
      dynamicType,
      company = {},
      videoVisible,
      videoList,
      videoKeyId,
      // unitList,
      onekeyFlowDrawerVisible,
      unitListType,
      unitListDrawerVisible,
      waterItem,
      waterItemDrawerVisible,
      electricalFireMonitoringDetailDrawerVisible,
      electricalFireMonitoringDetailDrawerValue,
      electricalFireMonitoringDetailDrawerActiveKey,
      gasDrawerVisible,
      // showVideoList,
    } = this.state;
    const headProps = {
      ...workOrderDetail[0],
      dynamicType,
      onCameraClick: this.handleVideoOpen,
      ...company,
      videoList,
    };

    const unitList = unitLists[deviceType];
    const aggUnitList = aggregationUnitLists[deviceType];
    const handleCameraOpen = videoList && videoList.length ? this.handleVideoOpen : null;

    return (
      <BigPlatformLayout
        title="智慧消防运营驾驶舱"
        extra={unitName}
        style={{ backgroundImage: 'none' }}
        headerStyle={HEADER_STYLE}
        titleStyle={{ fontSize: 46 }}
        contentStyle={CONTENT_STYLE}
        // settable
        // onSet={this.handleClickSetButton}
      >
        {/* 地图 */}
        <BackMap
          deviceType={deviceType}
          // units={getUnitList(unitList, deviceType)}
          units={unitList}
          aggUnits={aggUnitList}
          unitLists={unitLists}
          aggUnitLists={aggregationUnitLists}
          handleMapClick={this.showUnitDetail}
          showTooltip={this.showTooltip}
          hideTooltip={this.hideTooltip}
          unitDetail={unitDetail}
          alarmIds={alarmIds}
          handleParentChange={this.handleMapParentChange}
          // handleAlarmClick={this.handleAlarmClick}
          // handleFaultClick={this.handleFaultClick}
          onRef={this.onRef}
          handleCompanyClick={this.handleCompanyClick}
          // fetchMapInfo={this.fetchMapInfo}
          handleDeviceTypeChange={this.handleDeviceTypeChange}
          showUnitListDrawer={this.showUnitListDrawer}
        />
        {/* 搜索框 */}
        <MapSearch
          cssType="1"
          style={MAP_SEARCH_STYLE}
          selectList={selectList}
          value={searchValue}
          keys={{ id: 'companyId', name: 'companyName' }}
          handleChange={this.handleMapSearchChange}
          handleSelect={this.showUnitDetail}
        />
        <div className={styles.leftContainer}>
          {/* 火警数量统计 */}
          <FireCount onClick={this.handleFireDrawerOpen} />
          {/* 维保任务统计 */}
          <TaskCount onClick={this.handleTaskDrawerOpen} />
        </div>
        <SettingModal
          visible={setttingModalVisible}
          handleOk={this.handleSettingOk}
          handleCancel={this.handleSettingCancel}
        />
        {/* 火警统计抽屉 */}
        <FireStatisticsDrawer
          dateType={dateType}
          loading={fireListLoading}
          hasMore={fireListHasMore}
          data={{ firePie, fireTrend, fireList }}
          visible={fireStatisticsDrawerVisible}
          getFirePie={this.getFirePie}
          getFireList={this.getFireList}
          handleDateTypeChange={this.handleDateTypeChange}
          handleClose={this.handleFireStatisticsDrawerClose}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <MyTooltip
          visible={tooltipVisible}
          title={tooltipName}
          position={tooltipPosition}
          offset={[15, 42]}
          style={{ zIndex: 150 }}
        />
        {/* 任务抽屉 */}
        <TaskDrawer
          visible={this.state.taskDrawerVisible}
          process={this.state.taskDrawerProcess}
          onClose={this.handleTaskDrawerClose}
          onJump={this.handleTaskCardClick}
        />
        {/* 实时消息 */}
        <Messages
          cssType="1"
          showCompanyInMsg
          className={styles.realTimeMessage}
          model={this.props.operation}
          phoneVisible={phoneVisible}
          typeClickList={TYPE_CLICK_LIST}
          showTypes={SHOW_TYPES}
          handleParentChange={this.handleMapParentChange}
          handleClickMsgFlow={this.handleClickMsgFlow}
          // handleViewDangerDetail={this.handleViewDangerDetail}
          // fetchData={this.fetchMaintenanceCheck}
          // handleClickMessage={this.handleClickMessage}
          // handleFaultClick={this.handleFaultClick}
          // handleWorkOrderCardClickMsg={this.handleWorkOrderCardClickMsg}
          // handleFireMessage={this.handleFireMessage}
          handleClickElecMsg={this.handleClickElecMsg}
          // handleClickSmoke={this.handleClickSmoke}
          handleClickWater={this.handleClickWater}
        />
        {/* 消防主机处理动态 */}
        <FireFlowDrawer
          data={workOrderDetail}
          flowRepeat={flowRepeat}
          visible={fireFlowDrawerVisible}
          handleParentChange={this.handleMapParentChange}
          onClose={() => this.handleDrawerVisibleChange('fireFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          msgFlow={msgFlow}
          phoneVisible={phoneVisible}
          headProps={headProps}
          messageInformList={messageInformList}
          messageInformListLoading={messageInformListLoading}
          head={true}
        />
        {/* 独立烟感处理动态 */}
        <SmokeFlowDrawer
          flowRepeat={flowRepeat}
          data={workOrderDetail}
          visible={smokeFlowDrawerVisible}
          handleParentChange={this.handleMapParentChange}
          onClose={() => this.handleDrawerVisibleChange('smokeFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          msgFlow={msgFlow}
          phoneVisible={phoneVisible}
          headProps={headProps}
          messageInformList={messageInformList}
          messageInformListLoading={messageInformListLoading}
          head={true}
        />
        {/* 一键报修处理动态 */}
        <OnekeyFlowDrawer
          data={workOrderDetail}
          visible={onekeyFlowDrawerVisible}
          handleParentChange={this.handleMapParentChange}
          onClose={() => this.handleDrawerVisibleChange('onekeyFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          phoneVisible={phoneVisible}
          headProps={headProps}
          messageInformList={messageInformList}
          messageInformListLoading={messageInformListLoading}
          head={true}
        />
        <GasDrawer
          monitorData={{ item: gasRealtimeData, history: gasHistory }}
          orderData={{ order: workOrderDetail, item: gasRealtimeData, phoneVisible, headProps, messageInformList, messageInformListLoading, gasTotal }}
          visible={gasDrawerVisible}
          handleCameraOpen={handleCameraOpen}
          fetchGasTotal={this.fetchGasTotal}
          onClose={() => this.handleDrawerVisibleChange('gas')}
        />
        <UnitListDrawer
          visible={unitListDrawerVisible}
          listType={unitListType}
          list={unitList}
          aggList={unitDetail && unitDetail.list ? unitDetail.list : []}
          deviceType={deviceType}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          showUnitDetail={this.showUnitDetail}
          handleCompanyClick={this.handleCompanyClick}
        />
        <ElectricalFireMonitoringDetailDrawer
          showCompany
          visible={electricalFireMonitoringDetailDrawerVisible}
          value={electricalFireMonitoringDetailDrawerValue}
          activeKey={electricalFireMonitoringDetailDrawerActiveKey}
          handleCameraOpen={handleCameraOpen}
          onClose={this.hideElectricalFireMonitoringDetailDrawer}
        />
        <WaterItemDrawer
          showCompany
          visible={waterItemDrawerVisible}
          fetchAlarmCount={this.fetchAlarmCount}
          handleCameraOpen={handleCameraOpen}
          handleClose={this.hdieWaterItemDrawer}
          data={{ item: waterItem, history: waterHistory, total: getWaterTotal(waterAlarmCount) }}
        />
        <VideoPlay
          showList={true}
          videoList={videoList}
          visible={videoVisible}
          keyId={videoKeyId}
          style={{ position: 'fixed', zIndex: 99999 }}
          handleVideoClose={this.handleVideoClose}
        />
      </BigPlatformLayout>
    );
  }
}
