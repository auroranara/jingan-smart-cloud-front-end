import {
  queryOvAlarmCounts,
  queryOvDangerCounts,
  queryAlarm,
  querySys,
  queryFireTrend,
  getCompanyFireInfo,
} from '../services/bigPlatform/fireControl';

export default {
  namespace: 'bigFireControl',

  state: {
    map: {
      companyBasicInfoList: [],
      fireNum: 0,
      totalNum: 0,
    },
    overview: {},
    alarm: {},
    sys: {},
    trend: {},
  },

  effects: {
    *fetchCompanyFireInfo({ payload }, { call, put }) {
      const response = yield call(getCompanyFireInfo);
      if (response && response.code === 200) {
        yield put({ type: 'saveMap', payload: response.data });
      }
    },
    *fetchOvAlarmCounts({ payload }, { call, put }) {
      const response = yield call(queryOvAlarmCounts);
      const { code, data } = response;
      if (code === 200) yield put({ type: 'saveOv', payload: data });
    },
    *fetchOvDangerCounts({ payload }, { call, put }) {
      const response = yield call(queryOvDangerCounts);
      // const { code, data } = response;
      if (response) {
        const { total: totalDanger, overRectifyNum: overdueNum, rectifyNum, reviewNum } = response;
        yield put({ type: 'saveOv', payload: { totalDanger, overdueNum, rectifyNum, reviewNum } });
      }
    },
    *fetchAlarm({ payload }, { call, put }) {
      const response = yield call(queryAlarm, payload);
      const { code, data } = response;
      if (code === 200) yield put({ type: 'saveAlarm', payload: data });
    },
    *fetchSys({ payload }, { call, put }) {
      const response = yield call(querySys);
      if (response && response.code === 200) {
        const { data } = response;
        const { total, activeCount } = data;
        yield put({ type: 'saveSys', payload: data });
        yield put({ type: 'saveOv', payload: { total, activeCount } });
      }
    },
    *fetchFireTrend({ payload }, { call, put }) {
      const response = yield call(queryFireTrend);
      const { code, data } = response;
      if (code === 200) yield put({ type: 'saveTrend', payload: data });
    },
  },

  reducers: {
    saveMap(state, action) {
      return { ...state, map: action.payload };
    },
    saveOv(state, action) {
      const overview = { ...state.overview, ...action.payload };
      return { ...state, overview };
    },
    saveAlarm(state, action) {
      return { ...state, alarm: action.payload };
    },
    saveSys(state, action) {
      return { ...state, sys: action.payload };
    },
    saveTrend(state, action) {
      return { ...state, trend: action.payload };
    },
  },
};
