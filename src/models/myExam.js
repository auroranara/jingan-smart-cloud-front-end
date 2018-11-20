import {
  getExamList,
} from '../services/myExam';

const EMPTY = {};
const DEFAULT_CODE = 500;

export default {
  namespace: 'myExam',

  state: {
    examList: [],
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
  },

  reducers: {
    saveExamList(state, action) {
      return { ...state, examList: action.payload };
    },
  },
};
