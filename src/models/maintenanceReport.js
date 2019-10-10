import {
  getMaintenancSelfCheckList,
  // 获取详情
  getSelfCheckDetail,
  // 导出
  exportData,
  // 导出---政府报表
  exportGovData,
  fetchMaintenanceCheckForGov,
  fetchAllCheckDetail,
} from '../services/maintenanceReport.js';
import fileDownload from 'js-file-download';
import moment from 'moment';

export default {
  namespace: 'maintenanceReport',

  state: {
    /* 报告列表 */
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },

    /* 检查结果列表 */
    checkResultList: [
      {
        key: '1',
        value: '正常',
      },
      {
        key: '2',
        value: '异常',
      },
    ],
    /* 上报途径列表 */
    reportingChannelsList: [
      {
        key: '1',
        value: '网格点',
      },
      {
        key: '2',
        value: '风险点',
      },
      {
        key: '3',
        value: '随手拍',
      },
    ],

    detail: {
      list: [],
    },
  },

  effects: {
    // 列表
    *fetchMaintenancList({ payload, callback }, { call, put }) {
      const response = yield call(getMaintenancSelfCheckList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
        if (callback) callback(response);
      }
    },
    // 新-获取政府监督报表列表
    *fetchMaintenanceCheckForGov({ payload, callback }, { call, put }) {
      const response = yield call(fetchMaintenanceCheckForGov, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
        if (callback) callback(response);
      }
    },
    // 详情
    *fetchCheckDetail({ payload }, { call, put }) {
      // console.log('payload', payload);
      const response = yield call(getSelfCheckDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
      }
    },
    // 获取政府和随手拍的所有详情
    *fetchAllCheckDetail({ payload }, { call, put }) {
      // console.log('payload', payload);
      const response = yield call(fetchAllCheckDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
      }
    },
    // 导出
    *exportData({ payload, callback }, { call, put }) {
      const blob = yield call(exportData, payload);
      const { detail } = payload;
      fileDownload(blob, `维保检查报表_${moment().format('YYYYMMDD')}.${detail ? 'zip' : 'xlsx'}`);
    },
    // 导出---政府报表
    *exportGovData({ payload, callback }, { call, put }) {
      const blob = yield call(exportGovData, payload);
      const { detail } = payload;
      fileDownload(blob, `政府监督报表_${moment().format('YYYYMMDD')}.${detail ? 'zip' : 'xlsx'}`);
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        data: payload,
      };
    },

    saveDetail(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        detail: payload,
      };
    },
  },
};
