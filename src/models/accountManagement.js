import {
  queryAccountList,
  queryAddaccountoptions,
  queryUnitlist,
  addAccount,
  queryAccountDetail,
  updateAccountDetail,
} from '../services/accountManagement.js';

export default {
  namespace: 'accountManagement',

  state: {
    list: [],
    pageNum: 1,
    isLast: false,
    detail: {
      data: {
        loginName: undefined,
        userName: undefined,
        phoneNumber: undefined,
        unitType: undefined,
        unitId: undefined,
        accountStatus: undefined,
        unitName: undefined,
      },
    },
    unitTypes: [],
    accountStatuses: [],
    unitIds: [],
  },

  effects: {
    // 查询账号列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAccountList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryAccountList',
          payload: response.data,
        });
      }
    },

    // 新增账号-初始化页面选项
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

    // 新增账号-根据所选单位类型查询单位列表
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

    // 新增账号
    *addAccount({ payload, success, error }, { call }) {
      const response = yield call(addAccount, payload);
      if (response.code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 查看账号详情
    *fetchAccountDetail({ payload, success, error }, { call, put }) {
      const response = yield call(queryAccountDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryAccountDetail',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改账号
    *updateAccountDetail({ payload, success, error }, { call, put }) {
      const response = yield call(updateAccountDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateAccountDetail',
          payload: response.data,
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
    queryAccountList(
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
        unitIds: payload,
      };
    },

    queryAccountDetail(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    updateAccountDetail(state, { payload }) {
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
