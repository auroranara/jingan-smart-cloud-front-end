import { queryAddaccountoptions } from '../services/maintenanceCompany.js';

export default {
  namespace: 'accountmanagement',

  state: {
    list: [],
    detail: {},
    pageNum: 1,
    isLast: false,
    unitTypes: [],
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
  },

  effects: {
    // *fetch({ payload }, { call, put }) {
    //   const response = yield call(queryMaintenanceCompanies, payload);
    //   if (response.code === 200) {
    //     yield put({
    //       type: 'query',
    //       payload: response.data,
    //     });
    //   }
    // },

    *fetchOptions(
      {
        payload: { type, key },
        success,
        error,
      },
      { call, put }
    ) {
      const response = yield call(queryAddaccountoptions, { type });
      if (response.code === 200) {
        yield put({
          type: 'queryAddaccountoptions',
          payload: {
            key,
            list: response.data.list,
          },
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    query(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list,
        pageNum: 1,
        isLast: pageNum * pageSize >= total,
      };
    },
    // 新增账号-初始化页面选项
    queryAddaccountoptions(
      state,
      {
        payload: { key, list },
      }
    ) {
      return {
        ...state,
        [key]: list,
      };
    },
  },
};
