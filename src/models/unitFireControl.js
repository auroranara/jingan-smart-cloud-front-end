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

export default {
  namespace: 'unitFireControl',

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
  },

  effects: {
    // 获取待处理信息
    *fetchPendingInfo({ payload, success, error }, { call, put }) {
      const response = yield call(getPendingInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'savePendingInfo',
          payload: response.data.list,
        });
        if (success) {
          success(response.data.list);
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取待处理火警和待处理故障数量
    *fetchPendingNumber({ payload, success, error }, { call, put }) {
      const response = yield call(getPendingNumber, payload);
      if (response.code === 200) {
        yield put({
          type: 'savePendingNumber',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      }
      else if (error) {
        error();
      }
    },
    // 超期未整改隐患数量
    *fetchOutOfDateNumber({ payload, success }, { call, put }) {
      const response = yield call(getOutOfDateNumber, payload);
      yield put({
        type: 'saveOutOfDateNumber',
        payload: response.total,
      });
      if (success) {
        success(response.total);
      }
    },
    // 获取待整改隐患数量
    *fetchToBeRectifiedNumber({ payload, success }, { call, put }) {
      const response = yield call(getToBeRectifiedNumber, payload);
      yield put({
        type: 'saveToBeRectifiedNumber',
        payload: response.total,
      });
      if (success) {
        success(response.total);
      }
    },
    // 获取待巡查任务数量
    *fetchToBeInspectedNumber({ payload, success }, { call, put }) {
      const response = yield call(getToBeInspectedNumber, payload);
      yield put({
        type: 'saveToBeInspectedNumber',
        payload: response.total,
      });
      if (success) {
        success(response.total);
      }
    },
    // 获取火灾报警系统
    *fetchFireAlarmSystem({ payload, success, error }, { call, put }) {
      const response = yield call(getFireAlarmSystem, payload);
      if (response.code === 200) {
        const payload = response.data.list[0] || {
          fire_state: 0,
          fault_state: 0,
          start_state: 0,
          supervise_state: 0,
          shield_state: 0,
          feedback_state: 0,
        };
        yield put({
          type: 'saveFireAlarmSystem',
          payload,
        });
        if (success) {
          success(payload);
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取隐患巡查记录
    *fetchHiddenDangerRecords({ payload, success }, { call, put }) {
      const response = yield call(getHiddenDangerRecords, payload);
      yield put({
        type: 'saveHiddenDangerRecords',
        payload: response.hiddenDangers.filter(({ status }) => +status !== 4),
      });
      if (success) {
        success(response.hiddenDangers);
      }
    },
    // 获取消防数据统计
    *fetchFireControlCount({ payload, success, error }, { call, put }) {
      const response = yield call(getFireControlCount, payload);
      if (response.code === 200) {
        const payload = response.data.list[0] || {
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
          type: 'saveFireControlCount',
          payload,
        });
        if (success) {
          success(payload);
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取隐患巡查统计
    *fetchHiddenDangerCount({ payload, success }, { call, put }) {
      const response = yield call(getHiddenDangerCount, payload);
      yield put({
        type: 'saveHiddenDangerCount',
        payload: response,
      });
      if (success) {
        success(response);
      }
    },
    // 获取维保情况统计
    *fetchMaintenanceCount({ payload, success, error }, { call, put }) {
      const response = yield call(getMaintenanceCount, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveMaintenanceCount',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取主机
    *fetchHosts({ payload, success, error }, { call, put }) {
      const response = yield call(getHosts, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveHosts',
          payload: response.data.list,
        });
        if (success) {
          success(response.data.list);
        }
      }
      else if (error) {
        error();
      }
    },
    // 复位单个主机
    *changeSingleHost({ payload, success, error }, { call, put }) {
      const response = yield call(resetSingleHost, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateSingleHost',
          payload: payload.id,
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
    // 复位所有主机
    *changeAllHosts({ payload, success, error }, { call, put }) {
      const response = yield call(resetAllHosts, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateAllHosts',
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取视频列表
    *fetchVideoList({ payload, success, error }, { call, put }) {
      const response = yield call(getVideoList, payload);
      yield put({
        type: 'saveVideoList',
        payload: response.list,
      });
      if (success) {
        success();
      }
    },
  },

  reducers: {
    // 待处理信息
    savePendingInfo(state, { payload: pendingInfo }) {
      return {
        ...state,
        pendingInfo,
      };
    },
    // 待处理火警数量和待处理故障数量
    savePendingNumber(state, { payload: { fire: pendingFireNumber, fault: pendingFaultNumber } }) {
      return {
        ...state,
        pendingFireNumber,
        pendingFaultNumber,
      };
    },
    // 超期未整改隐患数量
    saveOutOfDateNumber(state, { payload: outOfDateNumber }) {
      return {
        ...state,
        outOfDateNumber,
      };
    },
    // 待整改隐患数量
    saveToBeRectifiedNumber(state, { payload: toBeRectifiedNumber }) {
      return {
        ...state,
        toBeRectifiedNumber,
      };
    },
    // 待巡查任务数量
    saveToBeInspectedNumber(state, { payload: toBeInspectedNumber }) {
      return {
        ...state,
        toBeInspectedNumber,
      };
    },
    // 火灾报警系统
    saveFireAlarmSystem(state, { payload: fireAlarmSystem }) {
      return {
        ...state,
        fireAlarmSystem,
      };
    },
    // 隐患巡查记录
    saveHiddenDangerRecords(state, { payload: hiddenDangerRecords }) {
      return {
        ...state,
        hiddenDangerRecords,
      };
    },
    // 消防数据统计
    saveFireControlCount(state, { payload: fireControlCount }) {
      return {
        ...state,
        fireControlCount,
      };
    },
    // 隐患巡查统计
    saveHiddenDangerCount(state, { payload: hiddenDangerCount }) {
      return {
        ...state,
        hiddenDangerCount,
      };
    },
    // 维保情况统计
    saveMaintenanceCount(state, { payload: maintenanceCount }) {
      return {
        ...state,
        maintenanceCount,
      };
    },
    // 主机
    saveHosts(state, { payload: hosts }) {
      return {
        ...state,
        hosts,
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
    // 视频列表
    saveVideoList(state, { payload: videoList }) {
      return {
        ...state,
        videoList,
      };
    },
  },
}
