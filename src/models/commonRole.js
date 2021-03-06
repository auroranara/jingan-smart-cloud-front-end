import {
  queryList,
  queryDetail,
  queryPermissionTree,
  addRole,
  editRole,
  deleteRole,
  cloneRoles,
} from '../services/role/commonRole';
import { getUnits } from '../services/role/userRole';
import { removeEmptyChildren } from '@/pages/RoleAuthorization/Role/utils';

export default {
  namespace: 'commonRole',

  state: {
    detail: {},
    permissionTree: [],
    appPermissionTree: [],
    msgPermissionTree: [],
    data: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 24,
        total: 0,
      },
    },
    unitList: [],
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
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: 'saveDetail',
          payload: data || {},
        });
        success && success(data);
      }
      else
        error && error();
    },
    /* 获取单位类型对应的权限树 */
    *fetchPermissionTree({ payload, callback, callbackLater }, { call, put }) {
      const response = yield call(queryPermissionTree, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const webPermissions = data && Array.isArray(data.webPermissions) ? data.webPermissions : [];
        const appPermissions = data && Array.isArray(data.appPermissions) ? data.appPermissions : [];
        const msgPermissions = data && Array.isArray(data.messagePermissions) ? data.messagePermissions : [];
        removeEmptyChildren(msgPermissions);
        callback && callback(webPermissions, appPermissions, msgPermissions);
        yield put({
          type: 'savePermissionTree',
          payload: [webPermissions, appPermissions, msgPermissions],
        });
        callbackLater && callbackLater(webPermissions, appPermissions, msgPermissions);
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
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deleteRole, payload);
      const { code, msg } = response || {};
      if (code === 200)
        yield put({ type: 'decreaseList', payload });
      callback && callback(code, msg);
    },
    *fetchUnits({ payload, callback }, { call, put }) {
      const response = yield call(getUnits, payload);
      const { code, data } = response || {};
      if (code === 200)
        yield put({ type: 'saveUnits', payload: data && Array.isArray(data.list) ? data.list : [] });
    },
    *syncRoles({ payload, callback }, { call }) {
      const response = yield call(cloneRoles, payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
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
    decreaseList(state, action) {
      const { id } = action.payload;
      const { data } = state;
      const newData = { ...data, list: data.list.filter(({ id: rId }) => rId !== id) };
      return { ...state, data: newData };
    },
    /* 获取详情 */
    saveDetail(state, { payload: detail }) {
      return { ...state, detail };
    },
    /* 获取权限树 */
    savePermissionTree(state, action) {
      const [webPermissions, appPermissions, msgPermissions] = action.payload;
      return {
        ...state,
        permissionTree: webPermissions,
        appPermissionTree: appPermissions,
        msgPermissionTree: msgPermissions,
      };
    },
    saveUnits(state, action) {
      return { ...state, unitList: action.payload };
    },
  },
}
