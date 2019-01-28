import {
  query as queryUsers,
  queryCurrent,
  activationSendCode,
  forgetSendCode,
  verifyCode,
  updatePwd,
} from '../services/user';
import { getGrids } from '../services/bigPlatform/gridSelect';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    grids: [],
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
      const setting = { contentWidth: 'Fixed', layout: 'topmenu' };
      const response = yield call(queryCurrent);
      if (response && response.data) {
        const {
          data: { unitType },
        } = response;
        // 是否是运营来判断
        yield put({
          type: 'setting/changeSetting',
          payload: unitType === 3 ? { contentWidth: 'Fluid', layout: 'sidemenu' } : setting,
        });
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
    *activationSendCode({ payload, callback }, { call }) {
      const response = yield call(activationSendCode, payload);
      if (callback) callback(response);
    },
    *forgetSendCode({ payload, callback }, { call }) {
      const response = yield call(forgetSendCode, payload);
      if (callback) callback(response);
    },
    *verifyCode({ payload, callback }, { call }) {
      const response = yield call(verifyCode, payload);
      if (callback) callback(response);
    },
    *updatePwd({ payload, callback }, { call }) {
      const response = yield call(updatePwd, payload);
      if (callback) callback(response);
    },
    *fetchGrids({ payload, callback }, { call, put }) {
      const response = yield call(getGrids);
      if (Array.isArray(response)) {
        yield put({ type: 'saveGrids', payload: response });
        callback && callback(response);
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
    saveGrids(state, action) {
      return { ...state, grids: action.payload };
    },
  },
};
