
import { getMessages, getCompanyId, getUnitData } from '../services/electricityMonitor'
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
  },
}
