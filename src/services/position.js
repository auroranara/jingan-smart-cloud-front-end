import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

// 获取历史轨迹数据
export async function getList(params) {
  return request(`/acloud_new/v2/location/historicalTrack?${stringify(params)}`);
}
