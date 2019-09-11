import { stringify } from 'qs';
import request from '@/utils/request';

const URL_PREFIX = '/acloud_new/v2/iot';
const URL_REPAIR = '/acloud_new/v2'
const URL_WH = '/acloud_new/v2/wh'

// 公司列表
export async function queryCompanies(params) {
  return request(`${URL_PREFIX}/companyList?${stringify(params)}`);
}

// 数据分析
export async function queryData(params) {
  return request(`${URL_PREFIX}/iotInfoForPage?${stringify(params)}`);
}

// 导出
export async function queryExport(params) {
  // console.log('fetch export...');
  return request(`${URL_PREFIX}/export?${stringify(params)}`);
}

// 获取企业名字
export async function getCompanyName(params) {
  return request(`${URL_PREFIX}/getCompanyName?${stringify(params)}`);
}

// 获取一键报修记录列表
export async function fetchRepairRecords(params) {
  return request(`${URL_REPAIR}/fireManage/selectFaultReport?${stringify(params)}`);
}

// 获取危险作业管理列表
export async function fetchWorkApprovalList(params) {
  return request(`${URL_WH}/eightJob/queryEightJobList?${stringify(params)}`)
}

// 获取危险作业管理详情
export async function fetchWorkApprovalDetail(params) {
  return request(`${URL_WH}/eightJob/detailEightJob/${params.id}`)
}

// 获取审批状态列表
export async function fetchApprovalStatus() {
  return request(`${URL_REPAIR}/eightJob/approveStatusList`)
}

// 获取作业级别列表
export async function fetchJobLevel(params) {
  return request(`${URL_REPAIR}/eightJob/jobLevelList?${stringify(params)}`)
}

// 获取危险化学品/供货方单位
export async function fetchDangerChemicals(params) {
  return request(`${URL_REPAIR}/mobile/getCerItemsList.json?${stringify(params)}`)
}
