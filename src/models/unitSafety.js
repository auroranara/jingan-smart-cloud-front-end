import {
  // 企业信息(包含人员数量四色图等)
  getCompanyMessage,
  // 特种设备
  getSpecialEquipmentCount,
  // 获取风险点信息
  getPointInfoList,
  // 获取隐患列表
  getHiddenDangerList,
  // 获取视频列表
  getVideoList,
  // 获取监控球相关数据
  getMonitorData,
  // 企业大屏四色风险点,
  getCountDangerLocation,
  // 获取巡查人员列表
  getStaffList,
  // 获取巡查人员记录
  getStaffRecords,
  // 获取巡查记录详情
  getInspectionPointData,
  // 获取安全人员信息
  getSafetyOfficer,
  // 获取安全指数
  getSafetyIndex,
  // 获取动态监测
  getMonitorList,
  // 获取安全档案
  getSafeFiles,
  // 获取动态监测数据
  getDynamicMonitorData,
  // 获取风险点的风险告知卡列表
  getRiskPointCardList,
  // 获取风险点的隐患列表
  getRiskPointHiddenDangerList,
  // 获取风险点的巡查列表
  getRiskPointInspectionList,
  // 获取风险点的隐患统计
  getRiskPointHiddenDangerCount,
  // 获取风险点的巡查统计
  getRiskPointInspectionCount,
  // 获取点位
  getPoints,
} from '../services/unitSafety';

function handleRiskList(response) {
  if (!response)
    return [];

  const result = ['supervision', 'red', 'orange', 'yellow', 'blue', 'notRated'].reduce((prev, next) => {
    const value = response[`${next}${next !== 'supervision' ? 'Danger' : ''}Result`];
    const list = Array.isArray(value) ? value.map(item => ({ ...item, flag: next })) : [];
    return prev.concat(list);
  }, []).filter(item => item.status === 4);

  result.sort((item, item1) => item.check_date_time - item1.check_date_time);
  return result;
}

// const MONITOR_PROPS = [
//   'prepare_elec_state', // 备电
//   'main_elec_state', // 主电
//   'main_line_state', // 主线
//   'fault_state', // 故障
//   'fire_state', // 火警
// ];
// function handleMonitorList(list) {
//   const result = list.filter(item => {
//     return MONITOR_PROPS.some(prop => item[prop] === '1');
//     // 火警标识为报警，其他的都标识为故障
//   }).map(item => ({ ...item, statusLabel: item.fire_state === '1' ? '报警' : '故障' }));

//   result.sort((item, item1) => item1.save_time - item.save_time);
//   return result;
// }

function getStatus(params) {
  if (params === '故障')
    return 0;

  if (params.includes('火警'))
    return 1;

  return 2;
}

// 0 消防主机故障 1 消防主机火警 2 其他监测设备报警 3 失联
function handleMonitorList(list) {
  const loss = Array.isArray(list.lossDevice) ? list.lossDevice.map(({ deviceId, relationDeviceId, area, location, statusTime, typeName }) => ({
    id: deviceId,
    type: typeName,
    number: relationDeviceId,
    params: '失联',
    status: 3,
    time: statusTime,
    location: `${area}${location || ''}`,
  })) : [];
  const alarm = Array.isArray(list.abnormalDevice) ? list.abnormalDevice.map(({ deviceId, relationDeviceId, area, location, unormalParams, typeName }) => ({
    id: deviceId,
    type: typeName,
    number: relationDeviceId,
    params: unormalParams,
    status: getStatus(unormalParams),
    location: `${area}${location || ''}`,
  })) : [];

  loss.sort((item, item1) => item1.time - item.time);
  return [...alarm, ...loss];
}

function handleDangerList(list) {
  const outed = list.filter(item => item.status === '7');
  const rectify = list.filter(item => item.status === '1' || item.status === '2');
  const review = list.filter(item => item.status === '3');
  [outed, rectify, review].forEach(ls => ls.sort((item, item1) => item1.report_time - item.report_time));

  return [...outed, ...rectify, ...review];
}

const ITEMS = ['特种设备', '应急物资', '特种作业操作证人员', '企业安全培训信息'];
const PROPS = {
  '特种设备': ['recheck_date', 'data_true_name'],
  '应急物资': ['end_time', 'emergency_equipment_name'],
  '特种作业操作证人员': ['nextDate', 'name'],
  '企业安全培训信息': ['nextDate', 'traineeName'],
};
const DAY_MS = 24 * 3600 * 1000;

function handleSafeList(list) {
  const now = Date.now();

  const result = list.reduce((prev, next) => {
    if (!ITEMS.includes(next.name) || !Array.isArray(next.list))
      return prev;

    const ls = next.list.map(({ [PROPS[next.name][0]]: expire, [PROPS[next.name][1]]: name }) => ({
      type: next.name,
      name,
      expire: Math.floor((now - expire) / DAY_MS),
    })).filter(item => item.expire >= 0);
    return prev.concat(ls);
  }, []);

  result.sort((item, item1) => item1.expire - item.expire);
  return result;
}

// 格式化动态监测数据
const formatDynamicMonitorData = (list) => {
  const data = {};
  list.forEach((item) => {
    switch(item.name) {
      case '消防主机监测':
        data.fireEngine = item;
        break;
      case '电气火灾监测':
        data.electricalFire = item;
        break;
      case '独立烟感报警监测':
        data.smokeAlarm = item;
        break;
      case '储罐监测':
        data.storageTank = item;
        break;
      case '可燃/有毒气体监测':
        data.toxicGas = item;
        break;
      case '废水监测':
        data.effluent = item;
        break;
      case '废气监测':
        data.exhaustGas = item;
        break;
      case '视频监控':
        data.videoMonitor = item;
        break;
      default:
        break;
    }
  });
  return data;
};

export default {
  namespace: 'unitSafety',

  state: {
    // 企业信息
    companyMessage: {
      // 企业信息
      companyMessage: {
        // 企业名称
        companyName: '',
        // 安全负责人
        headOfSecurity: '',
        // 联系方式
        headOfSecurityPhone: '',
        // 风险点统计
        countCheckItem: 0,
        // 安全人员统计
        countCompanyUser: 0,
      },
      // 巡查次数列表
      check_map: [],
      // 隐患数量列表
      hidden_danger_map: [],
      // 是否是重点单位
      isImportant: false,
      // 风险点列表
      point: [],
      // 四色图列表
      fourColorImg: [],
    },
    // 特种设备统计
    specialEquipmentCount: 0,
    // 风险点信息列表（风险告知卡列表）
    // pointInfoList: [],
    // 隐患列表
    hiddenDangerList: {},
    // 视频列表
    videoList: [],
    // 监控球数据
    monitorData: { score: 0 },
    // 四色风险点统计
    countDangerLocation: {},
    // 人员巡查列表
    staffList: [],
    // 人员记录
    staffRecords: [],
    // 安全人员信息
    safetyOfficer: {},
    // 巡查点位数据
    inspectionPointData: {

    },
    // 安全指数
    safetyIndex: undefined,
    // 每个具体的安全指数
    safetyIndexes: [],
    // 隐患巡查单条记录对应的隐患列表
    inspectionRecordData: {},
    // 风险点数组
    riskList: [],
    // 隐患排查数组
    dangerList: {},
    // 动态监测
    monitorList: [],
    // 安全档案
    safeList: [],
    // 动态监测数据
    dynamicMonitorData: {},
    // 风险点详情
    riskPointDetail: {
      // 风险告知卡列表
      cardList: [],
      // 隐患列表
      hiddenDangerList: {},
      // 巡查列表
      inspectionList: {},
      // 隐患统计
      hiddenDangerCount: {},
      // 巡查统计
      inspectionCount: {},
    },
    // 点位
    points: {
      // 所有点位
      pointList: [],
      // 四色图点位
      fourColorImgPoints: {},
      // 其他各种点位和统计
    },
    // 隐患统计
    hiddenDangerCount: { total: 0, ycq: 0, wcq: 0, dfc: 0 },
  },

  effects: {
    // 获取企业信息
    *fetchCompanyMessage({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyMessage, payload);
      const companyMessage = {
        ...response,
        // 移除地址不合法的四色图
        fourColorImg:
          response.fourColorImg && response.fourColorImg.startsWith('[')
            ? JSON.parse(response.fourColorImg).filter(
                ({ id, webUrl }) => /^http/.test(webUrl) && id
              )
            : [],
      };
      yield put({
        type: 'save',
        payload: { companyMessage },
      });
      if (callback) {
        callback(companyMessage);
      }
    },
    // 特种设备统计
    *fetchSpecialEquipmentCount({ payload, callback }, { call, put }) {
      const response = yield call(getSpecialEquipmentCount, payload);
      yield put({
        type: 'save',
        payload: { specialEquipmentCount: response.total },
      });
      if (callback) {
        callback(response.total);
      }
    },
    // // 获取风险点信息（风险告知卡列表）
    // *fetchPointInfoList({ payload, callback }, { call, put }) {
    //   const response = yield call(getPointInfoList, payload);
    //   yield put({
    //     type: 'savePointInfoList',
    //     payload: response.companyLetter,
    //   });
    //   if (callback) {
    //     callback(response.companyLetter);
    //   }
    // },
    // 获取隐患列表
    *fetchHiddenDangerList({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerList, payload);
      const { code, data: { list, pagination } } = response;
      if (code === 200) {
        yield put({ type: 'saveHiddenDangerList', payload: { list, pagination: { ...pagination, pageNum: payload.pageNum, pageSize: payload.pageSize }  }, append: payload.pageNum !== 1 });
      }
      callback && callback(response);
    },
    // 获取隐患列表
    *fetchDangerList({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerList, payload);
      const { code, data: { list, pagination } } = response;
      if (code === 200) {
        yield put({ type: 'saveDangerList', payload: { list, pagination: { ...pagination, pageNum: payload.pageNum, pageSize: payload.pageSize }  }, append: payload.pageNum !== 1 });
      }
      callback && callback(response);
    },
    // 获取视频列表
    *fetchVideoList({ payload, callback }, { call, put }) {
      const response = yield call(getVideoList, payload);
      yield put({ type: 'save', payload: { videoList: response.list } });
      if (callback) callback(response.list);
    },
    // 获取监控球数据
    *fetchMonitorData({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorData, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: { monitorData: response.data },
        });
        if (callback) {
          callback(response.data);
        }
      } else if (callback) {
        callback();
      }
    },
    // 获取四色风险点
    *fetchCountDangerLocation({ payload, callback }, { call, put }) {
      const response = yield call(getCountDangerLocation, payload);
      const {
        countDangerLocation: [count],
        redDangerResult,
        orangeDangerResult,
        yellowDangerResult,
        blueDangerResult,
        notRatedDangerResult = [],
      } = response;

      const redList = {
        normal: redDangerResult.filter(({ status }) => +status === 1),
        checking: redDangerResult.filter(({ status }) => +status === 3),
        abnormal: redDangerResult.filter(({ status }) => +status === 2),
        over: redDangerResult.filter(({ status }) => +status === 4),
      };
      const orangeList = {
        normal: orangeDangerResult.filter(({ status }) => +status === 1),
        checking: orangeDangerResult.filter(({ status }) => +status === 3),
        abnormal: orangeDangerResult.filter(({ status }) => +status === 2),
        over: orangeDangerResult.filter(({ status }) => +status === 4),
      };
      const yellowList = {
        normal: yellowDangerResult.filter(({ status }) => +status === 1),
        checking: yellowDangerResult.filter(({ status }) => +status === 3),
        abnormal: yellowDangerResult.filter(({ status }) => +status === 2),
        over: yellowDangerResult.filter(({ status }) => +status === 4),
      };
      const blueList = {
        normal: blueDangerResult.filter(({ status }) => +status === 1),
        checking: blueDangerResult.filter(({ status }) => +status === 3),
        abnormal: blueDangerResult.filter(({ status }) => +status === 2),
        over: blueDangerResult.filter(({ status }) => +status === 4),
      };
      const notRatedList = {
        normal: notRatedDangerResult.filter(({ status }) => +status === 1),
        checking: notRatedDangerResult.filter(({ status }) => +status === 3),
        abnormal: notRatedDangerResult.filter(({ status }) => +status === 2),
        over: notRatedDangerResult.filter(({ status }) => +status === 4),
      };
      // 获取各状态统计
      const getCount = (key) => redList[key].length + orangeList[key].length + yellowList[key].length + blueList[key].length + notRatedList[key].length;
      yield put({
        type: 'save',
        payload: {
          countDangerLocation: {
            countDangerLocation: { ...count, normal: getCount('normal'), checking: getCount('checking'), abnormal: getCount('abnormal'), over: getCount('over') },
            redDangerResult: redList,
            orangeDangerResult: orangeList,
            yellowDangerResult: yellowList,
            blueDangerResult: blueList,
            notRatedDangerResult: notRatedList,
          },
        },
      });
      yield put({ type: 'saveRiskList', payload: handleRiskList(response) });
      if (callback) {
        callback();
      }
    },
    // 巡查人员列表
    *fetchStaffList({ payload, callback }, { call, put }) {
      const response = yield call(getStaffList, payload);
      yield put({
        type: 'save',
        payload: { staffList: response.personCheck },
      });
      if (callback) {
        callback(response.personCheck);
      }
    },
    // 巡查人员列表
    *fetchStaffRecords({ payload, callback }, { call, put }) {
      const response = yield call(getStaffRecords, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: { staffRecords: response.data.list },
        });
        if (callback) {
          callback(response.data.list);
        }
      } else if (callback) {
        callback();
      }
    },
    // 安全人员
    *fetchSafetyOfficer({ payload, callback }, { call, put }) {
      const response = yield call(getSafetyOfficer, payload);
      yield put({
        type: 'save',
        payload: { safetyOfficer: response },
      });
      if (callback) {
        callback(response);
      }
    },
    // 获取巡查记录数据
    *fetchInspectionPointData({ payload, callback }, { call, put }) {
      const response = yield call(getInspectionPointData, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: { inspectionPointData: response.data },
        });
        if (callback) {
          callback(response.data);
        }
      } else if (callback) {
        callback();
      }
    },
    // 获取巡查记录对应的隐患列表
    *fetchInspectionRecordData({ payload, callback }, { call, put }) {
      const response = yield call(getInspectionPointData, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: { inspectionRecordData: response.data },
        });
        if (callback) {
          callback(response.data);
        }
      } else if (callback) {
        callback();
      }
    },
    // 获取安全指数
    *fetchSafetyIndex({ payload, callback }, { call, put }) {
      const response = yield call(getSafetyIndex, payload);
      if (response && response.code === 200) {
        const allIndex = response.data || {};
        const { totalScore: safetyIndex=null, safe_point=null, hidden_record_score=null, monitorScore=null, safetyInfoPoint=null } = allIndex;
        const safetyIndexes = [safe_point, hidden_record_score, monitorScore, safetyInfoPoint];
        yield put({
          type: 'save',
          // payload: { safetyIndex: response.data },
          payload: { safetyIndex },
        });
        yield put({ type: 'saveSafeIndexes', payload: safetyIndexes });
        if (callback) {
          callback(response.data);
        }
      } else if (callback) {
        callback();
      }
    },
    // 获取动态监测
    *fetchMonitorList({ payload, callback }, { call, put }) {
      let response = yield call(getMonitorList, payload);
      response = response || {};
      const { code=500, data } = response;
      // if (code === 200 && data && Array.isArray(data.list))
      //   yield put({ type: 'saveMonitorList', payload: data.list });
      if (code === 200 && data)
        yield put({ type: 'saveMonitorList', payload: data });
    },
    // 获取安全档案
    *fetchSafeFiles({ payload, callback }, { call, put }) {
      let response = yield call(getSafeFiles, payload);
      response = response || {};
      const { code=500, data } = response;
      if (code === 200 && data && Array.isArray(data.list))
        yield put({ type: 'saveSafeFiles', payload: handleSafeList(data.list) });
    },
    // 获取动态监测
    *fetchDynamicMonitorData({ payload, callback }, { call, put }) {
      let response = yield call(getDynamicMonitorData, payload);
      response = response || {}
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'save', payload: { dynamicMonitorData: formatDynamicMonitorData(data.list) } });
      }
      callback && callback(response);
    },
    // 获取风险点的风险告知卡列表
    *fetchRiskPointCardList({ payload, callback }, { call, put }) {
      const response = yield call(getRiskPointCardList, payload);
      if (response.code === 200) {
        yield put({ type: 'saveRiskPointAttr', payload: { cardList: response.data.list } });
      }
      callback && callback(response);
    },
    // 获取风险点的隐患列表
    *fetchRiskPointHiddenDangerList({ payload, callback }, { call, put }) {
      const response = yield call(getRiskPointHiddenDangerList, payload);
      if (response.code === 200) {
        yield put({ type: 'saveRiskPointHiddenDangerList', payload: {
          list: response.data.list,
          pagination: { total: response.data.total, pageNum: payload.pageNum, pageSize: payload.pageSize },
        }, append: payload.pageNum !== 1 });
      }
      callback && callback(response);
    },
    // 获取风险点的巡查列表
    *fetchRiskPointInspectionList({ payload, callback }, { call, put }) {
      const response = yield call(getRiskPointInspectionList, payload);
      if (response.code === 200) {
        yield put({ type: 'saveRiskPointInspectionList', payload: {
          list: response.data.list,
          pagination: { total: response.data.total, pageNum: payload.pageNum, pageSize: payload.pageSize },
        }, append: payload.pageNum !== 1 });
      }
      callback && callback(response);
    },
    // 获取风险点的隐患统计
    *fetchRiskPointHiddenDangerCount({ payload, callback }, { call, put }) {
      const response = yield call(getRiskPointHiddenDangerCount, payload);
      if (response.code === 200) {
        yield put({ type: 'saveRiskPointAttr', payload: { hiddenDangerCount: response.data } });
      }
      callback && callback(response);
    },
    // 获取风险点的巡查统计
    *fetchRiskPointInspectionCount({ payload, callback }, { call, put }) {
      const response = yield call(getRiskPointInspectionCount, payload);
      if (response.code === 200) {
        yield put({ type: 'saveRiskPointAttr', payload: { inspectionCount: response.data } });
      }
      callback && callback(response);
    },
    // 获取点位
    *fetchPoints({ payload, callback }, { call, put }) {
      const response = yield call(getPoints, payload);
      const { code, data: { points, pointInfo } } = response;
      if (code === 200) {
        const pointInfoMap = pointInfo.reduce((o, c) => {
          o[c.item_id] = c;
          return o;
        }, {});
        const levelDict = ['gray', 'red', 'orange', 'yellow', 'blue'];
        const statusDict = ['normal', 'normal', 'abnormal', 'pending', 'overtime'];
        const capitalStatusDict = ['Normal', 'Normal', 'Abnormal', 'Pending', 'Overtime'];
        const result = points.reduce((obj, { itemId, xNum, yNum, fixImgId }) => {
          const info = pointInfoMap[itemId];
          const point = {
            itemId,
            xNum,
            yNum,
            fixImgId,
            info,
          };
          const { status, risk_level } = info || {};
          // 四色图相关点位，排除没有坐标的点位
          if (xNum && yNum) {
            if (fixImgId in obj.fourColorImgPoints) {
              obj.fourColorImgPoints[fixImgId].push(point);
            }
            else {
              obj.fourColorImgPoints[fixImgId] = [point];
            }
          }
          obj.pointList.push(point);
          obj[statusDict[+status]]++;
          obj[levelDict[+risk_level]]++;
          obj[`${levelDict[+risk_level]}${capitalStatusDict[+status]}PointList`].push(point);
          return obj;
        }, {
          pointList: [],
          red: 0,
          orange: 0,
          yellow: 0,
          blue: 0,
          gray: 0,
          normal: 0,
          abnormal: 0,
          pending: 0,
          overtime: 0,
          redNormalPointList: [],
          redAbnormalPointList: [],
          redPendingPointList: [],
          redOvertimePointList: [],
          orangeNormalPointList: [],
          orangeAbnormalPointList: [],
          orangePendingPointList: [],
          orangeOvertimePointList: [],
          yellowNormalPointList: [],
          yellowAbnormalPointList: [],
          yellowPendingPointList: [],
          yellowOvertimePointList: [],
          blueNormalPointList: [],
          blueAbnormalPointList: [],
          bluePendingPointList: [],
          blueOvertimePointList: [],
          grayNormalPointList: [],
          grayAbnormalPointList: [],
          grayPendingPointList: [],
          grayOvertimePointList: [],
          fourColorImgPoints: {},
        });

        yield put({
          type: 'save',
          payload: { points: result },
        });
      }
      callback && callback(response);
    },
    // 获取隐患统计
    *fetchHiddenDangerCount({ payload, callback }, { call, put, all }) {
      const [
        { data: { pagination: { total } } },
        { data: { pagination: { total: ycq } } },
        { data: { pagination: { total: wcq } } },
        { data: { pagination: { total: dfc } } },
      ]  = yield all([
        call(getHiddenDangerList, { status: 5, pageSize: 1, pageNum: 1, ...payload }),
        call(getHiddenDangerList, { status: 7, pageSize: 1, pageNum: 1, ...payload }),
        call(getHiddenDangerList, { status: 2, pageSize: 1, pageNum: 1, ...payload }),
        call(getHiddenDangerList, { status: 3, pageSize: 1, pageNum: 1, ...payload }),
      ]);
      yield put({
        type: 'save',
        payload: { hiddenDangerCount: { total, ycq, wcq, dfc } },
      });
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
    saveRiskList(state, action) {
      return { ...state, riskList: action.payload };
    },
    saveDangerList(state, { payload, append }) {
      if (append) {
        return {
          ...state,
          dangerList: {
            pagination: payload.pagination,
            list: state.dangerList.list.concat(payload.list),
          },
        };
      }
      return {
        ...state,
        dangerList: payload,
      };
    },
    saveMonitorList(state, action) {
      return { ...state, monitorList: handleMonitorList(action.payload) };
    },
    saveSafeFiles(state, action) {
      return { ...state, safeList: action.payload };
    },
    saveSafeIndexes(state, action) {
      return { ...state, safetyIndexes: action.payload };
    },
    saveRiskPointAttr(state, { payload }) {
      return {
        ...state,
        riskPointDetail: {
          ...state.riskPointDetail,
          ...payload,
        },
      };
    },
    saveRiskPointHiddenDangerList(state, { payload, append }) {
      if (append) {
        return {
          ...state,
          riskPointDetail: {
            ...state.riskPointDetail,
            hiddenDangerList: {
              pagination: payload.pagination,
              list: state.riskPointDetail.hiddenDangerList.list.concat(payload.list),
            },
          },
        };
      }
      return {
        ...state,
        riskPointDetail: {
          ...state.riskPointDetail,
          hiddenDangerList: payload,
        },
      };
    },
    saveRiskPointInspectionList(state, { payload, append }) {
      if (append) {
        return {
          ...state,
          riskPointDetail: {
            ...state.riskPointDetail,
            inspectionList: {
              pagination: payload.pagination,
              list: state.riskPointDetail.inspectionList.list.concat(payload.list),
            },
          },
        };
      }
      return {
        ...state,
        riskPointDetail: {
          ...state.riskPointDetail,
          inspectionList: payload,
        },
      };
    },
    // 保存隐患列表
    saveHiddenDangerList(state, { payload, append }) {
      if (append) {
        return {
          ...state,
          hiddenDangerList: {
            pagination: payload.pagination,
            list: state.hiddenDangerList.list.concat(payload.list),
          },
        };
      }
      return {
        ...state,
        hiddenDangerList: payload,
      };
    },
  },
}
