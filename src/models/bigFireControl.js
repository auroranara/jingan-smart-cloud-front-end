import {
  queryOvAlarmCounts,
  queryOvDangerCounts,
  queryCompanyOv,
  queryAlarm,
  querySys,
  queryFireTrend,
  queryDanger,
  queryDangerList,
  getHiddenDangerRecords,
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
  getRiskPoints,
  getSafeMan,
  getHostAlarmTrend,
  fetchCameraTree,
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
    function (prev, next) {
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

function handleRiskPoints(pointsObj) {
  if (!pointsObj)
    return [];

  return ['red', 'orange', 'yellow', 'blue', 'notRated'].reduce((prev, next) => {
    const prop = `${next}DangerResult`;
    const arr = Array.isArray(pointsObj[prop]) ? pointsObj[prop] : [];
    return prev.concat(arr);
  }, []);
}

function getRestTime(t) {
  const time = Math.floor(t / 1000);
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return min ? `${min}分${sec}秒` : `${sec}秒`;
}

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
    govAlarm: {}, // 概况中的火警信息
    comAlarm: {},
    alarm: {},
    alarmHistory: {},
    sys: {},
    trend: {},
    companyTrend: {},
    danger: {},
    dangerList: [], // 隐患企业列表
    dangerRecords: [], // 隐患巡查记录
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
    createTime: 0, // 倒计时开始时间
    countdown: {},
    offGuard: {},
    allCamera: [],
    cameraTree: [],
    // startToPlay: '',
    videoLookUp: [],
    lookUpCamera: [],
    mapLocation: [],
    grids: [],
    units: {},
    riskPoints: [],
    safeMan: {},
    hostAlarmTrend: {},
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
      if (code === 200) {
        yield put({ type: payload.companyId ? 'saveCompanyOv' : 'saveOv', payload: data });
        yield put({ type: payload.companyId ? 'saveComAlarm' : 'saveGovAlarm', payload: data });
      }
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
        const { total, activeCount, importCount, titleName } = data;
        yield put({ type: 'saveSys', payload: data });
        yield put({ type: 'saveOv', payload: { total, activeCount, importCount, titleName } });
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
    *fetchDangerList({ payload }, { call, put }) {
      const response = yield call(queryDangerList, payload);
      yield put({ type: 'saveDangerList', payload: response || [] });
    },
    *fetchDangerRecords({ payload }, { call, put }) {
      const response = yield call(getHiddenDangerRecords, payload);
      if (response && Array.isArray(response.hiddenDangers))
        yield put({ type: 'saveDangerRecords', payload: response.hiddenDangers });
    },
    *fetchInitLookUp({ payload, callback }, { call, put }) {
      let response = yield call(queryLookUp, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) {
        yield put({ type: 'saveLookUp', payload: data });
        if (data && data.createTime)
          yield put({ type: 'saveCreateTime', payload: data.createTime });
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
      const { code = DEFAULT_CODE, data, msg } = response;
      const newMsg = typeof data === 'number' ? `${msg}，还有${getRestTime(data)}可以查岗` : msg;
      callback && callback(code, newMsg);
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
    *fetchCameraTree({ payload }, { call, put }) {
      const response = yield call(fetchCameraTree, payload);
      const { list } = response;
      yield put({ type: 'saveCameraTree', payload: list });
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
    // 获取风险点
    *fetchRiskPoints({ payload }, { call, put }) {
      let response = yield call(getRiskPoints, payload);
      if (response)
        yield put({ type: 'saveRiskPoints', payload: response });
    },
    // 获取安全员
    *fetchSafeMan({ payload }, { call, put }) {
      const response = yield call(getSafeMan, payload);
      const { code, data } = response || {};
      if (code === 200)
        yield put({ type: 'saveSafeMan', payload: data && data.roleMap ? data.roleMap : {} });
    },
    // 获取最近十二个月的主机报警数量
    *fetchHostAlarmTrend({ payload }, { call, put }) {
      let response = yield call(getHostAlarmTrend, payload);
      response = response || {};
      const { code = DEFAULT_CODE, data = {} } = response;
      if (code === 200)
        yield put({ type: 'saveHostAlarmTrend', payload: data || {} });
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
    saveGovAlarm(state, action) {
      return { ...state, govAlarm: action.payload };
    },
    saveComAlarm(state, action) {
      return { ...state, comAlarm: action.payload };
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
    saveDangerList(state, action) {
      const dangerList = action.payload;
      dangerList.forEach((item, i) => item.index = i + 1);
      return { ...state, dangerList };
    },
    saveDangerRecords(state, action) {
      // 过滤掉隐患记录中的已关闭
      return { ...state, dangerRecords: action.payload.filter(({ status }) => status !== '4') };
      // return { ...state, dangerRecords: action.payload };
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
    // saveCreateTime(state, action) {
    //   return { ...state, lookUp: { ...state.lookUp, createTime: action.payload } };
    // },
    saveCreateTime(state, action) {
      return { ...state, createTime: action.payload };
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
    saveRiskPoints(state, action) {
      return { ...state, riskPoints: handleRiskPoints(action.payload) }
    },
    saveSafeMan(state, action) {
      return { ...state, safeMan: action.payload };
    },
    saveHostAlarmTrend(state, action) {
      return { ...state, hostAlarmTrend: action.payload };
    },
    saveCameraTree(state, action) {
      return { ...state, cameraTree: action.payload };
    },
  },
};
