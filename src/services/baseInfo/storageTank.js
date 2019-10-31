import { stringify } from 'qs';
import request from '@/utils/request';

// 获取储罐列表（分页）
export async function fetchStorageTankForPage(params) {
  return request(`/acloud_new/v2/tankManage/tankManageForPage?${stringify(params)}`)
}

// 新增储罐
export async function addStorageTank(body) {
  return request('/acloud_new/v2/tankManage/tankManage', {
    method: 'POST',
    body,
  })
}

// 编辑储罐
export async function editStorageTank(body) {
  return request('/acloud_new/v2/tankManage/tankManage', {
    method: 'PUT',
    body,
  })
}

// 删除储罐
export async function deleteStorageTank(params) {
  return request(`/acloud_new/v2/tankManage/tankManage/${params.id}`, {
    method: 'DELETE',
  })
}
