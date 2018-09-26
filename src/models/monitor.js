import {
  getCompanyDevices,
  getDeviceConfig,
  getRealTimeData,
  getAllCamera,
  // getStartToPlay,
  getGasCount,
  getGasList,
  fetchCountAndExponent,
  fetchAlarmInfo,
  fetchHistoryAlarm,
  getGsmsHstData,
  getPieces,
} from '../services/bigPlatform/monitor';

const DEFAULT_CODE = 500;
const EMPTY_OBJECT = {};

export default {
  namespace: 'monitor',

  state: {
    allCamera: [],
    gasCount: {},
    gasList: [],
    tags: [],
    countAndExponent: {},
    realTimeAlarm: [],
    historyAlarm: {
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
  },

  effects: {
    *fetchAllCamera({ payload }, { call, put }) {
      const response = yield call(getAllCamera, payload);
      if (response && response.list)
        yield put({ type: 'saveAllCamera', payload: response.list });
    },
    // *fetchStartToPlay({ payload, success }, { call, put }) {
    //   const response = yield call(getStartToPlay, payload);
    //   if (response && response.code === 200) {
    //     // yield put({ type: 'startToPlay', payload: { src: response.data.url } });
    //     if (success) success(response);
    //   }
    // },
    *fetchGasCount({ payload }, { call, put }) {
      let response = yield call(getGasCount, payload);
      response = response || EMPTY_OBJECT;
      const { code = DEFAULT_CODE, data = EMPTY_OBJECT } = response;
      if (code === 200)
        yield put({ type: 'saveGasCount', payload: data });
    },
    *fetchGasList({ payload }, { call, put }) {
      let response = yield call(getGasList, payload);
      response = response || EMPTY_OBJECT;
      const { result = EMPTY_OBJECT } = response;
      yield put({ type: 'saveGasList', payload: result });
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
      const response = yield call(fetchCountAndExponent, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCountAndExponent',
          payload: response.data,
        })
      }
    },
    // 获取实时报警
    *fetchRealTimeAlarm({ payload }, { call, put }) {
      const response = yield call(fetchAlarmInfo, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveRealTimeAlarm',
          payload: response.data.list,
        })
      }
    },
    // 获取报警历史记录
    *fetchHistoryAlarm({ payload }, { call, put }) {
      const response = yield call(fetchHistoryAlarm, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveHistoryAlarm',
          payload: response.data,
        })

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
      if (code === 200)
        yield put({ type: 'saveChartParams', payload: data });
    },
  },

  reducers: {
    saveAllCamera(state, action) {
      return { ...state, allCamera: action.payload };
    },
    saveGasCount(state, action) {
      return { ...state, gasCount: action.payload };
    },
    saveGasList(state, action) {
      return { ...state, gasList: action.payload };
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
      }
    },
    saveRealTimeAlarm(state, { payload }) {
      return {
        ...state,
        realTimeAlarm: payload || [],
      }
    },
    saveHistoryAlarm(state, { payload: {
      list = [],
      pagination,
      pagination: { pageNum, pageSize, total },
    } }) {
      if (pageNum > 1) {
        return {
          ...state,
          historyAlarm: {
            isLast: pageNum * pageSize >= total,
            pagination,
            list: [...state.historyAlarm.list, ...list],
          },
        }
      } else {
        return {
          ...state,
          historyAlarm: {
            isLast: pageNum * pageSize >= total,
            pagination,
            list,
          },
        }
      }
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
  },
};
