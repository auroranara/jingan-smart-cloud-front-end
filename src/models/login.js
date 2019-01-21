// import { routerRedux } from 'dva/router';
import router from 'umi/router';
// import { stringify } from 'qs';
import { getFakeCaptcha } from '../services/api';
import { setAuthority, setToken } from '../utils/authority';
// import { getPageQuery } from '../utils/utils';
import { reloadAuthorized } from '../utils/Authorized';

import { accountLogin, accountLoginGsafe, fetchFooterInfo, changerUser } from '../services/account';

const FIRE_CONTROL_URL = '/fire-control/maintenance-company/list';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    username: null,
    password: null,
    users: [],
  },

  effects: {
    *login({ payload, error, handleMoreUser }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response && response.code === 200) {
        if (response.data.isMoreUser) {
          // 如果是多用户
          yield put({
            type: 'saveMoreUser',
            payload: response.data.moreUser,
          });
          if (handleMoreUser) handleMoreUser();
        } else {
          const { unitType } = response.data;
          // 如果不是多用户，直接登录进去
          yield put({
            type: 'changeLoginStatus',
            payload: { ...response.data },
          });
          // 登录1.0
          yield call(accountLoginGsafe, payload);
          reloadAuthorized();
          router.replace(unitType === 1 ? FIRE_CONTROL_URL : '/');
        }
      } else error(response.msg);
    },

    *loginWithUserId({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      const { unitType } = response.data;
      if (response && response.code === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: { ...response.data },
        });
        // 登录1.0
        yield call(accountLoginGsafe, payload);
        reloadAuthorized();
        router.replace(unitType === 1 ? FIRE_CONTROL_URL : '/');
      }
    },

    *loginGsafe({ payload, callback }, { call, put }) {
      const res = yield call(accountLoginGsafe, payload);
      if (res.code === 200 && callback) callback();
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      yield put({ type: 'user/saveCurrentUser' });
      setToken();
      reloadAuthorized();
      document.cookie = '';
      router.push('/user/login');
      window.location.reload();
    },
    *fetchFooterInfo({ payload }, { call, put }) {
      const response = yield call(fetchFooterInfo);
      if (response && response.code === 200) {
        yield put({
          type: 'saveFooterInfo',
          payload: response.data,
        });
      }
    },
    *changerUser({ payload, success, error }, { call, put }) {
      const response = yield call(changerUser, payload);
      const { unitType } = response.data;
      if (response && response.code === 200 && response.data && response.data.webToken) {
        yield setToken(response.data.webToken);
        reloadAuthorized();
        router.replace(unitType === 1 ? FIRE_CONTROL_URL : '/');
        if (success) success();
      } else if (error) error();
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setToken(payload.token);
      return {
        ...state,
      };
    },
    saveFooterInfo(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    saveMoreUser(state, { payload }) {
      return {
        ...state,
        users: payload,
      };
    },
  },
};
