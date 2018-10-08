import { queryCompanies, queryData, queryExport } from '../services/dataAnalysis';
import fileDownload from 'js-file-download';

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
        const total = data.pagination && data.pagination.total ? data.pagination.total : 0;
        callback && callback(total);
      }
    },
    *fetchData({ payload, callback }, { call, put }) {
      let response = yield call(queryData, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT, msg } = response;
      callback && callback(code, msg);
      if (code === 200) yield put({ type: 'saveData', payload: data });
    },
    *fetchExport({ payload }, { call, put }) {
      const blob = yield call(queryExport, payload);
      fileDownload(blob, `${new Date().getTime()}.xls`);
      // response = response || EMPTY_OBJECT;
      // const { code = DEFAULT_CODE, data = EMPTY_OBJECT, msg } = response;
      // callback && callback(code, msg);
      // if (code === 200)
      //   yield put({ type: 'saveData', payload: data });
    },
  },

  reducers: {
    saveCompanyList(state, action) {
      const data = action.payload;
      const { list=[], pagination={} } = data;
      const { pageNum=1 } = pagination;
      let newList = list;
      // 第一页list就为获取的list，第二页就要在之前list上增加新获取的list
      if (pageNum !== 1)
        newList = [...state.companies.list, ...list];
      const companies = { ...data, list: newList };

      return { ...state, companies };
    },
    saveData(state, action) {
      return { ...state, analysis: action.payload };
    },
  },
};
