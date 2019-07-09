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
  editCompanyDevice,
  deleteCompanyDevice,
  fetchSensors,
  fetchMonitoringTypeDict,
  fetchSensorBrandDict,
  fetchSensorTypeDict,
  fetchMonitoringParameter,
  queryModelList,
  addSensor,
  editSensor,
  deleteSensor,
  fetchSensorDetail,
  fetchSensorModels,
  addSensorModel,
  editSensorModel,
  fetchModelParameters,
  addModelParameter,
  editModelParameter,
  deleteModelParameter,
  copySensorModel,
  fetchModelCount,
  fetchUnsetModelList,
  fetchAllUnsetModelList,
  deleteSensorModel,
} from '../services/sensor'
const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 }
export default {
  namespace: 'sensor',
  state: {
    // 传感器列表
    list: [],
    pagination: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
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
    // 监测类型字典
    monitoringTypeDict: [],
    // 传感器品牌字典
    brandDict: [],
    // 传感器型号字典
    typeDict: [],
    // 监测参数列表
    monitoringParameters: [],
    // 企业列表
    companyModal: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    // 传感器详情
    sensorDetail: {},
    // 传感器型号
    sensorModel: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    // 型号参数
    modelParameters: [],
    // 型号代码列表(筛选掉已添加)
    modelCodeList: [],
    // 型号代码列表
    allModelCodeList: [],
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
    // 编辑单位下的设备
    *editCompanyDevice({ payload, success, error }, { call }) {
      const response = yield call(editCompanyDevice, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error()
    },
    // 删除单位下的设备
    *deleteCompanyDevice({ payload, success, error }, { call }) {
      const response = yield call(deleteCompanyDevice, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error()
    },
    // 获取传感器列表（分页）
    *fetchSensors({ payload }, { call, put }) {
      const response = yield call(fetchSensors, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveSensors',
          payload: response.data,
        })
      }
    },
    // 获取监测类型字典（传入justState=true时，redux不保存数据，数据传给callback）
    *fetchMonitoringTypeDict({ payload = {}, callback }, { call, put }) {
      const { justState = false, ...newPayload } = payload
      const response = yield call(fetchMonitoringTypeDict, newPayload)
      if (response && response.code === 200) {
        if (justState && callback) {
          callback(response.data.list || [])
          return
        }
        yield put({
          type: 'saveState',
          payload: { key: 'monitoringTypeDict', value: response.data.list || [] },
        })
      }
    },
    // 获取品牌字典
    *fetchSensorBrandDict({ payload = {}, callback }, { call, put }) {
      const { justState = false, ...newPayload } = payload
      const response = yield call(fetchSensorBrandDict, newPayload)
      if (response && response.code === 200) {
        if (justState && callback) {
          callback(response.data.list || [])
          return
        }
        yield put({
          type: 'saveState',
          payload: { key: 'brandDict', value: response.data.list || [] },
        })
      }
    },
    // 获取传感器型号字典
    *fetchSensorTypeDict({ payload = {}, callback }, { call, put }) {
      const { justState = false, ...newPayload } = payload
      const response = yield call(fetchSensorTypeDict, newPayload)
      if (response && response.code === 200) {
        if (justState && callback) {
          callback(response.data.list || [])
          return
        }
        yield put({
          type: 'saveState',
          payload: { key: 'typeDict', value: response.data.list || [] },
        })
      }
    },
    // 获取监测参数列表
    *fetchMonitoringParameter({ payload }, { call, put }) {
      const response = yield call(fetchMonitoringParameter, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'monitoringParameters', value: response.data.list || [] },
        })
      }
    },
    // 获取企业列表（弹出框）
    *fetchModelList({ payload }, { call, put }) {
      const response = yield call(queryModelList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'companyModal', value: response.data },
        });
      }
    },
    // 新增传感器
    *addSensor({ payload, success, error }, { call }) {
      const response = yield call(addSensor, payload);
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error()
    },
    // 编辑传感器
    *editSensor({ payload, success, error }, { call }) {
      const response = yield call(editSensor, payload);
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error()
    },
    // 删除传感器
    *deleteSensor({ payload, success, error }, { call }) {
      const response = yield call(deleteSensor, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error(response)
    },
    // 获取传感器详情
    *fetchSensorDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchSensorDetail, payload)
      if (response && response.code === 200 && response.data) {
        yield put({
          type: 'saveState',
          payload: { key: 'sensorDetail', value: response.data },
        })
        if (callback) callback(response)
      }
    },
    // 获取传感器型号列表
    *fetchSensorModels({ payload }, { call, put }) {
      const response = yield call(fetchSensorModels, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveSensorModel',
          payload: response.data,
        })
      }
    },
    // 新增传感器型号
    *addSensorModel({ payload, success, error }, { call }) {
      const response = yield call(addSensorModel, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error(response)
    },
    *copySensorModel({ payload, success, error }, { call }) {
      const response = yield call(copySensorModel, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error(response)
    },
    // 编辑传感器型号
    *editSensorModel({ payload, success, error }, { call }) {
      const response = yield call(editSensorModel, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error(response)
    },
    // 获取传感器型号的监测参数
    *fetchModelParameters({ payload }, { call, put }) {
      const response = yield call(fetchModelParameters, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'modelParameters', value: response.data.list || [] },
        })
      }
    },
    // 新增传感器型号的监测参数
    *addModelParameter({ payload, success, error }, { call }) {
      const response = yield call(addModelParameter, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error(response)
    },
    // 编辑传感器型号的监测参数
    *editModelParameter({ payload, success, error }, { call }) {
      const response = yield call(editModelParameter, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error(response)
    },
    // 删除传感器型号的监测参数
    *deleteModelParameter({ payload, success, error }, { call }) {
      const response = yield call(deleteModelParameter, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error(response)
    },
    //
    *fetchModelCount({ payload, callback }, { call }) {
      const response = yield call(fetchModelCount, payload)
      if (response && response.code === 200 && callback) {
        callback(response.data)
      }
    },
    // 根据监测类型获取型号代码列表（对象包含描述和补充描述）,筛选掉已添加
    *fetchUnsetModelList({ payload, success, error }, { call, put }) {
      const response = yield call(fetchUnsetModelList, payload)
      if (response && response.error && response.error.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'modelCodeList', value: response.result || [] },
        })
        if (success) success()
      } else if (error) error(response)
    },
    // 根据监测类型获取型号代码列表（对象包含描述和补充描述）
    *fetchAllUnsetModelList({ payload, success, error }, { call, put }) {
      const response = yield call(fetchAllUnsetModelList, payload)
      if (response && response.error && response.error.code === 200) {
        yield put({
          type: 'saveState',
          payload: { key: 'allModelCodeList', value: response.result || [] },
        })
        if (success) success()
      } else if (error) error(response)
    },
    // 删除传感器型号
    *deleteSensorModel({ payload, success, error }, { call }) {
      const response = yield call(deleteSensorModel, payload)
      if (response && response.code === 200 && success) {
        success()
      } else if (error) error(response)
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
    saveSensors(state, { payload: { list = [], pagination = defaultPagination } }) {
      return {
        ...state,
        list,
        pagination,
      }
    },
    saveSensorModel(state, { payload: { list = [], pagination = defaultPagination } }) {
      return {
        ...state,
        sensorModel: {
          list,
          pagination,
        },
      }
    },
    saveModelCodeList(state, { payload: { list = [] } }) {
      return {
        ...state,
        modelCodeList: list,
      }
    },
  },
}
