import request from '@/utils/request';
import { stringify } from 'qs';

// 获取品牌列表（分页）
export async function fetchBrandsForPage(params) {
  return request(`/acloud_new/v2/monitor/equipmentBrandForPage?${stringify(params)}`)
}

// 新增品牌
export async function addBrand(body) {
  return request('/acloud_new/v2/monitor/equipmentBrand', {
    method: 'POST',
    body,
  })
}

// 编辑品牌
export async function editBrand(body) {
  return request('/acloud_new/v2/monitor/equipmentBrand', {
    method: 'PUT',
    body,
  })
}

// 删除品牌
export async function deleteBrand(params) {
  return request(`/acloud_new/v2/monitor/equipmentBrand/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取型号列表
export async function fetchModelsForPage(params) {
  return request(`/acloud_new/v2/monitor/equipmentModelForPage?${stringify(params)}`)
}

// 新增型号
export async function addModel(body) {
  return request('/acloud_new/v2/monitor/equipmentModel', {
    method: 'POST',
    body,
  })
}

// 编辑型号
export async function editModel(body) {
  return request('/acloud_new/v2/monitor/equipmentModel', {
    method: 'PUT',
    body,
  })
}

// 删除型号
export async function deleteModel(params) {
  return request(`/acloud_new/v2/monitor/equipmentModel/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取参数列表（分页）
export async function fetchParameterForPage(params) {
  return request(`/acloud_new/v2/monitor/sensorMonitorParamForPage?${stringify(params)}`)
}

// 新增参数
export async function addParameter(body) {
  return request('/acloud_new/v2/monitor/sensorMonitorParam', {
    method: 'POST',
    body,
  })
}

// 编辑参数
export async function editParameter(body) {
  return request('/acloud_new/v2/monitor/sensorMonitorParam', {
    method: 'PUT',
    body,
  })
}

// 查询报警策略
export async function fetchAlarmStrategy(params) {
  return request(`/acloud_new/v2/monitor/paramWarnStrategy?${stringify(params)}`)
}

// 保存报警策略
export async function submitAlarmStrategy(body) {
  return request('/acloud_new/v2/monitor/paramWarnStrategy', {
    method: 'POST',
    body,
  })
}
