import { queryAppHistories, querySelectCondition, queryDetail } from '../services/fireTest';

export default {
  namespace: 'fireTest',

  state: {
    list: [],
    pagination: {
      total: 0,
      pageSize: 10,
      pageNum: 1,
      companyNum: 0,
    },
    detail: {
      alarmStatus: '',
      code: '',
      failureCode: '',
      safetyName: '',
      componentNo: '',
      name: '',
      time: '',
      position: '',
      safetyPhone: '',
      type: '',
      componentRegion: '',
    },
    dictDataList: [],
    deviceCodes: [],
  },

  effects: {
    *fetchAppHistories({ payload, success, error }, { call, put }) {
      const response = yield call(queryAppHistories, payload);
      if (response.code === 200) {
        yield put({
          type: 'appHistories',
          payload: response,
        });
        if (success) {
          success(response);
        }
      } else if (error) {
        error();
      }
    },
    *fetchSelectCondition({ payload, success, error }, { call, put }) {
      const response = yield call(querySelectCondition, payload);
      if (response.code === 200) {
        yield put({
          type: 'selectCondition',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    *fetchDetail({ payload, success, error }, { call, put }) {
      const response = yield call(queryDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'detail',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
  },

  reducers: {
    appHistories(state, { payload }) {
      return {
        ...state,
        list: payload.list && payload.list.length > 0 ? payload.list : [],
        pagination: payload.pagination,
      };
    },
    selectCondition(state, { payload }) {
      return {
        ...state,
        dictDataList:
          payload.dictDataList && payload.dictDataList.length > 0 ? payload.dictDataList : [],
        deviceCodes:
          payload.deviceCodes && payload.deviceCodes.length > 0 ? payload.deviceCodes : [],
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
  },
};
