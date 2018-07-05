import {
  queryAddaccountoptions,
  queryUnitlist,
  addAccount,
} from '../services/accountManagement.js';

export default {
  namespace: 'accountmanagement',

  state: {
    list: [],
    detail: {},
    pageNum: 1,
    isLast: false,
    unitTypes: [],
    accountStatuses: [],
    hasUnits: [],
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

    *fetchOptions({ success, error }, { call, put }) {
      const response = yield call(queryAddaccountoptions);
      if (response.code === 200) {
        yield put({
          type: 'queryAddaccountoptions',
          payload: {
            data: response.data,
          },
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    *fetchUnitList({ payload, callback }, { call, put }) {
      const response = yield call(queryUnitlist, payload);
      const { code } = response;
      if (callback) callback(code);
      if (response.code === 200) {
        yield put({
          type: 'queryUnitlist',
          payload: response.data.list,
        });
      }
    },

    *addAccount({ payload, callback }, { call, put }) {
      const response = yield call(addAccount, payload);
      const { code } = response;
      if (callback) callback(code);
      if (code === 200) {
        yield put({
          type: 'addAccount',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    // query(
    //   state,
    //   {
    //     payload: {
    //       list,
    //       pagination: { pageNum, pageSize, total },
    //     },
    //   }
    // ) {
    //   return {
    //     ...state,
    //     list,
    //     pageNum: 1,
    //     isLast: pageNum * pageSize >= total,
    //   };
    // },
    queryAddaccountoptions(
      state,
      {
        payload: {
          data: { unitType, accountStatus },
        },
      }
    ) {
      return {
        ...state,
        unitTypes: unitType,
        accountStatuses: accountStatus,
      };
    },

    queryUnitlist(state, { payload }) {
      return {
        ...state,
        hasUnits: payload,
      };
    },

    addAccount(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
  },
};
