import { searchCompanies } from '../services/bigPlatform/bigPlatform.js';

export default {
  namespace: 'bigPlatformSafetyCompany',

  state: {
    selectList: [],
  },

  effects: {
    *fetchSelectList({ payload }, { call, put }) {
      let response = {};
      if (payload.name) {
        response = yield call(searchCompanies, payload);
      }
      yield put({
        type: 'querySelectList',
        payload: response && response.code === 200 ? response.data.list : [],
      });
    },
  },

  reducers: {
    querySelectList(state, action) {
      return {
        ...state,
        selectList: action.payload,
      };
    },
  },
};
