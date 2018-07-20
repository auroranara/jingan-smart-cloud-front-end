// import { stringify } from 'qs';
import request from '../utils/request';

export async function accountLogin(params) {
  return request('/acloud_new/v2/login/account', {
    method: 'POST',
    body: params,
  });
}
