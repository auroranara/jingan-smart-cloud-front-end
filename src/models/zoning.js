import { getZone, zoning } from '../services/zoning';

export default {
  namespace: 'zoning',

  state: {
    zone: {},
  },

  effects: {
    *fetchZone({ payload, callback }, { call, put }) {
      const { code, data } = yield call(getZone, payload);
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            zone: data,
          },
        });
        if (callback) {
          callback(data);
        }
      }
      else if (callback) {
        callback();
      }
    },
    *zoning({ payload, callback }, { call, put }) {
      const { code } = yield call(zoning, payload);
      if (callback) {
        callback(code === 200);
      }
    },
  },
  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
