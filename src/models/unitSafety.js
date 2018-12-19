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
} from '../services/unitSafety';

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
    hiddenDangerList: { ycq: [], wcq: [], dfc: [] },
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
    safetyIndex: 100,
  },

  effects: {
    // 获取企业信息
    *fetchCompanyMessage({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyMessage, payload);
      const { companyLetter } = yield call(getPointInfoList, payload);
      const companyMessage = {
        ...response,
        // 移除坐标不存在的风险点并添加风险告知卡信息
        point:
          response.point ?
          response.point.filter(
            ({ itemId, xNum, yNum }) =>
              itemId &&
              (xNum || Number.parseFloat(xNum) === 0) &&
              (yNum || Number.parseFloat(yNum) === 0)
          ).map((item) => {
            const { itemId } = item;
            return {
              ...item,
              info: companyLetter.filter(({ hdLetterInfo: { itemId: id } }) => itemId === id)[0],
            };
          }) : [],
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
      // 筛选已超期的隐患列表并根据计划整改时间排序
      const ycq = response.hiddenDangers
        .filter(({ status }) => +status === 7)
        .sort((a, b) => {
          return +a.plan_rectify_time - b.plan_rectify_time;
        });
      // 筛选未超期的隐患列表并根据计划整改时间排序
      const wcq = response.hiddenDangers
        .filter(({ status }) => +status === 1 || +status === 2)
        .sort((a, b) => {
          return +a.plan_rectify_time - b.plan_rectify_time;
        });
      // 筛选待复查的隐患列表并根据计划整改时间排序
      const dfc = response.hiddenDangers
        .filter(({ status }) => +status === 3)
        .sort((a, b) => {
          return +a.real_rectify_time - b.real_rectify_time;
        });
      yield put({
        type: 'save',
        payload:  {
          hiddenDangerList : {
            ycq,
            wcq,
            dfc,
          },
        },
      });
      if (callback) {
        callback();
      }
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
    // 获取安全指数
    *fetchSafetyIndex({ payload, callback }, { call, put }) {
      const response = yield call(getSafetyIndex, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: { safetyIndex: response.data },
        });
        if (callback) {
          callback(response.data);
        }
      } else if (callback) {
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
  },
}
