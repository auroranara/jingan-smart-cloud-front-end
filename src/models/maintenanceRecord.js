import {
  queryMaintenanceCheck,
  queryMaintenanceRecordDetail,
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
    detail: {},
    items: [],
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

    // 获取记录详情
    *fetchRecordDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryMaintenanceRecordDetail, payload);
      console.log(response);

      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
        if (callback) callback(response);
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

    // 获取记录详情
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
  },
};
