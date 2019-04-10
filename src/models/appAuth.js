import { getTree, getList, getOne, postAuth, putAuth } from '../services/appAuth';

const DEFAULT_CODE = 500;

export default {
  namespace: 'appAuth',

  state: {
    tree: [],
    list: [],
  },

  effects: {
    *fetchTree({ payload, callback }, { call, put }) {
      let response = yield call(getTree, payload);
      response = response || {};
      const { code = DEFAULT_CODE, data = {} } = response;
      if (code === 200) {
        callback && callback(data.menu || []);
        yield put({ type: 'saveTree', payload: data.menu || [] });
      }
    },
    *fetchList({ payload, callback }, { call, put }) {
      let response = yield call(getList, payload);
      response = response || {};
      const { code = DEFAULT_CODE, data = {} } = response;
      if (code === 200) {
        callback && callback(data.list || []);
        yield put({ type: 'saveList', payload: data.list || [] });
      }
    },
    *postAuth({ payload, callback }, { call, put }) {
      let response = yield call(postAuth, payload);
      response = response || {};
      const { code = DEFAULT_CODE, msg } = response;
      callback && callback(code, msg);
    },
    *putAuth({ payload, callback }, { call, put }) {
      let response = yield call(putAuth, payload);
      response = response || {};
      const { code = DEFAULT_CODE, msg } = response;
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
  },
}
