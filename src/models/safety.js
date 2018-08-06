import { queryMenus, queryDetail, putDetail } from '../services/company/safety';

export default {
  namespace: 'safety',

  state: {
    menus: {},
    detail: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryDetail, payload);
      // console.log('response', response);
      const { code, data } = response;
      // console.log(code, typeof code, code !== 200);
      if (code !== 200)
        return;

      callback && callback(data);
      if (data && typeof data === 'object')
        yield put({ type: 'saveDetail', payload: data });
    },
    *fetchMenus({ payload, callback }, { call, put }) {
      const response = yield call(queryMenus, payload);
      const { code, data } = response;

      if (code !== 200)
        return;

      callback && callback(data);
      if (data && typeof data === 'object')
        yield put({ type: 'saveMenu', payload: data });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(putDetail, payload);
      const { code, msg } = response;
      callback(code, msg);
    },
  },

  reducers: {
    saveMenu(state, action) {
      // console.log(action);
      return { ...state, menus: action.payload };
    },
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
};
