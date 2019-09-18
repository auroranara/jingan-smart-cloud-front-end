import {
  getList,
  getHistory,
  getDetail,
  add,
  edit,
} from '@/services/emergencyPlan';

export default {
  namespace: 'emergencyPlan',

  state: {
    list: {},
    history: {},
    detail: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            list: data || {},
          },
        });
      }
    },
    *fetchHistory({ payload }, { call, put }) {
      // const response = yield call(getHistory, payload);
      const response = {
        code: 200,
        data: {

        },
      };
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            history: data || {},
          },
        });
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const detail = data || {};
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(detail);
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
};
