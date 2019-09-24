import {
  queryCaseList,
  queryCaseAdd,
  queryCaseEdit,
  queryCaseDelete,
} from '../services/typicalAccidentCase';

export default {
  namespace: 'typicalAccidentCase',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: { data: [] },
  },

  effects: {
    // 案例列表
    *fetchCaseList({ payload, callback }, { call, put }) {
      const response = yield call(queryCaseList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'saveCaseList',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    // 新增
    *fetchCaseAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryCaseAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveCaseAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 编辑
    *fetchCaseEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryCaseEdit, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCaseUpdate',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除
    *fetchCaseDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryCaseDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'removeCase', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    saveCaseList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        data: payload,
      };
    },
    saveCaseAdd(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    saveCaseUpdate(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    clearDetail(state) {
      return {
        ...state,
        detail: { data: {} },
      };
    },
    removeCase(state, { payload: id }) {
      return {
        ...state,
        data: {
          ...state.data,
          list: state.data.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
