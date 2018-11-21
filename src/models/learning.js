import { queryTrainingMaterials, queryKnowledgeTree } from '../services/training/learning.js';

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
    },
    detail: {},
    treeData: {
      knowledgeList: [],
    },
  },

  effects: {
    // 列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTrainingMaterials, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
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
  },
  reducers: {
    // 列表
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        data: payload,
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
  },
};
