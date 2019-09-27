// import {

// } from '../services/industrialProductLicence.js';

export default {
  namespace: 'industrialProductLicence',

  state: {
    industrialData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    credentialTypeList: [
      { key: '0', value: '生产' },
      { key: '1', value: '经营' },
      { key: '2', value: '使用' },
    ],
    expireList: [
      { key: '0', value: '未到期' },
      { key: '1', value: '即将到期' },
      { key: '2', value: '已过期' },
    ],
    credentialStatusList: [
      { key: '0', value: '现用' },
      { key: '1', value: '吊销' },
      { key: '2', value: '注销' },
      { key: '3', value: '暂扣' },
      { key: '4', value: '曾用' },
    ],
    engineerLevelList: [],
  },

  effects: {},

  reducers: {},
};
