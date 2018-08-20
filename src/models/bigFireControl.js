import { queryOvAlarmCounts, queryOvDangerCounts, queryAlarm, querySys, queryFireTrend, queryDanger } from '../services/bigPlatform/fireControl';

export default {
  namespace: 'bigFireControl',

  state : {
    overview: {},
    alarm: {},
    sys: {},
    trend: {},
    danger: {},
  },

  effects: {
    *fetchOvAlarmCounts({ payload }, { call, put }) {
      const response = yield call(queryOvAlarmCounts);
      const { code, data } = response;
      if (code === 200)
        yield put({ type: 'saveOv', payload: data });
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
      if (code === 200)
        yield put({ type: 'saveAlarm', payload: data });
    },
    *fetchSys({ payload }, { call, put }) {
      const response = yield call(querySys);
      const { code, data } = response;
      const { total, activeCount } = data;
      if (code === 200) {
        yield put({ type: 'saveSys', payload: data });
        yield put({ type: 'saveOv', payload: { total, activeCount } });
      }
    },
    *fetchFireTrend({ payload }, { call, put }) {
      const response = yield call(queryFireTrend);
      const { code, data } = response;
      if (code === 200)
        yield put({ type: 'saveTrend', payload: data });
    },
    *fetchDanger({ payload }, { call, put }) {
      const response = yield call(queryDanger);
      const { code, data } = response;
      if (code === 200)
        yield put({ type: 'saveDanger', payload: data });
    },
  },

  reducers: {
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
    saveDanger(state, action) {
      return { ...state, danger: action.payload };
    },
  },
}
