import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getFakeCaptcha } from '../services/api';
import { setAuthority, setToken } from '../utils/authority';
// import { getPageQuery } from '../utils/utils';
import { reloadAuthorized } from '../utils/Authorized';

import { accountLogin, accountLoginGsafe, testGssafe } from '../services/account';

export default {
  namespace: 'login',

  state: {
    status: undefined,
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
        const gsafeRes = yield call(accountLoginGsafe, payload);
        console.log('gsafeRes', gsafeRes);
        console.log('cookie', document.cookie);
        reloadAuthorized();
        const testRes = yield call(testGssafe, payload);
        console.log('testRes', testRes);
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.startsWith('/#')) {
        //       redirect = redirect.substr(2);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }
        // yield put(routerRedux.replace({ pathname: redirect || '/' }));
        yield put(routerRedux.replace({ pathname: '/' }));
      }
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
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
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
  },
};
