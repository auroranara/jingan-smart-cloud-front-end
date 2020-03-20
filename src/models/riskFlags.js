import {
  getTableList,
  post,
  get,
  put,
  del,
} from '@/services/riskFlags';
import { getList } from '@/utils/service';

export default {
  namespace: 'riskFlags',

  state: {
    total: 0,
    list: [],
    detail: {},
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(getTableList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({
          type: 'saveTotal',
          payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0,
        });
        yield put({ type: 'saveList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(get, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const detail = data || {};
        yield put({ type: 'saveDetail', payload: detail });
        callback && callback(detail);
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(post, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(put, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(del, payload);
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
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
};
