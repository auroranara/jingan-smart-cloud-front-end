import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/eye/api';

// 获取单位树
export async function queryFolderTree(params) {
  return request(`${URL_PREFIX}/folders?${stringify(params)}`);
}

// 获取视频列表(列表)
export async function queryVideoList(params) {
  return request(`${URL_PREFIX}/videos/list?${stringify(params)}`);
}

// 获取视频列表(树)
// export async function queryVideoTree(params) {
//   return request(`${URL_PREFIX}/videos/tree?${stringify(params)}`);
// }

// 获取视频详情
export async function queryVideoDetail({ id }) {
  return request(`${URL_PREFIX}/video/${id}`);
}

// 新增系统管理员
export async function bindVideo(params) {
  return request(`${URL_PREFIX}/videos/tree`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 获取视频播放地址
export async function queryVideoUrl(params) {
  return request(`${URL_PREFIX}/videos/startToPlay?${stringify(params)}`, {
    method: 'GET',
  });
}

// 视频树逐层获取数据
export async function fetchVideoTree(params) {
  return request(`/acloud_new/v2/video/api/getTree?${stringify(params) || ''}`)
}

// 保存视频权限
export async function bindVodeoPermission(params) {
  return request('/acloud_new/v2/video/api/bindVideo', {
    method: 'POST',
    body: params,
  })
}
