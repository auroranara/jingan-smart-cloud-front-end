import {
  queryGeneralList,
  queryPersonList,
  queryExamDetail,
  queryMultipleReport,
  queryFileCompanies,
} from '../services/training/generalFile';

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
    examDetailData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    multipleData: {},
    searchInfo: undefined,
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
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

    // 综合档案---考试详情
    *fetchExamDetail({ payload }, { call, put }) {
      const response = yield call(queryExamDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveExamDetail',
          payload: response.data,
        });
      }
    },

    // 考试成绩综合分析报告
    *fetchMultipleReport({ payload }, { call, put }) {
      const response = yield call(queryMultipleReport, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveMultipleReport',
          payload: response.data,
        });
      }
    },

    // 获取企业列表
    *fetchCompanies({ payload, success, error }, { call, put }) {
      const response = yield call(queryFileCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCompanies',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
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
    saveExamDetail(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        examDetailData: payload,
      };
    },
    saveMultipleReport(state, { payload }) {
      return {
        ...state,
        multipleData: payload,
      };
    },

    // 获取企业
    saveCompanies(state, { payload }) {
      return {
        ...state,
        modal: payload,
      };
    },

    // 保存搜索条件
    saveSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload || null,
      };
    },
  },
};
