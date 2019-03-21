import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { notification } from 'antd';
import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import VideoSurveillance from './VideoSurveillance';
import VideoPlay from '../NewFireControl/section/VideoPlay';
import PointInspectionCount from './PointInspectionCount';
import CompanyInfo from './CompanyInfo';
import Messages from './Messages';
import MaintenanceCount from './MaintenanceCount';
import FourColor from './FourColor';

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
import iconFire from '@/assets/icon-fire-msg.png';
import iconFault from '@/assets/icon-fault-msg.png';
import headerBg from '@/assets/new-header-bg.png';

const { projectName } = global.PROJECT_CONFIG;
// const DELAY = 5 * 1000;
// const CHART_DELAY = 10 * 60 * 1000;

notification.config({
  placement: 'bottomLeft',
  duration: null,
  bottom: 8,
});

const msgInfo = {
  '5': {
    title: '火警提示',
    icon: iconFire,
    color: '#f83329',
    body: '发生报警，',
    bottom: '情况危急，请立即处理！',
    animation: styles.redShadow,
  },
  '6': {
    title: '故障提示',
    icon: iconFault,
    color: '#f4710f',
    body: '发生故障，',
    bottom: '请及时维修！',
    animation: styles.orangeShadow,
  },
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
};
/**
 * description: 新企业消防
 * author:
 * date: 2018年12月03日
 */
@connect(({ newUnitFireControl, monitor, loading }) => ({
  newUnitFireControl,
  monitor,
  loading: loading.models.newUnitFireControl,
}))
export default class App extends PureComponent {
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
            } = result;

            if (type === 5 || type === 6) {
              this.showFireMsg(result);
            }

            if (
              type === 1 ||
              type === 2 ||
              type === 3 ||
              type === 4 ||
              type === 5 ||
              type === 6 ||
              type === 21
            ) {
              // 获取消防主机监测
              dispatch({
                type: 'newUnitFireControl/fetchFireAlarmSystem',
                payload: {
                  companyId,
                },
              });
            }

            if (type === 14 || type === 15 || type === 16 || type === 17) {
              // 更新当前隐患总数
              dispatch({
                type: 'newUnitFireControl/fetchHiddenDangerNum',
                payload: { companyId },
              });
            }

            // 获取水系统---消火栓系统
            if (type === 36 || type === 37) {
              if (+deviceType === +waterTab) this.fetchWaterSystem(deviceType);
              dispatch({
                type: 'newUnitFireControl/fetchWaterAlarm',
                payload: {
                  companyId,
                },
              });
            }

            if (type === 18) {
              // 获取消防设施评分
              dispatch({
                type: 'newUnitFireControl/fetchSystemScore',
                payload: {
                  companyId,
                },
              });
              if (this.state.fireAlarmVisible) this.fetchViewFireAlarm();
            }

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
    dispatch({
      type: 'newUnitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });
    // 获取消防设施评分
    dispatch({
      type: 'newUnitFireControl/fetchSystemScore',
      payload: {
        companyId,
      },
    });

    // 获取隐患详情
    dispatch({
      type: 'newUnitFireControl/fetchRiskDetail',
      payload: {
        company_id: companyId,
      },
    });

    // 获取警情动态详情及历史
    [0, 1].forEach(i => this.handleFetchAlarmHandle(0, i));

    // 初始化维保工单
    this.handleFetchAllWorkOrder();

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
        // this.topId = res.list[0] ? res.list[0].messageId : undefined;
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

    this.fetchWaterSystem('101');
  }

  showFireMsg = item => {
    const { type, messageId } = item;
    if (type === 5 || type === 6) {
      // 5 火警， 6 故障
      const msgItem = msgInfo[type.toString()];
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
  };

  renderNotificationTitle = item => {
    const { type } = item;
    const msgItem = msgInfo[type.toString()];
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
    const { type, addTime, installAddress, componentType, messageFlag } = item;
    const msgItem = msgInfo[type.toString()];
    return (
      <div
        className={styles.notificationBody}
        onClick={() => {
          if (type === 5) this.handleClickMessage(messageFlag, item);
          else this.handleFaultClick({ ...item });
        }}
      >
        <div>
          <span className={styles.time}>{moment(addTime).format('YYYY-MM-DD HH:mm')}</span>{' '}
          {/* <span className={styles.time}>{addTimeStr}</span>{' '} */}
          <span className={styles.address}>{installAddress}</span>
        </div>
        <div>
          <span className={styles.device} style={{ color: msgItem.color }}>
            【{componentType}】
          </span>
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
    dispatch({
      type: 'newUnitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });

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
    dispatch({
      type: 'newUnitFireControl/fetchWaterAlarm',
      payload: {
        companyId,
      },
    });
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

        let sameIndex = -1;
        res.list.forEach((item, index) => {
          if (item.messageId === this.topId) {
            sameIndex = index;
            return;
          }
        });
        // 截取新的消息列表
        const newMsg = sameIndex < 0 ? res.list : res.list.slice(0, sameIndex);
        newMsg.forEach(data => {
          this.showFireMsg(data);
        });
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

  handleWorkOrderCardClick = id => {
    this.handleDrawerVisibleChange('maintenance');
    this.handleFetchWorkOrder(undefined, id);
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
    const { cameraMessage } = data;
    this.hiddeAllPopup();
    this.setState({ faultMessage: data, faultMessageDrawerVisible: true });
    this.handleShowFireVideo(cameraMessage);
  };

  hiddeAllPopup = () => {
    this.setState({ ...popupVisible });
  };

  // 点击当前隐患图表进行筛选
  handleFilterCurrentDanger = ({ dataIndex }) => {
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

  render() {
    // 从props中获取数据
    const {
      match: {
        params: { unitId: companyId },
      },
      monitor: { allCamera },
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
        waterAlarm,
      },
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
    } = this.state;

    return (
      <BigPlatformLayout
        title={projectName}
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
          tips={fourColorTips}
          latestHiddenDangerId={latestHiddenDangerId}
        />
        <div className={styles.companyInfo}>
          <div className={styles.inner}>
            {/* 企业基本信息 */}
            <CompanyInfo
              handleViewCurrentDanger={this.handleViewCurrentDanger}
              handleCheckDrawer={this.handleCheckDrawer}
              model={this.props.newUnitFireControl}
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
        />
        <div className={styles.bottom}>
          <div className={styles.bottomInner}>
            <div className={styles.item}>
              <div className={styles.inner} ref={node => (this.fireNode = node)}>
                {/* 消防主机监测 */}
                <FireMonitoring
                  fire={fire_state}
                  fault={fault_state}
                  shield={shield_state}
                  linkage={start_state}
                  supervise={supervise_state}
                  feedback={feedback_state}
                  handleShowAlarm={this.handleShowAlarm}
                  handleShowAlarmHistory={this.handleShowAlarmHistory}
                  handleShowFault={this.handleShowFault}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 重点部位监控 */}
                <VideoSurveillance handleShowVideo={this.handleShowVideo} data={allCamera} />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 水系统 */}
                <FireDevice
                  companyId={companyId}
                  onClick={this.handleViewWater}
                  waterList={list}
                  fetchWaterSystem={this.fetchWaterSystem}
                  waterAlarm={waterAlarm}
                />
                {/* <FireDevice systemScore={systemScore} onClick={this.handleViewFireAlarm} /> */}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 点位巡查统计 */}
                <PointInspectionCount
                  model={this.props.newUnitFireControl}
                  handleShowDrawer={(name, params) => {
                    this.handleDrawerVisibleChange(name, params);
                    this.fetchPointInspectionList(params.pointInspectionDrawerSelectedDate);
                  }}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 维保统计 */}
                <MaintenanceCount
                  model={this.props.newUnitFireControl}
                  handleShowOrder={this.handleDrawerVisibleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <VideoPlay
          showList={showVideoList}
          videoList={allCamera}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
        />
        <VideoPlay
          showList={true}
          videoList={videoList}
          visible={fireVideoVisible}
          keyId={videoList[0] ? videoList[0].key_id : undefined} // keyId
          handleVideoClose={this.handleFireVideoClose}
        />
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
        />
        <AlarmDynamicDrawer
          // data={alarmHandleHistory}
          data={
            alarmHandleHistory.length > 20 ? alarmHandleHistory.slice(0, 20) : alarmHandleHistory
          }
          visible={alarmHistoryDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('alarmHistory')}
        />
        {/* <PointPositionName
          visible={pointDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />*/}
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
        />
        <MaintenanceCheckDrawer
          model={this.props.newUnitFireControl}
          visible={maintenanceCheckDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('maintenanceCheck')}
        />
        <WaterSystemDrawer
          visible={waterSystemDrawerVisible}
          waterTabItem={waterTabItem}
          onClose={this.handleCloseWater}
          waterList={list}
        />
      </BigPlatformLayout>
    );
  }
}
