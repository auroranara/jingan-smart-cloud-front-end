import request from '../utils/request';
import { stringify } from 'qs';

// const URL_PREFIX = '/mock/28/acloud_new/v2/baseInfo';
const URL_PREFIX = '/acloud_new/v2';

// 新增视频设备信息
export async function addVideoDevice({ companyId, ...params }) {
  return request(`${URL_PREFIX}/videoDevice/company/${companyId}/videoDevice`, {
    method: 'POST',
    body: { companyId, ...params },
  });
}

// 修改视频设备信息
export async function updateVideoDevice({ companyId, videoId, ...params }) {
  return request(`${URL_PREFIX}/videoDevice/company/${companyId}/videoDevice/${videoId}`, {
    method: 'PUT',
    body: { companyId, videoId, ...params },
  });
}

// 视频企业列表
export async function queryVideoCompaniesList(params) {
  return request(`${URL_PREFIX}/videoDevice/companies?${stringify(params)}`);
}

// 视频设备列表
export async function queryVideoList(params) {
  return request(
    `${URL_PREFIX}/videoDevice/company/${params.companyId}/videoList?${stringify(params)}`
  );
}

// 查詢设备詳情
export async function queryVideoDetail(videoId) {
  return request(`${URL_PREFIX}/videoDevice/company/videoDevice/${videoId}`);
}

/* 企业列表弹出框 */
export async function queryModelList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}
