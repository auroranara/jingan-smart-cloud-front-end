import { fetchKnowledgeTree, fetchQuestions, addQuestion, fetchQuestionDetail, updateQuestion } from '../services/training/resourceManagement';
import { queryAddAccountOptions, queryUnits } from '../services/accountManagement';

export default {
  namespace: 'resourceManagement',
  state: {
    knowledgeTree: [],
    unitTypes: [],
    units: [],
    questions: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 5,
      },
      isLast: false,
      detail: {},
    },
  },
  effects: {
    // 获取知识点树
    *fetchKnowledgeTree({ payload }, { call, put }) {
      const response = yield call(fetchKnowledgeTree, payload)
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
    // 加载更多试题列表
    *appendQuestions({ payload }, { call, put }) {
      const response = yield call(fetchQuestions, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveAppendQuestions',
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
    // 获取试题详情
    *fetchQuestionDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchQuestionDetail, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveQuestionDetail',
          payload: response.data,
        })
        if (callback) callback(response.data)
      }
    },
    // 编辑试题
    *updateQuestion({ payload, success, error }, { call }) {
      const response = yield call(updateQuestion, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 获取单位类型
    /* *fetchUnitTypes(_, { call, put }) {
      const response = yield call(queryAddAccountOptions)
      if (response && response.code === 200) {
        yield put({
          type: 'saveUnitTypes',
          payload: response.data.unitType,
        })
      }
    }, */
    // 模糊查询单位列表
    *fetchUnitByName({ payload }, { call, put }) {
      const response = yield call(queryUnits, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveUnits',
          payload: response.data.list,
        })
      }
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
          pagination,
          pagination: {
            total,
            pageNum,
            pageSize,
          },
        },
      } = action
      return {
        ...state,
        questions: {
          ...state.questions,
          list: list,
          pagination: pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    saveQuestionDetail(state, action) {
      const { payload = {} } = action
      return {
        ...state,
        questions: {
          ...state.questions,
          detail: payload,
        },
      }
    },
    saveUnitTypes(state, { payload = [] }) {
      return {
        ...state,
        unitTypes: payload,
      }
    },
    saveUnits(state, { payload = [] }) {
      return {
        ...state,
        units: payload,
      }
    },
    saveAppendQuestions(state, action) {
      const {
        payload: {
          list = [],
          pagination,
          pagination: {
            total,
            pageNum,
            pageSize,
          },
        },
      } = action
      return {
        ...state,
        questions: {
          ...state.questions,
          list: [...state.questions.list, ...list],
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
  },
}
