import { queryApp, removeApp, addApp, updateApp } from '../services/system/app.js';

export default {
  namespace: 'app',

  state: {
    data: {
      list: [],
      pagination: {},
      andCount: '',
      iosCount: '',
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      // console.log(payload);
      const response = yield call(queryApp, payload);
      const { code, msg } = response;
      if (code === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
      if (callback) callback(code, msg);
    },
    *add({ payload, pagination, callback }, { call }) {
      const { pageNum, pageSize } = pagination;
      const paginationPayload = {
        pageNum,
        pageSize,
        type: payload.type,
      };
      // console.log('payload', payload);
      // console.log('paginationPayload', paginationPayload);
      const response = yield call(addApp, payload);
      // console.log('add', response);
      const { code, msg } = response;
      if (callback) callback(code, msg, paginationPayload);
    },
    *update({ payload, pagination, callback }, { call }) {
      const { pageNum, pageSize } = pagination;
      const paginationPayload = {
        pageNum,
        pageSize,
        type: payload.type,
      };
      // console.log('update payload', payload);
      const response = yield call(updateApp, payload);
      // console.log('update response', response);
      const { code, msg } = response;
      if (callback) callback(code, msg, paginationPayload);
    },
    *remove({ payload, pagination, callback }, { call }) {
      const response = yield call(removeApp, payload);
      const { code, msg } = response;
      const { pageNum, pageSize } = pagination;
      const paginationPayload = {
        pageNum,
        pageSize,
        type: payload.type,
      };
      if (callback) callback(code, msg, paginationPayload);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: { ...action.payload },
      };
    },
  },
};
