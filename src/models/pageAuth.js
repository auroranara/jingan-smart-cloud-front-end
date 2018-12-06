import { getTree, getList, getOne, postAuth, putAuth } from '../services/pageAuth';

const DEFAULT_CODE = 500;
const EMPTY_OBJECT = {};

export default {
  namespace: 'pageAuth',

  state: {
    tree: [],
    list: [],
    detail: {},
  },

  effects: {
    *fetchTree({ payload, callback }, { call, put }) {
      let response = yield call(getTree, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) {
        callback && callback(data.menu || []);
        yield put({ type: 'saveTree', payload: data.menu || [] });
      }
    },
    *fetchList({ payload, callback }, { call, put }) {
      let response = yield call(getList, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) {
        callback && callback(data.list || []);
        yield put({ type: 'saveList', payload: data.list || [] });
      }
    },
    *fetchOne({ payload, callback }, { call, put }) {
      let response = yield call(getOne, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) {
        callback && callback(data);
        yield put({ type: 'saveDetail', payload: data});
      }
    },
    *postAuth({ payload, callback }, { call, put }) {
      let response = yield call(postAuth, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT, msg } = response;
      callback && callback(code, msg);
    },
    *putAuth({ payload, callback }, { call, put }) {
      let response = yield call(putAuth, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT, msg } = response;
      callback && callback(code, msg);
    },
  },
  reducers: {
    saveTree(state, action) {
      return { ...state, tree: action.payload };
    },
    saveList(state, action) {
      return { ...state, list: action.payload };
    },
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
}
