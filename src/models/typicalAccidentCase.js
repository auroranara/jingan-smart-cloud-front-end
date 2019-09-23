import { queryCaseAdd } from '../services/typicalAccidentCase';

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
  },

  reducers: {
    saveCaseAdd(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
  },
};
