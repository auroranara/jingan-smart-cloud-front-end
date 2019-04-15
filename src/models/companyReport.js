import { getCompanySelfCheckList, getSelfCheckDetail } from '../services/companyReport.js';

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

    selectList: [],
  },

  effects: {
    // 列表
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanySelfCheckList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response.data.list,
        });
        if (callback) callback(response);
      }
    },

    // 详情
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getSelfCheckDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response.data.list,
        });
        if (callback) callback(response);
      }
    },
    // 网格
    // 导出
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          list: payload || [],
        },
      };
    },
  },
};
