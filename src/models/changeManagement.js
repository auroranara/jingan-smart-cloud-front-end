import {
  evaluate,
  approve,
  getChangeList,
  getLogList,
} from '../services/changeWarning';
import { getList } from '@/utils/service';

export default {
  namespace: 'changeManagement',

  state: {
    total: 0,
    list: [],
    logList: [],
  },

  effects: {
    *fetchChangeList({ payload, callback }, { call, put }) {
      const response = yield call(getChangeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({ type: 'saveTotal', payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0 });
        yield put({ type: 'saveList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
    *fetchLogList({ payload, callback }, { call, put }) {
      const response = yield call(getLogList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({ type: 'saveLogList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
    *postEvaluate({ payload, callback }, { call }) {
      const response = yield call(evaluate, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *postApprove({ payload, callback }, { call }) {
      const response = yield call(approve, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
  },

  reducers: {
    saveTotal(state, action) {
      return { ...state, total: action.payload };
    },
    saveList(state, action) {
      return { ...state, list: action.payload };
    },
    saveLogList(state, action) {
      return { ...state, logList: action.payload };
    },
  },
}
