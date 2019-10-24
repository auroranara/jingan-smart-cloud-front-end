import {
  getList,
  getDetail,
  add,
  edit,
  execute,
  remove,
} from '@/services/trainingProgram';

export default {
  namespace: 'trainingProgram',

  state: {
    list: {},
    detail: {},
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      // const response = yield call(getList, payload);
      const response = {
        code: 200,
        data: {
          list: [],
          pagination: {
            pageSize: 10,
            pageNum: 1,
            total: 0,
          },
        },
      };
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
      // const response = yield call(getDetail, payload);
      const response = {
        code: 200,
        data: {
          id: 1,
        },
      };
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
      // const response = yield call(add, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *edit({ payload, callback }, { call }) {
      // const response = yield call(edit, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *execute({ payload, callback }, { call }) {
      // const response = yield call(execute, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *remove({ payload, callback }, { call }) {
      // const response = yield call(remove, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
