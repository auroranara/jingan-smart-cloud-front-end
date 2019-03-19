import {
  fetchSensorCompanies,
  fetchCompanyDevice,
  fetchDeviceTypes,
  addSensorCompany,
  fetchDeviceBindedSensor,
  fetchCompanySensor,
  fetchSensorTypes,
  bindDeviceSensor,
  unbindDeviceSensor,
} from '../services/sensor'
export default {
  namespace: 'sensor',
  state: {
    // 绑定设备的企业
    sensorCompany: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isLast: true,
    },
    // 企业下绑定的设备
    companyDevice: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isLast: true,
    },
    companySensor: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    // 设备绑定的传感器
    deviceBindedSensor: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    deviceTypes: [],
    // 传感器型号
    sensorTypes: [],
  },
  effects: {
    // 获取传感器企业列表
    *fetchSensorCompanies({ payload }, { call, put }) {
      const response = yield call(fetchSensorCompanies, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompany',
          payload: response.data,
        })
      }
    },
    // 获取企业下绑定的设备列表
    *fetchCompanyDevice({ payload }, { call, put }) {
      const response = yield call(fetchCompanyDevice, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyDevice',
          payload: response.data,
        })
      }
    },
    // 获取设备类型列表
    *fetchDeviceTypes({ payload }, { call, put }) {
      const response = yield call(fetchDeviceTypes, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'deviceTypes', value: response.data.deviceType || [] },
        })
      }
    },
    // 设备关联传感器新增设备
    *addSensorCompany({ payload, success, error }, { call }) {
      const response = yield call(addSensorCompany, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error()
    },
    // 获取设备绑定的传感器
    *fetchDeviceBindedSensor({ payload, callback }, { call, put }) {
      const response = yield call(fetchDeviceBindedSensor, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveDeviceBindedSensor',
          payload: response.data,
        })
        if (callback) callback()
      }
    },
    // 获取企业下传感器
    *fetchCompanySensor({ payload }, { call, put }) {
      const response = yield call(fetchCompanySensor, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanySensor',
          payload: response.data,
        })
      }
    },
    // 获取传感器型号
    *fetchSensorTypes({ payload }, { call, put }) {
      const response = yield call(fetchSensorTypes, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'sensorTypes', value: response.data.deviceModelId || [] },
        })
      }
    },
    // 设备绑定传感器
    *bindDeviceSensor({ payload, success, error }, { call }) {
      const response = yield call(bindDeviceSensor, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error()
    },
    // 解绑虚拟设备
    *unbindDeviceSensor({ payload, success, error }, { call }) {
      const response = yield call(unbindDeviceSensor, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error()
    },
  },
  reducers: {
    saveState(state, { payload: { key, value } }) {
      state[key] = value
      return {
        ...state,
      }
    },
    saveCompany(state, { payload: { list = [], pagination, pagination: { pageNum = 1, pageSize = 10, total = 0 } } }) {
      return {
        ...state,
        sensorCompany: {
          ...state.sensorCompany,
          list: pageNum === 1 ? list : [...state.companyList, ...list],
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    saveCompanyDevice(state, { payload: { list = [], pagination = { pageNum: 1, pageSize: 10, total: 0 } } }) {
      return {
        ...state,
        companyDevice: {
          ...state.companyDevice,
          list,
          pagination,
        },
      }
    },
    saveDeviceBindedSensor(state, { payload: { list = [], pagination = { pageNum: 1, pageSize: 10, total: 0 } } }) {
      return {
        ...state,
        deviceBindedSensor: {
          ...state.deviceBindedSensor,
          list,
          pagination,
        },
      }
    },
    saveCompanySensor(state, { payload: { list = [], pagination = { pageNum: 1, pageSize: 10, total: 0 } } }) {
      return {
        ...state,
        companySensor: {
          ...state.companySensor,
          list,
          pagination,
        },
      }
    },
  },
}
