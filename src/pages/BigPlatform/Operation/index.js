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
import { BackMap, SettingModal, FireStatisticsDrawer, Messages } from './sections/Components';
import {
  MapSearch,
  Tooltip as MyTooltip,
  TaskDrawer,
  TaskCount,
  FireCount,
} from './components/Components';
import { PAGE_SIZE, getUnitList } from './utils';
import iconFire from '@/assets/icon-fire-msg.png';
import iconFault from '@/assets/icon-fault-msg.png';
import FireFlowDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/FireFlowDrawer';
import SmokeFlowDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/SmokeFlowDrawer';

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
    title: '火警提示',
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

const switchMsgType = type => {
  const alarmTypes = [7, 38, 39];
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
  // 点位巡查抽屉是否显示
  pointInspectionDrawerVisible: false,
  maintenanceMsgDrawerVisible: false,
  alarmDynamicMsgDrawerVisible: false,
  fireAlarmVisible: false,
  maintenanceCheckDrawerVisible: false,
  smokeDrawerVisible: false,
  electricityDrawerVisible: false,
  resetHostsDrawerVisible: false,
  checksDrawerVisible: false,
  newWorkOrderDrawerVisible: false,
};

@connect(({ loading, operation, user, unitSafety }) => ({
  operation,
  user,
  unitSafety,
  loading: loading.models.operation,
  fireListLoading: loading.effects['operation/fetchFireList'],
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
      unitList: [], // 地图显示的企业列表
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
      videoList: [],
      videoKeyId: undefined,
      dynamicType: null,
      company: {},
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
        currentUser: { userId },
      },
    } = this.props;

    // 烟感地图数据
    this.fetchMapUnitList();
    // 获取实时消息
    this.fetchScreenMessage();

    const params = {
      companyId: userId,
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
        this.fetchStatistics();
        this.fetchMapUnitList(data.data.companyId);
        dispatch({
          type: 'operation/fetchWebsocketScreenMessage',
          payload: data,
          success: result => {
            // 显示火警障碍弹窗
            const {
              itemId,
              messageFlag,
              type,
              checkResult,
              pointId,
              pointStatus,
              deviceType,
              enterSign,
              isOver,
            } = result;

            if (
              type === 7 ||
              type === 9 ||
              type === 38 ||
              type === 39 ||
              type === 40 ||
              type === 41
            ) {
              if (+isOver === 0) {
                if (type === 7 || type === 9) {
                  if (enterSign === '1') this.showFireMsg(result);
                } else {
                  this.showFireMsg(result);
                }
              }
              this.fetchScreenMessage();
            }

            if (
              type === 1 ||
              type === 2 ||
              type === 3 ||
              type === 4 ||
              type === 9 ||
              type === 7 ||
              type === 21
            ) {
              // 获取消防主机监测
              // this.fetchFireAlarmSystem();
            }
          },
        });
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { operation: { unitList } } = this.props;
    const { deviceType } = this.state;
    const { operation: { unitList: prevUnitList } } = prevProps;
    const { deviceType: prevDeviceType } = prevState;
    if (unitList !== prevUnitList || deviceType !== prevDeviceType) {
      this.setState({ unitList: getUnitList(unitList, deviceType) });
    }
  }

  messageIds = [];
  messageTimers = [];
  messageCloseTimers = [];

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

  showUnitDetail = unitDetail => {
    // 地图显示某个企业详情
    if (!unitDetail) {
      return;
    }
    const { mapInstance } = this.state;
    const { longitude, latitude } = unitDetail;
    mapInstance.setZoomAndCenter(18, [longitude, latitude]);
    this.setState({ unitDetail });
    this.mapChild.handleMapClick(unitDetail);
    this.hideTooltip();
  };

  // hideUnitDetail = () => {
  //   // this.setState({ monitorDrawerVisible: false });
  // };

  // hideWarningNotification = ({ messageFlag, paramCode }) => {
  //   notification.close(`${messageFlag}_${paramCode}`);
  // };

  showFireMsg = item => {
    const { type, messageId, isOver } = item;
    if (type === 7 || type === 9 || type === 38 || type === 39 || type === 40 || type === 41) {
      if (+isOver === 0) {
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
      }
    }
  };

  closeNotification = id => {
    notification.close(id);
    const index = this.messageIds.indexOf(id);
    [this.messageIds, this.messageTimers, this.messageCloseTimers] = [this.messageIds, this.messageTimers, this.messageCloseTimers].map(list => list.filter((n, i) => i !== index));
  };

  closeExcessNotification = () => {
    if (this.messageIds.length <= NOTIFICATION_MAX)
      return;

    const [restId, restTimer, restCloseTimer] = [this.messageIds, this.messageTimers, this.messageCloseTimers].map(list => list[NOTIFICATION_MAX]);
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
      companyId,
      type,
      addTime,
      installAddress,
      unitTypeName,
      messageFlag,
      area,
      location,
      cameraMessage,
      isOver,
      count,
      num,
      newTime,
      lastTime,
      componentType,
      workOrder,
      systemTypeValue,
      createBy,
      createByPhone,
      faultName,
      firstTime,
      companyName,
      component,
    } = item;
    const msgItem = switchMsgType(+type);
    const repeat = {
      times: +isOver === 0 ? count : num,
      lastreportTime: addTime,
    };
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
      dataId: msgFlag,
      companyName: companyName || undefined,
      component: component || undefined,
      unitTypeName: unitTypeName || undefined,
      companyId: companyId || undefined,
    };
    return (
      <div
        className={styles1.notificationBody}
        onClick={() => {
          if (type === 7) this.handleClickMsgFlow(param, 0, 0, ...restParams);
          else if (type === 9) this.handleClickMsgFlow(param, 0, 1, ...restParams);
          else if (type === 38) this.handleClickMsgFlow(param, 1, 0, ...restParams);
          else if (type === 39) this.handleClickMsgFlow(param, 2, 0, ...restParams);
          else if (type === 40) this.handleClickMsgFlow(param, 1, 1, ...restParams);
          // if (type === 7 || type === 38 || type === 39) this.handleClickMessage(messageFlag, item);
          // else this.handleFaultClick({ ...item });
        }}
      >
        <div>
          <span className={styles1.time}>{moment(addTime).format('YYYY-MM-DD HH:mm')}</span>{' '}
          {/* <span className={styles.time}>{addTimeStr}</span>{' '} */}
          <span className={styles1.address}>{installAddress || area + location}</span>
        </div>
        {companyName && <div>【{companyName}】</div>}
        <div>
          {(type === 7 || type === 9) &&
            unitTypeName && (
              <span className={styles1.device} style={{ color: msgItem.color }}>
                【{unitTypeName}】
              </span>
            )}
          {(type === 38 || type === 39 || type === 40) && (
            <span className={styles1.device} style={{ color: msgItem.color }}>
              {type === 39 ? `【可燃气体探测器】` : `【独立烟感探测器】`}
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
    const { operation: { unitList } } = this.props;
    const { deviceType } = this.state;
    const list = getUnitList(unitList, deviceType);
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
      dispatch,
    } = this.props;
    const {
      company: {
        companyId,
      },
      videoList = [],
    } = this.state;
    // 如果后台没给绑定的视频列表，显示全部
    if (videoList && videoList.length) {
      this.setState({
        videoVisible: true,
        videoList,
        videoKeyId: videoList && videoList[0] && videoList[0].key_id,
      });
      return
    }
    dispatch({
      type: 'operation/fetchVideoList',
      payload: {
        company_id: companyId,
      },
      callback: (response) => {
        const { list = [] } = response || {};
        this.setState({
          videoVisible: true,
          videoList: list,
          videoKeyId: list && list[0] && list[0].key_id,
        });
      },
    });
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
      // callback: list => {
      //   this.setState({ unitList: list });
      // },
    });
  };

  handleFireDrawerOpen = dateType => {
    const dType = FIRE_DICT[dateType];
    this.setState({ fireStatisticsDrawerVisible: true, dateType: dType });
    this.getFirePie(dType);
    this.getFireTrend();
    this.getFireList();
  };

  getFirePie = dateType => {
    const { dispatch } = this.props;
    dispatch({ type: 'operation/fetchFirePie', payload: { type: dateType + 1 } });
  };

  getFireTrend = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'operation/fetchFireTrend' });
  };

  getFireList = ({ deviceType, fireType, searchValue } = {}, initial = true) => {
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
    console.log(data);
    const {
      id,
      companyName,
      companyId,
    } = data;
    // const param = {
    //   dataId: id,
    //   companyName: companyName || undefined,
    //   component: component || undefined,
    //   unitTypeName: unitTypeName || undefined,
    //   companyId: companyId || undefined,
    // };
    // type,
    // flow,
    // // repeat,
    // cameraMessage = [],
    // occurData,
    // cId,
    // this.handleClickMsgFlow();
  };

  handleDeviceTypeChange = (v, callback) => {
    const {
      operation: { unitList },
    } = this.props;
    const { unitDetail } = this.state;
    const list = getUnitList(unitList, v);
    this.setState({ deviceType: v });
    callback(!!list.find(({ companyId }) => companyId === unitDetail.companyId));
  };

  handleClickMsgFlow = (
    param,
    type,
    flow,
    // repeat,
    cameraMessage = [],
    occurData,
    cId,
  ) => {
    // type 0/1/2/3 主机/烟感/燃气/一键报修
    // flow 0/1 报警/故障

    const {
      dispatch,
      operation: { unitList },
    } = this.props;
    const drawerVisibles = [
      'fireFlowDrawerVisible',
      'smokeFlowDrawerVisible',
      'gasFlowDrawerVisible',
      'onekeyFlowDrawerVisible',
    ];
    const reportTypes = [1, 4, 3, 2];
    this.hiddeAllPopup();
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
            const { num, lastTime, firstTime } = res;
            dispatch({
              type: 'operation/saveWorkOrderDetail',
              payload: [{ ...occurData[0], firstTime, num, lastTime }],
            });
          } else {
            dispatch({
              type: 'operation/fetchWorkOrder',
              payload: { companyId: cId, reportType: reportTypes[type], ...param },
            });
          }
        },
      });
    } else {
      // 一键报修没有重复上报
      dispatch({
        type: 'newUnitFireControl/fetchWorkOrder',
        payload: { companyId: cId, reportType: reportTypes[type], ...param },
        callback: res => {
          if (!(res.data && Array.isArray(res.data.list))) return;
          if (res.data.list.length === 0) {
            dispatch({
              type: 'newUnitFireControl/saveWorkOrderDetail',
              payload: occurData,
            });
          }
        },
      });
    }
    // 企业负责人和运维员信息
    dispatch({
      type: 'operation/fetchMaintenanceCompany',
      payload: {
        companyId: param.companyId,
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
      [drawerVisibles[type]]: true,
      msgFlow: flow,
      dynamicType: type,
      company: { ...param },
      videoList: cameraMessage,
    });
    this.handleShowFireVideo(cameraMessage);

    const detail = unitList.find(({ companyId }) => companyId === cId);
    this.setState({ deviceType: type + 1 });
    this.showUnitDetail(detail);
    this.hideTooltip();
  };

  /**
   *  点击播放重点部位监控
   */
  handleShowFireVideo = videoList => {
    if (!Array.isArray(videoList) || videoList.length === 0) return null;
    this.setState({ fireVideoVisible: true });
  };

  /**
   * 渲染
   */
  render() {
    const {
      fireListLoading,
      operation: {
        // unitList,
        firePie,
        fireTrend,
        fireList,
      },
      user: {
        currentUser: { unitName },
      },
      operation: {
        workOrderDetail, // 只有一个元素的数组
        maintenanceCompany: {
          name: maintenanceCompanys = [],
          PrincipalName = '', // 安全管理员
          PrincipalPhone = '', // 安全管理员电话
        },
      },
      unitSafety: { points, phoneVisible },
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
      unitList,
    } = this.state;
    const headProps = {
      ...workOrderDetail[0],
      dynamicType,
      onCameraClick: this.handleVideoOpen,
      ...company,
    };
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
        />
        {/* 搜索框 */}
        <MapSearch
          className={styles.mapSearch}
          style={MAP_SEARCH_STYLE}
          selectList={selectList}
          value={searchValue}
          handleChange={this.handleMapSearchChange}
          handleSelect={this.showUnitDetail}
        />
        <div className={styles.leftContainer}>
          {/* 火警数量统计 */}
          <FireCount onClick={this.handleFireDrawerOpen} />
          {/* 运维任务统计 */}
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
          className={styles.realTimeMessage}
          model={this.props.operation}
          handleParentChange={this.handleMapParentChange}
          handleClickMsgFlow={this.handleClickMsgFlow}
          phoneVisible={phoneVisible}
        />
        {/* 消防主机处理动态 */}
        <FireFlowDrawer
          // data={occurData}
          data={workOrderDetail}
          flowRepeat={flowRepeat}
          // fireData={occurData}
          // faultData={occurData}
          visible={fireFlowDrawerVisible}
          handleParentChange={this.handleMapParentChange}
          onClose={() => this.handleDrawerVisibleChange('fireFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          msgFlow={msgFlow}
          phoneVisible={phoneVisible}
          headProps={headProps}
          head={true}
        />
        {/* 独立烟感处理动态 */}
        <SmokeFlowDrawer
          // data={occurData}
          flowRepeat={flowRepeat}
          data={workOrderDetail}
          // fireData={occurData}
          // faultData={occurData}
          visible={smokeFlowDrawerVisible}
          handleParentChange={this.handleMapParentChange}
          onClose={() => this.handleDrawerVisibleChange('smokeFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          msgFlow={msgFlow}
          phoneVisible={phoneVisible}
          headProps={headProps}
          head={true}
        />
        <VideoPlay
          showList={false}
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
