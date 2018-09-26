import request from '../utils/request';

// const URL_PREFIX = '/mock/28/acloud_new/v2/baseInfo';
const URL_PREFIX = '/acloud_new/v2';

// 新增视频设备信息
export async function addVideoDevice({ companyId }) {
  return request(`${URL_PREFIX}/fireControl/company/${companyId}/vedioDevice`, {
    method: 'POST',
    body: { companyId },
  });
}

// 修改视频设备信息
export async function updateVideoDevice({ companyId, vedioId, params }) {
  return request(`${URL_PREFIX}/fireControl/company/${companyId}/vedioDevice/${vedioId}`, {
    method: 'POST',
    body: params,
  });
}
