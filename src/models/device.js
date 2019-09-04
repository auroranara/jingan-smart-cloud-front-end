import {
  fetchMonitoringTypes,
  addMonitoringTypes,
  editMonitoringTypes,
  deleteMonitoringTypes,
} from '@/services/device/monitoringType'
import {
  fetchDeviceTypes,
  deployMonitoringType,
} from '@/services/device/deviceType'
const defaultPagination = {
  total: 0,
  pageNum: 1,
  pageSize: 10,
}

export default {
  namespace: 'device',
  state: {
    // 监测类型树
    monitoringType: [],
    // 设备类型列表
    deviceType: {
      list: [],
      pagination: defaultPagination,
    },
  },
  effects: {
    // 获取监测类型列表
    *fetchMonitoringTypes({ callback }, { call, put }) {
      const response = yield call(fetchMonitoringTypes)
      if (response && response.code === 200) {
        const list = response.data.list || []
        yield put({
          type: 'saveMonitoringTypes',
          payload: list,
        })
        callback && callback(list)
      }
    },
    // 新增监测类型
    *addMonitoringTypes({ payload, success, error }, { call }) {
      const response = yield call(addMonitoringTypes, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 监测类型
    *editMonitoringTypes({ payload, success, error }, { call }) {
      const response = yield call(editMonitoringTypes, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 监测类型
    *deleteMonitoringTypes({ payload, success, error }, { call }) {
      const response = yield call(deleteMonitoringTypes, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取设备类型列表（分页）
    *fetchDeviceTypes({ payload }, { call, put }) {
      const response = yield call(fetchDeviceTypes, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveDeviceTypes',
          payload: response.data,
        })
      }
    },
    // 设备类型-配置监测类型
    *deployMonitoringType({ payload, success, error }, { call }) {
      const response = yield call(deployMonitoringType, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    saveMonitoringTypes(state, { payload = [] }) {
      return {
        ...state,
        monitoringType: payload,
      }
    },
    saveDeviceTypes(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        deviceType: {
          list,
          pagination,
        },
      }
    },
  },
}
