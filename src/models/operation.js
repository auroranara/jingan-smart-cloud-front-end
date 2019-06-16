import {
  getTaskList,
  getTaskCount,
  getFireCount,
  getUnitList,
  getFirePie,
  getFireTrend,
  getFireList,
} from '@/services/operation';
import { message } from 'antd';
function error(msg) {
  message.error(msg);
}

export default {
  namespace: 'operation',

  state: {
    // 任务列表
    taskList: {},
    // 运维任务统计
    count: {
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
      // const response = { code: 200, data: {
      //   day: 10, // 待处理
      //   month: 10, // 处理中
      //   week: 10, // 已处理
      // } };
      const { code=500, msg='获取火警数量统计失败，请稍后重试', data } = response || {};
      if (code === 200) {
        const { day=0, month=0, week=0 } = data || {};
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
    saveUnitList(state, action) {
      return { ...state, unitList: action.payload };
    },
    saveFirePie(state, action) {
      return { ...state, firePie: action.payload };
    },
    saveFireTrend(state, action) {
      return { ...state, fireTrend: action.payload };
    },
    saveFireList(state, action) {
      const { pageNum, list } = action.payload;
      return { ...state, fireList: pageNum === 1 ? list : state.fireList.concat(list) };
    },
  },
}
