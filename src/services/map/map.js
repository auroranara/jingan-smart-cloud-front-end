import { stringify } from 'qs';
import request from '../../utils/request';

// 获取地图信息统计
export async function queryMapCount(params) {
  return request(`/eye/api/index/info?${stringify(params)}`, {
    method: 'GET',
  });
}

// 获取周围用户
export async function queryAroundUsers(params) {
  return request(`/eye/api/index/user/location?${stringify(params)}`, {
    method: 'GET',
  });
}

// 获取周围的视频资源
export async function queryAroundVideos() {
  return request('/eye/api/index/video/location', {
    method: 'GET',
  });
}

// 获取视频播放地址
export async function queryVideoUrl(params) {
  return request(`/eye/api/videos/startToPlay?${stringify(params)}`, {
    method: 'GET',
  });
}
