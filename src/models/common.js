import {
  getCompanyList,
  getAreaList,
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
    areaList: [],
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
    // 获取区域列表
    *getAreaList({ payload, callback }, { call, put }) {
      const response = yield call(getAreaList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const areaList = data.list;
        yield put({
          type: 'save',
          payload: {
            areaList,
          },
        });
        callback && callback(true, areaList);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}


