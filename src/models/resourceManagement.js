import { fetchKnowledgeTree, fetchQuestions, addQuestion } from '../services/training/resourceManagement';

export default {
  namespace: 'resourceManagement',
  state: {
    knowledgeTree: [],
    questions: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
  },
  effects: {
    // 获取知识点树
    *fetchKnowledgeTree(_, { call, put }) {
      const response = yield call(fetchKnowledgeTree)
      if (response && response.code === 200) {
        yield put({
          type: 'saveKnowledgeTree',
          payload: response.data,
        })
      }
    },
    // 获取试题列表
    *fetchQuestions({ payload }, { call, put }) {
      const response = yield call(fetchQuestions, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveQuestions',
          payload: response.data,
        })
      }
    },
    // 添加试题
    *addQuestion({ payload, success, error }, { call, put }) {
      const response = yield call(addQuestion, payload)
      if (response && response.code === 200) {
        if (success) success(response)
      } else if (error) error()
    },
  },
  reducers: {
    saveKnowledgeTree(state, action) {
      const { payload: { list = [] } } = action
      return {
        ...state,
        knowledgeTree: list,
      }
    },
    saveQuestions(state, action) {
      const {
        payload: {
          list = [],
          pagination = {
            total: 0,
            pageNum: 1,
            pageSize: 10,
          },
        },
      } = action
      return {
        ...state,
        questions: {
          ...state.questions,
          list: list,
          pagination: pagination,
        },
      }
    },
  },
}
