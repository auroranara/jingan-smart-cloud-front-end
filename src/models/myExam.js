import {
  getExamList,
  getSide,
  getQuestion,
  saveAnswer,
  handInExam,
  getPaper,
} from '../services/myExam';

const EMPTY = {};
const DEFAULT_CODE = 500;

export default {
  namespace: 'myExam',

  state: {
    examList: [],
    side: {},
    question: {},
    paper: {},
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
      let { code=DEFAULT_CODE, data, msg } = response;
      data = data || {};
      callback && callback(code, msg, data);
      if (code === 200)
        yield put({ type: 'saveQuestion', payload: data });
    },
    *putAnswer({ payload, callback }, { call }) {
      let response = yield call(saveAnswer, payload);
      response = response || EMPTY;
      let { code=DEFAULT_CODE, msg } = response;
      callback && callback(code, msg);
    },
    *handIn({ payload, callback }, { call }) {
      let response = yield call(handInExam, payload);
      response = response || EMPTY;
      let { code=DEFAULT_CODE, msg, data } = response;
      callback && callback(code, msg, data);
    },
    *fetchPaper({ payload, callback }, { call, put }) {
      let response = yield call(getPaper, payload);
      response = response || EMPTY;
      let { code=DEFAULT_CODE, data, msg } = response;
      data = data || {};
      callback && callback(code, msg, data);
      if (code === 200)
        yield put({ type: 'savePaper', payload: data });
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
    savePaper(state, action) {
      return { ...state, paper: action.payload };
    },
  },
};
