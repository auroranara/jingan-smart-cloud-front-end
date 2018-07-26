import {
  queryAccountList,
  queryAddAccountOptions,
  addAccount,
  queryAccountDetail,
  updateAccountDetail,
  queryUnits,
  updatePassword,
  checkAccountOrPhone,
  queryRoles,
} from '../services/accountManagement.js';

export default {
  namespace: 'account',

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
        treeIds: undefined,
      },
    },
    unitTypes: [],
    accountStatuses: [],
    unitIdes: [],
    roles: [],
  },

  effects: {
    // 账号列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAccountList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryAccountList',
          payload: response.data,
        });
      }
    },

    // 查询账号列表
    *appendfetch({ payload }, { call, put }) {
      const response = yield call(queryAccountList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryList',
          payload: response.data,
        });
      }
    },

    // 新增账号-初始化页面选项
    *fetchOptions({ success, error }, { call, put }) {
      const response = yield call(queryAddAccountOptions);
      if (response.code === 200) {
        yield put({
          type: 'queryAddAccountOptions',
          payload: {
            data: response.data,
          },
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 新增账号-根据单位类型和名称模糊搜索
    *fetchUnitListFuzzy({ payload, callback }, { call, put }) {
      const response = yield call(queryUnits, payload);
      if (callback) callback(response);
      if (response.code === 200) {
        yield put({
          type: 'queryUnits',
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
          type: 'updateDetail',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改密码
    *updateAccountPwd({ payload, success, error }, { call, put }) {
      const response = yield call(updatePassword, payload);
      if (response.code === 200) {
        yield put({
          type: 'updatePassword',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 查询用户名和手机号是否唯一
    *checkAccountOrPhone({ payload, callback }, { call, put }) {
      const response = yield call(checkAccountOrPhone, payload);
      if (response.code && response.msg) {
        if (callback) callback(response);
      }
    },

    // 查询角色列表
    *fetchRoles({ payload, success, error }, { call, put }) {
      const response = yield call(queryRoles, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryRoles',
          payload: response.data.list,
        });
        if (success) {
          success(response.data.list);
        }
      }
      else if (error) {
        error();
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
        list: [...state.list, ...list],
        pageNum,
        isLast: pageNum * pageSize >= total,
      };
    },
    queryList(
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
        pageNum,
        isLast: pageNum * pageSize >= total,
      };
    },
    queryAddAccountOptions(
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

    queryUnits(state, { payload }) {
      return {
        ...state,
        unitIdes: payload,
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

    updateDetail(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    updatePassword(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    clearDetail(state) {
      return {
        ...state,
        detail: {
          data: {},
        },
      };
    },


    /* 获取角色列表 */
    queryRoles(state, { payload: roles }) {
      return {
        ...state,
        roles,
      };
    },
  },
};
