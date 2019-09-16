import {
  getCompanyList,
} from '@/services/common';

export default {
  namespace: 'common',

  state: {
    companyList: {
      list: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
    },
  },

  effects: {
    /* 获取列表 */
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const companyList = data || {};
        yield put({
          type: 'save',
          payload: {
            companyList,
          },
        });
        if (callback) {
          callback(companyList);
        }
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}


