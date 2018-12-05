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
  queryCountdown,
  queryOffGuard,
  warnOffGuard,
  postLookingUp,
  getAllCamera,
  getVideoLookUp,
  getMapLocation,
  getGrids,
} from '../services/bigPlatform/fireControl';

const DEFAULT_CODE = 500;
const EMPTY_OBJECT = {};

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
        type: '',
      },
      finshMap: {
        safetyMan: '',
        endTime: 0,
        safetyPhone: '',
        type: '',
      },
      picture: [],
    },
    lookUp: {},
    countdown: {},
    offGuard: {},
    allCamera: [],
    // startToPlay: '',
    videoLookUp: [],
    lookUpCamera: [],
    mapLocation: [],
    grids: [],
  },

  effects: {
    *fetchCompanyFireInfo({ payload }, { call, put }) {
      let response = yield call(getCompanyFireInfo, payload);
      if (response && response.code === 200) yield put({ type: 'saveMap', payload: response.data });
    },
    *fetchOvAlarmCounts({ payload }, { call, put }) {
      let response = yield call(queryOvAlarmCounts, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) yield put({ type: payload.companyId ? 'saveCompanyOv' : 'saveOv', payload: data });
    },
    *fetchOvDangerCounts({ payload }, { call, put }) {
      const response = yield call(queryOvDangerCounts, payload);
      if (response) {
        const { total: totalDanger, overRectifyNum: overdueNum, rectifyNum, reviewNum } = response;
        yield put({
          type: payload.company_id ? 'saveCompanyOv' : 'saveOv',
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
    *fetchAlarm({ payload, callback }, { call, put }) {
      let response = yield call(queryAlarm, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) {
        callback && callback(data ? data.list : []);
        yield put({ type: 'saveAlarm', payload: data });
      }
    },
    *fetchAlarmHistory({ payload }, { call, put }) {
      let response = yield call(queryAlarm, { ...payload, historyType: 1 });
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) {
        yield put({ type: 'saveAlarmHistory', payload: data });
      }
    },
    *fetchSys({ payload }, { call, put }) {
      const response = yield call(querySys, payload);
      if (response && response.code === 200) {
        const { data = EMPTY_OBJECT } = response;
        const { total, activeCount, titleName } = data;
        yield put({ type: 'saveSys', payload: data });
        yield put({ type: 'saveOv', payload: { total, activeCount, titleName } });
      }
    },
    *fetchFireTrend({ payload }, { call, put }) {
      let response = yield call(queryFireTrend, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200)
        yield put({ type: payload.companyId ? 'saveCompanyTrend' : 'saveTrend', payload: data });
    },
    *fetchDanger({ payload }, { call, put }) {
      const response = yield call(queryDanger, payload);
      // const { code, data } = response;
      if (response) {
        if (payload.company_id)
          yield put({ type: 'saveCompanyDanger', payload: handleDanger(response, true) });
        else {
          const [pyd, gridPyd] = handleDanger(response);
          yield put({ type: 'saveDanger', payload: pyd });
          yield put({ type: 'saveGridDanger', payload: gridPyd });
        }
      }
    },
    *fetchInitLookUp({ payload, callback }, { call, put }) {
      let response = yield call(queryLookUp, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) {
        yield put({ type: 'saveLookUp', payload: data });
        const { flag, recordsId } = data;
        callback && callback(flag, recordsId);
      }
    },
    *fetchCountdown({ payload, callback }, { call, put }) {
      let response = yield call(queryCountdown, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) {
        yield put({ type: 'saveCountdown', payload: data });
        callback && callback(data.ended);
      }
    },
    *postLookingUp({ payload, callback }, { call, put }) {
      let response = yield call(postLookingUp, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, msg = '暂无信息' } = response;
      callback && callback(code, msg);
    },
    *fetchOffGuard({ payload }, { call, put }) {
      let response = yield call(queryOffGuard, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) yield put({ type: 'saveOffGuard', payload: data });
    },
    *offGuardWarn({ payload, callback }, { call, put }) {
      let response = yield call(warnOffGuard, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, msg = '暂无信息', data = EMPTY_OBJECT } = response;
      callback && callback(code, msg, data);
    },
    *fetchAlarmHandle({ payload }, { call, put }) {
      const response = yield call(queryAlarmHandle, payload);
      if (response.code === 200) {
        yield put({ type: 'saveAlarmHandle', payload: response.data });
      }
    },
    *fetchAllCamera({ payload }, { call, put }) {
      const response = yield call(getAllCamera, payload);
      const { list } = response;
      yield put({ type: 'saveAllCamera', payload: list });
    },
    *fetchVideoLookUp({ payload, callback }, { call, put }) {
      let response = yield call(getVideoLookUp, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      callback && callback(code, data.list);
      if (code === 200) yield put({ type: 'saveVideoLookUp', payload: data.list });
    },
    // 获取网格区域
    *fetchMapLocation({ payload, success, error }, { call, put }) {
      const response = yield call(getMapLocation, payload);
      if (response.code === 200) {
        yield put({
          type: 'mapLocation',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 获取网格列表
    *fetchGrids({ payload, callback }, { call, put }) {
      let response = yield call(getGrids);
      response = response || EMPTY_OBJECT;
      // const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      const code = 200;
      const data = response;
      if (code === 200) {
        yield put({ type: 'saveGrids', payload: data });
        callback && callback(data);
      }
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
    saveAllCamera(state, action) {
      return { ...state, allCamera: action.payload };
    },
    // startToPlay(state, action) {
    //   return { ...state, startToPlay: action.payload };
    // },
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
    saveCreateTime(state, action) {
      return { ...state, lookUp: { ...state.lookUp, createTime: action.payload } };
    },
    saveCountdown(state, action) {
      return { ...state, countdown: action.payload };
    },
    saveOffGuard(state, action) {
      return { ...state, offGuard: action.payload };
    },
    saveVideoLookUp(state, action) {
      return { ...state, videoLookUp: action.payload };
    },
    saveLookUpCamera(state, action) {
      return { ...state, lookUpCamera: action.payload };
    },
    mapLocation(state, action) {
      return { ...state, mapLocation: action.payload ? JSON.parse(action.payload) : [] };
    },
    saveGrids(state, action) {
      return { ...state, grids: action.payload };
    },
  },
};
