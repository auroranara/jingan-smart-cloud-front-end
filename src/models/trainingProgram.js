import {
  getList,
  getDetail,
  add,
  edit,
} from '@/services/trainingProgram';

export default {
  namespace: 'trainingProgram',

  state: {
    list: {},
    detail: {},
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'save',
          payload: {
            list: data,
          },
        });
        callback && callback(data);
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'save',
          payload: {
            detail: data,
          },
        });
        callback && callback(data);
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code } = response || {};
      callback && callback(code === 200);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code } = response || {};
      callback && callback(code === 200);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
