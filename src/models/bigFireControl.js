import {
  queryOvAlarmCounts,
  queryOvDangerCounts,
  queryCompanyOv,
  queryAlarm,
  querySys,
  queryFireTrend,
  queryDanger,
  getCompanyFireInfo,
  queryAlarmHandle,
  queryLookUp,
  queryOffGuard,
} from '../services/bigPlatform/fireControl';

function handleDanger(response, isCompany = false) {
  const dangerMap = {};
  const selfCheck = {};
  response.hidden_danger_map.forEach(({ month, day, created_danger, from_self_check_point }) => {
    const key = `${month}.${day}`;
    selfCheck[key] = from_self_check_point;
    dangerMap[key] = created_danger;
  });

  const { list, gridList } = response['check_map'].reduce(
    function(prev, next) {
      const { month, day, grid_check_point, self_check_point } = next;
      const key = `${month}.${day}`;
      const time = `${month}/${day}`;
      const danger = selfCheck[key];
      const gridDanger = dangerMap[key];

      prev.list.push({
        time,
        inspect: self_check_point ? self_check_point : 0,
        danger: danger ? danger : 0,
      });
      prev.gridList.push({
        time,
        inspect: grid_check_point ? grid_check_point : 0,
        danger: gridDanger ? gridDanger : 0,
      });

      return prev;
    },
    { list: [], gridList: [] }
  );

  if (isCompany) return { list };
  return [{ list }, { list: gridList }];
}

// function handleMapCompanyList(list) {
//   return list.map(item => {
//     const { isFire } = item;
//     return { ...item, hasFire: isFire === NORMAL ? false: true, status: isFire };
//   });
// }

export default {
  namespace: 'bigFireControl',

  state: {
    map: {
      companyBasicInfoList: [],
      fireNum: 0,
      totalNum: 0,
    },
    overview: {},
    companyOv: {},
    alarm: {},
    alarmHistory: {},
    sys: {},
    trend: {},
    companyTrend: {},
    danger: {},
    gridDanger: {},
    companyDanger: {},
    alarmProcess: {
      startMap: {
        unitType: '',
        createTime: 0,
      },
      handleMap: {
        createTime: 0,
        safetyMan: '',
        safetyPhone: '',
      },
      finshMap: {
        safetyMan: '',
        endTime: 0,
        safetyPhone: '',
      },
      picture: [],
    },
    lookUp: {},
    offGuard: {},
  },

  effects: {
    *fetchCompanyFireInfo({ payload }, { call, put }) {
      const response = yield call(getCompanyFireInfo);
      if (response && response.code === 200) yield put({ type: 'saveMap', payload: response.data });
    },
    *fetchOvAlarmCounts({ payload }, { call, put }) {
      const response = yield call(queryOvAlarmCounts, payload);
      const { code, data = {} } = response;
      if (code === 200) yield put({ type: payload ? 'saveCompanyOv' : 'saveOv', payload: data });
    },
    *fetchOvDangerCounts({ payload }, { call, put }) {
      const response = yield call(queryOvDangerCounts, payload);
      if (response) {
        const { total: totalDanger, overRectifyNum: overdueNum, rectifyNum, reviewNum } = response;
        yield put({
          type: payload ? 'saveCompanyOv' : 'saveOv',
          payload: { totalDanger, overdueNum, rectifyNum, reviewNum },
        });
      }
    },
    *fetchCompanyOv({ payload }, { call, put }) {
      const response = yield call(queryCompanyOv, payload);
      if (response && response.companyMessage) {
        const {
          countCompanyUser: safetyOfficer,
          countCheckItem: riskPointer,
        } = response.companyMessage;
        yield put({ type: 'saveCompanyOv', payload: { safetyOfficer, riskPointer } });
      }
    },
    *fetchAlarm({ payload }, { call, put }) {
      const response = yield call(queryAlarm, payload);
      const { code, data = {} } = response;
      if (code === 200) yield put({ type: 'saveAlarm', payload: data });
    },
    *fetchAlarmHistory({ payload }, { call, put }) {
      const response = yield call(queryAlarm, { ...payload, historyType: 1 });
      const { code, data = {} } = response;
      if (code === 200) {
        yield put({ type: 'saveAlarmHistory', payload: data });
      }
    },
    *fetchSys({ payload }, { call, put }) {
      const response = yield call(querySys);
      if (response && response.code === 200) {
        const { data = {} } = response;
        const { total, activeCount, titleName } = data;
        yield put({ type: 'saveSys', payload: data });
        yield put({ type: 'saveOv', payload: { total, activeCount, titleName } });
      }
    },
    *fetchFireTrend({ payload }, { call, put }) {
      const response = yield call(queryFireTrend, payload);
      const { code, data = {} } = response;
      if (code === 200)
        yield put({ type: payload ? 'saveCompanyTrend' : 'saveTrend', payload: data });
    },
    *fetchDanger({ payload }, { call, put }) {
      const response = yield call(queryDanger, payload);
      // const { code, data } = response;
      if (response) {
        if (payload)
          yield put({ type: 'saveCompanyDanger', payload: handleDanger(response, true) });
        else {
          const [pyd, gridPyd] = handleDanger(response);
          yield put({ type: 'saveDanger', payload: pyd });
          yield put({ type: 'saveGridDanger', payload: gridPyd });
        }
      }
    },
    *fetchAlarmHandle({ payload }, { call, put }) {
      const response = yield call(queryAlarmHandle, payload);
      if (response.code === 200) {
        yield put({ type: 'saveAlarmHandle', payload: response.data });
      }
    },
    *fetchLookUp({ payload, callback }, { call, put }) {
      const response = yield call(queryLookUp);
      const { code, data = {} } = response;
      if (code === 200) {
        yield put({ type: 'saveLookUp', payload: data });
        const { flag, recordsId } = data;
        callback && callback(flag, recordsId);
      }
    },
    *fetchOffGuard({ payload }, { call, put }) {
      const response = yield call(queryOffGuard, payload);
      const { code, data = {} } = response;
      if (code === 200) yield put({ type: 'saveOffGuard', payload: data });
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
    saveCompanyOv(state, action) {
      const companyOv = { ...state.companyOv, ...action.payload };
      return { ...state, companyOv };
    },
    saveAlarm(state, action) {
      return { ...state, alarm: action.payload };
    },
    saveAlarmHistory(state, action) {
      return { ...state, alarmHistory: action.payload };
    },
    saveSys(state, action) {
      return { ...state, sys: action.payload };
    },
    saveTrend(state, action) {
      return { ...state, trend: action.payload };
    },
    saveCompanyTrend(state, action) {
      return { ...state, companyTrend: action.payload };
    },
    saveDanger(state, action) {
      return { ...state, danger: action.payload };
    },
    saveGridDanger(state, action) {
      return { ...state, gridDanger: action.payload };
    },
    saveCompanyDanger(state, action) {
      return { ...state, companyDanger: action.payload };
    },
    saveAlarmHandle(state, action) {
      return { ...state, alarmProcess: action.payload };
    },
    saveLookUp(state, action) {
      return { ...state, lookUp: action.payload };
    },
    savaOffGuard(state, action) {
      return { ...state, offGuard: action.payload };
    },
  },
};
