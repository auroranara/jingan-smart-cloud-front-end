import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

// 获取历史轨迹数据
export async function getList(params) {
  return request(`/acloud_new/v2/location/historicalTrack?${stringify(params)}`);
}

// 获取最近一次历史轨迹数据
export async function getLatest({ cardId }) {
  return request(`/acloud_new/v2/location/getRecentlyTrack/${cardId}`);
}

// 获取区域树
export async function getTree(params) {
  return request(`/acloud_new/v2/areaInfo/getScreenTree?${stringify(params)}`);
}
