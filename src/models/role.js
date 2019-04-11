import {
  queryList,
  queryDetail,
  queryPermissionTree,
  addRole,
  editRole,
  deleteRole,
  queryRolePermissions,
  getAppPermissionTree,
} from '../services/role/role';

export default {
  namespace: 'role',

  state: {
    detail: {
      sysRole: {},
    },
    rolePermissions: [],
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
    // 在账号菜单中(非当前的角色菜单)获取roles对应的权限
    *fetchRolePermissions({ payload, success, error }, { call, put }) {
      const response = yield call(queryRolePermissions, payload);
      // console.log(response);
      if (response && response.code === 200) {
        let rolePermissions = [];
        if (response.data && response.data.permissions)
          rolePermissions = Array.from(new Set(response.data.permissions.split(',').filter(k => k)));

        yield put({
          type: 'saveRolePermissions',
          payload: rolePermissions,
        });
        success &&  success(rolePermissions);
      }
      else
        error && error();
    },
    /* 获取WEB权限树 */
    *fetchPermissionTree({ payload, success, error }, { call, put }) {
      const response = yield call(queryPermissionTree, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryPermissionTree',
          payload: response.data.menu,
        });
        if (success) {
          success(response.data.menu);
        }
      }
      else if (error) {
        error();
      }
    },
    // 获取APP权限树
    *fetchAppPermissionTree({ payload, callback, callbackLast }, { call, put }) {
      let response = yield call(getAppPermissionTree, payload);
      response = response || {};
      const { code=500 } = response;
      if (code === 200) {
        const tree = response.data && Array.isArray(response.data.menu) ? response.data.menu : [];
        callback && callback(tree);
        yield put({ type: 'saveAppPermissionTree', payload: tree });
        callbackLast && callbackLast(tree);
      }
    },
    /* 新增角色 */
    *insertRole({ payload, success, error }, { call }) {
      const response = yield call(addRole, payload);
      if (response.code === 200) {
        // yield put({
        //   type: 'addRole',
        //   payload: response.data,
        // });
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
        // yield put({
        //   type: 'editRole',
        //   payload: response.data,
        // });
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
    /* 获取权限树 */
    queryPermissionTree(state, { payload: permissionTree }) {
      return {
        ...state,
        permissionTree,
      };
    },
    saveAppPermissionTree(state, action) {
      return { ...state, appPermissionTree: action.payload };
    },
    /* 新增角色 */
    addRole(state, { payload: detail }) {
      return {
        ...state,
        detail,
      };
    },
    /* 编辑角色 */
    editRole(state, { payload: detail }) {
      return {
        ...state,
        detail,
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
