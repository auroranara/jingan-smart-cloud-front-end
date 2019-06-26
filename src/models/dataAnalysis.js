import {
  queryCompanies,
  queryData,
  queryExport,
  getCompanyName,
  fetchRepairRecords,
  fetchWorkApprovalList,
  fetchWorkApprovalDetail,
  fetchApprovalStatus,
  fetchJobLevel,
  fetchDangerChemicals, // 获取危险化学品/供货方单位
} from '@/services/dataAnalysis';
import fileDownload from 'js-file-download';
import moment from 'moment';

const DEFAULT_CODE = 500;
const EMPTY_OBJECT = {};
const DEFAULT_PAGINATION = {
  total: 0,
  pageNum: 1,
  pageSize: 10,
}

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
    repairRecordDetail: { realStatus: '' },
    // 作业审批报表-企业列表
    // workApprovalCompany: {
    //   list: [],
    //   pagination: {
    //     total: 0,
    //     pageNum: 1,
    //     pageSize: 10,
    //   },
    //   isLast: true,
    // },
    // 作业审批列表
    workApproval: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
    workApprovalDetail: {}, // 作业审批报表详情
    approvalStatus: [], // 审批状态
    jobLevel: [],       // 作业级别（类别）
    dangerChemicals: [], // 危险化学品
    supplierUnits: [],    // 供货方单位
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
      fileDownload(blob, `${typeLabel}_${companyName}_${moment().format('YYYY-MM-DD')}.xlsx`);
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
    // 获取作业审批报表列表
    *fetchWorkApprovalList({ payload }, { call, put }) {
      const response = yield call(fetchWorkApprovalList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveWorkApprovalList',
          payload: response.data,
        })
      }
    },
    // 获取作业审批报表详情
    *fetchWorkApprovalDetail({ payload }, { call, put }) {
      const response = yield call(fetchWorkApprovalDetail, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { workApprovalDetail: response.data || {} },
        })
      }
    },
    // 获取审批状态列表
    *fetchApprovalStatus({ payload }, { call, put }) {
      const response = yield call(fetchApprovalStatus, payload)
      if (response && response.code === 200 && response.data) {
        yield put({
          type: 'save',
          payload: { approvalStatus: response.data.list || [] },
        })
      }
    },
    // 获取作业级别列表
    *fetchJobLevel({ payload }, { call, put }) {
      const response = yield call(fetchJobLevel, payload)
      if (response && response.code === 200 && response.data) {
        yield put({
          type: 'save',
          payload: { jobLevel: response.data.list || [] },
        })
      }
    },
    // 获取危险化学品
    *fetchDangerChemicals({ payload }, { call, put }) {
      const response = yield call(fetchDangerChemicals, payload)
      if (response && response.code === 200 && response.data) {
        yield put({
          type: 'save',
          payload: { dangerChemicals: response.data.list || [] },
        })
      }
    },
    // 获取供货方单位（需要传参数 materialsId）
    *fetchSupplierUnits({ payload }, { call, put }) {
      const response = yield call(fetchDangerChemicals, payload)
      if (response && response.code === 200 && response.data) {
        yield put({
          type: 'save',
          payload: { supplierUnits: response.data.list || [] },
        })
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
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
        repairRecordDetail: { realStatus: '' },
      }
    },
    saveWorkApprovalList(state, { payload: { list = [], pagination = DEFAULT_PAGINATION } }) {
      return {
        ...state,
        workApproval: {
          ...state.workApproval,
          list,
          pagination,
        },
      }
    },
  },
};
