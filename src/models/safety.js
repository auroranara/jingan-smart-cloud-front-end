import { queryDetail, putDetail } from '../services/company/safety';

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
      const { code, menus, detail } = response;
      // console.log(code, typeof code, code !== 200);
      if (code !== 200)
        return;

      if (menus && typeof menus === 'object')
        yield put({ type: 'saveMenu', payload: menus });
      if (detail && typeof detail === 'object')
        yield put({ type: 'saveDetail', payload: detail });

      callback && callback(menus, detail);
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
