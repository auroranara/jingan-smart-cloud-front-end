import { stringify } from 'qs';
import request from '@/utils/request';

// 获取承包商人员资质列表
export async function fetchList (params) {
  return request(`/acloud_new/v2/contractorPerson/contractorPerson/page?${stringify(params)}`)
}

// 新增承包商人员资质
export async function addQualification (body) {
  return request('/acloud_new/v2/contractorPerson/contractorPerson', {
    method: 'POST',
    body,
  })
}

// 编辑承包商人员资质
export async function editQualification (body) {
  return request('/acloud_new/v2/contractorPerson/contractorPerson', {
    method: 'PUT',
    body,
  })
}

// 删除承包商人员资质
export async function deleteQualification (params) {
  return request(`/acloud_new/v2/contractorPerson/contractorPerson/${params.id}`, {
    method: 'DELETE',
  })
}
