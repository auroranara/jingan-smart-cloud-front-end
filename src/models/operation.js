import {
  getTaskList,
  getTaskCount,
  getFireCount,
  getUnitList,
  getFirePie,
  getFireTrend,
  getFireList,
  getScreenMessage,
  getVideoList,
} from '@/services/operation';
import {
  queryAlarmHandleList,
  queryWorkOrderMsg,
  queryDataId,
}from '@/services/bigPlatform/fireControl'
import { message } from 'antd';
function error(msg) {
  message.error(msg);
}

export default {
  namespace: 'operation',

  state: {
    // 任务列表
    taskList: {},
    taskList2: {},
    // 运维任务统计
    taskCount: {
      pending: 0, // 待处理
      processing: 0, // 处理中
      processed: 0, // 已处理
    },
    // 火警数量统计
    fireCount: {
      day: 0,
      week: 0,
      month: 0,
    },
    unitList: [], // 地图企业列表
    firePie: {},
    fireTrend: [],
    fireList: [],
    // 大屏消息
    screenMessage: [],
    // 火警消息
    alarmHandleMessage: [],
    // 火警动态
    alarmHandleList: [],
    alarmHandleHistory: [],
    maintenanceCompany: {
      name: [],
      PrincipalName: '', // 安全管理员
      PrincipalPhone: '', // 安全管理员电话
    },
    // 维保处理动态详情
    workOrderDetail: [],
  },
  effects: {
    *fetchTaskList({ payload, callback }, { call, put }) {
      const response = yield call(getTaskList, payload);
      const { code=500, msg='获取任务失败，请稍后重试', data } = response || {};
      if (code === 200) {
        const { pageSize, pageNum } = payload;
        const { list, pagination } = data || {};
        const { listSize: total } = pagination || {};
        yield put({
          type: 'saveTaskList',
          payload: {
            list: list || [],
            pagination: { pageSize, pageNum, total: total || 0 },
          },
        });
        callback && callback();
      } else {
        error(msg);
      }
    },
    *fetchTaskList2({ payload, callback }, { call, put }) {
      const response = yield call(getTaskList, payload);
      const { code=500, msg='获取任务失败，请稍后重试', data } = response || {};
      if (code === 200) {
        const { pageSize, pageNum } = payload;
        const { list, pagination } = data || {};
        const { listSize: total } = pagination || {};
        yield put({
          type: 'saveTaskList2',
          payload: {
            list: list || [],
            pagination: { pageSize, pageNum, total: total || 0 },
          },
        });
        callback && callback();
      } else {
        error(msg);
      }
    },
    *fetchTaskCount({ payload }, { call, put }) {
      const response = yield call(getTaskCount, payload);
      const { code=500, msg='获取运维任务统计失败，请稍后重试', data } = response || {};
      if (code === 200) {
        const { pendingFire: pending=0, processFire: processing=0, finishFire: processed=0 } = data || {};
        yield put({
          type: 'save',
          payload: {
            taskCount: {
              pending,
              processing,
              processed,
            },
          },
        });
      } else {
        error(msg);
      }
    },
    *fetchFireCount({ payload }, { call, put }) {
      const response = yield call(getFireCount, payload);
      const { code=500, msg='获取火警数量统计失败，请稍后重试', data } = response || {};
      if (code === 200) {
        const { day = 0, month = 0, week = 0 } = data || {};
        yield put({
          type: 'save',
          payload: {
            fireCount: {
              day,
              month,
              week,
            },
          },
        });
      } else {
        error(msg);
      }
    },
    *fetchUnitList({ payload, callback }, { call, put }) {
      const response = yield call(getUnitList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const lst = data && Array.isArray(data.list) ? data.list : [];
        yield put({ type: 'saveUnitList', payload: lst });
        callback && callback(lst);
      }
    },
    *fetchFirePie({ payload }, { call, put }) {
      const response = yield call(getFirePie, payload);
      const { code, data } = response || {};
      if (code === 200)
        yield put({ type: 'saveFirePie', payload: data || {} });
    },
    *fetchFireTrend({ payload }, { call, put }) {
      const response = yield call(getFireTrend);
      const { code, data } = response || {};
      if (code === 200)
        yield put({ type: 'saveFireTrend', payload: data && Array.isArray(data.list) ? data.list : [] });
    },
    *fetchFireList({ payload, callback }, { call, put }) {
      const response = yield call(getFireList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const lst = data && Array.isArray(data.list) ? data.list : [];
        let pageNum, total;
        if (data && data.pagination) {
          pageNum = data.pagination.pageNum ? data.pagination.pageNum : 1;
          total = data.pagination.total ? data.pagination.total : 0;
        }
        yield put({ type: 'saveFireList', payload: { pageNum, list: lst } });
        callback && callback(total);
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
    // 消息故障详情
    *fetchMaintenanceMsg({ payload, callback }, { call, put }) {
      const response = yield call(queryWorkOrderMsg, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveWorkOrderDetail',
          payload: response.data && Array.isArray(response.data.list) ? response.data.list : [],
        });
      }
      if (callback) callback(response);
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
    *fetchVideoList({ payload, callback }, { call }) {
      const response = yield call(getVideoList, payload);
      callback && callback(response);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveTaskList(state, { payload: { list, pagination } }) {
      return {
        ...state,
        taskList: {
          list: pagination.pageNum === 1 ? list : [...state.taskList.list, ...list],
          pagination,
        },
      };
    },
    saveTaskList2(state, { payload: { list, pagination } }) {
      return {
        ...state,
        taskList2: {
          list: pagination.pageNum === 1 ? list : [...state.taskList2.list, ...list],
          pagination,
        },
      };
    },
    saveUnitList(state, action) {
      return { ...state, unitList: action.payload };
    },
    saveFirePie(state, action) {
      return { ...state, firePie: action.payload };
    },
    saveFireTrend(state, action) {
      const fireTrend = action.payload;
      fireTrend.reverse();
      return { ...state, fireTrend };
    },
    saveFireList(state, action) {
      const { pageNum, list } = action.payload;
      return { ...state, fireList: pageNum === 1 ? list : state.fireList.concat(list) };
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
    saveWorkOrderDetail(state, action) {
      return { ...state, workOrderDetail: action.payload };
    },
  },
}
