import { stringify } from 'qs';
import request from 'utils/request';

const URL_PREFIX = '/acloud_new/v2/video';

// 获取地图信息统计
export async function queryMapCount(params) {
  return request(`${URL_PREFIX}/index/info?${stringify(params)}`, {
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
  // return request('/eye/api/index/video/location', {
  return request(`${URL_PREFIX}/index/location`, {
    method: 'GET',
  });
}

// 获取视频播放地址
export async function queryVideoUrl(params) {
  // return request(`/eye/api/videos/startToPlay?${stringify(params)}`, {
  return request(`${URL_PREFIX}/operate/web/play?${stringify(params)}`, {
    method: 'GET',
  });
}

// 获取网格点区域
export async function fetchGridPoints(params) {
  return request(`/acloud_new/v2/gridInfo/getMapLocation?${stringify(params)}`)
}

// 添加/编辑网格点
export async function updateGridPoints(params) {
  return request('/acloud_new/v2/gridInfo/updateMapLocation', {
    method: 'POST',
    body: params,
  })
}
