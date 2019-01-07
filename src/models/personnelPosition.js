import {
  // 获取系统配置列表
  fetchSystemConfiguration,
  // 添加系统配置
  addSystemConfiguration,
  // 编辑系统配置
  editSystemConfiguration,
  // 删除系统配置
  deleteSystemConfiguration,
} from '../services/personnelPosition/systemConfiguration';
import {
  // 获取信标企业列表
  fetchBeaconCompanyList,
  // 获取信标列表
  fetchBeaconList,
  // 新增信标
  addBeacon,
  // 编辑信标
  editBeacon,
  // 删除信标
  deleteBeacon,
} from '../services/personnelPosition/beaconManagement';
import { getCompanyList } from '@/services/examinationPaper.js';

export default {
  namespace: 'personnelPosition',
  state: {
    // 系统配置
    systemConfiguration: {
      list: [],     // 系统配置列表
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      isLast: true, // 是否加载结束
      companyList: {
        list: [],
        pagination: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
      },
    },
    // 信标管理
    beaconManagement: {
      list: [],  // 信标企业列表
      pagination: {
        pageNum: 1,
        pageSize: 18,
        total: 0,
      },
      isLast: true,
      beaconList: [],// 信标列表
      beaconPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      beaconIsLast: true,
    },
  },
  effects: {
    // 获取系统配置列表
    *fetchSystemConfiguration({ payload }, { call, put }) {
      const response = yield call(fetchSystemConfiguration, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveSystemConfiguration',
          payload: response.data,
        })
      }
    },
    // 添加系统配置
    *addSystemConfiguration({ payload, success, error }, { call }) {
      const response = yield call(addSystemConfiguration, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 编辑系统配置
    *editSystemConfiguration({ payload, success, error }, { call }) {
      const response = yield call(editSystemConfiguration, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 删除系统配置
    *deleteSystemConfiguration({ payload, success, error }, { call }) {
      const response = yield call(deleteSystemConfiguration, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 获取企业列表
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyList',
          payload: response.data,
        })
        if (callback) callback()
      }
    },
    // 获取信标企业列表
    *fetchBeaconCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(fetchBeaconCompanyList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveBeaconCompanyList',
          payload: response.data,
        })
        if (callback) callback()
      }
    },
    // 获取信标列表
    *fetchBeaconList({ payload, callback }, { call, put }) {
      const response = yield call(fetchBeaconList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveBeaconList',
          payload: response.data,
        })
        if (callback) callback()
      }
    },
    // 新增信标
    *addBeacon({ payload, success, error }, { call }) {
      const response = yield call(addBeacon, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 编辑信标
    *editBeacon({ payload, success, error }, { call }) {
      const response = yield call(editBeacon, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response.msg)
    },
    // 删除信标
    *deleteBeacon({ payload, success, error }, { call }) {
      const response = yield call(deleteBeacon, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
  },
  reducers: {
    saveSystemConfiguration(state, { payload: {
      list = [],
      pagination,
      pagination: { pageNum, pageSize, total },
    } }) {
      return {
        ...state,
        systemConfiguration: {
          ...state.systemConfiguration,
          list,
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    saveCompanyList(state, { payload }) {
      return {
        ...state,
        systemConfiguration: {
          ...state.systemConfiguration,
          companyList: payload,
        },
      }
    },
    saveBeaconCompanyList(state, { payload: {
      list = [],
      pagination,
      pagination: { pageNum, pageSize, total },
    } }) {
      if (pageNum === 1) {
        return {
          ...state,
          beaconManagement: {
            ...state.beaconManagement,
            list,
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        }
      } else {
        return {
          ...state,
          beaconManagement: {
            ...state.beaconManagement,
            list: [...state.beaconManagement.list, ...list],
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        }
      }
    },
    saveBeaconList(state, { payload: {
      list = [],
      pagination,
      pagination: { pageNum, pageSize, total },
    } }) {
      return {
        ...state,
        beaconManagement: {
          ...state.beaconManagement,
          beaconList: list,
          beaconPagination: pagination,
          beaconIsLast: pageNum * pageSize >= total,
        },
      }
    },
  },
}
