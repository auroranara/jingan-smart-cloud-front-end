import { queryOvAlarmCounts, queryOvDangerCounts, queryAlarm, querySys } from '../services/bigPlatform/fireControl';

export default {
  namespace: 'bigFireControl',

  state : {
    overview: {},
    alarm: {},
    sys: {},
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
  },
}
