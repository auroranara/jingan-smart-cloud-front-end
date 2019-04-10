// import { searchCompanies } from '../services/companyReport.js';

export default {
  namespace: 'companyReport',

  state: {
    /* 报告列表 */
    list: {
      list: [],
      pagination: {},
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
    // 详情
    // 网格
    // 导出
  },

  reducers: {},
};
