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

// 登录页面获取footer信息
export async function fetchFooterInfo() {
  return request('/acloud_new/v2/pi/getIndexBottom');
}

// 多用户切换（右上角）
export async function changerUser(params) {
  return request(`/acloud_new/v2/rolePermission/user/changerUser/${params.id}`);
}

// 获取验证码
export async function getCode(params) {
  return request(`/acloud_new/v2/login/sendLoginCode?${stringify(params)}`);
}

// 手机号登陆
export async function loginByPhone(params) {
  return request(`/acloud_new/v2/login/checkVerifyCode?${stringify(params)}`);
}
