// import { stringify } from 'qs';
import request from '../../utils/request';

const URL_PREFIX = '/mock/28/acloud_new/v2/safety';
// const URL_PREFIX = '/acloud_new/v2/safety';

export async function queryDetail(companyId) {
  return request(`${URL_PREFIX}/${companyId}`)
}

export async function putDetail({ companyId, formValues }) {
  return request(`${URL_PREFIX}/${companyId}`, {
    method: 'PUT',
    body: formValues,
  });
}
