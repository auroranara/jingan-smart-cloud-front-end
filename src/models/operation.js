import {
  getTaskList,
  getTaskCount,
  getFireCount,
  getUnitList,
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
    unitList: [],
  },

  effects: {
    *fetchTaskList({ payload }, { call, put }) {
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
      // const response = yield call(getFireCount, payload);
      const response = { code: 200, data: {
        day: 10, // 待处理
        month: 10, // 处理中
        week: 10, // 已处理
      } };
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
      const { code, list } = response || {};
      if (code === 200) {
        const lst = Array.isArray(list) ? list : [];
        yield put({ type: 'saveUnitList', payload: lst });
        callback && callback(lst);
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
    saveUnitList(state, payload) {
      return { ...state, unitList: payload.action };
    },
  },
}
