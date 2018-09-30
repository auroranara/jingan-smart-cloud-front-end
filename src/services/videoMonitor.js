import request from '../utils/request';
import { stringify } from 'qs';

// const URL_PREFIX = '/mock/28/acloud_new/v2/baseInfo';
const URL_PREFIX = '/acloud_new/v2';

// 新增视频设备信息
export async function addVideoDevice({ companyId, ...params }) {
  return request(`${URL_PREFIX}/vedioDevice/company/${companyId}/vedioDevice`, {
    method: 'POST',
    body: { companyId, ...params },
  });
}

// 修改视频设备信息
export async function updateVideoDevice({ companyId, vedioId, ...params }) {
  return request(`${URL_PREFIX}/vedioDevice/company/${companyId}/vedioDevice/${vedioId}`, {
    method: 'PUT',
    body: { companyId, vedioId, ...params },
  });
}

// 视频企业列表
export async function queryVideoCompaniesList(params) {
  return request(`${URL_PREFIX}/vedioDevice/companies?${stringify(params)}`);
}

// 视频设备列表
export async function queryVideoList(params) {
  return request(
    `${URL_PREFIX}/vedioDevice/company/${params.companyId}/vedioList?${stringify(params)}`
  );
}

// 查詢设备詳情
export async function queryVideoDetail(vedioId) {
  return request(`${URL_PREFIX}/vedioDevice/company/vedioDevice/${vedioId}`);
}
