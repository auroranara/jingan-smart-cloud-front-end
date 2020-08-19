import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取企业列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}

/* 获取风险区域列表 */
export async function getAreaList(params) {
  return request(`/acloud_new/v2/riskArea/riskArea/page?${stringify(params)}`);
}

/* 获取风险分区列表 */
export async function getList(params) {
  return request(`/acloud_new/v2/ci/zone/zoneForPage?${stringify(params)}`);
}

/* 获取地图数据 */
export async function getMap(params) {
  return request(`/acloud_new/v2/ThreedMap/threedMap?${stringify(params)}`);
}

/* 获取风险分区详情 */
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/ci/zone/zone/${id}`);
}

/* 新增风险分区 */
export async function add(body) {
  return request(`/acloud_new/v2/ci/zone/zone`, {
    method: 'POST',
    body,
  });
}

/* 编辑风险分区 */
export async function edit(body) {
  return request(`/acloud_new/v2/ci/zone/zone`, {
    method: 'PUT',
    body,
  });
}

/* 删除风险分区 */
export async function remove({ ids }) {
  return request(`/acloud_new/v2/ci/zone/zone/${ids}`, {
    method: 'DELETE',
  });
}
