import {
  queryTrainingMaterials,
  queryKnowledgeTree,
  queryCompanies,
  addReadRecord,
} from '../services/training/learning.js';

export default {
  namespace: 'learning',
  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
      isLast: false,
    },
    detail: {},
    treeData: {
      knowledgeList: [],
    },
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
    searchInfo: undefined,
  },

  effects: {
    // 文章列表
    *fetch({ payload, success, error }, { call, put }) {
      const response = yield call(queryTrainingMaterials, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
          params: payload,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 课件列表
    *fetchCoursewareList({ payload }, { call, put }) {
      const response = yield call(queryTrainingMaterials, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCoursewareList',
          payload: response.data,
          params: payload,
        });
      }
    },

    // 获取知识点树
    *fetchTree({ payload, callback }, { call, put }) {
      const response = yield call(queryKnowledgeTree, payload);
      if (response && response.code === 200) {
        if (callback) callback([...response.data.list]);
        yield put({
          type: 'saveTree',
          payload: response.data.list,
        });
      }
    },

    // 获取企业列表
    *fetchCompanies({ payload, success, error }, { call, put }) {
      const response = yield call(queryCompanies, payload);
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

    // 文章课件增加阅读记录
    *featchReadRecord({ payload, callback }, { call }) {
      const response = yield call(addReadRecord, payload);
      if (response && response.code === 200) {
        if (callback) callback();
      }
    },
  },
  reducers: {
    // 文章列表
    saveList(
      state,
      {
        payload: {
          list = [],
          pagination,
          pagination: { pageNum, pageSize, total },
        },
        params,
      }
    ) {
      return {
        ...state,
        data: {
          ...state.data,
          list: params.readStatus
            ? list.filter(data => data.readStatus === params.readStatus)
            : list,
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      };
    },

    // 课件列表
    saveCoursewareList(
      state,
      {
        payload: {
          list = [],
          pagination,
          pagination: { pageNum, pageSize, total },
        },
        params,
      }
    ) {
      return {
        ...state,
        data: {
          ...state.data,
          list: params.readStatus
            ? list.filter(data => data.readStatus === params.readStatus)
            : list,
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      };
    },

    // 获取知识点树
    saveTree(state, { payload }) {
      return {
        ...state,
        treeData: {
          ...state.treeData,
          knowledgeList: payload || [],
        },
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
