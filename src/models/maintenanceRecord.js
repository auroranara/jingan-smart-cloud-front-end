import {
  queryMaintenanceCheck,
  // queryMaintenanceRecordDetail,
} from '../services/maintenanceRecord.js';

export default {
  namespace: 'maintenanceRecord',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    list: [],
    detail: {},
  },

  effects: {
    // 维保记录列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCheck, payload);
      console.log('payload', payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    // 维保单位列表
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        data: payload,
      };
    },
  },
};
