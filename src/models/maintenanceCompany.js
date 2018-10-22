import {
  queryMaintenanceCompanies,
  deleteMaintenanceCompany,
  queryMaintenanceCompany,
  queryMaintenanceCompanyinfo,
  updateMaintenanceCompany,
  addMaintenanceCompany,
  queryServiceUnit,
  gsafeQueryIndustryType,
  fetchAddress,
  gsafeQueryDict,
  queryDict,
  queryCompanyType,
  queryExtraMaintenanceCompanies,
  queryServiceDetail,
  queryServiceSafetyInfo,
  queryServiceMenus,
} from '../services/maintenanceCompany.js';
import router from "umi/router";
import urls from '@/utils/urls';
const {
  exception: { 500: exceptionUrl },
} = urls;

export default {
  namespace: 'maintenanceCompany',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    list: [],
    detail: {
      companyBasicInfo: {},
    },
    // 注册地址列表
    registerAddressList: [],
    // 实际地址列表
    practicalAddressList: [],
    // 单位性质列表
    companyNatureList: [],
    // 单位状态列表
    companyStatusList: [],
    // 行业类别列表
    industryCategoryList: [],
    // 经济类型列表
    economicTypeList: [],
    // 规模情况列表
    scaleList: [],
    // 营业执照类别列表
    licenseTypeList: [],
    // 单位类型列表
    companyTypeList: [],
    // 是否为分公司字典
    isBranchList: [],
    // 总公司列表
    parentIdList: [],
    categories: [],
    pageNum: 1,
    isLast: false,
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
    /* 服务单位详情 */
    serviceDetail: {},
    /* 服务单位安监信息 */
    safetyInfo: {},
    /* 服务单位字典 */
    menus: {},
  },

  effects: {
    // 维保单位列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryMaintenanceCompanyList',
          payload: response.data,
        });
      }
    },
    // 查询维保单位列表
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'appendList',
          payload: response.data,
        });
      }
    },
    // 删除维保单位信息
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deleteMaintenanceCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'delete',
          payload: payload.id,
        });
        if (callback) callback(response);
      }
    },
    //  查看指定维保单位信息
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryMaintenanceCompanyinfo, payload.id);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'detail',
            value: response.data,
          },
        });
        if (callback) callback(response.data);
      }
      else {
        router.push(exceptionUrl);
      }
    },
    // 修改维保单位信息
    *updateMaintenanceCompany({ payload, callback }, { call, put }) {
      const response = yield call(updateMaintenanceCompany, payload);
      if (callback) callback(response);
    },
    // 新增维保单位信息
    *addMaintenanceCompany({ payload, callback }, { call, put }) {
      const response = yield call(addMaintenanceCompany, payload);
      if (callback) callback(response);
    },
    // 根据维保单位id查询服务单位列表
    *fetchServiceUnit({ payload }, { call, put }) {
      const response = yield call(queryServiceUnit, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryServiceUnit',
          payload: response.data,
        });
      }
    },
    /* 获取行业类别列表 */
    *fetchIndustryCategoryList({ callback }, { call, put }) {
      const response = yield call(gsafeQueryIndustryType, { parent_id: -1 });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'industryCategoryList',
            value: response.data.list,
          },
        });
        if (callback) {
          callback();
        }
      }
      else {
        router.push(exceptionUrl);
      }
    },
    /* 获取实际地址列表 */
    *fetchPracticalAddressList({ payload, success, error }, { call, put }) {
      const response = yield call(fetchAddress, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'practicalAddressList',
            value: response.data.list,
          },
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error(response.msg);
      }
    },
    /* 获取注册地址列表 */
    *fetchRegisterAddressList({ payload, success, error }, { call, put }) {
      const response = yield call(fetchAddress, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'registerAddressList',
            value: response.data.list,
          },
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error(response.msg);
      }
    },
    /* acloud版获取字典 */
    *fetchDict({ payload: { type, key }, callback }, { call, put }) {
      const response = yield call(queryDict, { type });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key,
            value: response.data.list,
          },
        });
        if (callback) {
          callback();
        }
      }
      else {
        router.push(exceptionUrl);
      }
    },
    /* gsafe版获取字典 */
    *gsafeFetchDict({ payload: { type, key }, callback }, { call, put }) {
      const response = yield call(gsafeQueryDict, { type });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key,
            value: response.data.list,
          },
        });
        if (callback) {
          callback();
        }
      }
      else {
        router.push(exceptionUrl);
      }
    },
    /* 获取单位类型列表 */
    *fetchCompanyTypeList({ callback }, { call, put }) {
      const response = yield call(queryCompanyType);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'companyTypeList',
            value: response.data.companyType,
          },
        });
        if (callback) {
          callback();
        }
      }
      else {
        router.push(exceptionUrl);
      }
    },
    /* 查询除自己以外的维保单位 */
    *fetchExtraMaintenanceCompanies({ payload, callback }, { call, put }) {
      const response = yield call(queryExtraMaintenanceCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'modal',
            value: response.data,
          },
        });
        if (callback) {
          callback();
        }
      }
      else {
        router.push(exceptionUrl);
      }
    },
    /* 服务单位详情 */
    *fetchServiceDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryServiceDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'serviceDetail',
            value: response.data,
          },
        });
        if (callback) {
          callback(response.data);
        }
      }
      else {
        router.push(exceptionUrl);
      }
    },
    /* 服务单位安监信息 */
    *fetchServiceSafetyInfo({ payload, callback }, { call, put }) {
      const response = yield call(queryServiceSafetyInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'safetyInfo',
            value: response.data,
          },
        });
        if (callback) {
          callback(response.data);
        }
      }
      else {
        router.push(exceptionUrl);
      }
    },
    /* 服务单位字典 */
    *fetchServiceMenus({ callback }, { call, put }) {
      const response = yield call(queryServiceMenus);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            key: 'menus',
            value: response.data,
          },
        });
        if (callback) {
          callback(response.data);
        }
      }
      else {
        router.push(exceptionUrl);
      }
    },
  },

  reducers: {
    // 维保单位列表
    queryMaintenanceCompanyList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        data: payload,
        isLast: pageNum * pageSize >= total,
      };
    },
    // 查询维保单位列表
    appendList(
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
    // 删除维保单位信息
    delete(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload),
      };
    },
    // 根据维保单位id查询服务单位列表
    queryServiceUnit(
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
        list,
        pageNum: 1,
        isLast: pageNum * pageSize >= total,
      };
    },
    /* 保存字段 */
    save(state, { payload: { key, value } }) {
      return {
        ...state,
        [key]: value,
      };
    },
  },
};
