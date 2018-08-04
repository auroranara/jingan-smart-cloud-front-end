import { stringify } from 'qs';
import request from '../utils/request';

export async function accountLogin(params) {
  return request('/acloud_new/v2/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function accountLoginGsafe(params) {
  return request('/gsafe/loginV1.do', {
    method: 'POST',
    body: params,
  });
}

// 校验旧密码
export async function checkOldPass(params) {
  return request(`/acloud_new/v2/rolePermission/user/checkPwd?${stringify(params)}`);
}

// 个人中心修改密码
export async function changePass(params) {
  return request('/acloud_new/v2/rolePermission/user/resetPwd', {
    method: 'POST',
    body: params,
  });
}

export async function testGssafe(params) {
  return request(`/gsafe/console/`);
}
