import {
  // 获取待处理信息
  getPendingInfo,
  // 获取待处理火警和待处理故障数量
  getPendingNumber,
  // 超期未整改隐患数量
  getOutOfDateNumber,
  // 获取待整改隐患数量
  getToBeRectifiedNumber,
  // 获取待维保任务数量（注：未完成，需变更）
  getToBeMaintainedNumber,
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
    // 待维保任务数量（注：未完成，需变更）
    toBeMaintainedNumber: 0,
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
    // 获取待维保任务数量（注：未完成，需变更）
    *fetchToBeMaintainedNumber({ payload, success }, { call, put }) {
      const response = yield call(getToBeMaintainedNumber, payload);
      yield put({
        type: 'saveToBeMaintainedNumber',
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
        payload: response.dangerList,
      });
      if (success) {
        success(response.dangerList);
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
    // 待维保任务数量（注：未完成，需变更）
    saveToBeMaintainedNumber(state, { payload: toBeMaintainedNumber }) {
      return {
        ...state,
        toBeMaintainedNumber,
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
  },
}
