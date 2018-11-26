import {
  // 企业风险点数
  getCoItemList,
  // 特种设备
  getSpecialEquipment,
  // 企业信息(包含人员数量四色图等)
  getCompanyMessage,
  // 企业大屏四色风险点,
  getCountDangerLocationForCompany,
  // 获取风险点信息
  getRiskPointInfo,
  // 获取隐患详情
  getRiskDetail,
  // 隐患总数
  getHiddenDanger,
  // 获取安全人员信息
  getSafetyOfficer,
  // 单位名称查找
  searchCompanies,
  // 视频
  getAllCamera,
  // 视频路径
  getStartToPlay,
  // 获取监控球相关数据
  getMonitorData,
  // 获取巡查人员列表
  getStaffList,
  // 获取巡查人员记录
  getStaffRecords,
} from '../services/unitSafety';

export default {
  namespace: 'unitSafety',

  state: {

  },

  effects: {
    // 获取待处理信息
    // *fetchPendingInfo({ payload, success, error }, { call, put }) {
    //   const response = yield call(getPendingInfo, payload);
    //   if (response.code === 200) {
    //     yield put({
    //       type: 'savePendingInfo',
    //       payload: response.data.list,
    //     });
    //     if (success) {
    //       success(response.data.list);
    //     }
    //   }
    //   else if (error) {
    //     error();
    //   }
    // },
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
