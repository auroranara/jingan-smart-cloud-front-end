import { stringify } from 'qs';
import request from '@/utils/request';

/* 查询当前用户权限下的企业列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}

/* 获取区域列表 */
export async function getAreaList(params) {
  return request(`/acloud_new/v2/baseInfo/city/new?${stringify(params)}`);
}

// 获取监测类型列表
export async function getMonitorTypeList(params) {
  return request(`/acloud_new/v2/monitor/equipmentType?${stringify(params)}`);
}

// 获取监测设备列表
export async function getMonitorEquipmentList(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/page?${stringify(params)}`);
}

// 设置监测设备绑定状态
export async function setMonitorEquipmentBindStatus(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/bind`, {
    method: 'POST',
    body: params,
  });
}

// 获取人员列表
export async function getPersonList(params) {
  return request(`/acloud_new/v2/rolePermission/user?${stringify(params)}`);
}

// 获取部门列表
export async function getDepartmentList(params) {
  return request(`/acloud_new/v2/sys/sysDepartment?${stringify(params)}`);
}

// 获取地图列表
export async function getMapList(params) {
  return request(`/acloud_new/v2/ThreedMap/threedMap?${stringify(params)}`);
}

// 获取承包商列表
export async function getContractorList(params) {
  return request(`/acloud_new/v2/safetyWork/contractor/page?${stringify(params)}`);
}

// 获取供应商列表
export async function getSupplierList(params) {
  return request(`/acloud_new/v2/safetyWork/supplier/page?${stringify(params)}`);
}

// 获取网格列表
export async function getGridList(params) {
  return request(`/acloud_new/v2/gridInfo/getTreeDataById?${stringify(params)}`);
}

// 获取网格人员列表
export async function getGridPersonList(params) {
  return request(`/acloud_new/v2/rectifyTeam/selectAllUserByGridId?${stringify(params)}`);
}

// 获取网格企业列表
export async function getGridCompanyList(params) {
  return request(`/acloud_new/v2/rectifyTeam/selectAllCompanyByGridId?${stringify(params)}`);
}

// 获取检查内容列表
export async function getExaminationContentList(params) {
  return request(`/acloud_new/v2/actInfo/dtoFlowList?${stringify(params)}`);
}

// 获取业务分类
export async function getBusinessTypeList(params) {
  return request(
    `/acloud_new/v2/lawsAndRegulations/lawsAndRegulations/options?${stringify(params)}`
  );
}

// 获取所属行业
export async function getIndustryList(params) {
  return request(`/acloud_new/v2/pointManage/industryDict?${stringify(params)}`);
}

// 获取流程列表
export async function getFlowList(params) {
  return request(`/acloud_new/v2/actInfo/dtoList.json?${stringify(params)}`);
}

// 获取专项整治组列表
export async function getSpecialRemediationSectionList(params) {
  return request(`/acloud_new/v2/rectifyTeam/rectifyTeam/page?${stringify(params)}`);
}

// 获取专项整治组详情
export async function getSpecialRemediationSectionDetail({ id }) {
  return request(`/acloud_new/v2/rectifyTeam/rectifyTeam/${id}`);
}

// 获取安全服务机构列表
export async function getSafetyServiceList(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies?${stringify(params)}`);
}

// 获取账号列表
export async function getAccountList(params) {
  return request(`/acloud_new/v2/rolePermission/users?${stringify(params)}`);
}

// 获取员工列表
export async function getEmployeeList(params) {
  return request(`/acloud_new/v2/education/examStudents?${stringify(params)}`);
}
