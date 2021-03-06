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
  queryExecCertificateType,
  queryUserType,
  queryDepartmentList,
  fetchAssociatedUnitDetail,
  addAssociatedUnit,
  editAssociatedUnit,
  chnageAccountStatus,
  queryMaintenanceTree,
  getDashboard,
  putDashboard,
} from '../services/accountManagement.js';

import {
  checkOldPass,
  changePass,
  sendVerifyCode,
  updatePwdNew,
  updatePwdNewForForget,
} from '../services/account.js';
import { queryMenus } from '../services/company/safety';

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
        parentId: undefined,
        departmentId: undefined,
        departmentName: undefined,
        userType: undefined,
        userGovType: undefined,
        documentTypeId: undefined,
        execCertificateCode: undefined,
      },
    },
    unitTypes: [],
    accountStatuses: [],
    unitIds: [],
    roles: [],
    permissionTree: [],
    appPermissionTree: [],
    msgpermissionTree: [],
    userTypes: [],
    gavUserTypes: [],
    subDepartments: [],
    documentTypeIds: [],
    departments: [],
    user: {},
    searchInfo: null,
    maintenanceTree: {},
    maintenanceSerTree: [],
    maintenanceSubTree: [],
    grids: [], // 网格点
  },

  effects: {
    // 账号列表
    *fetch({ payload, success, error }, { call, put }) {
      const response = yield call(queryAccountList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveAccountList',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 查询账号列表
    *appendfetch({ payload }, { call, put }) {
      const response = yield call(queryAccountList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveAccountLoadMoreList',
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
    *fetchUnitListFuzzy({ payload, success, error }, { call, put }) {
      const response = yield call(queryUnits, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryUnits',
          payload: response.data.list,
        });
        if (success) {
          success(response.data.list);
        }
      } else if (error) {
        error(response.msg);
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
    *updateAccountPwd({ payload, callback }, { call }) {
      const response = yield call(updatePassword, payload);
      if (callback) callback(response);
    },

    // 查询用户名和手机号是否唯一
    *checkAccountOrPhone({ payload, callback }, { call, put }) {
      const response = yield call(checkAccountOrPhone, payload);
      if (response.code && response.msg) {
        if (callback) callback(response);
      }
    },
    // 校验旧密码正确性
    *checkOldPass({ payload, callback }, { call, put }) {
      const response = yield call(checkOldPass, payload);
      if (callback && response.code) callback(response.code);
    },
    // 个人中心修改密码
    *changePass({ payload, callback }, { call }) {
      const response = yield call(changePass, payload);
      if (callback) callback(response);
    },

    // 查询角色列表
    *fetchRoles({ payload, success, error }, { call, put }) {
      const response = yield call(queryRoles, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const list = data && data.roleList ? data.roleList : [];
        const trees = data && data.allPermissionTree ? data.allPermissionTree : {};
        yield put({ type: 'queryRoles', payload: list });
        yield put({ type: 'saveTrees', payload: trees });
        success && success(list, trees);
      } else error && error();
    },

    // 查询执法证件种类
    *fetchExecCertificateType({ payload, callback }, { call, put }) {
      const response = yield call(queryExecCertificateType, payload);
      if (callback) callback(response);
      if (response.code === 200) {
        yield put({
          type: 'queryExecCertificateType',
          payload: response.data.list,
        });
      }
    },

    // 查询用户角色
    *fetchUserType({ payload, callback }, { call, put }) {
      const response = yield call(queryUserType, payload);
      if (callback) callback(response);
      if (response.code === 200) {
        yield put({
          type: 'queryUserType',
          payload: response.data.list,
        });
      }
    },

    // 查询部门列表
    *fetchDepartmentList({ payload, callback }, { call, put }) {
      const response = yield call(queryDepartmentList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'queryDepartment',
          payload: response.data.list,
        });
        callback && callback(response.data.list);
      }
    },
    // 获取用户详情（关联企业页面）
    *fetchAssociatedUnitDetail({ payload, success, error }, { call, put }) {
      const response = yield call(fetchAssociatedUnitDetail, payload);
      if (response && response.code === 200) {
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
    // 添加关联企业
    *addAssociatedUnit({ payload, successCallback, errorCallback }, { call, put }) {
      const response = yield call(addAssociatedUnit, payload);
      if (response && response.code === 200) {
        if (successCallback) successCallback();
      } else if (errorCallback) {
        errorCallback(response.msg);
      }
    },
    // 修改关联企业
    *editAssociatedUnit({ payload, successCallback, errorCallback }, { call }) {
      const response = yield call(editAssociatedUnit, payload);
      if (response && response.code === 200) {
        if (successCallback) successCallback();
      } else if (errorCallback) {
        errorCallback(response.msg);
      }
    },
    // 绑定、解绑关联企业
    *chnageAccountStatus({ payload, success, error }, { call }) {
      const response = yield call(chnageAccountStatus, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) {
        error(response.msg);
      }
    },
    // 维保权限树
    *fetchMaintenanceTree({ payload, callback }, { call, put }) {
      const response = yield call(queryMaintenanceTree, payload);
      if (response && response.code === 200) {
        const list = response.data.list || [];
        if (list.length < 1) return;
        const [{ children } = {}] = list;
        const maintenanceSerTree =
          (Array.isArray(children) && children.filter(item => item.type === '0')) || [];
        const maintenanceSubTree =
          (Array.isArray(children) && children.filter(({ type }) => type === '1')) || [];
        const payload = { ...response.data, maintenanceSerTree, maintenanceSubTree };
        yield put({
          type: 'saveMaintenanceTree',
          payload,
        });
        // callback放后面，因为callback中有setFieldsValue，所以要先等上面先保存好值，先渲染好表单中的Tree，不如可能会报错，在注册组建前设置其值
        callback && callback(payload);
      }
    },
    // 获取网格点
    *fetchGrids({ payload, callback }, { call, put }) {
      const response = yield call(queryMenus, payload);
      const { code, data } = response || {};
      if (code === 200) {
        let list = data && data.gridList ? data.gridList : [];
        if (!Array.isArray(list)) list = JSON.parse(list);
        yield put({ type: 'saveGrids', payload: list });
      }
    },
    *fetchDashboard({ payload, callback }, { call }) {
      const response = yield call(getDashboard, payload);
      const { code, data } = response || {};
      if (code === 200) callback && callback(data && Array.isArray(data.list) ? data.list : []);
    },
    *setDashboard({ payload, callback }, { call }) {
      const response = yield call(putDashboard, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    // 获取手机验证码
    *sendVerifyCode({ payload, success, error }, { call }) {
      const response = yield call(sendVerifyCode, payload);
      if (response.code === 200) {
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 手机号修改密码
    *updatePwdNew({ payload, callback }, { call }) {
      const response = yield call(updatePwdNew, payload);
      if (callback) callback(response);
    },
    // 手机号修改密码 忘记密码不需要token
    *updatePwdNewForForget({ payload, callback }, { call }) {
      const response = yield call(updatePwdNewForForget, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    saveAccountList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        data: payload,
        pageNum,
        isLast: pageNum * pageSize >= total,
      };
    },

    saveAccountLoadMoreList(
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
    queryAddAccountOptions(
      state,
      {
        payload: {
          data: { unitType, accountStatus, userGovType },
        },
      }
    ) {
      return {
        ...state,
        unitTypes: unitType,
        accountStatuses: accountStatus,
        gavUserTypes: userGovType,
      };
    },

    queryUnits(state, { payload }) {
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

    updateDetail(state, { payload }) {
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

    saveTrees(state, action) {
      const { webPermissions, appPermissions, messagePermissions } = action.payload;
      return {
        ...state,
        permissionTree: webPermissions || [],
        appPermissionTree: appPermissions || [],
        msgpermissionTree: messagePermissions || [],
      };
    },

    /* 查询执法证件种类 */
    queryExecCertificateType(state, { payload }) {
      return {
        ...state,
        documentTypeIds: payload,
      };
    },

    /* 查询用户角色 */
    queryUserType(state, { payload }) {
      return {
        ...state,
        userTypes: payload,
      };
    },

    // 查询部门列表
    queryDepartment(state, { payload: departments }) {
      return {
        ...state,
        departments,
      };
    },

    // 关联企业初始化数据
    initValue(state, { payload }) {
      return {
        ...state,
        detail: {
          data: {
            ...state.detail.data,
            unitType: undefined,
            unitId: undefined,
            unitName: undefined,
            treeIds: undefined,
            parentId: undefined,
            departmentId: undefined,
            departmentName: undefined,
            userType: undefined,
            userGovType: undefined,
            documentTypeId: undefined,
            execCertificateCode: undefined,
          },
        },
      };
    },
    saveUserInfo(state, { payload }) {
      return {
        ...state,
        user: payload,
      };
    },
    saveAccounts(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    saveSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload || null,
      };
    },
    saveMaintenanceTree(
      state,
      {
        payload: { list, maintenanceSerTree, maintenanceSubTree },
      }
    ) {
      return {
        ...state,
        maintenanceTree: { list },
        maintenanceSerTree,
        maintenanceSubTree,
      };
    },
    initPageNum(state, { payload }) {
      return {
        ...state,
        pageNum: 1,
        isLast: false,
        data: {
          ...state.data,
          pagination: {
            ...state.data.pagination,
            pageNum: 1,
          },
        },
      };
    },
    saveGrids(state, action) {
      return { ...state, grids: action.payload };
    },
  },
};
