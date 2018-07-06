import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询合同列表 */
export async function queryContractList(params) {
  return request(`/acloud_new/v2/maintenanceBusiness/maintenanceContractForPage?${stringify(params)}`);
}

/* 查询合同详情 */
export async function queryContract({ id }) {
  return request(`/acloud_new/v2/maintenanceBusiness/maintenanceContract/${id}`);
}

/* 添加合同 */
export async function addContract(params) {
  return request(`/acloud_new/v2/maintenanceBusiness/maintenanceContract`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/* 编辑合同 */
export async function editContract(params) {
  return request(`/acloud_new/v2/maintenanceBusiness/maintenanceContract`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

/* 查询合同状态列表 */
export async function queryStatusList() {
  return request(`/acloud_new/v2/maintenanceBusiness/contractStatus`);
}

/* 查询维保单位列表 */
export async function queryMaintenanceList(params) {
  return request(`/acloud_new/v2/baseInfo/maintenanceCompanies.json?${stringify(params)}`);
}

/* 查询服务单位列表 */
export async function queryServiceList(params) {
  return request(`/acloud_new/v2/baseInfo/companies.json?${stringify(params)}`);
}

