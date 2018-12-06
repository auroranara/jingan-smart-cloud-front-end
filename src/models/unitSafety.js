import {
  // 企业信息(包含人员数量四色图等)
  getCompanyMessage,
  // 获取风险点信息
  getPointInfoList,
  // 获取隐患列表
  getHiddenDangerList,
  // 获取视频列表
  getVideoList,
  // 获取监控球相关数据
  getMonitorData,
  // 企业风险点数
  getCoItemList,
  // 特种设备
  getSpecialEquipment,
  // 企业大屏四色风险点,
  getCountDangerLocationForCompany,
  // 隐患总数
  getHiddenDanger,
  // 获取安全人员信息
  getSafetyOfficer,
  // 获取巡查人员列表
  getStaffList,
  // 获取巡查人员记录
  getStaffRecords,
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
    // 风险点信息列表（风险告知卡列表）
    pointInfoList: [],
    // 隐患列表
    hiddenDangerList: { ycq: [], wcq: [], dfc: [] },
    // 视频列表
    videoList: [],
    // 监控球数据
    monitorData: { score: 0 },
  },

  effects: {
    // 获取企业信息
    *fetchCompanyMessage({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyMessage, payload);
      const companyMessage = {
        ...response,
        // 移除坐标不存在的风险点
        point:
          response.point &&
          response.point.filter(
            ({ itemId, xNum, yNum }) =>
              itemId &&
              (xNum || Number.parseFloat(xNum) === 0) &&
              (yNum || Number.parseFloat(yNum) === 0)
          ),
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
    // 获取风险点信息（风险告知卡列表）
    *fetchPointInfoList({ payload, callback }, { call, put }) {
      const response = yield call(getPointInfoList, payload);
      yield put({
        type: 'save',
        payload: { pointInfoList: response.companyLetter },
      });
      if (callback) {
        callback(response.companyLetter);
      }
    },
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
