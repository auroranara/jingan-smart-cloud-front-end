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
    engineerLevelList: [
      { key: '0', value: '初级' },
      { key: '1', value: '中级' },
      { key: '2', value: '高级' },
    ],
    sexList: [{ key: '0', value: '男' }, { key: '1', value: '女' }],
    specialityList: [
      { key: '0', value: '煤矿安全' },
      { key: '1', value: '金属非金属矿山安全' },
      { key: '2', value: '化工安全' },
      { key: '3', value: '金属冶炼安全' },
      { key: '4', value: '建筑施工安全' },
      { key: '4', value: '道路运输安全' },
      { key: '4', value: '其他安全（不包括消防安全）' },
    ],
  },

  effects: {},

  reducers: {},
};
