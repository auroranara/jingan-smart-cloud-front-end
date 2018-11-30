import {
  // getCompanyInfo,
  getCompanyDevices,
  getDeviceConfig,
  getRealTimeData,
  getAllCamera,
  getGasCount,
  getGasList,
  fetchCountAndExponent,
  fetchAlarmInfo,
  fetchHistoryAlarm,
  getGsmsHstData,
  getPieces,
  fetchErrorDevices,
  fetchAlarmInfoTypes,
  querySmokeList,
} from '../services/bigPlatform/monitor';

const DEFAULT_CODE = 500;
const EMPTY_OBJECT = {};

export default {
  namespace: 'monitor',

  state: {
    companyInfo: {},
    allCamera: [],
    gasCount: {},
    gasList: [],
    smokeCount: {},
    smokeList: {
      smokeLists: [],
      smokeListByPage: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    tags: [],
    countAndExponent: {},
    realTimeAlarm: [],
    historyAlarm: {
      alarmTypes: [],
      isLast: false,
      pagination: { pageNum: 1, pageSize: 20, total: 0 },
      list: [],
    },
    waterCompanyDevicesData: [],
    waterDeviceConfig: [],
    waterRealTimeData: [],
    chartDeviceList: [],
    gsmsHstData: {},
    electricityPieces: {},
    chartParams: {},
    errorDevice: {
      errorDevices: [],
      errorDevicesByPage: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
  },

  effects: {
    // *fetchCompanyInfo({ payload }, { call, put }) {
    //   let response = yield call(getCompanyInfo, payload);
    //   response = response || EMPTY_OBJECT;
    //   const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
    //   if (code === 200)
    //     yield put({ type: 'saveCompanyInfo', payload: data });
    // },
    *fetchAllCamera({ payload }, { call, put }) {
      const response = yield call(getAllCamera, payload);
      if (response && response.list) yield put({ type: 'saveAllCamera', payload: response.list });
      if (response) yield put({ type: 'saveCompanyInfo', payload: { name: response.companyName } });
    },
    *fetchGasCount({ payload }, { call, put }) {
      let response = yield call(getGasCount, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) yield put({ type: 'saveGasCount', payload: data });
    },
    *fetchGasList({ payload }, { call, put }) {
      let response = yield call(getGasList, payload);
      response = response || EMPTY_OBJECT;
      const { result = EMPTY_OBJECT } = response;
      yield put({ type: 'saveGasList', payload: result });
    },
    // 烟感监测数据
    *fetchSmokeCount({ payload }, { call, put }) {
      let response = yield call(getGasCount, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) yield put({ type: 'saveSmokeCount', payload: data });
    },
    // 烟感监测列表
    *fetchSmokeList({ payload }, { call, put }) {
      const response = yield call(querySmokeList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveSmokeList',
          payload: response.data.list || [],
        });
        yield put({
          type: 'handleSmokeListPagination',
          payload: { pageNum: 1 },
        });
      }
    },
    // 获取企业传感器列表 根据传感器类型
    *fetchCompanyDevices({ payload, callback }, { call, put }) {
      const { type } = payload;
      const response = yield call(getCompanyDevices, payload);
      if (response.code === 200) {
        // 1 电 2 表示可燃有毒气体 3 水质 4 废气
        switch (type) {
          case 1:
            yield put({ type: 'saveChartDeviceList', payload: response.data });
            break;
          case 3:
            yield put({ type: 'saveCompanyDevices', payload: response.data });
            break;
          default:
          // do noting;
        }

        const {
          data: { list = [] },
        } = response;

        // 当至少有一个设备时，再请求第一个设备的参数及其实时数据
        callback && list.length && callback(list[0].deviceId);
      }
    },
    // 获取传感器监测参数
    *fetchDeviceConfig({ payload }, { call, put }) {
      const response = yield call(getDeviceConfig, payload);
      if (response.code === 200) {
        yield put({ type: 'saveDeviceConfig', payload: response.data });
      }
    },
    // 获取传感器实时数据和状态
    *fetchRealTimeData({ payload }, { call, put }) {
      const response = yield call(getRealTimeData, payload);
      if (response.code === 200) {
        yield put({ type: 'saveRealTimeData', payload: response.data });
      }
    },
    // 获取监测指数和设备数量等信息
    *fetchCountAndExponent({ payload }, { call, put }) {
      const response = yield call(fetchCountAndExponent, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCountAndExponent',
          payload: response.data,
        });
      }
    },
    // 获取实时报警
    *fetchRealTimeAlarm({ payload }, { call, put }) {
      const response = yield call(fetchAlarmInfo, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveRealTimeAlarm',
          payload: response.data.list,
        });
      }
    },
    // 获取报警历史记录
    *fetchHistoryAlarm({ payload }, { call, put }) {
      const response = yield call(fetchHistoryAlarm, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveHistoryAlarm',
          payload: response.data,
        });
      }
    },
    // 获取传感器历史
    *fetchGsmsHstData({ payload, success, error }, { call, put }) {
      const response = yield call(getGsmsHstData, payload);
      if (response.code === 200 && !response.data.isError) {
        yield put({
          type: 'gsmsHstData',
          payload: response.data.result,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    // 获取上下线的区块
    *fetchPieces({ payload, success, error }, { call, put }) {
      const response = yield call(getPieces, payload);
      if (response.code === 200) {
        yield put({
          type: 'electricityPieces',
          payload: response.data.list,
          code: payload.code,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *fetchChartParams({ payload }, { call, put }) {
      let response = yield call(getDeviceConfig, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200) yield put({ type: 'saveChartParams', payload: data });
    },
    // 获取失联设备、报警设备列表
    *fetchErrorDevices({ payload }, { call, put }) {
      const response = yield call(fetchErrorDevices, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveErrorDevices',
          payload: response.data.list || [],
        });
        yield put({
          type: 'handleDevicesPagination',
          payload: { pageNum: 1 },
        });
      }
    },
    *fetchAlarmInfoTypes({ payload }, { call, put }) {
      const response = yield call(fetchAlarmInfoTypes);
      if (response && response.code === 200) {
        yield put({
          type: 'saveAlarmTypes',
          payload: response.data.list,
        });
      }
    },
  },

  reducers: {
    saveCompanyInfo(state, action) {
      return { ...state, companyInfo: action.payload };
    },
    saveAllCamera(state, action) {
      return { ...state, allCamera: action.payload };
    },
    saveGasCount(state, action) {
      return { ...state, gasCount: action.payload };
    },
    saveGasList(state, action) {
      return { ...state, gasList: action.payload };
    },
    saveSmokeCount(state, action) {
      return { ...state, smokeCount: action.payload };
    },
    saveSmokeList(state, { payload }) {
      return {
        ...state,
        smokeList: {
          ...state.smokeList,
          smokeLists: payload || [],
          smokeListByPage: [],
          pageNum: 1,
          total: (payload && payload.length) || 0,
        },
      };
    },
    handleSmokeListPagination(state, { payload }) {
      const { pageNum } = payload;
      const {
        smokeList: { pageSize, smokeLists },
      } = state;
      const list = smokeLists.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      return {
        ...state,
        smokeList: {
          ...state.smokeList,
          smokeListByPage: list,
          pageNum,
        },
      };
    },
    saveChartDeviceList(state, action) {
      return { ...state, chartDeviceList: action.payload };
    },
    saveCompanyDevices(state, action) {
      return { ...state, waterCompanyDevicesData: action.payload };
    },
    saveDeviceConfig(state, action) {
      return { ...state, waterDeviceConfig: action.payload };
    },
    saveRealTimeData(state, action) {
      return { ...state, waterRealTimeData: action.payload };
    },
    saveCountAndExponent(state, { payload }) {
      return {
        ...state,
        countAndExponent: payload || {},
      };
    },
    saveRealTimeAlarm(state, { payload }) {
      return {
        ...state,
        realTimeAlarm: payload || [],
      };
    },
    saveHistoryAlarm(
      state,
      {
        payload: {
          list = [],
          pagination,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      if (pageNum > 1) {
        return {
          ...state,
          historyAlarm: {
            ...state.historyAlarm,
            isLast: pageNum * pageSize >= total,
            pagination,
            list: [...state.historyAlarm.list, ...list],
          },
        };
      } else {
        return {
          ...state,
          historyAlarm: {
            ...state.historyAlarm,
            isLast: pageNum * pageSize >= total,
            pagination,
            list,
          },
        };
      }
    },
    clearHistoryAlarm(state) {
      return {
        ...state,
        historyAlarm: {
          alarmTypes: [],
          isLast: false,
          pagination: { pageNum: 1, pageSize: 20, total: 0 },
          list: [],
        },
      };
    },
    gsmsHstData(state, action) {
      return {
        ...state,
        gsmsHstData: action.payload,
      };
    },
    electricityPieces(state, action) {
      const obj = {};
      obj[action.code] = action.payload;
      return {
        ...state,
        electricityPieces: {
          ...state.electricityPieces,
          ...obj,
        },
      };
    },
    saveChartParams(state, action) {
      return { ...state, chartParams: action.payload };
    },
    saveErrorDevices(state, { payload }) {
      return {
        ...state,
        errorDevice: {
          ...state.errorDevice,
          errorDevices: payload || [],
          errorDevicesByPage: [],
          pageNum: 1,
          total: (payload && payload.length) || 0,
        },
      };
    },
    handleDevicesPagination(state, { payload }) {
      const { pageNum } = payload;
      const {
        errorDevice: { pageSize, errorDevices },
      } = state;
      const list = errorDevices.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      return {
        ...state,
        errorDevice: {
          ...state.errorDevice,
          errorDevicesByPage: list,
          pageNum,
        },
      };
    },
    saveAlarmTypes(state, action) {
      return {
        ...state,
        historyAlarm: {
          ...state.historyAlarm,
          alarmTypes: action.payload,
        },
      };
    },
  },
};
