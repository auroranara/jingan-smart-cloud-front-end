import { querySelfExamDocument } from '../services/training/myFile';

export default {
  namespace: 'myFile',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
  },

  effects: {
    // 个人档案列表
    *fetchSelfList({ payload }, { call, put }) {
      const response = yield call(querySelfExamDocument, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSelfList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    saveSelfList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        data: payload,
      };
    },
  },
};
