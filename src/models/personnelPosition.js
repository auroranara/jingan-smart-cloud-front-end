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
import { getCompanyList } from '@/services/examinationPaper.js';

export default {
  namespace: 'personnelPosition',
  state: {
    // 系统配置
    systemConfiguration: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      isLast: false, // 是否加载结束
      companyList: {
        list: [],
        pagination: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
      },
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
  },
  reducers: {
    saveSystemConfiguration(state, { payload: {
      list = [],
      pagination,
      pagination: { pageNum, pageSize, total },
    } }) {
      if (pageNum === 1) {
        return {
          ...state,
          systemConfiguration: {
            ...state.systemConfiguration,
            list,
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        }
      } else {
        return {
          ...state,
          systemConfiguration: {
            ...state.systemConfiguration,
            list: [...state.systemConfiguration.list, ...list],
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        }
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
  },
}
