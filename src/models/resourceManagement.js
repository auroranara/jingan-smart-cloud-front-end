import {
  fetchKnowledgeTree,
  fetchQuestions,
  addQuestion,
  fetchQuestionDetail,
  updateQuestion,
  fetchArticlesOrCourseWare,
  addArticlesOrCourseWare,
  deleteQuestion,
  editArticlesOrCourseWare,
  addReadRecord,
  deleteArticleOrCourseWare,
} from '@/services/training/resourceManagement';
import { queryUnits } from '@/services/accountManagement';
import { getCompanyList } from '@/services/examinationPaper.js';
export default {
  namespace: 'resourceManagement',
  state: {
    knowledgeTree: [],
    unitTypes: [],
    units: [],
    companyList: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    questions: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      isLast: false,
      detail: {},
    },
    article: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      isLast: false,
      detail: {},
    },
    courseWare: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      isLast: false,
      detail: {},
    },
    searchInfo: {},
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
    // 删除试题
    *deleteQuestion({ payload, success, error }, { call, put }) {
      const response = yield call(deleteQuestion, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 获取文章列表
    *fetchArticles({ payload }, { call, put }) {
      const response = yield call(fetchArticlesOrCourseWare, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveArticles',
          payload: response.data,
        })
      }
    },
    // 加载更多文章
    *appendArticles({ payload }, { call, put }) {
      const response = yield call(fetchArticlesOrCourseWare, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveAppendArticles',
          payload: response.data,
        })
      }
    },
    // 新增文章或课件
    *addArticlesOrCourseWare({ payload, success, error }, { call }) {
      const response = yield call(addArticlesOrCourseWare, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 获取文章详情
    *fetchArticleDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchArticlesOrCourseWare, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveArticleDetail',
          payload: response.data,
        })
        if (callback) callback(response.data.list[0])
      }
    },
    // 修改文章或课件
    *editArticlesOrCourseWare({ payload, success, error }, { call, put }) {
      const response = yield call(editArticlesOrCourseWare, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 获取课件列表
    *fetchCourseWare({ payload }, { call, put }) {
      const response = yield call(fetchArticlesOrCourseWare, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCourseWare',
          payload: response.data,
        })
      }
    },
    // 获取课件详情
    *fetchCourseWareDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchArticlesOrCourseWare, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCourseWareDetail',
          payload: response.data,
        })
        if (callback) callback(response.data.list[0])
      }
    },
    // 文章课件增加阅读记录
    *addReadRecord({ payload, callback }, { call }) {
      const response = yield call(addReadRecord, payload)
      if (response && response.code === 200) {
        if (callback) callback()
      }
    },
    // 获取更多课件
    *appendCourseWare({ payload }, { call, put }) {
      const response = yield call(fetchArticlesOrCourseWare, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveAppendCourseWare',
          payload: response.data,
        })
      }
    },
    // 获取企业列表
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyList',
          payload: response.data,
        })
        if (callback) callback()
      }
    },
    // 删除文章或课件
    *deleteArticleOrCourseWare({ payload, success, error }, { call }) {
      const response = yield call(deleteArticleOrCourseWare, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 改变文章发布状态
    *changePublishStatus({ payload, success, error }, { call, put }) {
      const response = yield call(editArticlesOrCourseWare, payload)
      if (response && response.code === 200) {
        if (payload.type === '1') {
          yield put({
            type: 'saveNewStatusArticles',
            payload,
          })
        } else if (payload.type === '2' || payload.type === '3') {
          yield put({
            type: 'saveNewStatusCourseWare',
            payload,
          })
        }
        if (success) success()
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
          list,
          pagination,
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
    saveArticles(state, { payload: {
      list = [],
      pagination,
      pagination: {
        pageNum,
        pageSize,
        total,
      },
    } }) {
      return {
        ...state,
        article: {
          ...state.article,
          list,
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    saveArticleDetail(state, { payload: { list } }) {
      if (!list || list.length === 0) return state
      return {
        ...state,
        article: {
          ...state.article,
          detail: list[0],
        },
      }
    },
    saveAppendArticles(state, { payload: {
      list = [],
      pagination,
      pagination: {
        total,
        pageNum,
        pageSize,
      },
    } }) {
      return {
        ...state,
        article: {
          ...state.article,
          list: [...state.article.list, ...list],
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    saveCourseWare(state, { payload: {
      list,
      pagination,
      pagination: {
        pageNum,
        pageSize,
        total,
      },
    } }) {
      return {
        ...state,
        courseWare: {
          ...state.courseWare,
          list,
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    saveCourseWareDetail(state, { payload: { list } }) {
      if (!list || list.length === 0) return state
      return {
        ...state,
        courseWare: {
          ...state.courseWare,
          detail: list[0],
        },
      }
    },
    saveAppendCourseWare(state, { payload: {
      list = [],
      pagination,
      pagination: {
        total,
        pageNum,
        pageSize,
      },
    } }) {
      return {
        ...state,
        courseWare: {
          ...state.courseWare,
          list: [...state.courseWare.list, ...list],
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    saveCompanyList(state, { payload = [] }) {
      return {
        ...state,
        companyList: payload,
      }
    },
    saveNewStatusArticles(state, { payload: { id, status } }) {
      const newList = state.article.list.map((item) => {
        return item.id === id ? {
          ...item,
          status,
        } : item
      })
      return {
        ...state,
        article: {
          ...state.article,
          list: newList,
        },
      }
    },
    saveNewStatusCourseWare(state, { payload: { id, status } }) {
      const newList = state.courseWare.list.map((item) => {
        return item.id === id ? {
          ...item,
          status,
        } : item
      })
      return {
        ...state,
        courseWare: {
          ...state.courseWare,
          list: newList,
        },
      }
    },
    saveSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload,
      }
    },
  },
}
