import request from '../utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/acloud_new/v2/login/currentUser');
}

export async function activationSendCode(params) {
  return request(`/acloud_new/v2/login/eye/register/sendCode?${stringify(params)}`)
}

export async function forgetSendCode(params) {
  return request(`/acloud_new/v2/login/eye/forget/sendCode?${stringify(params)}`)
}

export async function verifyCode(params) {
  return request(`/acloud_new/v2/login/eye/verifyCode?${stringify(params)}`)
}

export async function updatePwd(params) {
  return request('/acloud_new/v2/login/eye/updatePwd', {
    method: 'POST',
    body: params,
  })
}
