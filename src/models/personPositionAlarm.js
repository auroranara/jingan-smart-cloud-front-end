import {
  getCompanyList,
  getAlarmList,
} from '../services/personnelPosition/alarmManagement';

export default {
  namespace: 'personPositionAlarm',

  state: {
    companyList: [],
  },

  effects: {
    *fetchCompanyList({ payload, callback }, { call, put }) {
      let response = yield call(getCompanyList, payload);
      response = response || {};
      let { code=500, data } = response;
      data = data || {};
      if (code === 200) {
        callback && callback(data.pagination && data.pagination.total ? data.pagination.total : 0);
        yield put({ type: 'saveCompanyList', payload: data });
      }
    },
    *fetchAlarmList({ payload, callback }, { call, put }) {
      let response = yield call(getAlarmList, payload);
      response = response || {};
      let { code=500, data } = response;
      data = data || {};
      if (code === 200)
        yield put({ type: 'saveCompanyList', payload: data });
    },
  },

  reducers: {
    saveCompanyList(state, action) {
      const {
        list,
        pagination,
      } = action.payload;

      const { pageNum } = pagination;
      let nextList = Array.isArray(list) ? list : [];
      if (pageNum !== 1)
        nextList = state.companyList.concat(list);
      return { ...state, companyList: nextList };
    },
  },
};
