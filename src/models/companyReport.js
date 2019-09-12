import {
  getCompanySelfCheckList,
  // 获取详情
  getSelfCheckDetail,
  // 导出
  exportData,
} from '../services/companyReport.js';
import fileDownload from 'js-file-download';
import moment from 'moment';

export default {
  namespace: 'companyReport',

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

    detail: {
      list: [],
    },
  },

  effects: {
    // 列表
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanySelfCheckList, payload);
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
      console.log('payload', payload);
      const response = yield call(getSelfCheckDetail, payload);
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
      fileDownload(blob, `企业自查报表_${moment().format('YYYYMMDD')}.zip`);
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
