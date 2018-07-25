import { queryList, queryDetail, queryPermissionTree, addRole, editRole, deleteRole } from '../services/role/role';

export default {
  namespace: 'role',

  state: {
    detail: {
      sysRole: {},
    },
    permissionTree: [],
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
    /* 获取权限树 */
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
    /* 获取权限树 */
    queryPermissionTree(state, { payload: permissionTree }) {
      return {
        ...state,
        permissionTree,
      };
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
