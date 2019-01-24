import {
  getMessages,
  getCompanyId,
  getUnitData,
  getDeviceStatusCount,
  getDevices,
  getDeviceRealTimeData,
  getDeviceConfig,
  getDeviceHistoryData,
  getCameraList,
  getWarningTrend,
} from '../services/electricityMonitor';
// 获取单位集
const getUnitSet = function(units) {
  // 告警单位
  const alarmUnit = [];
  // 预警单位
  const earlyWarningUnit = [];
  // 正常单位
  const normalUnit = [];
  units.forEach(unit => {
    switch (+unit.status) {
      case 2:
        alarmUnit.push(unit);
        break;
      case 1:
        earlyWarningUnit.push(unit);
        break;
      default:
        normalUnit.push(unit);
        break;
    }
  });
  return {
    units,
    alarmUnit,
    earlyWarningUnit,
    normalUnit,
  };
};

export default {
  namespace: 'electricityMonitor',

  state: {
    // 告警信息列表
    messages: [],
    // 单位集合
    unitSet: {
      // 所有单位
      units: [],
      // 告警单位
      alarmUnit: [],
      // 预警单位
      earlyWarningUnit: [],
      // 正常单位
      normalUnit: [],
    },
    // 单位id列表
    unitIds: [],
    // 统计数据
    statisticsData: {
      // 管辖单位统计数
      jurisdictionalUnitStatistics: 0,
      // 接入单位统计数
      accessUnitStatistics: 0,
      // 接入率
      accessRate: '--',
    },
    deviceStatusCount: {
      count: 0,
      normal: 0,
      earlyWarning: 0,
      confirmWarning: 0,
      unconnect: 0,
    },
    // 设备列表
    devices: [],
    // 设备实时数据
    deviceRealTimeData: {
      status: 0,
      deviceId: undefined,
      deviceDataForAppList: [],
    },
    // 设备配置策略
    deviceConfig: [],
    // 历史数据
    deviceHistoryData: [],
    // 摄像头列表
    cameraList: [],
    warningTrendList: [], // 报警趋势列表(12个月)
    warningTrendList1: [], // 报警趋势列表(6个月)
  },

  effects: {
    // 获取告警信息列表
    *fetchMessages({ payload, callback }, { call, put }) {
      const {
        code,
        data: { list },
      } = yield call(getMessages, payload);
      if (code === 200) {
        yield put({
          type: 'save',
          payload: { messages: list },
        });
        if (callback) {
          callback(list);
        }
      } else if (callback) {
        callback();
      }
    },
    // 获取网格id
    *fetchCompanyId({ payload, callback }, { call, put }) {
      const { code, data } = yield call(getCompanyId, payload);
      if (code === 200) {
        if (callback) {
          callback(data);
        }
      } else if (callback) {
        callback();
      }
    },
    // 获取单位数据
    *fetchUnitData({ payload, callback }, { call, put }) {
      const {
        code,
        data: {
          companyInfoDtoList: units,
          countNum: jurisdictionalUnitStatistics,
          linkNum: accessUnitStatistics,
          allCompanyInfoDtoList = [],
        },
      } = yield call(getUnitData, payload);
      const statisticsData = {
        // 管辖单位统计数
        jurisdictionalUnitStatistics,
        // 接入单位统计数
        accessUnitStatistics,
        // 接入率
        accessRate:
          jurisdictionalUnitStatistics > 0
            ? `${Math.round((accessUnitStatistics / jurisdictionalUnitStatistics) * 100)}%`
            : '--',
      };
      const pay = {
        unitSet: getUnitSet(units),
        statisticsData,
        unitIds: units.map(({ companyId }) => companyId),
      };
      const pay = {
        unitSet: getUnitSet(units),
        statisticsData,
        unitIds: units.map(({ companyId }) => companyId),
        allCompanyList: allCompanyInfoDtoList,
      };
      if (code === 200) {
        yield put({
          type: 'save',
          payload: pay,
        });
        if (callback) {
          callback(pay);
        }
      } else if (callback) {
        callback();
      }
    },
    // 获取企业设备统计数
    *fetchDeviceStatusCount({ payload, success, error }, { call, put }) {
      const response = yield call(getDeviceStatusCount, payload);
      if (response.code === 200) {
        yield put({
          type: 'deviceStatusCount',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response);
      }
    },
    // 获取设备列表
    *fetchDevices({ payload, callback }, { call, put }) {
      const {
        code,
        data: { list },
      } = yield call(getDevices, payload);
      if (code === 200) {
        yield put({
          type: 'save',
          payload: { devices: list },
        });
        if (callback) {
          callback(list);
        }
      }
    },
    // 获取设备实时数据
    *fetchDeviceRealTimeData({ payload, callback }, { call, put }) {
      const { code, data } = yield call(getDeviceRealTimeData, payload);
      if (code === 200) {
        yield put({
          type: 'save',
          payload: { deviceRealTimeData: data },
        });
        if (callback) {
          callback(data);
        }
      }
    },
    // 获取设备配置策略
    *fetchDeviceConfig({ payload, callback }, { call, put }) {
      const {
        code,
        data: { list },
      } = yield call(getDeviceConfig, payload);
      if (code === 200) {
        yield put({
          type: 'save',
          payload: { deviceConfig: list },
        });
        if (callback) {
          callback(list);
        }
      }
    },
    // 获取设备历史数据
    *fetchDeviceHistoryData({ payload, callback }, { call, put }) {
      const { code, data } = yield call(getDeviceHistoryData, payload);
      const list = data && data.list ? data.list : [];
      if (code === 200) {
        yield put({
          type: 'save',
          payload: { deviceHistoryData: list },
        });
        if (callback) {
          callback(list);
        }
      }
    },
    *fetchCameraList({ payload }, { call, put }) {
      const response = yield call(getCameraList, payload);
      const { list } = response;
      yield put({ type: 'saveCameraList', payload: list });
    },
    *fetchWarningTrend({ payload }, { call, put }) {
      const response = yield call(getWarningTrend, payload);
      const { code = 500, data } = response || {};
      const list = data && Array.isArray(data.list) ? data.list : [];
      list.sort((item, item1) => item.timeFlag - item1.timeFlag);
      if (code === 200) {
        yield put({ type: 'saveWarningTrend', payload: list });
        yield put({ type: 'saveWarningTrend1', payload: list.slice(6, 12) });
      }
    },
  },
  reducers: {
    // 保存
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 保存单位数据
    saveUnitData(state, { payload }) {
      return {
        ...state,
        unitSet: getUnitSet(payload),
      };
    },
    deviceStatusCount(state, { payload }) {
      return {
        ...state,
        deviceStatusCount: payload,
      };
    },
    saveCameraList(state, action) {
      return { ...state, cameraList: action.payload };
    },
    saveWarningTrend(state, action) {
      return { ...state, warningTrendList: action.payload };
    },
    saveWarningTrend1(state, action) {
      return { ...state, warningTrendList1: action.payload };
    },
  },
};
