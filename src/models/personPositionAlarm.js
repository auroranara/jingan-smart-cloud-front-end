import {
  getCompanyList,
  getAlarmList,
  getMapList,
  getSectionList,
  getSectionLimits,
} from '../services/personnelPosition/alarmManagement';
// import { handleMapList } from '@/pages/PersonnelPosition/AlarmManagement/utils';

export default {
  namespace: 'personPositionAlarm',

  state: {
    companyList: [],
    alarmList: [],
    mapList: [],
    sectionList: [],
    sectionLimits: {},
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
        yield put({ type: 'saveAlarmList', payload: data });
    },
    *fetchMapList({ payload, callback }, { call, put }) {
      let response = yield call(getMapList, payload);
      response = response || {};
      let { code=500, data } = response;
      if (code === 200)
        yield put({ type: 'saveMapList', payload: data && Array.isArray(data.list) ? data.list : [] });
    },
    *fetchSectionList({ payload, callback }, { call, put }) {
      let response = yield call(getSectionList, payload);
      response = response || {};
      let { code=500, data } = response;
      if (code === 200)
        yield put({ type: 'saveSectionList', payload: data && Array.isArray(data.list) ? data.list : [] });
    },
    *fetchSectionLimits({ payload, callback }, { call, put }) {
      let response = yield call(getSectionLimits, payload);
      response = response || {};
      let { code=500, data } = response;
      if (code === 200)
        yield put({ type: 'saveSectionLimits', payload: data || {} });
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
    saveAlarmList(state, action) {
      return { ...state, alarmList: action.payload };
    },
    saveMapList(state, action) {
      return { ...state, mapList: action.payload };
    },
    saveSectionList(state, action) {
      return { ...state, sectionList: action.payload };
    },
    saveSectionLimits(state, action) {
      return { ...state, sectionLimits: action.payload };
    },
  },
};
