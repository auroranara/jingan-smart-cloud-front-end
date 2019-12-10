import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/ci';

// 获取承诺卡列表
export async function getCommitList(params) {
  return request(`${URL_PREFIX}/acceptCard/acceptCard/page?${stringify(params)}`);
}

// 查看承诺卡
export async function getCommitItem(id) {
  return request(`${URL_PREFIX}/acceptCard/acceptCard/${id}`);
}

// 添加承诺卡
export async function addCommitItem(params) {
  return request(`${URL_PREFIX}/acceptCard/acceptCard`, { method: 'POST', body: params });
}

// 编辑承诺卡
export async function editCommitItem(params) {
  return request(`${URL_PREFIX}/acceptCard/acceptCard`, { method: 'PUT', body: params });
}

// 删除承诺卡
export async function deleteCommitItem(id) {
  return request(`${URL_PREFIX}/acceptCard/acceptCard/${id}`, { method: 'DELETE' });
}

// 获取应知卡列表
export async function getKnowList(params) {
  return request(`${URL_PREFIX}/knowableCard/knowableCard/page?${stringify(params)}`);
}

// 查看应知卡
export async function getKnowItem(id) {
  return request(`${URL_PREFIX}/knowableCard/knowableCard/${id}`);
}

// 添加应知卡
export async function addKnowItem(params) {
  return request(`${URL_PREFIX}/knowableCard/knowableCard`, { method: 'POST', body: params });
}

// 编辑应知卡
export async function editKnowItem(params) {
  return request(`${URL_PREFIX}/knowableCard/knowableCard`, { method: 'PUT', body: params });
}

// 删除应知卡
export async function deleteKnowItem(id) {
  return request(`${URL_PREFIX}/knowableCard/knowableCard/${id}`, { method: 'DELETE' });
}

// 获取应急卡列表
export async function getEmergencyList(params) {
  return request(`${URL_PREFIX}/emergencyCard/emergencyCard/page?${stringify(params)}`);
}

// 查看应急卡
export async function getEmergencyItem(id) {
  return request(`${URL_PREFIX}/emergencyCard/emergencyCard/${id}`);
}

// 添加应急卡
export async function addEmergencyItem(params) {
  return request(`${URL_PREFIX}/emergencyCard/emergencyCard`, { method: 'POST', body: params });
}

// 编辑应急卡
export async function editEmergencyItem(params) {
  return request(`${URL_PREFIX}/emergencyCard/emergencyCard`, { method: 'PUT', body: params });
}

// 删除应急卡
export async function deleteEmergencyItem(id) {
  return request(`${URL_PREFIX}/emergencyCard/emergencyCard/${id}`, { method: 'DELETE' });
}

// 风险告知卡列表
export async function getInformCards(params) {
  return request(`/acloud_new/v2/pointManage/hdLetterForPage?${stringify(params)}`);
}

// 风险分类
export async function getRiskTypes() {
  return request('/acloud_new/v2/pointManage/riskTypeDict');
}
