import {
  queryList,
  queryDetail,
  queryPermissionTree,
  addRole,
  editRole,
  deleteRole,
} from '../services/role/commonRole';

export default {
  namespace: 'commonRole',

  state: {
    detail: {
      sysRole: {},
    },
    rolePermissions: [],
    roleAppPermissions: [],
    permissionTree: [],
    appPermissionTree: [],
    data: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 24,
        total: 0,
      },
    },
    isLast: false,
  },

  effects: {
    /* 获取列表 */
    *fetchList({ payload, success, error }, { call, put }) {
      const response = yield call(queryList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryList',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      }
      else if (error) {
        error();
      }
    },
    /* 追加列表 */
    *appendList({ payload, success, error }, { call, put }) {
      const response = yield call(queryList, payload);
      if (response.code === 200) {
        yield put({
          type: 'pushList',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      }
      else if (error) {
        error();
      }
    },
    /* 获取详情 */
    *fetchDetail({ payload, success, error }, { call, put }) {
      const response = yield call(queryDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryDetail',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      }
      else if (error) {
        error();
      }
    },
    /* 获取WEB权限树 */
    *fetchPermissionTree({ payload, callback, callbackLater }, { call, put }) {
      const response = yield call(queryPermissionTree, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const webPermissions = data && Array.isArray(data.webPermissions) ? data.webPermissions : [];
        const appPermissions = data && Array.isArray(data.appPermissions) ? data.appPermissions : [];
        callback && callback(webPermissions, appPermissions);
        yield put({
          type: 'savePermissionTree',
          payload: [webPermissions, appPermissions],
        });
        callbackLater && callbackLater(webPermissions, appPermissions);
      }
    },
    /* 新增角色 */
    *insertRole({ payload, success, error }, { call }) {
      const response = yield call(addRole, payload);
      if (response.code === 200) {
        if (success) {
          success(response.data);
        }
      }
      else if (error) {
        error();
      }
    },
    /* 编辑角色 */
    *updateRole({ payload, success, error }, { call }) {
      const response = yield call(editRole, payload);
      if (response.code === 200) {
        if (success) {
          success(response.data);
        }
      }
      else if (error) {
        error();
      }
    },
    /* 删除角色 */
    *remove({ payload, success, error }, { call, put }) {
      const response = yield call(deleteRole, payload);
      if (response.code === 200) {
        yield put({
          type: 'deleteRole',
          payload: payload.id,
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
  },

  reducers: {
    /* 获取列表 */
    queryList(state, { payload }) {
      const { pagination: { pageNum, pageSize, total } } = payload;
      return {
        ...state,
        data: payload,
        isLast: pageNum * pageSize >= total,
      };
    },
    /* 追加列表 */
    pushList(state, { payload: { list, pagination } }) {
      const { pageNum, pageSize, total } = pagination;
      return {
        ...state,
        data: {
          list: state.data.list.concat(list),
          pagination,
        },
        isLast: pageNum * pageSize >= total,
      };
    },
    /* 获取详情 */
    queryDetail(state, { payload: detail }) {
      return {
        ...state,
        detail,
      };
    },
    // 保存roles对应的permissions
    saveRolePermissions(state, { payload: rolePermissions }) {
      return { ...state, rolePermissions };
    },
    saveRoleAppPermissions(state, action) {
      return { ...state, roleAppPermissions: action.payload };
    },
    /* 获取权限树 */
    savePermissionTree(state, action) {
      const [webPermissions, appPermissions] = action.payload;
      return {
        ...state,
        permissionTree: webPermissions,
        appPermissionTree: appPermissions,
      };
    },
    /* 清除详情 */
    clearDetail(state) {
      return {
        ...state,
        detail: {
          sysRole: {},
        },
      };
    },
    /* 删除角色 */
    deleteRole(state, { payload: id }) {
      return {
        ...state,
        data: {
          ...state.data,
          list: state.data.list.filter(item => item.id !== id),
        },
      };
    },
  },
}
