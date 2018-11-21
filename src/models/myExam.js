import {
  getExamList,
  getSide,
  getQuestion,
  saveAnswer,
} from '../services/myExam';

const EMPTY = {};
const DEFAULT_CODE = 500;

export default {
  namespace: 'myExam',

  state: {
    examList: [],
    side: {},
    question: {},
  },

  effects: {
    *fetchExamList({ payload, callback }, { call, put }) {
      let response = yield call(getExamList, payload);
      response = response || EMPTY;
      let { code=DEFAULT_CODE, data } = response;
      data = data || {};
      if (code === 200)
        callback && callback(data.pagination && data.pagination.total ? data.pagination.total : 0);
        yield put({ type: 'saveExamList', payload: data });
    },
    *fetchSide({ payload, callback }, { call, put }) {
      let response = yield call(getSide, payload);
      response = response || EMPTY;
      let { code=DEFAULT_CODE, data } = response;
      data = data || {};
      if (code === 200) {
        callback && callback(data);
        yield put({ type: 'saveSide', payload: data });
      }
    },
    *fetchQuestion({ payload, callback }, { call, put }) {
      let response = yield call(getQuestion, payload);
      response = response || EMPTY;
      let { code=DEFAULT_CODE, data } = response;
      data = data || {};
      if (code === 200) {
        callback && callback(data);
        yield put({ type: 'saveQuestion', payload: data });
      }
    },
    *putAnswer({ payload, callback }, { call, put }) {
      let response = yield call(saveAnswer, payload);
      response = response || EMPTY;
      let { code=DEFAULT_CODE, msg } = response;
      callback && callback(code, msg);
    },
  },

  reducers: {
    saveExamList(state, action) {
      const {
        list,
        pagination,
      } = action.payload;

      const { pageNum } = pagination;
      let nextList = Array.isArray(list) ? list : [];
      if (pageNum !== 1)
        nextList = state.examList.concat(list);
      return { ...state, examList: nextList };
    },
    saveSide(state, action) {
      return { ...state, side: action.payload };
    },
    saveQuestion(state, action) {
      return { ...state, question: action.payload };
    },
  },
};
