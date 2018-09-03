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
    username: null,
    password: null,
    users: [],
  },

  effects: {
    // *login({ payload, error }, { call, put }) {
    //   const response = yield call(accountLogin, payload);
    //   // Login successfully
    //   if (response && response.code === 200) {
    //     yield put({
    //       type: 'changeLoginStatus',
    //       payload: { type: payload.type, status: true, ...response.data },
    //     });
    //     // 登录1.0
    //     yield call(accountLoginGsafe, payload);
    //     reloadAuthorized();
    //     yield put(routerRedux.replace({ pathname: '/' }));
    //   } else if (error) error(response.msg)
    // },

    *login({ payload, error, handleMoreUser }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response && response.code === 200) {
        if (response.data.isMoreUser) {
          // 如果是多用户
          yield put({
            type: 'saveMoreUser',
            payload: response.data.moreUser,
          })
          if (handleMoreUser) handleMoreUser()
        } else {
          // 如果不是多用户，直接登录进去
          yield put({
            type: 'changeLoginStatus',
            payload: { type: payload.type, status: true, ...response.data },
          });
          // 登录1.0
          yield call(accountLoginGsafe, payload);
          reloadAuthorized();
          yield put(routerRedux.replace({ pathname: '/' }));
        }
      } else error(response.msg)
    },

    *loginWithUserId({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response && response.code === 200) {
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
    saveMoreUser(state, { payload }) {
      return {
        ...state,
        users: payload,
      }
    },
  },
};
