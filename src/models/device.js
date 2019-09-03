import {
  fetchMonitoringTypes,
  addMonitoringTypes,
  editMonitoringTypes,
  deleteMonitoringTypes,
} from '@/services/device/monitoringType'

export default {
  namespace: 'device',
  state: {
    monitoringType: [],

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
  },
}
