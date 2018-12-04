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
} from '../services/bigPlatform/fireControl';
import {
  // 企业信息(包含人员数量四色图等)
  getCompanyMessage,
  getRiskDetail,
} from '../services/bigPlatform/bigPlatform';
import moment from 'moment';

const getColorByRiskLevel = function(level) {
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
  hiddenDangerRecordDto: [{ fileWebUrl: background }] = [{}],
  source_type_name,
  companyBuildingItem,
  business_type,
  review_time,
}) => {
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
      "faultAssign": 0,
      "shield_state": 0,
      "warn": 0,
      "warnTrue": 0,
      "start_state": 0,
      "fault_state": 0,
      "warnFalse": 0,
      "fault": 0,
      "feedback_state": 0,
      "faultSelf": 0,
      "fire_state": 0,
      "supervise_state": 0,
    },
    // 隐患巡查统计
    hiddenDangerCount: {

    },
    // 维保情况统计
    maintenanceCount: {
      "needRepairNum": 0,
      "selfNoNum": 0,
      "selfDoingNum": 0,
      "selfFinishNum": 0,
      "assignNoNum": 0,
      "assignDoingNum": 0,
      "assignFinishNum": 0,
      "avgSelfTime": "",
      "selfAllNum": 0,
      "selfRate": "100%",
      "avgAssignTime": "",
      "assignAllNum": 0,
      "assignRate": "100%",
    },
    // 复位主机列表
    hosts: [],
    // 视频列表
    videoList: [],
    companyMessage: {
      companyMessage: {
        companyName: '',
        headOfSecurity: '',
        headOfSecurityPhone: '',
        countCheckItem: 0,
        countCompanyUser: 0,
      },
      check_map: [],
      hidden_danger_map: [],
      isImportant: false,
    },
    // 隐患详情
    riskDetailList: {
      ycq: [],
      wcq: [],
      dfc: [],
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
          "faultAssign": 0,
          "shield_state": 0,
          "warn": 0,
          "warnTrue": 0,
          "start_state": 0,
          "fault_state": 0,
          "warnFalse": 0,
          "fault": 0,
          "feedback_state": 0,
          "faultSelf": 0,
          "fire_state": 0,
          "supervise_state": 0,
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
          return +b.isFire-a.isFire;
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
    *fetchVideoList({ payload, callback }, { call, put }) {
      const response = yield call(getVideoList, payload);
      yield put({
        type: 'save',
        payload: { videoList: response.list },
      });
      if (callback) {
        callback();
      }
    },
    // 企业信息(包含人员数量四色图等)
    *fetchCompanyMessage({ payload, success, error }, { call, put }) {
      const response = yield call(getCompanyMessage, payload);
      const res = {
        ...response,
        point:
          response.point &&
          response.point.filter(
            ({ itemId, xNum, yNum }) =>
              itemId &&
              (xNum || Number.parseFloat(xNum) === 0) &&
              (yNum || Number.parseFloat(yNum) === 0)
          ),
        fourColorImg:
          response.fourColorImg && response.fourColorImg.startsWith('[')
            ? JSON.parse(response.fourColorImg).filter(
                ({ id, webUrl }) => /^http/.test(webUrl) && id
              )
            : [],
      };
      // if (response.code === 200) {
      yield put({
        type: 'companyMessage',
        payload: res,
      });
      if (success) {
        success(res);
      }
      // }
      // else if (error) {
      //   error();
      // }
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
    // 企业信息(包含人员数量四色图等)
    companyMessage(state, { payload }) {
      return {
        ...state,
        companyMessage: payload,
      };
    },
    saveRiskDetail(state, { payload: riskDetailList }) {
      return {
        ...state,
        riskDetailList,
      };
    },
  },
}
