import { getList, getLatest } from '../services/position';

export default {
  namespace: 'position',

  state: {
    list: [],
  },

  effects: {
    *fetchLatest({ payload, callback }, { call, put }) {
      const { code, data } = yield call(getLatest, payload);
      if (code === 200 && callback) {
        callback(data);
      }
      else if (callback) {
        callback();
      }
    },
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const list = response.data.list.filter(({ xarea, yarea }) => xarea <= 100 && yarea <= 100);
      if (response.code === 200) {
        yield put({ type: 'save', payload: { list }});
        if (callback) {
          callback(list);
        }
      }
      else if (callback) {
        callback();
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
