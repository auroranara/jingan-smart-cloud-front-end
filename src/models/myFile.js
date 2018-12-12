import { querySelfExamDocument, queryExamReport } from '../services/training/myFile';

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
    analysisData: {},
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

    // 考试成绩综合分析报告
    *fetchExamReport({ payload }, { call, put }) {
      const response = yield call(queryExamReport, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveExamReport',
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

    saveExamReport(state, { payload }) {
      return {
        ...state,
        analysisData: payload,
      };
    },
  },
};
