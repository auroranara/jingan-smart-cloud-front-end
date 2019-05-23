import {
  queryList,
  queryDetail,
  queryPermissionTree,
  addRole,
  editRole,
  deleteRole,
  getAppPermissionTree,
  getMessageTree,
} from '../services/role/role';
import { queryDetail as queryRoleDetail } from '../services/role/commonRole';
import { removeEmptyChildren } from '@/pages/RoleAuthorization/Role/utils';

export default {
  namespace: 'role',

  state: {
    detail: {
      sysRole: {},
    },
    rolePermissions: [],
    roleAppPermissions: [],
    roleMsgTree: [], // 某个角色对应的订阅消息树
    permissionTree: [],
    appPermissionTree: [],
    msgTree: [], // 角色类型对应的订阅消息树
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
    // 在账号模块中(在当前角色模块中并无使用)获取role对应的权限，原来用来请求多个role，现在只能选单个，作用已经与上面请求详情的一样，但考虑遗留代码，不好删除
    *fetchRolePermissions({ payload, success, error }, { call, put }) {
      const response = yield call(queryRoleDetail, payload);
      const { code, data } = response || {};
      if (code === 200) {
        let { webPermissionIds, appPermissionIds, messagePermissionList } = data || {};
        webPermissionIds = webPermissionIds || [];
        appPermissionIds = appPermissionIds || [];
        messagePermissionList = messagePermissionList || [];
        removeEmptyChildren(messagePermissionList);

        yield put({ type: 'saveRolePermissions', payload: webPermissionIds });
        yield put({ type: 'saveRoleAppPermissions', payload: appPermissionIds });
        yield put({ type: 'saveRoleMsgTree', payload: messagePermissionList }); // 上面的权限是最小范围，这里的消息订阅是整棵树，即最大范围
        success &&  success(webPermissionIds, appPermissionIds, messagePermissionList);
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
      const { code, msg } = response || {};
      if (code === 200) {
        yield put({
          type: 'deleteRole',
          payload: payload.id,
        });
        success && success();
      }
      else
        error && error(msg);
    },
    // 获取角色类型对应的订阅消息树
    *fetchMsgTree({ payload, callback }, { call, put }) {
      const response = yield call(getMessageTree, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const list = data && Array.isArray(data.list) ? data.list : [];
        removeEmptyChildren(list);
        yield put({ type: 'saveMsgTree', payload: list });
        callback && callback(list);
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
    saveRoleMsgTree(state, action) {
      return { ...state, roleMsgTree: action.payload };
    },
    /* 获取权限树 */
    queryPermissionTree(state, { payload: permissionTree }) {
      return { ...state, permissionTree };
    },
    saveAppPermissionTree(state, action) {
      return { ...state, appPermissionTree: action.payload };
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
    saveMsgTree(state, action) {
      return { ...state, msgTree: action.payload };
    },
  },
}
