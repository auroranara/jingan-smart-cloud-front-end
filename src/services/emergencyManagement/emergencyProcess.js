import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询应急演练过程列表 */
export async function queryProcessList(params) {
  return request(`/acloud_new/v2/emergencyProcess/emergencyProcessForPage?${stringify(params)}`);
}

/* 新建应急演练过程 */
export async function addProcess(params) {
  return request(`/acloud_new/v2/emergencyProcess/emergencyProcess`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急演练过程 */
export async function updateProcess(params) {
  return request(`/acloud_new/v2/emergencyProcess/emergencyProcess`, {
    method: 'PUT',
    body: params,
  });
}

/* 应急演练过程详情 */
export async function processDetail({ id }) {
  return request(`/acloud_new/v2/emergencyProcess/emergencyProcess/${id}`);
}

/* 删除应急演练过程 */
export async function deleteProcess(params) {
  return request(`/acloud_new/v2/emergencyProcess/emergencyProcess/${params.id}`, {
    method: 'DELETE',
    // body: params,
  });
}

// 根据type获取老的字典列表
export async function queryDict(params) {
  return request(`/acloud_new/v2/sys/dict/listOld?${stringify(params)}`);
}
