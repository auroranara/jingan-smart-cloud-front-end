import {
  getBigFlatformData, //大屏主页面数据
  getUnNormalCount, // 异常单位统计数据
  getImportingTotal, // 接入单位统计
  getAbnormalingTotal, // 异常单位统计
  getPendingMission, // 待处理业务
  getMessages,
  getCompanyId,
  getCameraList,
  getGasForMaintenance,
} from '../services/smoke';

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
  namespace: 'smoke',

  state: {
    // 统计数据
    statisticsData: {
      // 管辖单位统计数
      jurisdictionalUnitStatistics: 0,
      // 接入单位统计数
      accessUnitStatistics: 0,
      // 接入率
      accessRate: '--',
      // 本月历史火警
      fireByMonth: 0,
      // 本季度历史火警
      fireByYear: 0,
      // 本年历史火警
      fireByQuarter: 0,
    },
    // 异常单位统计数据
    unNormalCount: {
      unnormalCompanyNum: 0, //火警单位数量
      faultCompanyNum: 0, //故障单位数量
    },
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
    AbnormalTrend: [],
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

    // 获取烟感大屏各单位数据
    *fetchUnitData({ payload, callback }, { call, put }) {
      const {
        code,
        data: {
          companys: units,
          companyNum: jurisdictionalUnitStatistics,
          importingCompanyNum: accessUnitStatistics,
          fireByMonth,
          fireByYear,
          fireByQuarter,
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
        // 本月历史火警
        fireByMonth,
        // 本季度历史火警
        fireByYear,
        // 本年历史火警
        fireByQuarter,
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

    // 获取异常单位统计数据
    *fetchUnNormalCount({ payload, success, error }, { call, put }) {
      const response = yield call(getUnNormalCount, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveUnNormalCount',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response);
      }
    },

    // 烟感大屏接入单位统计列表
    *fetchImportingTotal({ payload, callback }, { call, put }) {
      const {
        code,
        data: {
          // 饼图数据
          AccessStatistics: { Importing, unImporting },
          // 单位接入设备数
          AccessCount,
          companys: importingUnits,
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

    // 烟感大屏异常单位统计
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

    // 烟感大屏待处理业务
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

    *fetchCameraList({ payload }, { call, put }) {
      const response = yield call(getCameraList, payload);
      const { list } = response;
      yield put({ type: 'saveCameraList', payload: list });
    },
    // 报警处理流程
    *fetchGasForMaintenance({ payload, success, error }, { call, put }) {
      const response = yield call(getGasForMaintenance, payload);
      const num = payload.num || 0;
      const list = num ? response.data.list.slice(0, num) : response.data.list;
      if (response.code === 200) {
        yield put({
          type: 'gasForMaintenance',
          payload: list,
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
    saveUnNormalCount(state, { payload }) {
      return {
        ...state,
        unNormalCount: payload,
      };
    },
    saveCameraList(state, action) {
      return { ...state, cameraList: action.payload };
    },
    gasForMaintenance(state, { payload }) {
      return {
        ...state,
        gasForMaintenance: payload,
      };
    },
  },
};
