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
