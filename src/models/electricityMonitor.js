
import { getMessages, getCompanyId, getUnitData, getCompanyList, getDeviceStatusCount } from '../services/electricityMonitor'
// 获取单位集
const getUnitSet = function(units) {
  // 告警单位
  const alarmUnit = [];
  // 预警单位
  const earlyWarningUnit = [];
  // 正常单位
  const normalUnit = [];
  units.forEach((unit) => {
    switch(+unit.status) {
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
    // 企业统计及数组
    companyInfoDto: {
      companyInfoDtoList: [],
      countNum: 0,
      linkNum: 0,
    },
    deviceStatusCount: {
      count: 0,
      normal: 0,
      earlyWarning: 0,
      confirmWarning: 0,
      unconnect: 0,
    },
  },

  effects: {
    // 获取告警信息列表
    *fetchMessages({ payload, callback }, { call, put }) {
      const { code, data: { list } } = yield call(getMessages, payload)
      if (code === 200) {
        yield put({
          type: 'save',
          payload: { messages: list },
        })
        if (callback) {
          callback(list);
        }
      }
      else if (callback) {
        callback();
      }
    },
    // 获取告警信息列表
    *fetchCompanyId({ payload, callback }, { call, put }) {
      const { code, data } = yield call(getCompanyId, payload)
      if (code === 200) {
        if (callback) {
          callback(data);
        }
      }
      else if (callback) {
        callback();
      }
    },
    // 获取单位数据
    *fetchUnitData({ payload, callback }, { call, put }) {
      const { code, data: { companyInfoDtoList: units, countNum: jurisdictionalUnitStatistics, linkNum: accessUnitStatistics } } = yield call(getUnitData, payload)
      const statisticsData = {
        // 管辖单位统计数
        jurisdictionalUnitStatistics,
        // 接入单位统计数
        accessUnitStatistics,
        // 接入率
        accessRate: jurisdictionalUnitStatistics > 0 ? `${Math.round(accessUnitStatistics / jurisdictionalUnitStatistics * 100)}%` : '--',
      };
      const pay = { unitSet: getUnitSet(units), statisticsData, unitIds: units.map(({ companyId }) => companyId) };
      if (code === 200) {
        yield put({
          type: 'save',
          payload: pay,
        })
        if (callback) {
          callback(pay);
        }
      }
      else if (callback) {
        callback();
      }
    },
    // 企业统计及数组
    *fetchCompanyInfoDto({ payload, success, error }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCompanyInfoDto',
          payload: response.data,
        });
        if (success) {
          success(response);
        }
      } else if (error) {
        error(response);
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
    saveCompanyInfoDto(state, { payload }) {
      return {
        ...state,
        companyInfoDto: payload,
      };
    },
    deviceStatusCount(state, { payload }) {
      return {
        ...state,
        deviceStatusCount: payload,
      };
    },
  },
}
