import {
  queryRiskCompanyList,
  queryRiskPointList,
  queryRiskPointCount,
  queryLecDict,
  queryCountLevel,
  queryAssessLevel,
  queryLabelDict,
  queryRiskPointAdd,
  queryFixImgInfo,
  queryCheckCycle,
  deleteRiskPoint,
  updateRiskPoint,
  queryRiskPointDetail,
  queryRiskCardList,
  queryRiskTypeDict,
  queryAccidentTypeDict,
  queryWarningSignDict,
  queryIndustryDict,
  /* 风险告知卡 */
  queryHdLetterAdd,
  updateHdLetter,
  queryHdLetterDetail,
  deleteHdLetter,
  queryShowLetter,
} from '../services/riskPointManage.js';

export default {
  namespace: 'riskPointManage',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    riskPointData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    riskCountData: {
      list: [],
    },
    isLast: false,
    pageNum: 1,
    // 是否启用
    statusList: [
      {
        key: '1',
        value: '启用',
      },
      {
        key: '2',
        value: '禁用',
      },
    ],
    // 平面图类型
    picType: [
      {
        key: '1',
        value: '单位平面图',
      },
      {
        key: '2',
        value: '楼层平面图',
      },
      {
        key: '3',
        value: '安全四色图',
      },
      {
        key: '4',
        value: '消防平面图',
      },
    ],
    // 风险点等级
    riskGradeList: [
      {
        key: '1',
        value: '红',
      },
      {
        key: '2',
        value: '橙',
      },
      {
        key: '3',
        value: '黄',
      },
      {
        key: '4',
        value: '蓝',
      },
      {
        key: '5',
        value: '未评级',
      },
    ],
    // 检查状态
    checkStatusList: [
      {
        key: '1',
        value: '待检查',
      },
      {
        key: '2',
        value: '已检查',
      },
      {
        key: '3',
        value: '已超时',
      },
    ],
    // 有无隐患
    isDangerList: [
      {
        key: '1',
        value: '有隐患',
      },
      {
        key: '2',
        value: '无隐患',
      },
    ],
    // 风险等级
    riskGrade: [
      {
        key: '1',
        value: '红',
      },
      {
        key: '2',
        value: '橙',
      },
      {
        key: '3',
        value: '黄',
      },
      {
        key: '4',
        value: '蓝',
      },
    ],
    // 检查周期方案
    checkCycleList: [
      {
        key: '1',
        value: '使用推荐',
      },
      {
        key: '2',
        value: '使用自定义',
      },
    ],
    // 自定义检查周期
    cycleTypeList: [
      {
        key: 'every_day',
        value: '每日一次',
      },
      {
        key: 'every_week',
        value: '每周一次',
      },
      {
        key: 'every_month',
        value: '每月一次',
      },
      {
        key: 'every_quarter',
        value: '每季度一次',
      },
      {
        key: 'every_half_year',
        value: '每半年一次',
      },
      {
        key: 'every_year',
        value: '每年一次',
      },
    ],
    // lec字典
    lecData: {
      llist: [],
      elist: [],
      clist: [],
    },
    // 风险值
    count: '',
    assessLevelData: {},
    labelModal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
    detail: {
      data: {
        objectTitle: undefined,
        itemCode: undefined,
        locationCode: undefined,
        qrCode: undefined,
        nfcCode: undefined,
        checkCycle: undefined,
        cycleType: undefined,
      },
    },
    imgData: {
      list: [],
    },
    checkCycleData: {},
    industryData: {},
    // 风险告知卡列表
    riskCardData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    riskTypeDict: [],
    accidentTypeDict: {
      list: [],
    },
    warningSignDict: {
      list: [],
    },
    detailHdLetter: {
      data: {
        letterName: undefined,
        areaName: undefined,
        riskType: undefined,
        accidentTypeCode: undefined,
        dangerFactor: undefined,
        preventMeasures: undefined,
        emergencyMeasures: undefined,
        localPictureList: undefined,
        warningSignList: undefined,
      },
    },
    showLetterData: {
      companyInfo: {
        company_name: undefined,
        regulatoryClassifyName: undefined,
        headOfSecurity: undefined,
        headOfSecurityPhone: undefined,
      },
      hdLetterInfo: {
        riskLevelName: { desc: undefined, color: undefined },
        pointName: undefined,
        areaName: undefined,
        qrCode: undefined,
        dangerFactor: undefined,
        preventMeasures: undefined,
        emergencyMeasures: undefined,
        accidentTypeName: undefined,
        pointCode: undefined,
      },
      localPictureUrlList: [],
      warningSignUrlList: [],
    },
  },

  effects: {
    // 风险点企业列表
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(queryRiskCompanyList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCompaniesList',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },

    // 追加企业列表
    *appendCompanyList({ payload }, { call, put }) {
      const response = yield call(queryRiskCompanyList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyLoadMoreList',
          payload: response.data,
        });
      }
    },

    // 风险点列表
    *fetchRiskList({ payload, callback }, { call, put }) {
      const response = yield call(queryRiskPointList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveRiskList',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },

    // 追加风险点列表
    *appendRiskList({ payload, success, error }, { call, put }) {
      const response = yield call(queryRiskPointList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveRiskLoadMoreList',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 检查周期统计
    *fetchRiskCount({ payload }, { call, put }) {
      const response = yield call(queryRiskPointCount, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveRiskCount',
          payload: response.data,
        });
      }
    },

    // 获取lec字典
    *fetchLecDict({ payload }, { call, put }) {
      const response = yield call(queryLecDict, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveLecDict',
          payload: response.data,
        });
      }
    },

    // 获取LEC计算后的风险等级
    *fetchCountLevel({ payload }, { call, put }) {
      const response = yield call(queryCountLevel, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCountLevel',
          payload: response.data,
        });
      }
    },

    // 风险评级保存
    *fetchAssessLevel({ payload, success, error }, { call, put }) {
      const response = yield call(queryAssessLevel, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'addAssessLevel', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 标签列表
    *fetchLabelDict({ payload }, { call, put }) {
      const response = yield call(queryLabelDict, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveLabelDict',
          payload: response.data,
        });
      }
    },

    // 获取行业类别字典
    *fetchIndustryDict({ payload }, { call, put }) {
      const response = yield call(queryIndustryDict, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveIndustryDict',
          payload: response.data,
        });
      }
    },

    // 新增风险点
    *fetchRiskPointAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryRiskPointAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'addRiskPoint', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 编辑风险点
    *fetchRiskPointEdit({ payload, success, error }, { call, put }) {
      const response = yield call(updateRiskPoint, payload);
      if (response.code === 200) {
        yield put({
          type: 'savePointUpdate',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 查看风险点详情
    *fetchRiskPointDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryRiskPointDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'savePointDetail',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },

    // 删除风险点
    *fetchRiskPointDelete({ payload, success, error }, { call, put }) {
      const response = yield call(deleteRiskPoint, payload);
      if (response.code === 200) {
        yield put({ type: 'removeRiskPoint', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 图片选择
    *fetchFixImgInfo({ payload }, { call, put }) {
      const response = yield call(queryFixImgInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveFixImgInfo',
          payload: response.data,
        });
      }
    },

    // 获取系统推荐检查周期
    *fetchCheckCycle({ payload }, { call, put }) {
      const response = yield call(queryCheckCycle, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCheckCycle',
          payload: response.data,
        });
      }
    },

    // 风险告知卡列表
    *fetchRiskCardList({ payload }, { call, put }) {
      const response = yield call(queryRiskCardList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveRiskCardList',
          payload: response.data,
        });
      }
    },

    // 风险分类字典
    *fetchRiskTypeDict({ payload }, { call, put }) {
      const response = yield call(queryRiskTypeDict, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveRiskTypeDict',
          payload: { data: response.data },
        });
      }
    },

    // 易导致的事故类型字典
    *fetchAccidentTypeDict({ payload }, { call, put }) {
      const response = yield call(queryAccidentTypeDict, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveAccidentTypeDict',
          payload: response.data,
        });
      }
    },

    // 风险标志字典
    *fetchWarningSignDict({ payload }, { call, put }) {
      const response = yield call(queryWarningSignDict, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveWarningSignDict',
          payload: response.data,
        });
      }
    },

    // 风险告知卡新增
    *fetchHdLetterAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryHdLetterAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'addHdLetter', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 编辑风险点
    *fetchHdLetterEdit({ payload, success, error }, { call, put }) {
      const response = yield call(updateHdLetter, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveHdLetterUpdate',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 查看风险点详情
    *fetchHdLetterDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryHdLetterDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveHdLetterDetail',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },

    // 风险告知卡预览数据
    *fetchShowLetter({ payload, callback }, { call, put }) {
      const response = yield call(queryShowLetter, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveShowLetter',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },

    // 删除风险告知卡
    *deleteHdLetter({ payload, callback }, { call, put }) {
      const response = yield call(deleteHdLetter, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDeleteHdLetter',
          payload: payload.id,
        });
      }
      if (callback) callback(response);
    },
  },

  reducers: {
    // 获取企业列表
    saveCompaniesList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        data: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 获取更多企业列表
    saveCompanyLoadMoreList(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list: [...state.list, ...list],
        pageNum,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 获取风险点列表
    saveRiskList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        riskPointData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 获取更多风险点
    saveRiskLoadMoreList(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list: [...state.list, ...list],
        pageNum,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 获取检查周期统计
    saveRiskCount(state, { payload }) {
      return {
        ...state,
        riskCountData: payload,
      };
    },

    // 获取lec字典
    saveLecDict(state, { payload }) {
      return {
        ...state,
        lecData: payload,
      };
    },

    // 获取lec计算后的风险等级
    saveCountLevel(state, { payload }) {
      return {
        ...state,
        count: payload,
      };
    },

    // 风险评级保存
    addAssessLevel(state, { payload }) {
      return {
        ...state,
        assessLevelData: { payload },
      };
    },

    // 获取标签列表
    saveLabelDict(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        labelModal: payload,
      };
    },

    // 获取行业字典
    saveIndustryDict(state, { payload }) {
      return {
        ...state,
        industryData: payload,
      };
    },

    // 新增风险点
    addRiskPoint(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },

    // 编辑风险点
    savePointUpdate(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    // 查看详情
    savePointDetail(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearDetail(state) {
      return {
        ...state,
        detail: { data: {} },
      };
    },

    // 删除风险点
    removeRiskPoint(state, { payload: id }) {
      return {
        ...state,
        riskPointData: {
          ...state.riskPointData,
          list: state.riskPointData.list.filter(item => item.id !== id),
        },
      };
    },

    // 获取定位图片
    saveFixImgInfo(state, { payload }) {
      return {
        ...state,
        imgData: payload,
      };
    },

    // 获取推荐检查周期
    saveCheckCycle(state, { payload }) {
      return {
        ...state,
        checkCycleData: payload,
      };
    },

    // 获取风险告知卡列表
    saveRiskCardList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        riskCardData: payload,
      };
    },

    // 获取风险分类字典
    saveRiskTypeDict(
      state,
      {
        payload: {
          data: { list },
        },
      }
    ) {
      return {
        ...state,
        riskTypeDict: list,
      };
    },

    // 获取易导致的事故类型字典
    saveAccidentTypeDict(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        accidentTypeDict: payload,
      };
    },

    // 获取风险标志字典
    saveWarningSignDict(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        warningSignDict: payload,
      };
    },

    // 新增风险告知卡
    addHdLetter(state, { payload }) {
      return {
        ...state,
        detailHdLetter: payload,
      };
    },

    // 获取风险告知卡详情
    saveHdLetterDetail(state, { payload }) {
      return {
        ...state,
        detailHdLetter: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 编辑风险告知卡
    saveHdLetterUpdate(state, { payload }) {
      return {
        ...state,
        detailHdLetter: {
          ...state.detail,
          data: payload,
        },
      };
    },

    // 风险告知卡预览数据
    saveShowLetter(state, { payload }) {
      return {
        ...state,
        showLetterData: payload,
      };
    },

    // 删除风险告知卡
    saveDeleteHdLetter(state, { payload: id }) {
      return {
        ...state,
        riskCardData: {
          ...state.data,
          list: state.data.list.filter(item => item.id !== id),
        },
      };
    },

    // 清除风险告知卡详情
    clearHdLetterDetail(state) {
      return {
        ...state,
        detailHdLetter: { data: {} },
      };
    },
  },
};
