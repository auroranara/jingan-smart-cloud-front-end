import { queryGeneralList, queryPersonList } from '../services/training/generalFile';

export default {
  namespace: 'generalFile',

  state: {
    examData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    personalData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    reportData: {},
  },

  effects: {
    // 综合档案---考试列表
    *fetchExamList({ payload }, { call, put }) {
      const response = yield call(queryGeneralList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveExamList',
          payload: response.data,
        });
      }
    },

    // 综合档案---人员列表
    *fetchPersonalList({ payload }, { call, put }) {
      const response = yield call(queryPersonList, payload);
      if (response.code === 200) {
        yield put({
          type: 'savePersonalList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    saveExamList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        examData: payload,
      };
    },
    savePersonalList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        personalData: payload,
      };
    },

    saveExamReport(state, { payload }) {
      return {
        ...state,
        reportData: payload,
      };
    },
  },
};
