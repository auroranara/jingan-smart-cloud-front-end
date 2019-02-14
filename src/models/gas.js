import {
  getMessages,
  getCompanyId,
  // getUnitData,
  getDeviceStatusCount,
  getDevices,
  getDeviceRealTimeData,
  getDeviceConfig,
  getDeviceHistoryData,
  getCameraList,
  // 燃气大屏
  getBigFlatformData, //大屏主页面数据
  getImportingTotal, // 接入单位统计
  getAbnormalingTotal, // 异常单位统计
  getPendingMission, // 待处理业务
  getGasForMaintenance,
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
    /** 燃气大屏 */
    // 统计数据
    statisticsData: {
      // 管辖单位统计数
      jurisdictionalUnitStatistics: 0,
      // 接入单位统计数
      accessUnitStatistics: 0,
      // 接入率
      accessRate: '--',
      // 报警单位
      unnormalCompanyNum: 0,
      // 故障单位
      faultCompanyNum: 0,
      // 失联单位
      outContacts: 0,
    },
    // 饼图 --接入单位统计
    AccessStatistics: {
      Importing: 0,
      unImporting: 0,
    },
    // 树状图 --接入单位统计
    AccessCount: [],
    // 单位卡片列表 --接入单位统计
    gasUnitSet: {
      importingUnits: [],
    },
    // 单位状态统计数据 --异常单位统计
    companyStatus: {
      // 报警
      unnormal: 0,
      // 故障
      faultNum: 0,
      // 失联
      outContact: 0,
    },
    // 报警趋势图数据 --异常单位统计
    AbnormalTrend: {
      // 报警
      abUnnormal: 0,
      // 故障
      abFaultNum: 0,
      // 失联
      abOutContact: 0,
    },
    // 单位卡片列表 --异常单位统计
    gasErrorUnitSet: {
      errorUnits: [],
    },
    // 未处理报警
    allGasFire: 0,
    gasChartByMonth: [],
    // 单位卡片列表 --待处理单位统计
    gasPendingUnitSet: {
      companyList: [],
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
    // 报警处理流程
    gasForMaintenance: [],
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

    // 获取燃气大屏各单位数据
    *fetchUnitData({ payload, callback }, { call, put }) {
      const {
        code,
        data: {
          companys: units,
          companyNum: jurisdictionalUnitStatistics,
          importingCompanyNum: accessUnitStatistics,
          unnormalCompanyNum,
          faultCompanyNum,
          outContacts,
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
        // 报警单位
        unnormalCompanyNum,
        // 故障单位
        faultCompanyNum,
        // 失联单位
        outContacts,
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

    // 燃气大屏异常单位统计
    *fetchAbnormalingTotal({ payload, callback }, { call, put }) {
      const {
        code,
        data: {
          // 单位状态统计数据
          companyStatus: { unnormal, faultNum, outContact },
          AbnormalTrend = [],
          companys: errorUnits,
        },
      } = yield call(getAbnormalingTotal, payload);
      const companyStatus = {
        unnormal,
        faultNum,
        outContact,
      };
      const pay = {
        companyStatus,
        gasErrorUnitSet: { errorUnits },
        AbnormalTrend,
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

    // 燃气大屏待处理业务
    *fetchPendingMission({ payload, callback }, { call, put }) {
      const {
        code,
        data: {
          allGasFire, // 未处理报警
          gasChartByMonth = [], // 报警业务处理统计
          companyList = [], // 单位列表
        },
      } = yield call(getPendingMission, payload);
      const pay = {
        allGasFire,
        gasChartByMonth,
        gasPendingUnitSet: { companyList },
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
    // 报警处理流程
    *fetchGasForMaintenance({ payload, success, error }, { call, put }) {
      const response = yield call(getGasForMaintenance, payload);
      if (response.code === 200) {
        yield put({
          type: 'gasForMaintenance',
          payload: response.data || { list: [] },
        });
        if (success) {
          success(response);
        }
      } else if (error) {
        error(response);
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
    saveUnitData(state, { payload }) {
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
    gasForMaintenance(state, { payload }) {
      return {
        ...state,
        gasForMaintenance: payload.list,
      };
    },
  },
};
