// import { routerRedux } from 'dva/router';
import router from 'umi/router';
// import { stringify } from 'qs';
import { getFakeCaptcha } from '../services/api';
import { setAuthority, setToken } from '../utils/authority';
// import { getPageQuery } from '../utils/utils';
import { reloadAuthorized } from '../utils/Authorized';

import {
  accountLogin,
  accountLoginGsafe,
  fetchFooterInfo,
  changerUser,
  getCode,
  loginByPhone,
} from '../services/account';

// const FIRE_CONTROL_URL = '/fire-control/maintenance-company/list';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    username: null,
    password: null,
    users: [],
    logined: false, // 判断是否从登录页面进来的，登录页面进来会进当前model，刷新当前不会进当前model，一直保持初始值
  },

  effects: {
    *login({ payload, success, error, handleMoreUser }, { call, put }) {
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
          // const { unitType } = response.data;
          // 如果不是多用户，直接登录进去
          yield put({
            type: 'changeLoginStatus',
            payload: { ...response.data },
          });
          // 登录1.0
          yield call(accountLoginGsafe, payload);
          reloadAuthorized();
          // 第一次登陆 跳修改密码
          if (+response.data.isFirstLogin === 1 || +response.data.ruleStatus === 1)
            router.replace('/account/change-password');
          else router.replace('/');
        }
        success && success(response.data);
        yield put({ type: 'saveLogined', payload: true });
      } else error(response.msg);
    },

    *loginWithUserId(
      {
        payload: { type, ...payload },
        success,
      },
      { call, put }
    ) {
      let response;
      if (type === '1') {
        response = yield call(accountLogin, payload);
      } else {
        response = yield call(loginByPhone, payload);
      }
      // const { unitType } = response.data;
      if (response && response.code === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: { ...response.data },
        });
        // 登录1.0
        if (type === '1') {
          yield call(accountLoginGsafe, payload);
        }
        reloadAuthorized();
        if (+response.data.isFirstLogin === 1 || +response.data.ruleStatus === 1)
          router.replace('/account/change-password');
        else router.replace('/');
        success && success(response.data);
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
      // const { unitType } = response.data;
      if (response && response.code === 200 && response.data && response.data.webToken) {
        yield setToken(response.data.webToken);
        yield put({ type: 'user/saveCurrentUser' });
        reloadAuthorized();
        if (+response.data.isFirstLogin === 1 || +response.data.ruleStatus === 1)
          router.replace('/account/change-password');
        else router.replace('/');
        if (success) success(response.data);
      } else if (error) error();
    },
    // 获取验证码
    *getCode({ payload, callback }, { call, put }) {
      const response = yield call(getCode, payload);
      callback && callback(response);
    },
    // 手机号登录
    *loginByPhone({ payload, handleMoreUser, success, error }, { call, put }) {
      const response = yield call(loginByPhone, payload);
      const { code, msg, data } = response || {};
      if (code === 200) {
        if (data.isMoreUser) {
          // 如果是多用户
          yield put({
            type: 'saveMoreUser',
            payload: data.moreUser,
          });
          if (handleMoreUser) handleMoreUser({ token: data.token });
        } else {
          // 如果不是多用户，直接登录进去
          yield put({
            type: 'changeLoginStatus',
            payload: { ...data },
          });
          reloadAuthorized();
          if (+data.isFirstLogin === 1 || +data.ruleStatus === 1)
            router.replace('/account/change-password');
          else router.replace('/');
        }
        success && success(data);
        yield put({ type: 'saveLogined', payload: true });
      } else {
        error && error(msg);
      }
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
    saveLogined(state, action) {
      return { ...state, logined: action.payload };
    },
  },
};
