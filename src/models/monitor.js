import { queryTags } from '../services/api';
import {
  getCompanyDevices,
  getDeviceConfig,
  getRealTimeData,
} from '../services/bigPlatform/monitor';
export default {
  namespace: 'monitor',

  state: {
    tags: [],
    waterCompanyDevicesData: [],
    waterDeviceConfig: [],
    waterRealTimeData: [],
  },

  effects: {
    *fetchTags(_, { call, put }) {
      const response = yield call(queryTags);
      yield put({
        type: 'saveTags',
        payload: response.list,
      });
    },
    // 获取企业传感器列表 根据传感器类型
    *fetchCompanyDevices({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyDevices, payload);
      if (response.code === 200) {
        yield put({ type: 'saveCompanyDevices', payload: response.data });
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
  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
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
  },
};
