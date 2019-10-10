import {
  getTableList,
  addItem,
  getItem,
  editItem,
  deleteItem,
} from '../services/msds';
import { getList } from '@/utils/service';

export default {
  namespace: 'msds',

  state: {
    total: 0,
    list: [],
    detail: {},
  },

  effects: {
    *fetchTableList({ payload, callback }, { call, put }) {
      const response = yield call(getTableList, payload);
      const { code, data, msg } = response || {};
      if (code === 200) {
        yield put({ type: 'saveTotal', payload: data && data.pagination && data.pagination.total ? data.pagination.total : 0 });
        yield put({ type: 'saveTableList', payload: getList(data) });
        callback && callback(code, msg);
      }
    },
    *addMSDS({ payload, callback }, { call }) {
      const response = yield call(addItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *getMSDS({ payload, callback }, { call, put }) {
      const response = yield call(getItem, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const detail = data || {};
        yield put({ type: 'saveDetail', payload: detail });
        callback && callback(detail);
      }
    },
    *editMSDS({ payload, callback }, { call }) {
      const response = yield call(editItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *deleteMSDS({ payload, callback }, { call }) {
      const response = yield call(deleteItem, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
  },

  reducers: {
    saveTotal(state, action) {
      return { ...state, total: action.payload };
    },
    saveTableList(state, action) {
      return { ...state, list: action.payload };
    },
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
}
