import request from '@/utils/request';
import { stringify } from 'qs';

// 获取图标库列表
export async function fetchTagsForPage(params) {
  return request(`/acloud_new/v2/monitor/monitorParamLogoForPage?${stringify(params)}`)
}

// 编辑图标库
export async function editTag(body) {
  return request('/acloud_new/v2/monitor/monitorParamLogo', {
    method: 'PUT',
    body,
  })
}

// 新增图标库
export async function addTag(body) {
  return request('/acloud_new/v2/monitor/monitorParamLogo', {
    method: 'POST',
    body,
  })
}

// 删除图标库
export async function deleteTag(params) {
  return request(`/acloud_new/v2/monitor/monitorParamLogo/${params.id}`, {
    method: 'DELETE',
  })
}
