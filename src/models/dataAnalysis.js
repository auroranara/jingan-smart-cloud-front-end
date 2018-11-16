import { queryCompanies, queryData, queryExport, getCompanyName, fetchRepairRecords } from '../services/dataAnalysis';
import fileDownload from 'js-file-download';
import moment from 'moment';

const DEFAULT_CODE = 500;
const EMPTY_OBJECT = {};

export default {
  namespace: 'dataAnalysis',

  state: {
    companies: {},
    analysis: {},
    companyInfo: {},
    repairRecord: {
      repairRecords: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
    repairRecordDetail: {realStatus:''},
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
    *fetchExport({ payload, typeLabel, companyName }, { call, put }) {
      const blob = yield call(queryExport, payload);
      fileDownload(blob, `${typeLabel}_${companyName}_${moment().format('YYYY-MM-DD')}.xls`);
      // response = response || EMPTY_OBJECT;
      // const { code = DEFAULT_CODE, data = EMPTY_OBJECT, msg } = response;
      // callback && callback(code, msg);
      // if (code === 200)
      //   yield put({ type: 'saveData', payload: data });
    },
    *fetchCompanyInfo({ payload }, { call, put }) {
      let response = yield call(getCompanyName, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200)
        yield put({ type: 'saveCompanyInfo', payload: { name: data } });
    },
    // 获取一键报修记录列表
    *fetchRepairRecords({ payload }, { call, put }) {
      const response = yield call(fetchRepairRecords, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveRepairRecords',
          payload: response.data,
        })
      }
    },
    // 获取一键报修记录详情
    *fetchRepairRecordDetail({ payload }, { call, put }) {
      const response = yield call(fetchRepairRecords, payload);
      if (response && response.code === 200) {
        yield put({
          type: "saveRepairRecordDetail",
          payload: response.data,
        })
      }
    },
  },

  reducers: {
    saveCompanyList(state, action) {
      const data = action.payload;
      const { list = [], pagination = {} } = data;
      const { pageNum = 1 } = pagination;
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
    saveCompanyInfo(state, action) {
      return { ...state, companyInfo: action.payload };
    },
    saveRepairRecords(state, action) {
      const { list, pageNum, pageSize, total } = action.payload
      return {
        ...state,
        repairRecord: {
          ...state.repairRecord,
          repairRecords: list,
          pagination: {
            pageNum, pageSize, total,
          },
        },
      }
    },
    saveRepairRecordDetail(state, action) {
      const { list } = action.payload
      if (list && list.length) {
        return {
          ...state,
          repairRecordDetail: list[0],
        }
      } else return {
        ...state,
        repairRecordDetail: {realStatus:''},
      }
    },
  },
};
