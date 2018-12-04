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
} from '../services/bigPlatform/fireControl';

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
    // 获取企业信息
    *fetchCompanyMessage({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyMessage, payload);
      const companyMessage = {
        ...response,
        // 移除坐标不存在的风险点
        point:
          response.point &&
          response.point.filter(
            ({ itemId, xNum, yNum }) =>
              itemId &&
              (xNum || Number.parseFloat(xNum) === 0) &&
              (yNum || Number.parseFloat(yNum) === 0)
          ),
        // 移除地址不合法的四色图
        fourColorImg:
          response.fourColorImg && response.fourColorImg.startsWith('[')
            ? JSON.parse(response.fourColorImg).filter(
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
  },
}
