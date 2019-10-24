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

// 获取品牌列表（全部）
export async function fetchBrands(params) {
  return request(`/acloud_new/v2/monitor/equipmentBrand?${stringify(params)}`)
}

// 获取型号列表（分页）
export async function fetchModelsForPage(params) {
  return request(`/acloud_new/v2/monitor/equipmentModelForPage?${stringify(params)}`)
}

// 获取型号列表（全部）
export async function fetchModels(params) {
  return request(`/acloud_new/v2/monitor/equipmentModel?${stringify(params)}`)
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

// 获取参数列表（全部）
export async function fetchAllParameters(params) {
  return request(`/acloud_new/v2/monitor/sensorMonitorParam?${stringify(params)}`)
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

// 删除参数
export async function deleteParameter(params) {
  return request(`/acloud_new/v2/monitor/sensorMonitorParam/${params.id}`, {
    method: 'DELETE',
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

// 获取参数分组类型数组
export async function fetchParameterGroupTypes() {
  return request('/acloud_new/v2/monitor/groupFixType')
}

// 获取配置参数历史纪录
export async function fetchParameterStrategyHistory(params) {
  return request(`/acloud_new/v2/monitor/paramWarnStrategyHistory?${stringify(params)}`)
}
