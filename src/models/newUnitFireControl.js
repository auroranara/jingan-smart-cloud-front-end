import {
  // 获取待处理信息
  getPendingInfo,
  // 获取待处理火警和待处理故障数量
  getPendingNumber,
  // 超期未整改隐患数量
  getOutOfDateNumber,
  // 获取待整改隐患数量
  getToBeRectifiedNumber,
  // 获取待巡查任务数量
  getToBeInspectedNumber,
  // 获取火灾报警系统
  getFireAlarmSystem,
  // 获取隐患巡查记录
  getHiddenDangerRecords,
  // 获取消防数据统计
  getFireControlCount,
  // 获取隐患巡查统计
  getHiddenDangerCount,
  // 获取维保情况统计
  getMaintenanceCount,
  // 获取复位主机
  getHosts,
  // 复位单个主机
  resetSingleHost,
  // 复位所有主机
  resetAllHosts,
  // 获取视频列表
  getVideoList,
  // 获取企业信息
  getCompanyMessage,
  // 获取点位信息
  getRiskPointInfo,
  // 获取消防设施评分
  getSystemScore,
  //  获取当前隐患图表数据
  fetchHiddenDangerNum,
  // 南消：获取点位巡查统计
  getPointInspectionCount,
  // 南消：获取点位巡查列表
  getPointInspectionList,
  // 南消：获取点位
  getPointList,
  // 获取大屏消息
  getScreenMessage,
  // 检查点各状态数量
  getCheckStatusCount,
  // 检查点具体信息
  getCheckDetail,
  // 巡查点异常记录
  getPonitRecord,
  queryAlarmHandleList,
  queryWorkOrder,
  fetchCheckRecord,
  queryCheckUsers,
  queryFault,
  fetchHiddenDangerDetail,
  queryWorkOrderMsg,
  queryDataId,
} from '../services/bigPlatform/fireControl';
import { getRiskDetail } from '../services/bigPlatform/bigPlatform';
import { queryMaintenanceRecordDetail } from '../services/maintenanceRecord.js';
import moment from 'moment';
import { stringify } from 'qs';
import WebsocketHeartbeatJs from '../utils/heartbeat';
import pathToRegexp from 'path-to-regexp';

const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

const getColorByRiskLevel = level => {
  switch (+level) {
    case 1:
      return '红色';
    case 2:
      return '橙色';
    case 3:
      return '黄色';
    case 4:
      return '蓝色';
    default:
      return '';
  }
};
/* 完善步骤条数组 */
const formatTimeLine = function(timeLine) {
  const list = timeLine.map((item, index) => {
    let type = +item.type;
    let timeLineLabel = '';
    if (type === 1) {
      timeLineLabel = '隐患创建';
    } else if (type === 2) {
      // 如果index大于1，意味着必然为重新整改
      if (index > 1) {
        timeLineLabel = '重新整改';
      } else {
        timeLineLabel = '隐患整改';
      }
    } else if (type === 3) {
      timeLineLabel = '隐患复查';
    } else if (type === 4) {
      timeLineLabel = '隐患关闭';
    }
    return {
      ...item,
      timeLineLabel,
      id: index,
    };
  });
  const lastIndex = timeLine.length - 1;
  const { type } = timeLine[lastIndex];
  switch (+type) {
    case 1:
      list.push(
        { timeLineLabel: '隐患整改', id: lastIndex + 1 },
        { timeLineLabel: '隐患复查', id: lastIndex + 2 }
      );
      break;
    case 2:
      list.push({ timeLineLabel: '隐患复查', id: lastIndex + 1 });
      break;
    case 3:
      list.push(
        { timeLineLabel: '重新整改', id: lastIndex + 1 },
        { timeLineLabel: '隐患复查', id: lastIndex + 2 }
      );
      break;
    default:
      break;
  }
  return list;
};

const transformHiddenDangerFields = ({
  id,
  item_id,
  desc,
  report_user_name,
  report_time,
  rectify_user_name,
  plan_rectify_time,
  real_rectify_time,
  review_user_name,
  status,
  hiddenDangerRecordDto, //: [{ fileWebUrl: background }] = [{ fileWebUrl: '' }],
  source_type_name,
  companyBuildingItem,
  business_type,
  review_time,
}) => {
  const background = (hiddenDangerRecordDto[0] || { fileWebUrl: '' }).fileWebUrl;
  const { object_title, risk_level } = companyBuildingItem || {};
  return {
    id,
    item_id,
    description: desc,
    sbr: report_user_name,
    sbsj: moment(+report_time).format('YYYY-MM-DD'),
    zgr: rectify_user_name,
    plan_zgsj: moment(+plan_rectify_time).format('YYYY-MM-DD'),
    real_zgsj: moment(+real_rectify_time).format('YYYY-MM-DD'),
    fcr: review_user_name,
    status: +status,
    background: background ? background.split(',')[0] : '',
    source:
      (source_type_name === '网格点上报' && '监督点') ||
      (source_type_name === '风险点上报' &&
        `${getColorByRiskLevel(risk_level)}风险点${object_title ? `（${object_title}）` : ''}`) ||
      source_type_name,
    businessType: business_type,
    fcsj: moment(+review_time).format('YYYY-MM-DD'),
  };
};

export default {
  namespace: 'newUnitFireControl',

  state: {
    // 待处理信息
    pendingInfo: [],
    // 待处理火警数量
    pendingFireNumber: 0,
    // 待处理故障数量
    pendingFaultNumber: 0,
    // 超期未整改隐患数量
    outOfDateNumber: 0,
    // 待整改隐患数量
    toBeRectifiedNumber: 0,
    // 待巡查任务数量
    toBeInspectedNumber: 0,
    // 火灾报警系统
    fireAlarmSystem: {
      fire_state: 0,
      fault_state: 0,
      start_state: 0,
      supervise_state: 0,
      shield_state: 0,
      feedback_state: 0,
    },
    // 隐患巡查记录
    hiddenDangerRecords: [],
    // 消防数据统计
    fireControlCount: {
      faultAssign: 0,
      shield_state: 0,
      warn: 0,
      warnTrue: 0,
      start_state: 0,
      fault_state: 0,
      warnFalse: 0,
      fault: 0,
      feedback_state: 0,
      faultSelf: 0,
      fire_state: 0,
      supervise_state: 0,
    },
    // 隐患巡查统计
    hiddenDangerCount: {},
    // 维保情况统计
    maintenanceCount: {
      needRepairNum: 0,
      selfNoNum: 0,
      selfDoingNum: 0,
      selfFinishNum: 0,
      assignNoNum: 0,
      assignDoingNum: 0,
      assignFinishNum: 0,
      avgSelfTime: '',
      selfAllNum: 0,
      selfRate: '100%',
      avgAssignTime: '',
      assignAllNum: 0,
      assignRate: '100%',
    },
    // 复位主机列表
    hosts: [],
    // 视频列表
    videoList: [],
    // 视频列表---消防平面图
    videoFireList: [],
    // 隐患详情
    riskDetailList: {
      ycq: [],
      wcq: [],
      dfc: [],
    },
    // 企业信息
    companyMessage: {
      // 企业信息
      companyMessage: {
        // 企业名称
        companyName: '',
        // 安全负责人
        headOfSecurity: '',
        // 联系方式
        headOfSecurityPhone: '',
        // 风险点统计
        countCheckItem: 0,
        // 安全人员统计
        countCompanyUser: 0,
      },
      // 巡查次数列表
      check_map: [],
      // 隐患数量列表
      hidden_danger_map: [],
      // 是否是重点单位
      isImportant: false,
      // 风险点列表
      point: [],
      // 四色图列表
      fourColorImg: [],
      // 点位信息
      riskPointInfo: [],
      // 消防平面图列表：
      fireIchnographyUrl: [],
    },
    // 消防设施评分
    systemScore: {},
    // 当前隐患
    currentHiddenDanger: {
      rectifyNum: 0, // 未超期
      reviewNum: 0, // 待复查
      overRectifyNum: 0, // 已超期
      totalNum: 0, // 总数
      list: [], // 隐患列表
      timestampList: [], // 隐患详情
    },
    // 点位巡查统计
    pointInspectionCount: [],
    // 点位巡查列表
    pointInspectionList: {},
    // 点位
    pointList: [],
    // 点位---消防平面图
    firePoint: [],
    // 获取大屏消息
    screenMessage: [],
    // 检查点状态数量
    checkCount: {},
    // 检查点具体信息
    checkList: {
      checkLists: [],
    },
    // 巡查点异常记录
    pointRecordList: {
      abnormal: 0,
      count: 0,
      pointRecordLists: [],
    },
    // 火警消息
    alarmHandleMessage: [],
    // 火警动态
    alarmHandleList: [],
    alarmHandleHistory: [],
    // 已完成维保工单
    workOrderList1: [],
    // 待处理维保工单
    workOrderList2: [],
    // 已超期维保工单
    workOrderList7: [],
    // 维保处理动态详情
    workOrderDetail: [],
    // 火灾报警系统
    fireAlarm: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    // 维保巡查详情
    maintenanceDetail: {},
    maintenanceCompany: {
      name: [],
      result: [],
    },
    // 故障
    faultList: [],
  },

  subscriptions: {
    initWebScoket: ({ dispatch, history }) => {
      const pathname = '/big-platform/fire-control/new-company/:companyId';
      const re = pathToRegexp(pathname);
      if (pathToRegexp(pathname).test(history.location.pathname)) {
        const list = re.exec(history.location.pathname);
        const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
        const params = {
          companyId: list[1],
          env,
          type: 1,
        };
        const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;

        // 链接webscoket
        global.NanXiaoWebsocket = new WebsocketHeartbeatJs({ url, ...options });
        global.NanXiaoWebsocket.onopen = () => {
          console.log('connect success');
          global.NanXiaoWebsocket.send('heartbeat');
        };
      }
    },
  },

  effects: {
    // 获取待处理信息
    *fetchPendingInfo({ payload, callback }, { call, put }) {
      const response = yield call(getPendingInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: { pendingInfo: response.data.list },
        });
        if (callback) {
          callback(response.data.list);
        }
      }
    },
    // 获取待处理火警和待处理故障数量
    *fetchPendingNumber({ payload, callback }, { call, put }) {
      const response = yield call(getPendingNumber, payload);
      if (response.code === 200) {
        const { fire: pendingFireNumber, fault: pendingFaultNumber } = response.data;
        yield put({
          type: 'save',
          payload: { pendingFireNumber, pendingFaultNumber },
        });
        if (callback) {
          callback(response.data);
        }
      }
    },
    // 超期未整改隐患数量
    *fetchOutOfDateNumber({ payload, callback }, { call, put }) {
      const response = yield call(getOutOfDateNumber, payload);
      yield put({
        type: 'save',
        payload: { outOfDateNumber: response.total },
      });
      if (callback) {
        callback(response.total);
      }
    },
    // 获取待整改隐患数量
    *fetchToBeRectifiedNumber({ payload, callback }, { call, put }) {
      const response = yield call(getToBeRectifiedNumber, payload);
      yield put({
        type: 'save',
        payload: { toBeRectifiedNumber: response.total },
      });
      if (callback) {
        callback(response.total);
      }
    },
    // 获取待巡查任务数量
    *fetchToBeInspectedNumber({ payload, callback }, { call, put }) {
      const response = yield call(getToBeInspectedNumber, payload);
      yield put({
        type: 'save',
        payload: { toBeInspectedNumber: response.total },
      });
      if (callback) {
        callback(response.total);
      }
    },
    // 获取火灾报警系统
    *fetchFireAlarmSystem({ payload, callback }, { call, put }) {
      const response = yield call(getFireAlarmSystem, payload);
      if (response.code === 200) {
        const fireAlarmSystem = response.data.list[0] || {
          fire_state: 0,
          fault_state: 0,
          start_state: 0,
          supervise_state: 0,
          shield_state: 0,
          feedback_state: 0,
        };
        yield put({
          type: 'save',
          payload: { fireAlarmSystem },
        });
        if (callback) {
          callback(fireAlarmSystem);
        }
      }
    },
    // 获取隐患巡查记录
    *fetchHiddenDangerRecords({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerRecords, payload);
      // 移除已关闭的隐患巡查记录
      const hiddenDangerRecords = response.hiddenDangers.filter(({ status }) => +status !== 4);
      yield put({
        type: 'save',
        payload: { hiddenDangerRecords },
      });
      if (callback) {
        callback(hiddenDangerRecords);
      }
    },
    // 获取消防数据统计
    *fetchFireControlCount({ payload, callback }, { call, put }) {
      const response = yield call(getFireControlCount, payload);
      if (response.code === 200) {
        const fireControlCount = response.data.list[0] || {
          faultAssign: 0,
          shield_state: 0,
          warn: 0,
          warnTrue: 0,
          start_state: 0,
          fault_state: 0,
          warnFalse: 0,
          fault: 0,
          feedback_state: 0,
          faultSelf: 0,
          fire_state: 0,
          supervise_state: 0,
        };
        yield put({
          type: 'save',
          payload: { fireControlCount },
        });
        if (callback) {
          callback(fireControlCount);
        }
      }
    },
    // 获取隐患巡查统计
    *fetchHiddenDangerCount({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerCount, payload);
      yield put({
        type: 'save',
        payload: { hiddenDangerCount: response },
      });
      if (callback) {
        callback(response);
      }
    },
    // 获取维保情况统计
    *fetchMaintenanceCount({ payload, callback }, { call, put }) {
      const response = yield call(getMaintenanceCount, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: { maintenanceCount: response.data },
        });
        if (callback) {
          callback(response.data);
        }
      }
    },
    // 获取主机
    *fetchHosts({ payload, callback }, { call, put }) {
      const response = yield call(getHosts, payload);
      if (response.code === 200) {
        // 移除不需要的主机并做排序
        const hosts = response.data.list.filter(({ reset }) => +reset === 1).sort((a, b) => {
          return +b.isFire - a.isFire;
        });
        yield put({
          type: 'save',
          payload: { hosts },
        });
        if (callback) {
          callback();
        }
      }
    },
    // 复位单个主机
    *changeSingleHost({ payload, callback }, { call, put }) {
      const response = yield call(resetSingleHost, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateSingleHost',
          payload: payload.id,
        });
        if (callback) {
          callback();
        }
      }
    },
    // 复位所有主机
    *changeAllHosts({ payload, callback }, { call, put }) {
      const response = yield call(resetAllHosts, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateAllHosts',
        });
        if (callback) {
          callback();
        }
      }
    },
    // 获取视频列表
    // *fetchVideoList({ payload, callback }, { call, put }) {
    //   const response = yield call(getVideoList, payload);
    //   yield put({
    //     type: 'save',
    //     payload: { videoList: response.list },
    //   });
    //   if (callback) {
    //     callback();
    //   }
    // },
    *fetchVideoList({ payload, callback }, { call, put }) {
      const response = yield call(getVideoList, payload);
      yield put({
        type: 'save',
        payload: { videoFireList: response.list },
      });
      if (callback) {
        callback();
      }
    },
    // 获取企业信息
    *fetchCompanyMessage({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyMessage, payload);
      const companyMessage = {
        companyMessage: {
          companyName: '',
          headOfSecurity: '',
          headOfSecurityPhone: '',
          countCheckItem: 0,
        },
        ...response,
        // 移除坐标不存在的风险点
        point:
          response.point &&
          response.point.filter(
            ({ itemId, xFire, yFire }) =>
              itemId &&
              (xFire || Number.parseFloat(xFire) === 0) &&
              (yFire || Number.parseFloat(yFire) === 0)
          ),
        // 移除地址不合法的四色图
        fourColorImg:
          response.fourColorImg && response.fourColorImg.startsWith('[')
            ? JSON.parse(response.fourColorImg).filter(
                ({ id, webUrl }) => /^http/.test(webUrl) && id
              )
            : [],
        fireIchnographyUrl:
          response.fireIchnographyUrl && response.fireIchnographyUrl.startsWith('[')
            ? JSON.parse(response.fireIchnographyUrl).filter(
                ({ id, webUrl }) => /^http/.test(webUrl) && id
              )
            : [],
      };

      yield put({
        type: 'save',
        payload: { companyMessage },
      });
      if (callback) {
        callback(companyMessage);
      }
    },
    *fetchRiskDetail({ payload, success }, { call, put }) {
      const response = yield call(getRiskDetail, payload);
      const ycq = response.hiddenDangers
        .filter(({ status }) => +status === 7)
        .sort((a, b) => {
          return +a.plan_rectify_time - b.plan_rectify_time;
        })
        .map(transformHiddenDangerFields);
      const wcq = response.hiddenDangers
        .filter(({ status }) => +status === 1 || +status === 2)
        .sort((a, b) => {
          return +a.plan_rectify_time - b.plan_rectify_time;
        })
        .map(transformHiddenDangerFields);
      const dfc = response.hiddenDangers
        .filter(({ status }) => +status === 3)
        .sort((a, b) => {
          return +a.real_rectify_time - b.real_rectify_time;
        })
        .map(transformHiddenDangerFields);
      yield put({
        type: 'saveRiskDetail',
        payload: {
          ycq,
          wcq,
          dfc,
        },
      });
      if (success) {
        success();
      }
    },
    // 获取点位信息
    *fetchRiskPointInfo({ payload, callback }, { call, put }) {
      const response = yield call(getRiskPointInfo, payload);
      yield put({
        type: 'save',
        payload: { riskPointInfo: response.companyLetter },
      });
      if (callback) {
        callback();
      }
    },
    // 获取消防设施评分
    *fetchSystemScore({ payload }, { call, put }) {
      const response = yield call(getSystemScore, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveSystemScore',
          payload: response.data,
        });
      }
    },
    // 获取检查点各状态数量
    *fetchCheckCount({ payload }, { call, put }) {
      const response = yield call(getCheckStatusCount, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCheckCount',
          payload: response.data,
        });
      }
    },
    // 获取检查点具体信息
    *fetchCheckDetail({ payload, callback }, { call, put }) {
      const response = yield call(getCheckDetail, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCheckList',
          payload: response.data.list || [],
        });
        if (callback) {
          callback(callback);
        }
      }
    },
    // 巡查点异常记录
    *fetchPointRecord({ payload }, { call, put }) {
      const response = yield call(getPonitRecord, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'savePointRecord',
          payload: response.data || {},
        });
      }
    },
    // 获取当前隐患图表统计数据
    *fetchHiddenDangerNum({ payload }, { call, put }) {
      const response = yield call(fetchHiddenDangerNum, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCurrentHiddenDanger',
          payload: response.data,
        });
      }
    },
    // 获取当前隐患列表
    *fetchCurrentHiddenDanger({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerRecords, payload);
      if (response && response.hiddenDangers) {
        yield put({
          type: 'saveHiddenDangerList',
          payload: response.hiddenDangers,
        });
        if (callback) callback();
      }
    },
    // 获取隐患详情
    *fetchHiddenDangerDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchHiddenDangerDetail, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveHiddenDangerDetail',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    // 南消：点位巡查统计
    *fetchPointInspectionCount({ payload, callback }, { call, put }) {
      const response = yield call(getPointInspectionCount, payload);
      yield put({
        type: 'save',
        payload: { pointInspectionCount: response.data.list },
      });
      if (callback) {
        callback(response.data.list);
      }
    },
    // 南消：获取点位巡查列表
    *fetchPointInspectionList({ payload, callback }, { call, put }) {
      const response = yield call(getPointInspectionList, payload);
      yield put({
        type: 'save',
        payload: { pointInspectionList: response.data },
      });
      if (callback) {
        callback(response.data);
      }
    },
    // 南消：获取点位
    // *fetchPointList({ payload, callback }, { call, put }) {
    //   const response = yield call(getPointList, payload);
    //   yield put({
    //     type: 'save',
    //     payload: { pointList: response.data.list },
    //   });
    //   if (callback) {
    //     callback(response.data.list);
    //   }
    // },
    *fetchPointList({ payload, callback }, { call, put }) {
      const response = yield call(getPointList, payload);
      yield put({
        type: 'save',
        payload: { firePoint: response.data.list },
      });
      if (callback) {
        callback(response.data.list);
      }
    },

    // 获取大屏消息
    *fetchScreenMessage({ payload, success, error }, { call, put }) {
      const response = yield call(getScreenMessage, payload);
      if (response.code === 200) {
        yield put({
          type: 'screenMessage',
          payload: response.data || { list: [] },
        });
        if (success) {
          success(response.data || { list: [] });
        }
      } else if (error) {
        error();
      }
    },
    *fetchWebsocketScreenMessage({ payload, success, error }, { call, put }) {
      console.log('fetchWebsocketScreenMessage', payload);
      if (payload.code === 200) {
        yield put({
          type: 'saveScreenMessage',
          payload: payload.data,
        });
        if (success) {
          success(payload.data);
        }
      } else if (error) {
        error();
      }
    },
    // 火警动态列表或火警消息
    *fetchAlarmHandle({ payload, callback }, { call, put }) {
      const response = yield call(queryAlarmHandleList, payload);
      if (response && response.code === 200) {
        yield put({
          type: `saveAlarmHandle${
            payload.dataId ? 'Message' : payload.historyType ? 'History' : 'List'
          }`,
          payload: response.data ? response.data.list : [],
        });
        if (callback) callback(response);
      }
    },
    // 维保工单列表或维保处理动态
    *fetchWorkOrder({ payload }, { call, put }) {
      const response = yield call(queryWorkOrder, payload);
      if (response && response.code === 200) {
        yield put({
          type: payload.id ? 'saveWorkOrderDetail' : `saveWorkOrderList${payload.status}`,
          payload: response.data && Array.isArray(response.data.list) ? response.data.list : [],
        });
      }
    },
    // 获取火灾报警系统巡检记录
    *fetchCheckRecord({ payload }, { call, put }) {
      const response = yield call(fetchCheckRecord, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCheckRecord',
          payload: response.data,
        });
      }
    },
    *fetchFault({ payload, callback }, { call, put }) {
      const response = yield call(queryFault, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveFault',
          payload: response.data && Array.isArray(response.data.list) ? response.data.list : [],
        });
        if (callback) callback(response);
      }
    },
    // 维保巡查详情
    *fetchMaintenanceDetail({ payload, success, error }, { call, put }) {
      const response = yield call(queryMaintenanceRecordDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'maintenanceDetail',
          payload: response.data,
        });
        if (success) success(response);
      } else if (error) {
        error();
      }
    },
    // 企业负责人和维保员信息
    *fetchMaintenanceCompany({ payload, success, error }, { call, put }) {
      const response = yield call(queryCheckUsers, payload);
      if (response.code === 200) {
        yield put({
          type: 'maintenanceCompany',
          payload: response.data,
        });
        if (success) success(response);
      } else if (error) {
        error();
      }
    },
    // 消息故障详情
    *fetchMaintenanceMsg({ payload }, { call, put }) {
      const response = yield call(queryWorkOrderMsg, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveWorkOrderDetail',
          payload: response.data && Array.isArray(response.data.list) ? response.data.list : [],
        });
      }
    },
    // 根据processId查dataId
    *fetchDataId({ payload, success, error }, { call, put }) {
      const response = yield call(queryDataId, payload);
      if (response && response.code === 200) {
        if (success) success(response);
      } else if (error) {
        error();
      }
    },
  },

  reducers: {
    // 保存
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 复位单个主机
    updateSingleHost(state, { payload }) {
      return {
        ...state,
        hosts: state.hosts.map(item => {
          if (item.id === payload) {
            return {
              ...item,
              isReset: true,
            };
          }
          return item;
        }),
      };
    },
    // 复位所有主机
    updateAllHosts(state) {
      return {
        ...state,
        hosts: state.hosts.map(item => {
          return {
            ...item,
            isReset: true,
          };
        }),
      };
    },
    saveRiskDetail(state, { payload: riskDetailList }) {
      return {
        ...state,
        riskDetailList,
      };
    },
    // 消防设施评分
    saveSystemScore(state, { payload }) {
      return {
        ...state,
        systemScore: payload || {},
      };
    },
    // 检查点状态数量
    saveCheckCount(state, { payload }) {
      return {
        ...state,
        checkCount: payload || {},
      };
    },
    // 检查点具体信息
    saveCheckList(state, { payload }) {
      return {
        ...state,
        checkList: {
          ...state.checkList,
          checkLists: payload || [],
        },
      };
    },
    // 巡查点异常记录
    savePointRecord(state, { payload }) {
      return {
        ...state,
        pointRecordList: {
          ...state.pointRecordList,
          pointRecordLists: payload.result || [],
          abnormal: payload.abnormal || 0,
          count: payload.count || 0,
        },
      };
    },
    // 保存当前隐患内容
    saveCurrentHiddenDanger(state, { payload }) {
      return {
        ...state,
        currentHiddenDanger: {
          ...state.currentHiddenDanger,
          ...payload,
        },
      };
    },
    // 保存当前隐患列表
    saveHiddenDangerList(state, { payload }) {
      // 筛选掉已结束 1新建隐患.2待整改,3待复查,4已结束,7,超期未整改
      const list = payload.filter(({ status }) => +status !== 4);
      return {
        ...state,
        currentHiddenDanger: {
          ...state.currentHiddenDanger,
          list,
        },
      };
    },
    // 保存当前隐患详情
    saveHiddenDangerDetail(
      state,
      {
        payload: { hiddenDanger = {}, hiddenDangerRecord = [], timeLine },
      }
    ) {
      const timestampList = formatTimeLine(timeLine).map((item, i) => {
        if (i === 0) {
          return {
            timeLine: item,
            ...hiddenDanger,
            type: '1',
          };
        } else {
          if (hiddenDangerRecord.length < i)
            return {
              timeLine: item,
            };
          return {
            timeLine: item,
            ...hiddenDangerRecord[i - 1],
          };
        }
      });
      return {
        ...state,
        currentHiddenDanger: {
          ...state.currentHiddenDanger,
          timestampList,
        },
      };
    },
    saveScreenMessage(state, { payload }) {
      return {
        ...state,
        screenMessage: [payload, ...state.screenMessage],
      };
    },
    screenMessage(state, { payload }) {
      return {
        ...state,
        screenMessage: payload.list,
      };
    },
    saveAlarmHandleMessage(state, action) {
      return { ...state, alarmHandleMessage: action.payload || [] };
    },
    saveAlarmHandleList(state, action) {
      return { ...state, alarmHandleList: action.payload || [] };
    },
    saveAlarmHandleHistory(state, action) {
      return { ...state, alarmHandleHistory: action.payload || [] };
    },
    saveWorkOrderList1(state, action) {
      const list = action.payload;
      list.sort((item, item1) => item1.update_date - item.update_date); // 已完成工单，按照完成时间排序
      return { ...state, workOrderList1: list };
    },
    saveWorkOrderList2(state, action) {
      return { ...state, workOrderList2: action.payload }; // 待处理工单，按照报修时间排序，后台已处理
    },
    saveWorkOrderList7(state, action) {
      const list = action.payload;
      list.sort((item, item1) => item.plan_finish_date - item1.plan_finish_date); // 已超期工单，按照超期天数排序
      return { ...state, workOrderList7: list };
    },
    saveWorkOrderDetail(state, action) {
      return { ...state, workOrderDetail: action.payload };
    },
    saveCheckRecord(state, { payload }) {
      return {
        ...state,
        fireAlarm: {
          ...state.fireAlarm,
          ...payload,
        },
      };
    },
    saveFault(state, action) {
      return { ...state, faultList: action.payload };
    },
    maintenanceDetail(state, { payload }) {
      return {
        ...state,
        maintenanceDetail: payload,
      };
    },
    maintenanceCompany(state, { payload }) {
      return {
        ...state,
        maintenanceCompany: payload,
      };
    },
  },
};
