import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { notification, Tooltip } from 'antd';
import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import VideoSurveillance from './VideoSurveillance';
// import VideoPlay from '../NewFireControl/section/VideoPlay';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import PointInspectionCount from './PointInspectionCount';
import CompanyInfo from './CompanyInfo';
import Messages from './Messages';
import MaintenanceCount from './MaintenanceCount';
import FourColor from './FourColor';
import { findFirstVideo } from '@/utils/utils';

import styles from './index.less';

import FireMonitoring from './Section/FireMonitoring';
import FireDevice from './Section/FireDevice';
import RiskDrawer from './Section/RiskDrawer';
import WorkOrderDrawer from './Section/WorkOrderDrawer';
import AlarmDynamicDrawer from './Section/AlarmDynamicDrawer';
import CurrentHiddenDanger from './Section/CurrentHiddenDanger';
import DrawerHiddenDangerDetail from './Section/DrawerHiddenDangerDetail';
import PointPositionName from './Section/PointPositionName';
import CheckingDrawer from './Section/CheckingDrawer';
import PointInspectionDrawer from './PointInspectionDrawer';
import MaintenanceDrawer from './Section/MaintenanceDrawer';
import DrawerOfFireAlarm from './Section/DrawerOfFireAlarm';
import MaintenanceCheckDrawer from './Section/MaintenanceCheckDrawer';
import FaultMessageDrawer from './Section/FaultMessageDrawer';
import MaintenanceMsgDrawer from './Section/MaintenanceMsgDrawer';
import AlarmDynamicMsgDrawer from './Section/AlarmDynamicMsgDrawer';
import WaterSystemDrawer from './Section/WaterSystemDrawer';
import SmokeMonitor from './Section/SmokeMonitor';
import ElectricityMonitor from './Section/ElectricityMonitor';
import WaterMonitor from './Section/WaterMonitor';
import CheckWorkOrder from './Section/CheckWorkOrder';
import SmokeDrawer from './Section/SmokeDrawer';
import ElectricityDrawer from './Section/ElectricityDrawer';
import ResetHostsDrawer from './Section/ResetHostsDrawer';
import CheckDrawer from './Section/CheckDrawer';
import NewWorkOrderDrawer from './Section/NewWorkOrderDrawer';
import { Rotate } from 'react-transform-components';
import StatisticsOfFireControl from './Section/StatisticsOfFireControl';
import FireFlowDrawer from './Section/FireFlowDrawer';
import OnekeyFlowDrawer from './Section/OnekeyFlowDrawer';
import SmokeFlowDrawer from './Section/SmokeFlowDrawer';
import GasFlowDrawer from './Section/GasFlowDrawer';
import { SetDrawer } from '../Safety/Company3/components';

import iconFire from '@/assets/icon-fire-msg.png';
import iconFault from '@/assets/icon-fault-msg.png';
import headerBg from '@/assets/new-header-bg.png';
import videoBtn from '../Monitor/imgs/videoBtn.png';

const { projectName } = global.PROJECT_CONFIG;
// const DELAY = 5 * 1000;
// const CHART_DELAY = 10 * 60 * 1000;

notification.config({
  placement: 'bottomLeft',
  duration: null,
  bottom: 8,
});

const msgInfo = [
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
  if (alarmTypes.indexOf(type) >= 0) return msgInfo[0];
  else if (faultTypes.indexOf(type) >= 0) return msgInfo[1];
};

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
  fireFlowDrawerVisible: false,
  smokeFlowDrawerVisible: false,
  onekeyFlowDrawerVisible: false,
  gasFlowDrawerVisible: false,
  setDrawerVisible: false,
};
/**
 * description: 新企业消防
 * author:
 * date: 2018年12月03日
 */
@connect(
  ({
    newUnitFireControl,
    monitor,
    loading,
    smoke,
    electricityMonitor,
    bigPlatform,
    unitFireControl,
    unitSafety,
  }) => ({
    newUnitFireControl,
    monitor,
    loading: loading.models.newUnitFireControl,
    smoke,
    electricityMonitor,
    bigPlatform,
    unitFireControl,
    unitSafety,
    warnDetailLoading: loading.effects['newUnitFireControl/fetchWarnDetail'],
    faultDetailLoading: loading.effects['newUnitFireControl/fetchFaultDetail'],
  })
)
export default class NewUnitFireControl extends PureComponent {
  state = {
    videoVisible: false, // 重点部位监控视频弹窗
    showVideoList: false, // 是否展示视频弹窗右侧列表
    videoKeyId: undefined,
    riskDrawerVisible: false, // 是否显示对应弹框
    // 1 已完成   2 待处理   7 已超期
    drawerType: 7,
    workOrderDrawerVisible: false,
    alarmMessageDrawerVisible: false,
    faultMessage: {},
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
    // 点位巡查抽屉的选中时间
    pointInspectionDrawerSelectedDate: moment().format('YYYY-MM-DD'),
    // 四色图贴士
    fourColorTips: {},
    // 四色图贴士对应的已删除id
    deletedFourColorTips: [],
    fireAlarmVisible: false, // 火灾自动报警抽屉可见
    // 检查点Id
    checkItemId: '',
    // 检查点对应状态
    checkStatus: '',
    // 检查点对应名称
    checkPointName: '',
    maintenanceCheckDrawerVisible: false,
    fireAlarmTitle: '',
    maintenanceTitle: '维保处理动态',
    processIds: [],
    fireProcessIds: [],
    waterSystemDrawerVisible: false, // 水系统抽屉是否显示
    waterTabItem: '',
    // 最新一条隐患id
    latestHiddenDangerId: undefined,
    videoList: [],
    fireVideoVisible: false,
    fireVideoKeyId: '',
    waterTab: '101',
    smokeDrawerVisible: false,
    filterIndex: 0,
    electricityDrawerVisible: false,
    resetHostsDrawerVisible: false,
    checksDrawerVisible: false,
    newWorkOrderDrawerVisible: false,
    workOrderType: 0,
    workOrderStatus: 0,
    fireMonitorIndex: 0,
    fireControlType: 1,
    occurData: [],
    fireFlowDrawerVisible: false,
    smokeFlowDrawerVisible: false,
    onekeyFlowDrawerVisible: false,
    gasFlowDrawerVisible: false,
    msgFlow: 0, // 0报警 1故障
    setDrawerVisible: false,
    flowRepeat: {
      times: 0,
      lastreportTime: 0,
    },
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;

    const { checkItemId, waterTab } = this.state;

    const { NanXiaoWebsocket: ws } = global;
    if (!ws) return;
    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data);
        dispatch({
          type: 'newUnitFireControl/fetchWebsocketScreenMessage',
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
              isOver,
              enterSign,
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
              this.fetchScreenMessage(dispatch, companyId);
            }

            if (type === 38 || type === 40) {
              // 烟感列表
              dispatch({
                type: 'smoke/fetchCompanySmokeInfo',
                payload: {
                  company_id: companyId,
                },
              });
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
              this.fetchFireAlarmSystem();
            }

            if (type === 14 || type === 15 || type === 16 || type === 17) {
              // 更新当前隐患总数
              dispatch({
                type: 'newUnitFireControl/fetchHiddenDangerNum',
                payload: { companyId },
              });
            }

            if (type === 44 || type === 32 || type === 42 || type === 43) {
              // 电气火灾监测
              dispatch({
                type: 'electricityMonitor/fetchDeviceStatusCount',
                payload: { companyId },
              });
              this.getDeviceRealTimeData(this.elecDrawerDeviceId);
              this.handleFetchRealTimeData(this.elecMonitorDeviceId);
            }

            // 获取水系统---消火栓系统
            if (type === 36 || type === 37 || type === 48 || type === 49) {
              // 36 水系统报警 37 水系统报警恢复 48水系统失联 49 水系统失联恢复
              if (+deviceType === +waterTab) this.fetchWaterSystem(deviceType);
              if (this.state.waterSystemDrawerVisible) {
                dispatch({
                  type: 'newUnitFireControl/fetchWaterDrawer',
                  payload: {
                    companyId,
                    type: [101, 102, 103][this.state.waterTabItem],
                  },
                });
              }
              // dispatch({
              //   type: 'newUnitFireControl/fetchWaterAlarm',
              //   payload: {
              //     companyId,
              //   },
              // });
            }

            if (type === 38 || type === 40 || type === 46 || type === 47 || type === 50) {
              // 烟感列表
              dispatch({
                type: 'smoke/fetchCompanySmokeInfo',
                payload: {
                  company_id: companyId,
                },
              });
            }

            // if (type === 18) {
            //   // 获取消防设施评分
            //   dispatch({
            //     type: 'newUnitFireControl/fetchSystemScore',
            //     payload: {
            //       companyId,
            //     },
            //   });
            //   if (this.state.fireAlarmVisible) this.fetchViewFireAlarm();
            // }

            // 四色图隐患
            const { fourColorTips, deletedFourColorTips } = this.state;
            // 如果最新一条数据为隐患，并且为首次出现，则对应点位显示隐患提示
            if (type === 14 && deletedFourColorTips.indexOf(messageFlag) === -1) {
              // 如果前一条隐患还没消失，则移除前一条隐患
              if (fourColorTips[itemId] === messageFlag) {
                return;
              } else if (fourColorTips[itemId]) {
                this.setState({
                  fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
                  latestHiddenDangerId: itemId,
                  deletedFourColorTips: deletedFourColorTips.concat(fourColorTips[itemId]),
                });
              } else {
                this.setState({
                  fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
                  latestHiddenDangerId: itemId,
                });
              }
            }

            if (type === 14) {
              // 获取点位
              dispatch({
                type: 'newUnitFireControl/fetchPointList',
                payload: {
                  companyId,
                },
              });

              // 获取当前隐患列表
              dispatch({
                type: 'newUnitFireControl/fetchCurrentHiddenDanger',
                payload: {
                  company_id: companyId,
                  businessType: 2,
                },
              });

              //获取巡查记录
              dispatch({
                type: 'newUnitFireControl/fetchPointRecord',
                payload: {
                  itemId: checkItemId,
                  item_type: 2,
                },
              });
            }
            if (type === 15 || type === 16 || type === 17) {
              if (fourColorTips[pointId] === messageFlag)
                this.removeFourColorTip(pointId, messageFlag);
              // 获取点位
              dispatch({
                type: 'newUnitFireControl/fetchPointList',
                payload: {
                  companyId,
                },
              });

              // 获取当前隐患列表
              dispatch({
                type: 'newUnitFireControl/fetchCurrentHiddenDanger',
                payload: {
                  company_id: companyId,
                  businessType: 2,
                },
              });

              //获取巡查记录
              dispatch({
                type: 'newUnitFireControl/fetchPointRecord',
                payload: {
                  itemId: checkItemId,
                  item_type: 2,
                },
              });
            }
            if (type === 13) {
              // 获取点位
              dispatch({
                type: 'newUnitFireControl/fetchPointList',
                payload: {
                  companyId,
                },
              });

              // 获取当前隐患列表
              dispatch({
                type: 'newUnitFireControl/fetchCurrentHiddenDanger',
                payload: {
                  company_id: companyId,
                  businessType: 2,
                },
              });

              //获取巡查记录
              dispatch({
                type: 'newUnitFireControl/fetchPointRecord',
                payload: {
                  itemId: checkItemId,
                  item_type: 2,
                },
              });
              if (checkResult === '无隐患') this.removeFourColorTip2(pointId);
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

    // 获取企业信息
    dispatch({
      type: 'newUnitFireControl/fetchCompanyMessage',
      payload: {
        company_id: companyId,
        type: '2',
        month: moment().format('YYYY-MM'),
      },
    });

    // 获取视频列表
    dispatch({
      type: 'newUnitFireControl/fetchVideoList',
      payload: { company_id: companyId },
    });

    // // 获取点位信息
    // dispatch({
    //   type: 'newUnitFireControl/fetchRiskPointInfo',
    //   payload: { company_id: companyId },
    // });

    // 获取消防主机监测
    this.fetchFireAlarmSystem();
    // 获取消防设施评分
    // dispatch({
    //   type: 'newUnitFireControl/fetchSystemScore',
    //   payload: {
    //     companyId,
    //   },
    // });

    // 获取隐患详情
    // dispatch({
    //   type: 'newUnitFireControl/fetchRiskDetail',
    //   payload: {
    //     company_id: companyId,
    //   },
    // });

    // 获取警情动态详情及历史
    [0, 1].forEach(i => this.handleFetchAlarmHandle(0, i));

    // 初始化维保工单
    // this.handleFetchAllWorkOrder();

    // 获取故障
    dispatch({ type: 'newUnitFireControl/fetchFault', payload: { companyId } });

    // 获取当前隐患图表统计数据
    dispatch({
      type: 'newUnitFireControl/fetchHiddenDangerNum',
      payload: { companyId },
    });

    // 获取当前隐患列表
    dispatch({
      type: 'newUnitFireControl/fetchCurrentHiddenDanger',
      payload: {
        company_id: companyId,
        businessType: 2,
      },
    });
    // 获取点位巡查统计
    dispatch({
      type: 'newUnitFireControl/fetchPointInspectionCount',
      payload: {
        companyId,
      },
    });
    // 获取大屏消息
    // this.fetchScreenMessage(dispatch, companyId);

    dispatch({
      type: 'newUnitFireControl/fetchScreenMessage',
      payload: {
        companyId,
      },
      success: res => {
        const {
          list: [{ itemId, messageFlag, type } = {}],
        } = res;
        const { fourColorTips, deletedFourColorTips } = this.state;
        // 如果最新一条数据为隐患，并且为首次出现，则对应点位显示隐患提示
        if (type === 14 && deletedFourColorTips.indexOf(messageFlag) === -1) {
          if (fourColorTips[itemId] === messageFlag) {
            return;
          }
          // 如果前一条隐患还没消失，则移除前一条隐患
          else if (fourColorTips[itemId]) {
            this.setState({
              fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
              latestHiddenDangerId: itemId,
              deletedFourColorTips: deletedFourColorTips.concat(fourColorTips[itemId]),
            });
          } else {
            this.setState({
              fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
              latestHiddenDangerId: itemId,
            });
          }
        }

        // 记录最新的一条消息id
        this.topId = res.list[0] ? res.list[0].messageId : undefined;
      },
    });

    // 获取点位
    dispatch({
      type: 'newUnitFireControl/fetchPointList',
      payload: {
        companyId,
      },
    });

    // 企业负责人和维保员信息
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceCompany',
      payload: {
        companyId,
      },
    });
    // 获取点位巡查列表
    this.fetchPointInspectionList();

    // 轮询
    // this.pollTimer = setInterval(this.polling, DELAY);
    // this.chartPollTimer = setInterval(this.chartPolling, CHART_DELAY);
    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
    dispatch({ type: 'monitor/fetchCameraTree', payload: { company_id: companyId } });

    this.fetchWaterSystem('101');

    // 烟感列表
    dispatch({
      type: 'smoke/fetchCompanySmokeInfo',
      payload: {
        company_id: companyId,
      },
    });
    // 电气火灾监测
    dispatch({
      type: 'electricityMonitor/fetchDeviceStatusCount',
      payload: { companyId },
    });
    dispatch({
      type: 'electricityMonitor/fetchDevices',
      payload: {
        companyId,
        type: 1,
      },
      callback: ([data]) => {
        if (data) {
          const { deviceId } = data;
          this.handleFetchRealTimeData(deviceId);
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
    [1, 2, 3, 4].forEach(item => {
      // 巡查数量 1 正常,2 异常,3 待检查，4 已超时
      dispatch({
        type: 'bigPlatform/fetchCoItemList',
        payload: {
          company_id: companyId,
          status: item,
        },
      });
    });
    // 烟感视频？
    dispatch({ type: 'smoke/fetchCameraTree', payload: { company_id: companyId } });
    // 获取主机列表
    dispatch({
      type: 'unitFireControl/fetchHosts',
      payload: {
        companyId,
      },
    });

    // 安全巡查
    dispatch({ type: 'unitSafety/fetchPoints', payload: { companyId } });

    // 处理工单统计
    dispatch({ type: 'newUnitFireControl/fetchCountAllFireAndFault', payload: { companyId } });

    // 获取消防数据统计
    dispatch({
      type: 'unitFireControl/fetchFireControlCount',
      payload: {
        companyId,
        t: 1,
      },
    });

    // 手机号是否可见
    dispatch({ type: 'unitSafety/savePhoneVisible' });
  }

  handleFetchRealTimeData = deviceId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceRealTimeDataMonitor',
      payload: { deviceId },
    });
    this.elecMonitorDeviceId = deviceId;
  };

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
          className: styles.notification,
          message: this.renderNotificationTitle(item),
          description: this.renderNotificationMsg(item),
          style: this.fireNode ? { ...style, width: this.fireNode.clientWidth - 8 } : { ...style },
        };
        notification.open({
          ...options,
        });

        setTimeout(() => {
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
                notification.close(messageId);
              }, 200);
            },
          });
        }, 800);
      }
    }
  };

  renderNotificationTitle = item => {
    const { type } = item;
    const msgItem = switchMsgType(+type);
    return (
      <div className={styles.notificationTitle} style={{ color: msgItem.color }}>
        <span className={styles.iconFire}>
          <img src={msgItem.icon} alt="fire" />
        </span>
        {msgItem.title}
      </div>
    );
  };

  renderNotificationMsg = item => {
    const {
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
    const msgFlag = messageFlag[0] === '[' ? JSON.parse(messageFlag)[0] : messageFlag;
    const restParams = [repeat, cameraMessage, occurData];
    const param = { dataId: msgFlag };
    return (
      <div
        className={styles.notificationBody}
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
          <span className={styles.time}>{moment(addTime).format('YYYY-MM-DD HH:mm')}</span>{' '}
          {/* <span className={styles.time}>{addTimeStr}</span>{' '} */}
          <span className={styles.address}>{installAddress || area + location}</span>
        </div>
        <div>
          {(type === 7 || type === 9) &&
            unitTypeName && (
              <span className={styles.device} style={{ color: msgItem.color }}>
                【{unitTypeName}】
              </span>
            )}
          {(type === 38 || type === 39 || type === 40) && (
            <span className={styles.device} style={{ color: msgItem.color }}>
              {type === 39 ? `【可燃气体探测器】` : `【独立烟感探测器】`}
            </span>
          )}
          {msgItem.body}
        </div>
        <div>{msgItem.bottom}</div>
      </div>
    );
  };

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
        params: { unitId: companyId },
      },
    } = this.props;
    const { checkItemId } = this.state;
    // 获取消防主机监测
    this.fetchFireAlarmSystem();

    // 获取消防设施评分
    // dispatch({
    //   type: 'newUnitFireControl/fetchSystemScore',
    //   payload: {
    //     companyId,
    //   },
    // });

    // 获取当前隐患列表
    dispatch({
      type: 'newUnitFireControl/fetchHiddenDangerNum',
      payload: { companyId },
    });

    // 获取企业信息
    dispatch({
      type: 'newUnitFireControl/fetchCompanyMessage',
      payload: {
        company_id: companyId,
        type: '2',
        month: moment().format('YYYY-MM'),
      },
    });

    // 获取所有工单
    this.handleFetchAllWorkOrder();

    // 获取大屏消息
    this.fetchScreenMessage(dispatch, companyId);

    // 获取点位
    dispatch({
      type: 'newUnitFireControl/fetchPointList',
      payload: {
        companyId,
      },
    });

    // 获取当前隐患列表
    dispatch({
      type: 'newUnitFireControl/fetchCurrentHiddenDanger',
      payload: {
        company_id: companyId,
        businessType: 2,
      },
    });

    //获取巡查记录
    dispatch({
      type: 'newUnitFireControl/fetchPointRecord',
      payload: {
        itemId: checkItemId,
        item_type: 2,
      },
    });

    // 获取水系统---消火栓系统
    this.fetchWaterSystem('101');
  };

  // 获取水系统
  fetchWaterSystem = type => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({ waterTab: type });
    dispatch({
      type: 'newUnitFireControl/fetchWaterSystem',
      payload: {
        companyId,
        type,
      },
    });
    // dispatch({
    //   type: 'newUnitFireControl/fetchWaterAlarm',
    //   payload: {
    //     companyId,
    //   },
    // });
  };
  /**
   * 获取点位巡查列表
   */
  fetchPointInspectionList = (date = this.state.pointInspectionDrawerSelectedDate) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchPointInspectionList',
      payload: {
        companyId,
        date,
      },
    });
  };

  fetchMaintenanceCheck = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceDetail',
      payload: {
        id,
      },
    });
  };

  /**
   * 获取大屏消息
   */
  fetchScreenMessage = (dispatch, companyId) => {
    dispatch({
      type: 'newUnitFireControl/fetchScreenMessage',
      payload: {
        companyId,
      },
      success: res => {
        const {
          list: [{ itemId, messageFlag, type } = {}],
        } = res;
        const { fourColorTips, deletedFourColorTips } = this.state;
        // 如果最新一条数据为隐患，并且为首次出现，则对应点位显示隐患提示
        if (type === 14 && deletedFourColorTips.indexOf(messageFlag) === -1) {
          // 如果前一条隐患还没消失，则移除前一条隐患
          if (fourColorTips[itemId] === messageFlag) {
            return;
          } else if (fourColorTips[itemId]) {
            this.setState({
              fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
              deletedFourColorTips: deletedFourColorTips.concat(fourColorTips[itemId]),
            });
          } else {
            this.setState({
              fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
            });
          }
        }

        // let sameIndex = -1;
        // res.list.forEach((item, index) => {
        //   if (item.messageId === this.topId) {
        //     sameIndex = index;
        //     return;
        //   }
        // });
        // 截取新的消息列表
        // const newMsg = sameIndex < 0 ? res.list : res.list.slice(0, sameIndex);
        // newMsg.forEach(data => {
        //   this.showFireMsg(data);
        // });
        this.topId = res.list[0] ? res.list[0].messageId : undefined;
      },
    });
  };

  /**
   * 移除四色图隐患提示
   */
  removeFourColorTip = (id, hiddenDangerId) => {
    const { fourColorTips, deletedFourColorTips } = this.state;
    // 删除对应的tip，将隐患id存放到删除列表中
    this.setState({
      fourColorTips: { ...fourColorTips, [id]: undefined },
      deletedFourColorTips: deletedFourColorTips.concat(hiddenDangerId),
    });
  };

  /**
   * 移除四色图隐患提示
   */
  removeFourColorTip2 = id => {
    const { fourColorTips, deletedFourColorTips } = this.state;
    // 删除对应的tip，将隐患id存放到删除列表中
    this.setState({
      deletedFourColorTips: deletedFourColorTips.concat(fourColorTips[id]),
      fourColorTips: { ...fourColorTips, [id]: undefined },
    });
  };

  /**
   *  点击播放重点部位监控
   */
  handleShowVideo = (keyId, showList = true) => {
    this.setState({ videoVisible: true, videoKeyId: keyId, showVideoList: showList });
  };

  /**
   *  点击播放重点部位监控
   */
  handleShowFireVideo = videoList => {
    if (!Array.isArray(videoList) || videoList.length === 0) return null;
    this.setState({ fireVideoVisible: true, videoList });
  };

  /**
   *  关闭重点部位监控
   */
  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: undefined });
  };

  /**
   *  关闭视频监控
   */
  handleFireVideoClose = () => {
    this.setState({ fireVideoVisible: false, fireVideoKeyId: undefined, videoList: [] });
  };

  /**
   * 7:已超期工单,2:未超期工单,1:已完成工单
   */
  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  /**
   * 关闭当前隐患抽屉
   */
  handleCloseCurrentDrawer = () => {
    this.setState({ currentDrawerVisible: false });
  };

  /**
   * 关闭隐患详情
   */
  handleCloseDetailOfDanger = () => {
    this.setState({ dangerDetailVisible: false });
  };

  /**
   * 打开查看当前隐患抽屉
   */
  handleViewCurrentDanger = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取当前隐患图表统计数据
    dispatch({
      type: 'newUnitFireControl/fetchHiddenDangerNum',
      payload: { companyId },
    });

    // 获取当前隐患列表
    dispatch({
      type: 'newUnitFireControl/fetchCurrentHiddenDanger',
      payload: {
        company_id: companyId,
        businessType: 2,
      },
    });
    this.setState({ currentDrawerVisible: true });
  };

  /**
   * 打开检查点抽屉
   */
  handleCheckDrawer = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取检查点列表
    dispatch({
      type: 'newUnitFireControl/fetchCheckDetail',
      payload: {
        companyId,
        item_type: 2,
      },
    });
    // 获取当前隐患列表
    dispatch({
      type: 'newUnitFireControl/fetchCurrentHiddenDanger',
      payload: {
        company_id: companyId,
        businessType: 2,
      },
    });
    this.setState({ checkDrawerVisible: true });
  };
  /**
   * 查看点位名称
   * */
  handlePointDrawer = pointData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchPointRecord',
      payload: {
        itemId: pointData.item_id,
        item_type: 2,
      },
    });
    this.setState({
      pointDrawerVisible: true,
      checkStatus: pointData.status,
      checkItemId: pointData.item_id,
      checkPointName: pointData.object_title,
    });
  };

  //获取巡查记录
  handlePointRecordList = checkItemId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchPointRecord',
      payload: {
        itemId: checkItemId,
        item_type: 2,
      },
    });
  };

  // 点击查看隐患详情
  handleViewDangerDetail = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchHiddenDangerDetail',
      payload: { id: data.id },
    });
    this.setState({
      dangerDetailVisible: true,
    });
  };
  /**
   * 修改点位巡查抽屉选中时间
   */
  handleChangePointInspectionDrawerSelectedDate = date => {
    this.setState({ pointInspectionDrawerSelectedDate: date });
    this.fetchPointInspectionList(date);
  };

  handleFetchAlarmHandle = (dataId, historyType, callback) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;

    dispatch({
      type: 'newUnitFireControl/fetchAlarmHandle',
      payload: { companyId, dataId, historyType },
      callback,
    });
  };

  // 获取维保工单或维保动态详情
  handleFetchWorkOrder = (status, id) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchWorkOrder',
      payload: { companyId, id, status, except: 3 },
    });
  };

  handleFetchAllWorkOrder = () => {
    [1, 2, 7].forEach(s => this.handleFetchWorkOrder(s));
  };

  handleWorkOrderLabelChange = type => {
    this.setState({ drawerType: type });
  };

  handleWorkOrderCardClick = item => {
    const { id, type, data_id } = item;
    const isFire = +type === 1 || +type === 2;
    if (!isFire) {
      this.handleDrawerVisibleChange('maintenance');
      this.handleFetchWorkOrder(undefined, id);
    } else {
      this.handleDrawerVisibleChange('alarmMessage');
      this.handleFetchAlarmHandle(data_id);
    }
  };

  handleWorkOrderCardClickMsg = ids => {
    this.handleDrawerVisibleChange('maintenanceMsg');
    this.setState({ processIds: ids });
    this.fetchFaultDetail(ids[0]);
  };

  fetchFaultDetail = id => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceMsg',
      payload: { companyId, id },
    });
  };

  handleShowAlarm = e => {
    this.handleFetchAlarmHandle(0, 0, res => {
      const {
        data: {
          list: [{ cameraMessage }, ...rest],
        },
      } = res;
      this.handleShowFireVideo(cameraMessage);
    });
    this.setState({ alarmDynamicDrawerVisible: true });
    // this.handleShowVideo(allCamera.length ? allCamera[0].key_id : '', true);
  };

  handleShowAlarmHistory = e => {
    this.handleFetchAlarmHandle(0, 1);
    this.handleDrawerVisibleChange('alarmHistory');
  };

  handleShowFault = e => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;

    dispatch({
      type: 'newUnitFireControl/fetchFault',
      payload: { companyId },
      callback: res => {
        const {
          data: {
            list: [{ cameraMessage }, ...rest],
          },
        } = res;
        this.handleShowFireVideo(cameraMessage);
      },
    });
    this.handleDrawerVisibleChange('fault');
  };

  handleClickMessage = (dataId, msg) => {
    // const {
    //   monitor: { allCamera },
    // } = this.props;
    const { cameraMessage } = msg;
    this.hiddeAllPopup();
    this.handleFetchAlarmHandle(dataId);
    this.setState({ alarmMessageDrawerVisible: true });
    // this.handleShowVideo(allCamera.length ? allCamera[0].key_id : '', true);
    this.handleShowFireVideo(cameraMessage);
  };

  handleFireMessage = processIds => {
    this.setState({ fireProcessIds: processIds });
    this.handleFetchDataId(processIds[0], res => {
      if (!res.data) return;
      const {
        data: { dataId },
      } = res;
      this.handleFetchAlarmHandle(dataId);
      this.setState({ alarmDynamicMsgDrawerVisible: true });
    });
  };

  handleFetchDataId = (processId, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchDataId',
      payload: { id: processId },
      success: callback,
    });
  };

  handleFaultClick = data => {
    const { cameraMessage, messageFlag } = data;
    this.hiddeAllPopup();
    // this.setState({ faultMessage: data, faultMessageDrawerVisible: true });
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceMsg',
      payload: { dataId: messageFlag, companyId },
      callback: res => {
        if (!res.data.list.length) {
          this.setState({ faultMessage: data, faultMessageDrawerVisible: true });
          return;
        }
        this.setState({
          maintenanceTitle: '故障处理动态',
          processIds: res.data.list.map(item => item.id),
        });
        this.handleDrawerVisibleChange('maintenanceMsg');
        this.handleShowFireVideo(cameraMessage);
      },
    });
  };

  hiddeAllPopup = () => {
    this.setState({ ...popupVisible });
  };

  // 点击当前隐患图表进行筛选
  handleFilterCurrentDanger = ({ dataIndex }, callback = null) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取当前隐患列表
    dispatch({
      type: 'newUnitFireControl/fetchCurrentHiddenDanger',
      payload: {
        company_id: companyId,
        businessType: 2,
        status:
          (dataIndex === 0 && '7') || (dataIndex === 1 && '2') || (dataIndex === 2 && '3') || null,
      },
      callback,
    });
  };

  // 关闭火灾自动报警抽屉
  handleCloseFireAlarm = () => {
    this.setState({
      fireAlarmVisible: false,
    });
  };

  // 查看火灾自动报警抽屉
  handleViewFireAlarm = ({ sysId, sysName }) => {
    this.fetchViewFireAlarm(sysId);
    this.setState({
      fireAlarmVisible: true,
      fireAlarmTitle: sysName,
      sysId,
    });
  };

  fetchViewFireAlarm = systemId => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { sysId } = this.state;
    dispatch({
      type: 'newUnitFireControl/fetchCheckRecord',
      payload: {
        pageNum: 1,
        pageSize: 10,
        sysId: systemId || sysId,
        companyId,
      },
    });
  };

  handleViewWater = (i, type) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({
      waterSystemDrawerVisible: true,
      waterTabItem: i,
    });

    dispatch({
      type: 'newUnitFireControl/fetchWaterSystem',
      payload: {
        companyId,
        type: type,
      },
    });
  };

  handleCloseWater = () => {
    this.setState({
      waterSystemDrawerVisible: false,
    });
  };

  handleParentChange = newState => {
    this.setState({ ...newState });
  };

  handlePlay = (list, callback) => {
    const MediaPlayUrls = list.map(({ rtsp_address, name }) => ({
      videoUrl: rtsp_address,
      videoName: name,
    }));
    // const MediaPlayUrls = [{"videoUrl":"rtsp://admin:12345@192.168.16.250:554/h264/ch7/sub/av_stream","videoName":"视频1"},{"videoUrl":"rtsp://admin:12345@192.168.16.250:554/h264/ch7/sub/av_stream","videoName":"视频2"}];
    const url = 'ws://localhost:10035/test';
    const ws = new WebSocket(url);
    ws.onopen = () => {
      ws.send(JSON.stringify({ MediaPlayUrls }));
    };

    ws.onmessage = e => {
      console.log(e.data);
      ws.close();
    };

    ws.onerror = () => {
      console.log('error');
      callback();
      ws.close();
    };

    ws.onclose = () => {
      console.log('close');
    };
  };

  handleClickSmoke = index => {
    this.setState({ smokeDrawerVisible: true, filterIndex: index });
  };

  handleClickWater = (index, typeIndex) => {
    const { waterTabItem } = this.state;
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchWaterDrawer',
      payload: {
        companyId,
        type: [101, 102, 103][typeIndex],
      },
      callback: () => {
        this.setState({
          waterSystemDrawerVisible: true,
          filterIndex: index,
          waterTabItem: typeIndex || typeIndex === 0 ? typeIndex : waterTabItem,
        });
      },
    });
  };

  handleClickElectricity = (index, deviceId) => {
    this.setState({ electricityDrawerVisible: true, filterIndex: index });
    deviceId && this.handleSelectDevice(deviceId);
  };

  handleClickCheck = index => {
    this.setState({ checksDrawerVisible: true, filterIndex: index });
  };

  handleClickWorkOrder = index => {
    this.getWarnDetail(index, 0, 1);
    this.getFaultDetail(index, 0, 1);
    this.setState({ newWorkOrderDrawerVisible: true, workOrderStatus: index, workOrderType: 0 });
    this.getWordOrderCount(index);
    [0, 1].forEach(item => {
      if (document.getElementById(`workOrderScroll${item}`))
        document.getElementById(`workOrderScroll${item}`).scrollTop = 0;
    });
  };

  getWordOrderCount = status => {
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCountFinishByUserId',
      payload: {
        companyId: unitId,
        isMyself: false,
        status: status === 0 ? 2 : status === 1 ? 0 : 1,
      },
    });
  };

  handleClickWorkOrderTab = index => {
    const { workOrderStatus } = this.state;
    this.getWarnDetail(workOrderStatus, index, 1);
    this.getFaultDetail(workOrderStatus, index, 1);
    this.setState({ workOrderType: index });
  };

  getWarnDetail = (status, type = 1, pageNum) => {
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    const reportTypes = [1, 4, 3, 2]; // 1:火灾报警  2:一键报修 3:可燃气体 4:烟感

    dispatch({
      type: 'newUnitFireControl/fetchWarnDetail',
      payload: {
        unitId,
        status: status === 0 ? 2 : status === 1 ? 0 : 1,
        reportType: reportTypes[type],
        pageNum,
        pageSize: 10,
      },
    });
  };

  getFaultDetail = (status, type = 1, pageNum) => {
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    const reportTypes = [1, 4, 3, 2];

    dispatch({
      type: 'newUnitFireControl/fetchFaultDetail',
      payload: {
        unitId,
        status: status === 0 ? 2 : status === 1 ? 0 : 1,
        reportType: reportTypes[type],
        pageNum,
        pageSize: 10,
      },
    });
  };

  setAlertedLabelIndexFn = f => {
    this.setAlertedLabelIndex = f;
  };

  handleSelectDevice = (deviceId, callback) => {
    this.getDeviceRealTimeData(deviceId, callback);
    this.getDeviceHistoryData(deviceId);
    this.getDeviceConfig(deviceId);
    this.getDeviceCamera(deviceId, 3);
  };

  getDeviceCamera = (deviceId, type, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceCamera',
      payload: { deviceId, type },
      callback,
    });
  };

  getDeviceRealTimeData = (deviceId, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceRealTimeData',
      payload: { deviceId },
      callback,
    });
    this.elecDrawerDeviceId = deviceId;
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

  fetchFireAlarmSystem = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取消防主机监测
    dispatch({
      type: 'newUnitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });
  };

  // 复位单个主机
  handleResetSingleHost = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitFireControl/changeSingleHost',
      payload: {
        id,
      },
      success: () => {
        this.fetchFireAlarmSystem();
      },
    });
  };

  // 复位所有主机
  handleResetAllHosts = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取主机列表
    dispatch({
      type: 'unitFireControl/changeAllHosts',
      payload: {
        companyId,
      },
      success: () => {
        this.fetchFireAlarmSystem();
      },
    });
  };

  handleSwitchFireControlType = fireControlType => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({
      fireControlType,
    });
    // 重新获取消防数据统计
    dispatch({
      type: 'unitFireControl/fetchFireControlCount',
      payload: {
        companyId,
        t: fireControlType,
      },
    });
  };

  handleShowFireMonitor = fireMonitorIndex => {
    this.setState({ fireMonitorIndex });
  };

  // 获取消息人员列表
  fetchMessageInformList = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMessageInformList',
      payload: { ids },
    });
  };

  // 处理工单处理动态
  showWorkOrderDetail = (param, type, flow, repeat, occurData) => {
    // type 0/1/2/3 主机/烟感/燃气/一键报修
    // flow 0/1 报警/故障
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const drawerVisibles = [
      'fireFlowDrawerVisible',
      'smokeFlowDrawerVisible',
      'gasFlowDrawerVisible',
      'onekeyFlowDrawerVisible',
    ];
    const reportTypes = [1, 4, 3, 2];
    if (occurData) {
      dispatch({
        type: 'newUnitFireControl/saveWorkOrderDetail',
        payload: occurData,
      });
    } else {
      dispatch({
        type: 'newUnitFireControl/fetchWorkOrder',
        payload: { companyId, reportType: reportTypes[type], ...param },
      });
    }
    this.setState({ [drawerVisibles[type]]: true, msgFlow: flow, flowRepeat: repeat });
  };

  handleClickMsgFlow = (
    param,
    type,
    flow,
    repeat,
    cameraMessage = [],
    occurData,
    isHidePopups = true
  ) => {
    // type 0/1/2/3 主机/烟感/燃气/一键报修
    // flow 0/1 报警/故障
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const drawerVisibles = [
      'fireFlowDrawerVisible',
      'smokeFlowDrawerVisible',
      'gasFlowDrawerVisible',
      'onekeyFlowDrawerVisible',
    ];
    const reportTypes = [1, 4, 3, 2];
    isHidePopups && this.hiddeAllPopup();
    if (type !== 3) {
      dispatch({
        type: 'newUnitFireControl/fetchCountNumAndTimeById',
        payload: {
          id: param.dataId || param.id,
          reportType: reportTypes[type],
          fireType: flow + 1,
        },
        callback: res => {
          if (res) {
            const { num, lastTime, firstTime } = res;
            this.setState({ flowRepeat: { times: num, lastreportTime: lastTime } });
            dispatch({
              type: 'newUnitFireControl/saveWorkOrderDetail',
              payload: [{ ...occurData[0], firstTime }],
            });
          } else {
            dispatch({
              type: 'newUnitFireControl/fetchWorkOrder',
              payload: { companyId, reportType: reportTypes[type], ...param },
              callback: res => {
                if (res.data.list.length === 0) return;
                const { num, lastTime } = res.data.list[0];
                this.setState({ flowRepeat: { times: num, lastreportTime: lastTime } });
              },
            });
          }
        },
      });
    } else {
      // 一键报修没有重复上报
      dispatch({
        type: 'newUnitFireControl/fetchWorkOrder',
        payload: { companyId, reportType: reportTypes[type], ...param },
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
    this.setState({ [drawerVisibles[type]]: true, msgFlow: flow });
    this.handleShowFireVideo(cameraMessage);
  };

  handleClickElecMsg = deviceId => {
    const {
      electricityMonitor: {
        deviceStatusCount: { list: deviceList },
      },
    } = this.props;
    const deviceStatus = deviceList.find(item => item.deviceId === deviceId).status;
    this.handleClickElectricity(+deviceStatus > 0 ? 0 : +deviceStatus === -1 ? 1 : 2, deviceId);
  };

  render() {
    // 从props中获取数据
    const {
      match: {
        params: { unitId: companyId },
      },
      monitor: { allCamera, cameraTree },
      newUnitFireControl: {
        fireAlarmSystem: {
          fire_state = 0,
          fault_state = 0,
          start_state = 0,
          supervise_state = 0,
          shield_state = 0,
          feedback_state = 0,
        },
        // systemScore,
        currentHiddenDanger,
        currentHiddenDanger: { timestampList },
        checkCount,
        checkList,
        pointRecordList: { pointRecordLists, abnormal: checkAbnormal, count },
        alarmHandleMessage,
        alarmHandleList,
        alarmHandleHistory,
        workOrderList1,
        workOrderList2,
        workOrderList7,
        workOrderDetail, // 只有一个元素的数组
        fireAlarm,
        faultList,
        waterSystemData: { list },
        waterDrawer: { list: waterDrawerList },
        waterAlarm,
        maintenanceCompany: {
          name: maintenanceCompanys = [],
          PrincipalName = '', // 安全管理员
          PrincipalPhone = '', // 安全管理员电话
        },
        warnDetail,
        faultDetail,
        countAllFireAndFault,
        countFinishByUserId,
      },
      smoke: { companySmokeInfo },
      electricityMonitor: {
        deviceStatusCount,
        deviceRealTimeData,
        deviceRealTimeDataMonitor,
        devices,
        deviceConfig,
        deviceHistoryData,
        videoByDevice,
      },
      bigPlatform: { coItemList },
      unitFireControl: { hosts, fireControlCount },
      unitSafety: { points, phoneVisible },
      warnDetailLoading,
      faultDetailLoading,
    } = this.props;

    const {
      videoVisible,
      showVideoList,
      videoKeyId,
      workOrderDrawerVisible,
      alarmMessageDrawerVisible,
      faultMessageDrawerVisible,
      alarmDynamicDrawerVisible,
      alarmHistoryDrawerVisible,
      pointInspectionDrawerVisible,
      pointInspectionDrawerSelectedDate,
      riskDrawerVisible,
      checkDrawerVisible,
      pointDrawerVisible,
      currentDrawerVisible,
      dangerDetailVisible,
      drawerType,
      maintenanceDrawerVisible,
      fourColorTips,
      fireAlarmVisible,
      checkStatus,
      checkPointName,
      checkItemId,
      maintenanceCheckDrawerVisible,
      faultDrawerVisible,
      fireAlarmTitle,
      faultMessage,
      maintenanceTitle,
      maintenanceMsgDrawerVisible,
      processIds,
      fireProcessIds,
      alarmDynamicMsgDrawerVisible,
      latestHiddenDangerId,
      videoList,
      fireVideoVisible,
      fireVideoKeyId,
      waterSystemDrawerVisible,
      waterTabItem,
      smokeDrawerVisible,
      filterIndex,
      electricityDrawerVisible,
      resetHostsDrawerVisible,
      checksDrawerVisible,
      newWorkOrderDrawerVisible,
      workOrderType,
      workOrderStatus,
      fireMonitorIndex,
      fireControlType,
      fireFlowDrawerVisible,
      occurData,
      smokeFlowDrawerVisible,
      onekeyFlowDrawerVisible,
      gasFlowDrawerVisible,
      msgFlow,
      setDrawerVisible,
      flowRepeat,
    } = this.state;

    return (
      <BigPlatformLayout
        title={'智慧消防云平台'}
        style={{
          // backgroundImage: 'url(http://data.jingan-china.cn/v2/big-platform/fire-control/com/new/bg2.png)',
          backgroundImage: 'none',
          backgroundColor: 'rgb(0, 24, 52)',
        }}
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
        titleStyle={{ fontSize: document.body.offsetWidth < 1380 ? 36 : 46 }}
        contentStyle={{ position: 'relative', height: '100%', zIndex: 0 }}
        settable
        onSet={() => this.handleDrawerVisibleChange('set')}
      >
        {/* 四色图 */}
        <FourColor
          model={this.props.newUnitFireControl}
          handleShowPointDetail={(checkItemId, checkStatus, checkPointName) => {
            this.handlePointRecordList(checkItemId);
            this.handleDrawerVisibleChange('point', {
              checkItemId,
              checkStatus,
              checkPointName,
            });
          }}
          handleShowHiddenDanger={(id, hiddenDangerId) => {
            this.handleViewDangerDetail({ id: hiddenDangerId });
            this.removeFourColorTip(id, hiddenDangerId);
          }}
          handlePlay={this.handlePlay}
          tips={fourColorTips}
          latestHiddenDangerId={latestHiddenDangerId}
        />
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
            onClick={() => this.handleShowVideo(findFirstVideo(cameraTree).id)}
          />
        </Tooltip>
        <div className={styles.companyInfo}>
          <div className={styles.inner}>
            {/* 企业基本信息 */}
            <CompanyInfo
              handleViewCurrentDanger={this.handleViewCurrentDanger}
              handleCheckDrawer={this.handleCheckDrawer}
              model={this.props.newUnitFireControl}
              phoneVisible={phoneVisible}
            />
          </div>
        </div>
        {/* 实时消息 */}
        <Messages
          className={styles.realTimeMessage}
          model={this.props.newUnitFireControl}
          handleParentChange={this.handleParentChange}
          handleViewDangerDetail={this.handleViewDangerDetail}
          fetchData={this.fetchMaintenanceCheck}
          handleClickMessage={this.handleClickMessage}
          handleFaultClick={this.handleFaultClick}
          handleWorkOrderCardClickMsg={this.handleWorkOrderCardClickMsg}
          handleFireMessage={this.handleFireMessage}
          handleViewWater={this.handleViewWater}
          handleClickMsgFlow={this.handleClickMsgFlow}
          phoneVisible={phoneVisible}
          handleClickElecMsg={this.handleClickElecMsg}
          handleClickSmoke={this.handleClickSmoke}
          handleClickWater={this.handleClickWater}
        />
        <div className={styles.bottom}>
          <div className={styles.bottomInner}>
            <div className={styles.item}>
              <div className={styles.inner} ref={node => (this.fireNode = node)}>
                <Rotate axis="y" frontIndex={fireMonitorIndex}>
                  {/* 虚拟消控主机 */}
                  <FireMonitoring
                    fire={fire_state}
                    fault={fault_state}
                    shield={shield_state}
                    linkage={start_state}
                    supervise={supervise_state}
                    feedback={feedback_state}
                    handleShowAlarm={this.handleShowAlarm}
                    // handleShowAlarmHistory={this.handleShowAlarmHistory}
                    handleShowFault={this.handleShowFault}
                    handleParentChange={this.handleParentChange}
                    hosts={hosts}
                    handleShowFireMonitor={this.handleShowFireMonitor}
                  />
                  {/* 消防主机监测 */}
                  <StatisticsOfFireControl
                    type={fireControlType}
                    fireControlCount={fireControlCount}
                    onSwitch={this.handleSwitchFireControlType}
                    handleShowFireMonitor={this.handleShowFireMonitor}
                  />
                </Rotate>
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 重点部位监控 */}
                {/* <VideoSurveillance
                  handlePlay={this.handlePlay}
                  handleShowVideo={this.handleShowVideo}
                  data={cameraTree}
                /> */}
                {/* 电气火灾监测 */}
                <ElectricityMonitor
                  companySmokeInfo={companySmokeInfo}
                  deviceStatusCount={deviceStatusCount}
                  deviceRealTimeData={deviceRealTimeDataMonitor}
                  devices={devices}
                  handleFetchRealTimeData={this.handleFetchRealTimeData}
                  onClick={this.handleClickElectricity}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 水系统 */}
                {/* <FireDevice
                  companyId={companyId}
                  onClick={this.handleViewWater}
                  waterList={list}
                  fetchWaterSystem={this.fetchWaterSystem}
                  waterAlarm={waterAlarm}
                /> */}
                <WaterMonitor
                  companyId={companyId}
                  onClick={this.handleClickWater}
                  waterList={list}
                  fetchWaterSystem={this.fetchWaterSystem}
                  waterAlarm={waterAlarm}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 点位巡查统计 */}
                {/* <PointInspectionCount
                  model={this.props.newUnitFireControl}
                  handleShowDrawer={(name, params) => {
                    this.handleDrawerVisibleChange(name, params);
                    this.fetchPointInspectionList(params.pointInspectionDrawerSelectedDate);
                  }}
                /> */}
                {/* 独立烟感监测 */}
                <SmokeMonitor companySmokeInfo={companySmokeInfo} onClick={this.handleClickSmoke} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 维保统计 */}
                {/* <MaintenanceCount
                  model={this.props.newUnitFireControl}
                  handleShowOrder={this.handleDrawerVisibleChange}
                /> */}
                {/* 安全巡查/处理工单 */}
                <CheckWorkOrder
                  coItemList={coItemList}
                  checkClick={this.handleClickCheck}
                  workOrderClick={this.handleClickWorkOrder}
                  countAllFireAndFault={countAllFireAndFault}
                />
              </div>
            </div>
          </div>
        </div>
        <NewVideoPlay
          showList={showVideoList}
          videoList={cameraTree}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
          isTree={true}
        />
        <NewVideoPlay
          showList={true}
          videoList={videoList}
          visible={fireVideoVisible}
          keyId={videoList.length > 0 ? findFirstVideo(videoList).id : undefined} // keyId
          handleVideoClose={this.handleFireVideoClose}
          isTree={false}
        />
        {/* <VideoPlay
          showList={showVideoList}
          videoList={allCamera}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
        /> */}
        {/* <VideoPlay
          showList={true}
          videoList={videoList}
          visible={fireVideoVisible}
          keyId={videoList[0] ? videoList[0].key_id : undefined} // keyId
          handleVideoClose={this.handleFireVideoClose}
        /> */}
        <RiskDrawer
          visible={riskDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        {/**检查点抽屉 */}
        <CheckingDrawer
          visible={checkDrawerVisible}
          companyId={companyId}
          checkCount={checkCount}
          checkList={checkList}
          handlePointDrawer={this.handlePointDrawer}
          onClose={() => {
            this.setState({
              checkDrawerVisible: false,
            });
          }}
        />
        {/**点位名称抽屉 */}
        <PointPositionName
          visible={pointDrawerVisible}
          pointRecordLists={pointRecordLists}
          checkAbnormal={checkAbnormal}
          currentHiddenDanger={currentHiddenDanger}
          checkStatus={checkStatus}
          checkPointName={checkPointName}
          checkItemId={checkItemId}
          count={count}
          handlePointDangerDetail={this.handleViewDangerDetail}
          onClose={() => {
            this.setState({
              pointDrawerVisible: false,
            });
          }}
        />
        <AlarmDynamicDrawer
          data={alarmHandleMessage}
          visible={alarmMessageDrawerVisible}
          onClose={() => this.setState({ alarmMessageDrawerVisible: false })}
          phoneVisible={phoneVisible}
          handleParentChange={this.handleParentChange}
        />
        <FaultMessageDrawer
          data={faultMessage}
          model={this.props.newUnitFireControl}
          visible={faultMessageDrawerVisible}
          onClose={() => this.setState({ faultMessageDrawerVisible: false })}
        />
        <AlarmDynamicDrawer
          data={alarmHandleList}
          visible={alarmDynamicDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('alarmDynamic')}
          phoneVisible={phoneVisible}
        />
        <AlarmDynamicDrawer
          // data={alarmHandleHistory}
          data={
            alarmHandleHistory.length > 20 ? alarmHandleHistory.slice(0, 20) : alarmHandleHistory
          }
          visible={alarmHistoryDrawerVisible}
          phoneVisible={phoneVisible}
          onClose={() => this.handleDrawerVisibleChange('alarmHistory')}
        />
        {/* <PointPositionName
          visible={pointDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />*/}
        {/* 点位巡查详情 */}
        <PointInspectionDrawer
          date={pointInspectionDrawerSelectedDate}
          handleChangeDate={this.handleChangePointInspectionDrawerSelectedDate}
          model={this.props.newUnitFireControl}
          loadData={this.fetchPointInspectionList}
          visible={pointInspectionDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('pointInspection')}
        />
        {/* 当前隐患抽屉 */}
        <CurrentHiddenDanger
          visible={currentDrawerVisible}
          onClose={this.handleCloseCurrentDrawer}
          onCardClick={this.handleViewDangerDetail}
          onClickChat={this.handleFilterCurrentDanger}
          {...currentHiddenDanger}
        />
        {/* 隐患详情抽屉 */}
        <DrawerHiddenDangerDetail
          visible={dangerDetailVisible}
          onClose={this.handleCloseDetailOfDanger}
          data={timestampList}
        />
        <WorkOrderDrawer
          data={{ workOrderList1, workOrderList2, workOrderList7 }}
          maintenanceCompanys={maintenanceCompanys.map(data => data.name).join(',')}
          type={drawerType}
          visible={workOrderDrawerVisible}
          handleLabelChange={this.handleWorkOrderLabelChange}
          onClose={() => this.handleDrawerVisibleChange('workOrder')}
          handleCardClick={this.handleWorkOrderCardClick}
        />
        <MaintenanceDrawer
          title="维保处理动态"
          type={drawerType}
          data={workOrderDetail}
          visible={maintenanceDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('maintenance')}
        />
        <MaintenanceMsgDrawer
          title={maintenanceTitle}
          type={drawerType}
          data={workOrderDetail}
          processIds={processIds}
          visible={maintenanceMsgDrawerVisible}
          fetchFaultDetail={this.fetchFaultDetail}
          onClose={() => {
            this.handleDrawerVisibleChange('maintenanceMsg');
            setTimeout(() => {
              this.setState({ maintenanceTitle: '维保处理动态' });
            }, 200);
          }}
        />
        <AlarmDynamicMsgDrawer
          data={alarmHandleMessage}
          visible={alarmDynamicMsgDrawerVisible}
          processIds={fireProcessIds}
          handleFetchDataId={this.handleFetchDataId}
          handleFetchAlarmHandle={this.handleFetchAlarmHandle}
          onClose={() => this.handleDrawerVisibleChange('alarmDynamicMsg')}
        />
        <DrawerOfFireAlarm
          visible={fireAlarmVisible}
          onClose={this.handleCloseFireAlarm}
          title={fireAlarmTitle}
          {...fireAlarm}
        />
        <MaintenanceDrawer
          title="故障处理动态"
          type={drawerType}
          data={faultList}
          visible={faultDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('fault')}
          phoneVisible={phoneVisible}
        />
        {/* 维保巡检抽屉 */}
        <MaintenanceCheckDrawer
          model={this.props.newUnitFireControl}
          visible={maintenanceCheckDrawerVisible}
          phoneVisible={phoneVisible}
          onClose={() => this.handleDrawerVisibleChange('maintenanceCheck')}
        />
        {/* 水系统抽屉抽屉 */}
        <WaterSystemDrawer
          visible={waterSystemDrawerVisible}
          waterTabItem={waterTabItem}
          onClose={this.handleCloseWater}
          waterList={list}
          waterDrawer={waterDrawerList}
          onClick={this.handleClickWater}
          filterIndex={filterIndex}
        />
        {/* 独立烟感监测抽屉 */}
        <SmokeDrawer
          visible={smokeDrawerVisible}
          companySmokeInfo={companySmokeInfo}
          onClick={this.handleClickSmoke}
          onClose={() => this.handleDrawerVisibleChange('smoke')}
          filterIndex={filterIndex}
          videoList={videoByDevice}
          getDeviceCamera={this.getDeviceCamera}
          handleClickMsgFlow={this.handleClickMsgFlow}
        />
        {/* 电气火灾监测抽屉 */}
        <ElectricityDrawer
          data={{
            deviceStatusCount,
            devices,
            deviceRealTimeData,
            deviceConfig,
            deviceHistoryData,
            cameraList: videoByDevice,
          }}
          visible={electricityDrawerVisible}
          handleClose={() => this.handleDrawerVisibleChange('electricity')}
          handleSelect={this.handleSelectDevice}
          setAlertedLabelIndexFn={this.setAlertedLabelIndexFn}
          filterIndex={filterIndex}
          onClick={this.handleClickElectricity}
        />
        {/* 一键复位抽屉 */}
        <ResetHostsDrawer
          visible={resetHostsDrawerVisible}
          hosts={hosts}
          onClose={() => {
            const { dispatch } = this.props;
            this.handleDrawerVisibleChange('resetHosts');
            dispatch({
              type: 'unitFireControl/fetchHosts',
              payload: {
                companyId,
              },
            });
          }}
          handleResetSingleHost={this.handleResetSingleHost}
          handleResetAllHosts={this.handleResetAllHosts}
        />
        {/* 安全巡查抽屉 */}
        <CheckDrawer
          visible={checksDrawerVisible}
          coItemList={coItemList}
          data={points}
          onClose={() => this.handleDrawerVisibleChange('checks')}
          onClick={this.handleClickCheck}
          filterIndex={filterIndex}
        />
        {/* 工单抽屉 */}
        <NewWorkOrderDrawer
          handleClickTab={this.handleClickWorkOrderTab}
          workOrderType={workOrderType}
          workOrderStatus={workOrderStatus}
          warnDetailLoading={warnDetailLoading}
          faultDetailLoading={faultDetailLoading}
          handleParentChange={this.handleParentChange}
          visible={newWorkOrderDrawerVisible}
          warnDetail={warnDetail}
          faultDetail={faultDetail}
          onClose={() => this.handleDrawerVisibleChange('newWorkOrder')}
          getWarnDetail={this.getWarnDetail}
          getFaultDetail={this.getFaultDetail}
          countFinishByUserId={countFinishByUserId}
          showWorkOrderDetail={this.showWorkOrderDetail}
          handleClickMsgFlow={this.handleClickMsgFlow}
          phoneVisible={phoneVisible}
        />
        {/* 消防主机处理动态 */}
        <FireFlowDrawer
          data={workOrderDetail}
          flowRepeat={flowRepeat}
          visible={fireFlowDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('fireFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          msgFlow={msgFlow}
          phoneVisible={phoneVisible}
        />
        {/* 独立烟感处理动态 */}
        <SmokeFlowDrawer
          flowRepeat={flowRepeat}
          data={workOrderDetail}
          visible={smokeFlowDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('smokeFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          msgFlow={msgFlow}
          phoneVisible={phoneVisible}
        />
        {/* 一键报修处理动态 */}
        <OnekeyFlowDrawer
          data={workOrderDetail}
          visible={onekeyFlowDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('onekeyFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          phoneVisible={phoneVisible}
        />
        {/* 燃气处理动态 */}
        <GasFlowDrawer
          data={workOrderDetail}
          flowRepeat={flowRepeat}
          visible={gasFlowDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('gasFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          phoneVisible={phoneVisible}
        />
        {/* 设置抽屉 */}
        <SetDrawer
          visible={setDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('set')}
        />
      </BigPlatformLayout>
    );
  }
}
