import {
  getMessages,
  getCompanyId,
  // getUnitData,
  getImportingTotal,
  getDeviceStatusCount,
  getDevices,
  getDeviceRealTimeData,
  getDeviceConfig,
  getDeviceHistoryData,
  getCameraList,
  getBigFlatformData, //大屏主页面数据
} from '../services/gas';
// 获取单位集
const getUnitSet = function(units) {
  // 告警单位
  const alarmUnit = [];
  // 预警单位
  const faultUnit = [];
  // 正常单位
  const normalUnit = [];
  const newList = units.map(item => {
    const { company_id, company_name, principal_name, principal_phone } = item;
    return {
      ...item,
      companyId: company_id,
      companyName: company_name,
      principalName: principal_name,
      principalPhone: principal_phone,
    };
  });
  newList.forEach(unit => {
    const { unnormal, faultNum } = unit;
    if (+unnormal) {
      alarmUnit.push(unit);
    } else if (+faultNum) {
      faultUnit.push(unit);
    } else {
      normalUnit.push(unit);
    }
  });
  return {
    units: newList,
    alarmUnit,
    faultUnit,
    normalUnit,
  };
};

export default {
  namespace: 'gas',

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
      faultUnit: [],
      // 正常单位
      normalUnit: [],
    },

    // 单位id列表
    unitIds: [],
    // 接入单位统计-饼图
    AccessStatistics: {
      Importing: 0,
      unImporting: 0,
    },
    // 接入单位统计-树状图
    AccessCount: [],
    // 接入单位统计-卡片列表
    gasUnitSet: {
      importingUnits: [],
    },
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
    // 获取燃气大屏单位数据
    *fetchUnitData({ payload, callback }, { call, put }) {
      const {
        code,
        data: {
          companys: units,
          companyNum: jurisdictionalUnitStatistics,
          importingCompanyNum: accessUnitStatistics,
        },
      } = yield call(getBigFlatformData, payload);
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
        unitIds: units.map(({ company_id }) => company_id),
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

    // 燃气大屏接入单位统计
    *fetchImportingTotal({ payload, callback }, { call, put }) {
      const {
        code,
        data: {
          // 饼图数据
          AccessStatistics: { Importing, unImporting },
          companys: importingUnits,
          AccessCount,
        },
      } = yield call(getImportingTotal, payload);
      const AccessStatistics = {
        Importing,
        unImporting,
      };
      const pay = {
        gasUnitSet: { importingUnits },
        AccessCount,
        AccessStatistics,
      };
      if (code === 200) {
        yield put({
          type: 'saveUnitData',
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
  },
  reducers: {
    // 保存
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 接入单位统计
    saveUnitData(state, { payload }) {
      console.log('model', payload);
      return {
        ...state,
        ...payload,
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
  },
};
