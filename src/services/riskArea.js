import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取企业列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}

/* 查询账号列表 */
export async function queryAccountList(params) {
  return request(`/acloud_new/v2/rolePermission/users?${stringify(params)}`);
}


/* 获取风险分区列表 */
export async function getList(params) {
  return request(`/acloud_new/v2/riskArea/riskArea/page?${stringify(params)}`);
}

/* 获取地图数据 */
export async function getMap(params) {
  return request(`/acloud_new/v2/ThreedMap/threedMap?${stringify(params)}`);
}

/* 获取风险分区详情 */
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/riskArea/riskArea/${id}`);
}

/* 新增风险分区 */
export async function add(body) {
  return request(`/acloud_new/v2/riskArea/riskArea`, {
    method: 'POST',
    body,
  });
}

/* 编辑风险分区 */
export async function edit(body) {
  return request(`/acloud_new/v2/riskArea/riskArea`, {
    method: 'PUT',
    body,
  });
}

/* 删除风险分区 */
export async function remove({ id }) {
  return request(`/acloud_new/v2/riskArea/riskArea/${id}`, {
    method: 'DELETE',
  });
}
