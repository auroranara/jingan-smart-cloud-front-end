import { stringify } from 'qs';
import request from '../../utils/request';

// 获取特种作业操作证人员列表（分页）
export async function fetchSpecialWorkPerson (params) {
  return request(`/acloud_new/v2/specialworkPerson/specialworkPersonForPage?${stringify(params)}`)
}

// 新增特种作业操作证人员
export async function addSpecialWorkPerson (body) {
  return request('/acloud_new/v2/specialworkPerson/specialworkPerson', {
    method: 'POST',
    body,
  })
}

// 编辑特种作业操作证人员
export async function editSpecialWorkPerson (body) {
  return request('/acloud_new/v2/specialworkPerson/specialworkPerson', {
    method: 'PUT',
    body,
  })
}

// 删除特种作业操作证人员
export async function deleteSpecialWorkPerson (params) {
  return request(`/acloud_new/v2/specialworkPerson/specialworkPerson/${params.id}`, {
    method: 'DELETE',
  })
}

// 查询字典
export async function fetchDict (params) {
  return request(`/acloud_new/v2/sys/dict/listOld?${stringify(params)}`)
}
