import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

// 获取区域信息
export async function getZone({ id }) {
  return request(`/acloud_new/v2/areaInfo/getMap/${id}`);
}

// 划分区域
export async function zoning(body) {
  return request('/acloud_new/v2/areaInfo/editRange', {
    method: 'PUT',
    body,
  });
}
