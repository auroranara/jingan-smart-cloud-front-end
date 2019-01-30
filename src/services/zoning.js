import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

// 获取区域信息
export async function getZone(params) {
  return request(`/acloud_new/v2/sfg/getProjectName.json?${stringify(params)}`);
}
