import { stringify } from 'qs';
import request from 'utils/request';

// const URL_PREFIX = '/eye/api';
const URL_PREFIX = 'acloud_new/v2/video';

// 获取单位树
export async function queryFolderTree(params) {
  return request(`${URL_PREFIX}/api/folders?${stringify(params)}`);
}

// 获取视频列表(列表)
export async function queryVideoList(params) {
  return request(`${URL_PREFIX}/api/videosByFolder?${stringify(params)}`);
}

// 获取视频列表(树)
// export async function queryVideoTree(params) {
//   return request(`${URL_PREFIX}/videos/tree?${stringify(params)}`);
// }

// 获取视频详情
export async function queryVideoDetail(videoId) {
  return request(`${URL_PREFIX}/api/videoById?${stringify(videoId)}`);
}

// 新增系统管理员
// export async function bindVideo(params) {
//   return request(`${URL_PREFIX}/videos/tree`, {
//     method: 'POST',
//     body: {
//       ...params,
//     },
//   });
// }

// 获取视频播放地址
export async function queryVideoUrl(params) {
  return request(`${URL_PREFIX}/operate/web/play?${stringify(params)}`, {
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

// 获取企业列表（视频权限）
export async function fetchCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/eyeCompanyList?${stringify(params)}`)
}

// 获取企业下拉列表
export async function fetchCompanyOptions(params) {
  return request(`/acloud_new/v2/baseInfo/eyeCompanySelect?${stringify(params)}`)
}
