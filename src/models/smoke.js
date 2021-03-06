import {
  getBigFlatformData, //大屏主页面数据
  getUnNormalCount, // 异常单位统计数据
  getImportingTotal, // 接入单位统计
  getAbnormalingTotal, // 异常单位统计
  getFireHistory, // 火警统计
  getFaultByBrand, // 品牌故障统计
  getMessages,
  getCameraList,
  getSmokeForMaintenance,
  getMapList,
  getCompanySmokeInfo,
  fetchCameraTree,
  getDeviceCountChart, // 历史状态图表数据
  getDeviceList, // 传感器列表
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
      companysList: [],
    },
    // 异常单位统计数据
    unNormalCount: {
      unnormalCompanyNum: 0, //火警单位数量
      faultCompanyNum: 0, //故障单位数量
    },
    // 接入单位统计
    AccessStatistics: {
      Importing: 0,
      unImporting: 0,
    },
    AccessCount: [],
    gasUnitSet: {
      importingUnits: [],
    },
    // 异常单位统计
    companyStatus: {
      // 报警
      unnormal: 0,
      // 故障
      faultNum: 0,
      // 失联
      outContact: 0,
    },
    AbnormalTrend: [],
    gasErrorUnitSet: {
      errorUnits: [],
    },
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    // 火警统计
    fireHistoryData: {
      fireCompanyList: {
        startDate: '',
        endDate: '',
        list: [],
      },
    },
    // 品牌故障统计
    brandData: {
      brandList: [],
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
    gasChartByMonth: [],
    // 单位卡片列表 --待处理单位统计
    gasPendingUnitSet: {
      companyList: [],
    },
    // 摄像头列表
    cameraList: [],
    // 摄像头树列表
    cameraTree: [],
    // 报警处理流程
    gasForMaintenance: [],
    // 公司烟感具体监测数据
    companySmokeInfo: {
      dataByCompany: [],
      list: [],
    },
    // 历史状态图表数据
    deviceCountChartData: {
      list: [],
    },
    // 单位传感器列表
    deviceListData: {
      list: [],
    },
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
    // 获取烟感大屏各单位数据
    *fetchUnitData({ payload, callback }, { call, put }) {
      const response = yield call(getBigFlatformData, payload);
      const { code } = response;
      if (code === 200) {
        const {
          data: {
            companyNum: jurisdictionalUnitStatistics,
            importingCompanyNum: accessUnitStatistics,
            fireByMonth,
            fireByYear,
            fireByQuarter,
            companys,
          },
        } = response;
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
          companysList: companys,
        };
        const pay = {
          statisticsData,
        };
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

    // 烟感地图数据
    *fetchMapList({ payload, success, error }, { call, put }) {
      const response = yield call(getMapList, payload);
      const { code } = response;
      if (code === 200) {
        const {
          data: { list: units },
        } = response;
        const pay = {
          // unitSet: getUnitSet(units),
          unitSet: units,
          unitIds: units.map(({ companyId }) => companyId),
        };
        yield put({
          type: 'save',
          payload: pay,
        });
        if (success) {
          success(pay);
        }
      } else if (error) {
        error(response);
      }
    },

    // 获取异常单位统计数据
    *fetchCompanySmokeInfo({ payload, success, error }, { call, put }) {
      const response = yield call(getCompanySmokeInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'companySmokeInfo',
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
      const response = yield call(getImportingTotal, payload);
      const { code } = response;
      if (code === 200) {
        const {
          data: {
            // 饼图数据
            AccessStatistics: { Importing, unImporting },
            // 单位接入设备数
            AccessCount,
            companys: importingUnits,
          },
        } = response;
        const AccessStatistics = {
          Importing,
          unImporting,
        };
        const pay = {
          gasUnitSet: { importingUnits },
          AccessCount,
          AccessStatistics,
        };
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
      const response = yield call(getAbnormalingTotal, payload);
      const { code } = response;
      if (code === 200) {
        const {
          data: {
            // 单位状态统计数据
            companyStatus: { unnormal, faultNum, outContact },
            AbnormalTrend = [],
            companys: errorUnits,
          },
        } = response;
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

    // 烟感大屏火警统计
    *fetchFireHistory({ payload, success, error }, { call, put }) {
      const response = yield call(getFireHistory, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveFireHistory',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response);
      }
    },

    //  品牌故障统计
    *fetchFaultByBrand({ payload, success, error }, { call, put }) {
      const response = yield call(getFaultByBrand, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveFaultByBrand',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response);
      }
    },

    *fetchCameraList({ payload }, { call, put }) {
      const response = yield call(getCameraList, payload);
      const { list } = response;
      yield put({ type: 'saveCameraList', payload: list });
    },
    *fetchCameraTree({ payload }, { call, put }) {
      const response = yield call(fetchCameraTree, payload);
      const { list } = response;
      yield put({ type: 'save', payload: { cameraTree: list } });
    },
    // 报警处理流程
    *fetchSmokeForMaintenance({ payload, success, error }, { call, put }) {
      const response = yield call(getSmokeForMaintenance, payload);
      // const ids = [];
      // const newList = [];
      // response.data.list.forEach(item => {
      //   const { device_id } = item;
      //   if (ids.indexOf(device_id) < 0) {
      //     ids.push(device_id);
      //     newList.push({ ...item });
      //   }
      // });
      const newList = payload.id
        ? [...response.data.list]
        : response.data.list.filter(item => +item.over_flag === 0);
      if (response.code === 200) {
        const num = payload.num || 0;
        const list = num ? newList.slice(0, num) : newList;
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
    // 历史状态图表数据
    *fetchDeviceCountChart({ payload, success, error }, { call, put }) {
      const response = yield call(getDeviceCountChart, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDeviceCountChart',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response);
      }
    },

    // 传感器列表
    *fetchUnitDeviceList({ payload, success, error }, { call, put }) {
      const response = yield call(getDeviceList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDeviceList',
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
    saveUnitData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 获取异常单位统计数据
    saveUnNormalCount(state, { payload }) {
      return {
        ...state,
        unNormalCount: payload,
      };
    },
    // 获取火警统计
    saveFireHistory(state, { payload }) {
      return {
        ...state,
        fireHistoryData: payload,
      };
    },
    // 获取品牌故障统计
    saveFaultByBrand(state, { payload }) {
      return {
        ...state,
        brandData: payload,
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
    companySmokeInfo(state, { payload }) {
      return {
        ...state,
        companySmokeInfo: payload,
      };
    },

    // 获取历史状态图表数据
    saveDeviceCountChart(state, { payload }) {
      return {
        ...state,
        deviceCountChartData: payload,
      };
    },

    // 获取传感器列表
    saveDeviceList(state, { payload }) {
      return {
        ...state,
        deviceListData: payload,
      };
    },
  },
};
