import { stringify } from 'qs';
import request from '@/utils/request';

// 获取特种设备作业人员列表（分页）
export async function fetchSpecialEquipPerson (params) {
  return request(`/acloud_new/v2/specialequipPerson/specialequipPersonForPage?${stringify(params)}`)
}

// 新增特种设备作业人员
export async function addSpecialEquipPerson (body) {
  return request('/acloud_new/v2/specialequipPerson/specialequipPerson', {
    method: 'POST',
    body,
  })
}

// 编辑特种设备作业人员
export async function editSpecialEquipPerson (body) {
  return request('/acloud_new/v2/specialequipPerson/specialequipPerson', {
    method: 'PUT',
    body,
  })
}

// 删除特种作业操作证人员
export async function deleteSpecialEquipPerson (params) {
  return request(`/acloud_new/v2/specialequipPerson/specialequipPerson/${params.id}`, {
    method: 'DELETE',
  })
}
