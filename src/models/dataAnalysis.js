import {
  queryCompanies,
  queryData,
  queryExport,
} from '../services/dataAnalysis';

const DEFAULT_CODE = 500;
const EMPTY_OBJECT = {};

export default {
  namespace: 'dataAnalysis',

  state: {
    companies: {},
    analysis: {},
  },

  effects: {
    *fetchCompanyList({ payload, callback }, { call, put }) {
      let response = yield call(queryCompanies, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) {
        yield put({ type: 'saveCompanyList', payload: data });
        callback && callback();
      }
    },
    *fetchData({ payload, callback }, { call, put }) {
      let response = yield call(queryData, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT, msg } = response;
      callback && callback(code, msg);
      if (code === 200)
        yield put({ type: 'saveData', payload: data });
    },
    *fetchExport({ payload }, { call, put }) {
      let response = yield call(queryExport, payload);
      // response = response || EMPTY_OBJECT;
      // const { code = DEFAULT_CODE, data = EMPTY_OBJECT, msg } = response;
      // callback && callback(code, msg);
      // if (code === 200)
      //   yield put({ type: 'saveData', payload: data });
    },
  },

  reducers: {
    saveCompanyList(state, action) {
      return { ...state, companies: action.payload };
    },
    saveData(state, action) {
      return { ...state, analysis: action.payload };
    },
  },
};
