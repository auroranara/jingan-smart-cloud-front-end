import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

// 获取传感器企业列表
export async function fetchSensorCompanies(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/getCompanyList?${stringify(params)}`)
}

// 获取企业下绑定的传感器列表
export async function fetchCompanyDevice(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/virtualDeviceList?${stringify(params)}`)
}

// 获取设备类型列表
export async function fetchDeviceTypes() {
  return request(`/acloud_new/v2/virtualDeviceInfo/options`)
}

// 设备关联传感器新增单位（同时新增设备）
export async function addSensorCompany(params) {
  return request('/acloud_new/v2/virtualDeviceInfo/virtualDeviceInfo', {
    method: 'POST',
    body: params,
  })
}

// 获取企业绑定的传感器列表
export async function fetchDeviceBindedSensor(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/selectRealDeviceList?${stringify(params)}`)
}

// 获取企业下传感器
export async function fetchCompanySensor(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/companyDevices?${stringify(params)}`)
}

// 获取传感器型号
export async function fetchSensorTypes(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/getModelDescs?${stringify(params)}`)
}

// 设备绑定传感器
export async function bindDeviceSensor(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/virtualDeviceInfo/bindDevice?${stringify(params)}`)
}

// 解绑传感器
export async function unbindDeviceSensor(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/unbindDevice?${stringify(params)}`)
}

// 编辑单位下的设备
export async function editCompanyDevice(params) {
  return request('/acloud_new/v2/virtualDeviceInfo/virtualDeviceInfo', {
    method: 'PUT',
    body: params,
  })
}

// 删除单位下的设备
export async function deleteCompanyDevice({ id }) {
  return request(`/acloud_new/v2/virtualDeviceInfo/virtualDeviceInfo/${id}`, {
    method: 'DELETE',
  })
}

// 获取传感器列表（分页）
export async function fetchSensors(params) {
  return request(`/acloud_new/v2/sensor/sensorForPage?${stringify(params)}`)
}

// 获取监测类型字典
export async function fetchMonitoringTypeDict(params) {
  return request(`/acloud_new/v2/sensor/monitoringTypeDict?${stringify(params)}`)
}

// 获取品牌字典
export async function fetchSensorBrandDict(params) {
  return request(`/acloud_new/v2/sensor/sensorBrandDict?${stringify(params)}`)
}

// 获取传感器型号字典
export async function fetchSensorTypeDict(params) {
  return request(`/acloud_new/v2/sensor/sensorTypeDict?${stringify(params)}`)
}


/**
 * 获取监测参数列表
 */
export async function fetchMonitoringParameter(params) {
  return request(`/acloud_new/v2/sensor/monitoringParameter?${stringify(params)}`)
}


/**
 * 企业列表弹出框
 */
export async function queryModelList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}


/**
 * 新增传感器
 */
export async function addSensor(params) {
  return request('/acloud_new/v2/sensor/sensor', {
    method: 'POST',
    body: params,
  })
}


/**
 * 编辑传感器
 */
export async function editSensor(params) {
  return request('/acloud_new/v2/sensor/sensor', {
    method: 'PUT',
    body: params,
  })
}


/**
 * 删除传感器
 */
export async function deleteSensor({ id }) {
  return request(`/acloud_new/v2/sensor/sensor/${id}`, {
    method: 'DELETE',
  })
}


/**
 * 获取传感器详情
 */
export async function fetchSensorDetail({ id }) {
  return request(`/acloud_new/v2/sensor/sensor/${id}`)
}


/**
 * 获取传感器型号列表
 */
export async function fetchSensorModels(params) {
  return request(`/acloud_new/v2/sensorType/sensorTypeForPage?${stringify(params)}`)
}


/**
 * 新增传感器型号
 */
export async function editSensorModel(params) {
  return request('/acloud_new/v2/sensorType/sensorType', {
    method: 'PUT',
    body: params,
  })
}

/**
 * 新增传感器型号
 */
export async function addSensorModel(body) {
  return request('/acloud_new/v2/sensorType/sensorType', {
    method: 'POST',
    body,
  })
}

export async function copySensorModel({ copyId, ...body }) {
  return request(`/acloud_new/v2/sensorType/sensorType?copyId=${copyId}`, {
    method: 'POST',
    body,
  })
}


/**
 * 获取传感器型号的参数列表
 */
export async function fetchModelParameters({ modelId }) {
  return request(`/acloud_new/v2/sensorType/sensorType/${modelId}/monitoringParameter`)
}

/**
 * 新增传感器型号的参数
 */
export async function addModelParameter(params) {
  return request(`/acloud_new/v2/sensorType/sensorType/${params.modelId}/monitoringParameter`, {
    method: 'POST',
    body: params,
  })
}

/**
 * 编辑传感器型号的参数
 */
export async function editModelParameter(params) {
  return request(`/acloud_new/v2/sensorType/sensorType/${params.modelId}/monitoringParameter`, {
    method: 'PUT',
    body: params,
  })
}

/**
 * 删除传感器型号的参数
 */
export async function deleteModelParameter({ modelId, id }) {
  return request(`/acloud_new/v2/sensorType/sensorType/${modelId}/monitoringParameter/${id}`, {
    method: 'DELETE',
  })
}


/**
 * 获取传感器型号统计
 */
export async function fetchModelCount(params) {
  return request(`/acloud_new/v2/sensorType/sensorType/count?${stringify(params)}`)
}


/**
 * 根据监测类型获取型号代码列表（对象包含描述和补充描述）,筛选掉已添加
 */
export async function fetchUnsetModelList(params) {
  return request(`/acloud_new/deviceInfo/model/getunsetmodellist.json?${stringify(params)}`)
}

/**
 * 根据监测类型获取型号代码列表（对象包含描述和补充描述）
 */
export async function fetchAllUnsetModelList(params) {
  return request(`/acloud_new/deviceInfo/model/getallmodellist.json?${stringify(params)}`)
}

/**
 * 删除传感器型号
 */
export async function deleteSensorModel({ id }) {
  return request(`/acloud_new/v2/sensorType/sensorType/${id}`, {
    method: 'DELETE',
  })
}
