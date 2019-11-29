import {
  queryAreaList,
  queryAreaAdd,
  queryAreaEdit,
  queryAreaDelete,
  queryCompanyNum,
  queryDangerSourceList,
  queryDangerSourceaAdd,
  queryDangerSourceEdit,
  queryDangerSourceDelete,
  queryMaterialInfoList,
  queryCertificateList,
  queryCertificateaAdd,
  queryCertificateEdit,
  queryCertificateDelete,
  querySafetyEngList,
  querySafetyEngAdd,
  querySafetyEngEdit,
  querySafetyEngDelete,
  queryProductLicenceList,
  queryProductLicenceAdd,
  queryProductLicenceEdit,
  queryProductLicenceDelete,
} from '../services/company/reservoirRegion';

export default {
  namespace: 'reservoirRegion',

  state: {
    // 库区数据源
    areaData: {
      list: [],
      pagination: {},
    },
    areaDetail: {
      data: [],
    },
    envirTypeList: [
      { key: '1', value: '一类区' },
      { key: '2', value: '二类区' },
      { key: '3', value: '三类区' },
    ],
    areaCount: {},
    // 重大危险源数据源
    sourceData: {
      list: [],
      pagination: {},
    },
    sourceDetail: {
      data: [],
    },
    dangerTypeList: [
      { key: '1', value: '一级' },
      { key: '2', value: '二级' },
      { key: '3', value: '三级' },
      { key: '4', value: '四级' },
    ],
    productTypeList: [
      { key: '1', value: '生产' },
      { key: '2', value: '经营' },
      { key: '3', value: '使用' },
      { key: '4', value: '存储' },
    ],
    dangerChemicalsList: [
      { key: '1', value: '易燃' },
      { key: '2', value: '有毒' },
      { key: '3', value: '兼易燃有毒' },
    ],
    memoryPlaceList: [{ key: '1', value: '自有' }, { key: '2', value: '租赁' }],
    antiStaticList: [{ key: '1', value: '是' }, { key: '2', value: '否' }],
    dangerResourceTypeList: [
      { key: '1', value: '储罐区' },
      { key: '2', value: '库区' },
      { key: '3', value: '生产装置' },
      { key: '4', value: '气柜' },
    ],
    dangerResourseList: [
      { key: '0', value: '全部' },
      { key: '1', value: '储罐区' },
      { key: '2', value: '库区' },
      { key: '3', value: '生产装置' },
      { key: '4', value: '气柜' },
    ],
    // 物料数据源
    materialData: {
      list: [],
      pagination: {},
    },
    issuingTypeList: [
      { key: '1', value: '生产' },
      { key: '2', value: '经营' },
      { key: '3', value: '使用' },
    ],
    certificateStateList: [
      { key: '1', value: '现用' },
      { key: '2', value: '吊销' },
      { key: '3', value: '注销' },
      { key: '4', value: '暂扣' },
      { key: '5', value: '曾用' },
    ],
    expirationStatusList: [
      { key: '1', value: '即将到期' },
      { key: '2', value: '已过期' },
      { key: '0', value: '未到期' },
    ],
    // 危险化学品许可证数据源
    cerData: {
      list: [],
      pagination: {},
    },
    cerDetail: {
      data: [],
    },
    // 注册安全工程师数据源
    safetyEngData: {
      list: [],
      pagination: {},
    },
    safetyEngDetail: {
      data: [],
    },
    engineerLevelList: [
      { key: '0', value: '初级' },
      { key: '1', value: '中级' },
      { key: '2', value: '高级' },
    ],
    sexList: [{ key: '1', value: '男' }, { key: '2', value: '女' }],
    specialityList: [
      { key: '0', value: '煤矿安全' },
      { key: '1', value: '金属非金属矿山安全' },
      { key: '2', value: '化工安全' },
      { key: '3', value: '金属冶炼安全' },
      { key: '4', value: '建筑施工安全' },
      { key: '5', value: '道路运输安全' },
      { key: '6', value: '其他安全（不包括消防安全）' },
    ],
    // 工业产品许可证数据源
    industrialData: {
      list: [],
      pagination: {},
    },
    industrialDetail: {
      data: [],
    },
  },

  effects: {
    // 库区列表
    *fetchAreaList({ payload, callback }, { call, put }) {
      const response = yield call(queryAreaList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveAreaList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 数量
    *fetchCount({ payload, callback }, { call, put }) {
      const response = yield call(queryCompanyNum, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCount',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 新增库区
    *fetchAreaAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryAreaAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveAreaAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改库区
    *fetchAreaEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryAreaEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveAreaEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除库区
    *fetchAreaDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryAreaDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveAreaDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 危险源列表
    *fetchSourceList({ payload, callback }, { call, put }) {
      const response = yield call(queryDangerSourceList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSourceList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 新增危险源
    *fetchSourceAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryDangerSourceaAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveSourceAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改危险源
    *fetchSourceEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryDangerSourceEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSourceEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除危险源
    *fetchSourceDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryDangerSourceDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSourceDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 获取物料列表
    *fetchMaterialInfoList({ payload, callback }, { call, put }) {
      const response = yield call(queryMaterialInfoList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveMaterialInfoList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 危险化学品许可证列表
    *fetchCertificateList({ payload, callback }, { call, put }) {
      const response = yield call(queryCertificateList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCertificateList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 新增危险化学品许可证
    *fetchCertificateAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryCertificateaAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveCertificateAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改危险化学品许可证
    *fetchCertificateEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryCertificateEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveCertificateEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除危险化学品许可证
    *fetchCertificateDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryCertificateDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveCertificateDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 注册工程师列表
    *fetchSafetyEngList({ payload, callback }, { call, put }) {
      const response = yield call(querySafetyEngList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveSafetyEngList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 新增注册工程师
    *fetchSafetyEngAdd({ payload, success, error }, { call, put }) {
      const response = yield call(querySafetyEngAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveSafetyEngAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改注册工程师
    *fetchSafetyEngEdit({ payload, success, error }, { call, put }) {
      const response = yield call(querySafetyEngEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSafetyEngEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除注册工程师
    *fetchSafetyEngDelete({ payload, success, error }, { call, put }) {
      const response = yield call(querySafetyEngDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveSafetyEngDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 工业产品许可证列表
    *fetchIndustrialList({ payload, callback }, { call, put }) {
      const response = yield call(queryProductLicenceList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveIndustrialList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    // 新增工业产品许可证
    *fetchIndustrialAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryProductLicenceAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveIndustrialAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 修改工业产品许可证
    *fetchIndustrialEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryProductLicenceEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveIndustrialEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 删除工业产品许可证
    *fetchIndustrialDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryProductLicenceDelete, payload);
      if (response.code === 200) {
        yield put({ type: 'saveIndustrialDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    // 库区列表
    saveAreaList(state, { payload }) {
      const {
        data,
        data: { list },
      } = payload;
      return {
        ...state,
        list,
        areaData: data,
      };
    },

    saveCount(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        areaCount: data,
      };
    },

    // 新增库区
    saveAreaAdd(state, { payload }) {
      return {
        ...state,
        areaDetail: payload,
      };
    },

    // 编辑库区
    saveAreaEdit(state, { payload }) {
      return {
        ...state,
        areaDetail: {
          ...state.areaDetail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearDetail(state) {
      return {
        ...state,
        areaDetail: { data: {} },
      };
    },

    // 删除库区
    saveAreaDelete(state, { payload: id }) {
      return {
        ...state,
        areaData: {
          ...state.areaData,
          list: state.areaData.list.filter(item => item.id !== id),
        },
      };
    },

    // 危险源列表
    saveSourceList(state, { payload }) {
      const { data, msg } = payload;
      return {
        ...state,
        msg,
        sourceData: data,
      };
    },

    // 新增危险源
    saveSourceAdd(state, { payload }) {
      return {
        ...state,
        sourceDetail: payload,
      };
    },

    // 编辑危险源
    saveSourceEdit(state, { payload }) {
      return {
        ...state,
        sourceDetail: {
          ...state.sourceDetail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearSourceDetail(state) {
      return {
        ...state,
        sourceDetail: { data: {} },
      };
    },

    // 删除危险源
    saveSourceDelete(state, { payload: id }) {
      return {
        ...state,
        sourceData: {
          ...state.sourceData,
          list: state.sourceData.list.filter(item => item.id !== id),
        },
      };
    },

    // 物料列表
    saveMaterialInfoList(state, { payload }) {
      const {
        data,
        data: { list },
      } = payload;
      return {
        ...state,
        list,
        materialData: data,
      };
    },

    // 危险化学品许可证列表
    saveCertificateList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,

        cerData: data,
      };
    },

    // 新增危险化学品许可证
    saveCertificateAdd(state, { payload }) {
      return {
        ...state,
        cerDetail: payload,
      };
    },

    // 编辑危险化学品许可证
    saveCertificateEdit(state, { payload }) {
      return {
        ...state,
        cerDetail: {
          ...state.cerDetail,
          data: payload,
        },
      };
    },

    // 清除危险化学品详情
    clearCertificateDetail(state) {
      return {
        ...state,
        sourceDetail: { data: {} },
      };
    },

    // 删除危险化学品许可证
    saveCertificateDelete(state, { payload: id }) {
      return {
        ...state,
        cerData: {
          ...state.cerData,
          list: state.cerData.list.filter(item => item.id !== id),
        },
      };
    },

    // 注册工程师列表
    saveSafetyEngList(state, { payload }) {
      const { data, msg } = payload;
      return {
        ...state,
        msg,
        safetyEngData: data,
      };
    },

    // 新增注册工程师
    saveSafetyEngAdd(state, { payload }) {
      return {
        ...state,
        safetyEngDetail: payload,
      };
    },

    // 编辑注册工程师
    saveSafetyEngEdit(state, { payload }) {
      return {
        ...state,
        safetyEngDetail: {
          ...state.safetyEngDetail,
          data: payload,
        },
      };
    },

    // 清除注册工程师详情
    clearSafetyEngDetail(state) {
      return {
        ...state,
        safetyEngDetail: { data: {} },
      };
    },

    // 删除注册工程师
    saveSafetyEngDelete(state, { payload: id }) {
      return {
        ...state,
        safetyEngData: {
          ...state.safetyEngData,
          list: state.safetyEngData.list.filter(item => item.id !== id),
        },
      };
    },

    // 工业产品许可证列表
    saveIndustrialList(state, { payload }) {
      const { data, msg } = payload;
      return {
        ...state,
        msg,
        industrialData: data,
      };
    },

    // 新增工业产品许可证
    saveIndustrialAdd(state, { payload }) {
      return {
        ...state,
        industrialDetail: payload,
      };
    },

    // 编辑工业产品许可证
    saveIndustrialEdit(state, { payload }) {
      return {
        ...state,
        industrialDetail: {
          ...state.industrialDetail,
          data: payload,
        },
      };
    },

    // 清除工业产品许可证
    clearIndustrialDetail(state) {
      return {
        ...state,
        industrialDetail: { data: {} },
      };
    },

    // 删除工业产品许可证
    saveIndustrialDelete(state, { payload: id }) {
      return {
        ...state,
        industrialData: {
          ...state.industrialData,
          list: state.industrialData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
