import { query as queryUsers, queryCurrent } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    // currentUser: { permissionCodes: [] },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const setting = { grid: 'Wide', layout: 'topmenu' };
      const response = yield call(queryCurrent);
      if (response && response.data) {
        const {
          data: { unitType },
        } = response;
        // 是否是运营来判断
        yield put({
          type: 'setting/changeSetting',
          payload: unitType === 3 ? { grid: 'Fluid', layout: 'sidemenu' } : setting,
        });
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
