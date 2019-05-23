import {
  // 企业信息(包含人员数量四色图等)
  getCompanyMessage,
  // 特种设备
  getSpecialEquipmentCount,
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
  // 获取特种设备列表
  getSpecialEquipmentList,
  // 获取视频树
  fetchVideoTree,
} from '../services/unitSafety';
import moment from 'moment';

function handleRiskList(response) {
  if (!response) return [];

  const result = ['supervision', 'red', 'orange', 'yellow', 'blue', 'notRated']
    .reduce((prev, next) => {
      const value = response[`${next}${next !== 'supervision' ? 'Danger' : ''}Result`];
      const list = Array.isArray(value) ? value.map(item => ({ ...item, flag: next })) : [];
      return prev.concat(list);
    }, [])
    .filter(item => item.status === 4);

  result.sort((item, item1) => item.check_date_time - item1.check_date_time);
  return result;
}
const WATER_SYSTEM = ['消火栓系统', '喷淋系统', '水池/水箱'];
function handleMonitorList({ lossDevice, abnormalDevice, faultDevice }) {
  const alarm = Array.isArray(abnormalDevice)
    ? abnormalDevice.map(
      ({ deviceId, deviceName, relationDeviceId, area, location, unormalParams, typeName, statusTime, boxNo, componentType, loopNumber, partNumber }) => ({
        id: `${deviceId}_alarm`,
        monitoringType: WATER_SYSTEM.includes(typeName) ? '水系统监测' : typeName,
        relationId: relationDeviceId,
        params: unormalParams,
        status: 2,
        location: [area, location].filter(v => v).join('-'),
        time: statusTime,
        name: deviceName,
        system: typeName,
        number: boxNo,
        partType: componentType,
        loopNumber: loopNumber,
        partNumber: partNumber,
      }))
    : [];
  const loss = Array.isArray(lossDevice)
    ? lossDevice.map(
      ({ deviceId, deviceName, relationDeviceId, area, location, statusTime, typeName, boxNo, componentType, loopNumber, partNumber }) => ({
        id: `${deviceId}_loss`,
        monitoringType: WATER_SYSTEM.includes(typeName) ? '水系统监测' : typeName,
        relationId: relationDeviceId,
        status: -1,
        location: [area, location].filter(v => v).join('-'),
        time: statusTime,
        name: deviceName,
        system: typeName,
        number: boxNo,
        partType: componentType,
        loopNumber: loopNumber,
        partNumber: partNumber,
      })
    )
    : [];
  const fault = Array.isArray(faultDevice) ? faultDevice.map(
    ({ deviceId, deviceName, relationDeviceId, area, location, statusTime, typeName, boxNo, componentType, loopNumber, partNumber }) => ({
      id: `${deviceId}_fault`,
      monitoringType: WATER_SYSTEM.includes(typeName) ? '水系统监测' : typeName,
      relationId: relationDeviceId,
      status: -3,
      location: [area, location].filter(v => v).join('-'),
      time: statusTime,
      name: deviceName,
      system: typeName,
      number: boxNo,
      partType: componentType,
      loopNumber: loopNumber,
      partNumber: partNumber,
    })
  ) : [];
  loss.push(...fault);

  alarm.sort(({ time: a }, { time: b }) => b - a);
  loss.sort(({ time: a }, { time: b }) => b - a);
  return { alarm, loss }
}

function handleSafeList(list) {
  const now = moment().startOf('day');
  const result = list.reduce((prev, { key, list }) => {
    if (!Array.isArray(list)) {
      return prev;
    }
    switch(key) {
      case 'special_equipment': // 特种设备
      list.forEach(({ recheck_date, data_true_name, special_equipment_id }) => {
        const expiredDays = now.diff(recheck_date, 'days');
        if (expiredDays > 0) {
          prev.push({
            id: special_equipment_id,
            infoType: '特种设备',
            name: data_true_name,
            expiredType: '检验日期',
            expireDate: recheck_date,
            expiredDays,
          });
        }
      });
      break;
      case 'emergency_material': // 应急物资
      list.forEach(({ end_time, emergency_equipment_name, emergency_id }) => {
        const expiredDays = now.diff(end_time, 'days');
        if (expiredDays > 0) {
          prev.push({
            id: emergency_id,
            infoType: '应急物资',
            name: emergency_equipment_name,
            expiredType: '检验日期',
            expireDate: end_time,
            expiredDays,
          });
        }
      });
      break;
      case 'special_people': // 特种作业操作证人员
      list.forEach(({ endDate, nextDate, name, id }) => {
        const expiredDays = now.diff(endDate, 'days');
        const expiredDays2 = now.diff(nextDate, 'days');
        if (expiredDays > 0) {
          prev.push({
            id,
            infoType: '特种作业操作证人员',
            name,
            expiredType: '有效期',
            expireDate: endDate,
            expiredDays,
          });
        } else if (expiredDays2 > 0) {
          prev.push({
            id,
            infoType: '特种作业操作证人员',
            name,
            expiredType: '复审日期',
            expireDate: nextDate,
            expiredDays: expiredDays2,
          });
        }
      });
      break;
      case 'company_training': // 企业安全培训信息
      list.forEach(({ nextDate, traineeName, id }) => {
        const expiredDays = now.diff(nextDate, 'days');
        if (expiredDays > 0) {
          prev.push({
            id,
            infoType: '企业安全培训信息',
            name: traineeName,
            expiredType: '培训日期',
            expireDate: nextDate,
            expiredDays,
          });
        }
      });
      break;
      default:
      break;
    }
    return prev;
  }, []);

  return result.sort(({ expiredDays: a }, { expiredDays: b }) => b - a);
}

// 格式化动态监测数据
const formatDynamicMonitorData = list => {
  const data = {};
  list.forEach(item => {
    switch (item.name) {
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
        // 安全管理员
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
    // 视频树列表
    videoTree: [],
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
    inspectionPointData: {},
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
    monitorList: {},
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
      // 所有风险点位
      pointList: [],
      // 四色图点位
      fourColorImgPoints: {},
      // 其他各种点位和统计
    },
    // 隐患统计
    hiddenDangerCount: { total: 0, ycq: 0, wcq: 0, dfc: 0 },
    // 特种设备列表
    specialEquipmentList: {},
    // 手机号是否可见
    phoneVisible: false,
    // 设备统计列表
    deviceCountList: [],
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
    // 获取隐患列表
    *fetchHiddenDangerList({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerList, payload);
      const {
        code,
        data: { list, pagination },
      } = response;
      if (code === 200) {
        yield put({
          type: 'saveHiddenDangerList',
          payload: {
            list,
            pagination: { ...pagination, pageNum: payload.pageNum, pageSize: payload.pageSize },
          },
          append: payload.pageNum !== 1,
        });
      }
      callback && callback(response);
    },
    // 获取隐患列表
    *fetchDangerList({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerList, payload);
      const {
        code,
        data: { list, pagination },
      } = response;
      if (code === 200) {
        yield put({
          type: 'saveDangerList',
          payload: {
            list,
            pagination: { ...pagination, pageNum: payload.pageNum, pageSize: payload.pageSize },
          },
          append: payload.pageNum !== 1,
        });
      }
      callback && callback(response);
    },
    // 获取视频列表
    *fetchVideoList({ payload, callback }, { call, put }) {
      const response = yield call(getVideoList, payload);
      yield put({ type: 'save', payload: { videoList: (response.list || []).filter(({ x_num, y_num }) => x_num && y_num) } });
      if (callback) callback(response.list);
    },
    // 获取视频树
    *fetchVideoTree({ payload, callback }, { call, put }) {
      const response = yield call(fetchVideoTree, payload);
      yield put({ type: 'save', payload: { videoTree: response.list } });
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
      const getCount = key =>
        redList[key].length +
        orangeList[key].length +
        yellowList[key].length +
        blueList[key].length +
        notRatedList[key].length;
      yield put({
        type: 'save',
        payload: {
          countDangerLocation: {
            countDangerLocation: {
              ...count,
              normal: getCount('normal'),
              checking: getCount('checking'),
              abnormal: getCount('abnormal'),
              over: getCount('over'),
            },
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
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: { safetyOfficer: Object.entries(response.data.roleMap || {}).reduce((result, [key, value]) => {
            result.keyList.push(key);
            result.valueList.push(value || []);
            return result;
          }, { keyList: [], valueList: [] }) },
        });
      }
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
        const {
          totalScore: safetyIndex = null,
          safe_point = null,
          hidden_record_score = null,
          monitorScore = null,
          safetyInfoPoint = null,
        } = allIndex;
        const safetyIndexes = [safe_point, hidden_record_score, monitorScore, safetyInfoPoint];
        yield put({
          type: 'save',
          // payload: { safetyIndex: response.data },
          payload: { safetyIndex, safetyIndexes },
        });
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
      const { code = 500, data } = response;
      // if (code === 200 && data && Array.isArray(data.list))
      //   yield put({ type: 'saveMonitorList', payload: data.list });
      if (code === 200) yield put({ type: 'save', payload: { monitorList: handleMonitorList(data || {}) } });
    },
    // 获取安全档案
    *fetchSafeFiles({ payload, callback }, { call, put }) {
      let response = yield call(getSafeFiles, payload);
      response = response || {};
      const { code = 500, data } = response;
      if (code === 200 && data && Array.isArray(data.list))
        yield put({ type: 'saveSafeFiles', payload: handleSafeList(data.list) });
    },
    // 获取动态监测
    *fetchDynamicMonitorData({ payload, callback }, { call, put }) {
      let response = yield call(getDynamicMonitorData, payload);
      response = response || {};
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'save',
          payload: { dynamicMonitorData: formatDynamicMonitorData(data.list) },
        });
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
        yield put({
          type: 'saveRiskPointHiddenDangerList',
          payload: {
            list: response.data.list,
            pagination: {
              total: response.data.total,
              pageNum: payload.pageNum,
              pageSize: payload.pageSize,
            },
          },
          append: payload.pageNum !== 1,
        });
      }
      callback && callback(response);
    },
    // 获取风险点的巡查列表
    *fetchRiskPointInspectionList({ payload, callback }, { call, put }) {
      const response = yield call(getRiskPointInspectionList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveRiskPointInspectionList',
          payload: {
            list: response.data.list,
            pagination: {
              total: response.data.total,
              pageNum: payload.pageNum,
              pageSize: payload.pageSize,
            },
          },
          append: payload.pageNum !== 1,
        });
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
      const {
        code,
        data: { pointInfo },
      } = response;
      if (code === 200) {
        const pointInfoList = pointInfo.map(({ x_mum: x_num, y_mum: y_num, ...point }) => ({ ...point, x_num, y_num })).sort(({ nextCheckDate: a }, { nextCheckDate: b }) => a - b);
        const levelDict = ['gray', 'red', 'orange', 'yellow', 'blue'];
        const statusDict = ['normal', 'normal', 'abnormal', 'pending', 'overtime'];
        const capitalStatusDict = ['Normal', 'Normal', 'Abnormal', 'Pending', 'Overtime'];
        const result = pointInfoList.reduce(
          (obj, point) => {
            const {
              item_type,
              x_num,
              y_num,
              fix_img_id,
              status,
              risk_level,
            } = point;
            // 如果为风险点
            if (+item_type === 2) {
              // 四色图相关点位，排除没有坐标的点位
              if (x_num && y_num && fix_img_id) {
                if (fix_img_id in obj.fourColorImgPoints) {
                  obj.fourColorImgPoints[fix_img_id].push(point);
                } else {
                  obj.fourColorImgPoints[fix_img_id] = [point];
                }
              }
              obj.pointList.push(point);
              obj[statusDict[+status]]++;
              obj[levelDict[+risk_level]]++;
              obj[`${levelDict[+risk_level]}${capitalStatusDict[+status]}PointList`].push(point);
            }
            return obj;
          },
          {
            abnormalPointList: pointInfoList.filter(({ status }) => +status === 4), // 包括政府监督点
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
          }
        );
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
        {
          data: {
            pagination: { total },
          },
        },
        {
          data: {
            pagination: { total: ycq },
          },
        },
        {
          data: {
            pagination: { total: wcq },
          },
        },
        {
          data: {
            pagination: { total: dfc },
          },
        },
      ] = yield all([
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

    // 获取特种设备列表
    *fetchSpecialEquipmentList({ payload, success, error }, { call, put }) {
      const response = yield call(getSpecialEquipmentList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            specialEquipmentList: (response.data.list || [])
            .sort(({ recheck_date: a }, { recheck_date: b }) => a - b)
            .reduce((result, { checkStatus, recheck_date, data_true_name, linkman, factory_number, special_equipment_id }) => {
              const { allList, expiredList, unexpiredList } = result;
              const item = {
                id: special_equipment_id,
                name: data_true_name,
                number: factory_number,
                person: linkman,
                expiryDate: recheck_date,
                status: checkStatus,
              };
              allList.push(item);
              if (+checkStatus === 1) {
                expiredList.push(item);
              } else {
                unexpiredList.push(item);
              }
              return result;
            }, { allList: [], expiredList: [], unexpiredList: [] }),
          },
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
    // 保存手机是否显示配置
    savePhoneVisible(state, { payload: { phoneVisible }={} }) {
      if (phoneVisible !== undefined) {
        localStorage.setItem('phoneVisible', JSON.stringify(phoneVisible));
      } else {
        phoneVisible = JSON.parse(localStorage.getItem('phoneVisible')) || false;
        if (!phoneVisible) {
          localStorage.setItem('phoneVisible', JSON.stringify(false));
        }
      }
      return {
        ...state,
        phoneVisible,
      };
    },
  },
};
