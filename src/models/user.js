import router from 'umi/router';
import {
  query as queryUsers,
  queryCurrent,
  activationSendCode,
  forgetSendCode,
  verifyCode,
  updatePwd,
  addQuickMenu,
  editQuickMenu,
  fetchQuickMenu,
} from '@/services/user';
import { getGrids } from '../services/bigPlatform/gridSelect';
import { queryAccountList } from '@/services/accountManagement';
import { getList } from '@/utils/service';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    grids: [],
    systemType: 0,
    menuData: [], // 放在model里是为了防菜单置空闪烁
    isCompany: false, // 是否企业账号
    userList: [], // 用户列表
    quickExpand: false, // 快捷菜单是否展开
    quickEdit: false, // 快捷菜单是否编辑
  },

  effects: {
    *fetch (_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent ({ callback }, { select, call, put }) {
      // const setting = { contentWidth: 'Fixed', layout: 'topmenu' };
      const response = yield call(queryCurrent);
      if (response && response.data) {
        const {
          data: { unitType, permissionCodes },
        } = response;
        // 如果包含账号管理权限
        // const isAdmin = permissionCodes.includes('roleAuthorization.accountManagement');
        // 是否是运营来判断
        yield put({
          type: 'setting/changeSetting',
          payload: { contentWidth: 'Fluid', layout: 'sidemenu' },
          // payload: unitType === 3 || isAdmin ? { contentWidth: 'Fluid', layout: 'sidemenu' } : setting,
        });
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
        yield put({
          type: 'saveIsCompany',
          payload: unitType && unitType === 4,
        })
        const login = yield select(state => state.login);
        callback && callback(response.data, login);
      }
    },
    *activationSendCode ({ payload, callback }, { call }) {
      const response = yield call(activationSendCode, payload);
      if (callback) callback(response);
    },
    *forgetSendCode ({ payload, callback }, { call }) {
      const response = yield call(forgetSendCode, payload);
      if (callback) callback(response);
    },
    *verifyCode ({ payload, callback }, { call }) {
      const response = yield call(verifyCode, payload);
      if (callback) callback(response);
    },
    *updatePwd ({ payload, callback }, { call }) {
      const response = yield call(updatePwd, payload);
      if (callback) callback(response);
    },
    *fetchGrids ({ payload, callback }, { call, put }) {
      const response = yield call(getGrids);
      if (Array.isArray(response)) {
        yield put({ type: 'saveGrids', payload: response });
        callback && callback(response);
      }
    },
    *fetchUserList ({ payload, callback }, { call, put }) {
      const response = yield call(queryAccountList, payload);
      const { code, data } = response || {};
      if (code === 200)
        yield put({ type: 'saveUserList', payload: getList(data) });
    },
    // 添加快捷菜单
    *addQuickMenu ({ payload, callback }, { call }) {
      const res = yield call(addQuickMenu, payload);
      callback && callback(res && res.code === 200);
    },
    // 编辑快捷菜单
    *editQuickMenu ({ payload, callback }, { call }) {
      const res = yield call(editQuickMenu, payload);
      callback && callback(res && res.code === 200);
    },
    // 获取快捷菜单
    *fetchQuickMenu ({ payload, callback }, { call }) {
      const res = yield call(fetchQuickMenu, payload);
      callback && callback(res && res.code === 200 && res.data ? res.data.code : '');
    },
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser (state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount (state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveGrids (state, action) {
      return { ...state, grids: action.payload };
    },
    saveSystemType (state, action) {
      return { ...state, systemType: action.payload };
    },
    saveMenuData (state, action) {
      return { ...state, menuData: action.payload };
    },
    saveIsCompany (state, action) {
      return { ...state, isCompany: action.payload || false }
    },
    saveUserList (state, action) {
      return { ...state, userList: action.payload };
    },
    saveQuickList (state, action) {
      return { ...state, quickList: action.payload || [] };
    },
    saveQuickExpand (state, action) {
      return { ...state, quickExpand: action.payload || false };
    },
    saveQuickEdit (state, action) {
      return { ...state, quickEdit: action.payload };
    },
  },
};
