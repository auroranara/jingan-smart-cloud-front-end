import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getFakeCaptcha } from '../services/api';
import { setAuthority, setToken } from '../utils/authority';
// import { getPageQuery } from '../utils/utils';
import { reloadAuthorized } from '../utils/Authorized';

import { accountLogin, accountLoginGsafe, fetchFooterInfo } from '../services/account';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    data: {
      serviceSupport: null,
      servicePhone: null,
      projectName: '晶安智慧安全平台',
    },
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (callback) callback(response);
      // Login successfully
      if (response.code && response.code === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: { type: payload.type, status: true, ...response.data },
        });
        // 登录1.0
        yield call(accountLoginGsafe, payload);
        reloadAuthorized();
        yield put(routerRedux.replace({ pathname: '/' }));
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
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
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
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setToken(payload.token);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    saveFooterInfo(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};
