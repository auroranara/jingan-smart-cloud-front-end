import request from '../utils/request';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

// 风险点企业列表
export async function queryRiskCompanyList(params) {
  return request(`${URL_PREFIX}/pointManage/riskPointCompanyForPage?${stringify(params)}`);
}

// 风险点列表
export async function queryRiskPointList(params) {
  return request(`${URL_PREFIX}/pointManage/riskPointForPage?${stringify(params)}`);
}

// 风险点统计-检查周期
export async function queryRiskPointCount(params) {
  return request(`${URL_PREFIX}/pointManage/riskPointCheckCycleCount?${stringify(params)}`);
}

// 获取lec字典
export async function queryLecDict(params) {
  return request(`${URL_PREFIX}/pointManage/lecDict?${stringify(params)}`);
}

// 获取LEC计算后的风险等级
export async function queryCountLevel(params) {
  return request(`${URL_PREFIX}/pointManage/countLevel?${stringify(params)}`);
}

// 风险评级保存
export async function queryAssessLevel(params) {
  return request(`${URL_PREFIX}/pointManage/assessLevel`, {
    method: 'POST',
    body: params,
  });
}

// 获取标签列表
export async function queryLabelDict(params) {
  return request(`${URL_PREFIX}/pointManage/labelDict?${stringify(params)}`);
}

// 风险点定位信息重置
export async function queryResetPoint(params) {
  return request(`${URL_PREFIX}/pointManage/resetFixInfo?${stringify(params)}`);
}

// 风险点新增
export async function queryRiskPointAdd(params) {
  return request(`${URL_PREFIX}/pointManage/riskPoint`, {
    method: 'POST',
    body: params,
  });
}

// 风险点编辑
export async function updateRiskPoint(params) {
  return request(`/acloud_new/v2/pointManage/riskPoint`, {
    method: 'PUT',
    body: params,
  });
}

// 风险点详情
export async function queryRiskPointDetail({ id }) {
  return request(`${URL_PREFIX}/pointManage/riskPoint/${id}`);
}

// 风险点删除
export async function deleteRiskPoint({ ids }) {
  return request(`/acloud_new/v2/pointManage/point/${ids}`, {
    method: 'DELETE',
  });
}

// 图片选择
export async function queryFixImgInfo(params) {
  return request(`${URL_PREFIX}/pointManage/fixImgInfo?${stringify(params)}`);
}

// 获取系统推荐检查周期
export async function queryCheckCycle(params) {
  return request(`${URL_PREFIX}/pointManage/sysCheckCycle?${stringify(params)}`);
}

// 风险告知卡列表
export async function queryRiskCardList(params) {
  return request(`${URL_PREFIX}/pointManage/hdLetterForPage?${stringify(params)}`);
}

// 获取风险分类字典
export async function queryRiskTypeDict(params) {
  return request(`${URL_PREFIX}/pointManage/riskTypeDict?${stringify(params)}`);
}

// 获取易导致的事故类型字典
export async function queryAccidentTypeDict(params) {
  return request(`${URL_PREFIX}/pointManage/accidentTypeDict?${stringify(params)}`);
}

// 获取风险标志字典
export async function queryWarningSignDict(params) {
  return request(`${URL_PREFIX}/pointManage/warningSignDict?${stringify(params)}`);
}

// 风险告知卡新增
export async function queryHdLetterAdd(params) {
  return request(`${URL_PREFIX}/pointManage/hdLetter`, {
    method: 'POST',
    body: params,
  });
}

// 风险告知卡编辑
export async function updateHdLetter(params) {
  return request(`/acloud_new/v2/pointManage/hdLetter`, {
    method: 'PUT',
    body: params,
  });
}

// 风险告知卡详情
export async function queryHdLetterDetail({ id }) {
  return request(`${URL_PREFIX}/pointManage/hdLetter/${id}`);
}

// 风险告知卡删除
export async function deleteHdLetter({ ids }) {
  return request(`/acloud_new/v2/pointManage/hdLetter/${ids}`, {
    method: 'DELETE',
  });
}

// 风险告知卡预览数据
export async function queryShowLetter({ id }) {
  return request(`${URL_PREFIX}/pointManage/showLetter/${id}`);
}

// 获取行业类别字典
export async function queryIndustryDict(params) {
  return request(`${URL_PREFIX}/pointManage/industryDict?${stringify(params)}`);
}
