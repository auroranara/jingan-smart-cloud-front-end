import { getList, getDetail, add, edit, remove } from '@/services/HAZOP';

export default {
  namespace: 'HAZOP',

  state: {
    list: {},
    detail: {},
  },

  effects: {
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'save',
          payload: {
            list: data,
          },
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'save',
          payload: {
            detail: data,
          },
        });
        callback && callback(true, data);
      } else {
        callback && callback(false, msg);
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback(code === 200, msg);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      callback(code === 200, msg);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      const { code, msg } = response || {};
      callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
