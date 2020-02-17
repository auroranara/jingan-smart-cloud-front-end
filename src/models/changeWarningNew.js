import {
  evaluate,
  getWarningNewList,
} from '../services/changeWarning';
import { getList } from '@/utils/service';

export default {
  namespace: 'changeWarningNew',

  state: {
    total: 0,
    list: [],
  },

  effects: {
    *fetchWarningNewList({ payload, callback }, { call, put }) {
      const response = yield call(getWarningNewList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({ type: 'saveTotal', payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0 });
        yield put({ type: 'saveList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
    *postEvaluate({ payload, callback }, { call, put }) {
      const response = yield call(evaluate, payload);
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
  },
}
