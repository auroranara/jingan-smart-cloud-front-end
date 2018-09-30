import request from '../../utils/request';

// const URL_PREFIX = '/mock/28/acloud_new/v2/baseInfo';
const URL_PREFIX = '/acloud_new/v2/baseInfo';

export async function queryMenus() {
  return request(`${URL_PREFIX}/safetySelectInfo`);
}

export async function queryDetail({ companyId }) {
  return request(`${URL_PREFIX}/company/${companyId}/safetyInfo`);
}

export async function putDetail({ companyId, formValues }) {
  return request(`${URL_PREFIX}/company/${companyId}/safetyInfo`, {
    method: 'PUT',
    body: formValues,
  });
}
