import { stringify } from 'qs';
import request from '../../utils/request';

// 获取部门列表
export async function fetchDepartmentList(params) {
  return request(`/acloud_new/v2/sys/sysDepartment?${stringify(params)}`)
}

// 新增部门
export async function addDepaetment(params) {
  return request(`/acloud_new/v2/sys/sysDepartment`, {
    method: 'POST',
    body: params,
  })
}

// 编辑部门
export async function editDepartment(params) {
  return request(`/acloud_new/v2/sys/sysDepartment`, {
    method: 'PUT',
    body: params,
  })
}

// 删除部门
export async function deleteDepartment(id) {
  return request(`/acloud_new/v2/sys/sysDepartment/${id}`, {
    method: 'DELETE',
  })
}
