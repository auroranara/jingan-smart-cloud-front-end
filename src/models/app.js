import { queryApp, removeApp, addApp, updateApp } from '../services/system/app.js';

export default {
  namespace: 'app',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      // console.log(payload);
      const response = yield call(queryApp, payload);
      const { status, msg } = response;
      if (status === 200 && msg === '成功') {
        yield put({
          type: 'save',
          payload: response.result,
        });
      }
      if (callback) callback(status, msg);
    },
    *add({ payload, pagination, callback }, { call }) {
      const { currentPage, pageSize } = pagination;
      const paginationPayload = {
        currentPage,
        pageSize,
        type: payload.type,
      };
      // console.log('payload', payload);
      // console.log('paginationPayload', paginationPayload);
      const response = yield call(addApp, payload);
      // console.log('add', response);
      const { status, msg } = response;
      if (callback) callback(status, msg, paginationPayload);
    },
    *update({ payload, pagination, callback }, { call }) {
      const { currentPage, pageSize } = pagination;
      const paginationPayload = {
        currentPage,
        pageSize,
        type: payload.type,
      };
      // console.log('update payload', payload);
      const response = yield call(updateApp, payload);
      // console.log('update response', response);
      const { status, msg } = response;
      if (callback) callback(status, msg, paginationPayload);
    },
    *remove({ payload, pagination, callback }, { call }) {
      const response = yield call(removeApp, payload);
      const { status, msg } = response;
      const { currentPage, pageSize } = pagination;
      const paginationPayload = {
        currentPage,
        pageSize,
        type: payload.type,
      };
      if (callback) callback(status, msg, paginationPayload);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
