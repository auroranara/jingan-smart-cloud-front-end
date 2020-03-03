import { stringify } from 'qs';
import request from '../../utils/request';

const URL_PREFIX = '/acloud_new/v2/emergency';

/** 应急队伍 */

// 列表
export async function querEmergTeamList(params) {
  return request(`${URL_PREFIX}/emergencyTream/page?${stringify(params)}`);
}

// 详情
export async function queryEmergTeamView({ id }) {
  return request(`${URL_PREFIX}/emergencyTream/${id}`);
}

// 新增
export async function queryEmergTeamAdd(params) {
  return request(`${URL_PREFIX}/emergencyTream`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryEmergTeamEdit(params) {
  return request(`${URL_PREFIX}/emergencyTream`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryEmergTeamDel({ id }) {
  return request(`${URL_PREFIX}/emergencyTream/${id}`, {
    method: 'DELETE',
  });
}

// 查看队伍人员列表
export async function querTeamPersonList(params) {
  return request(`${URL_PREFIX}/emergencyTreamPer/page?${stringify(params)}`);
}

// 查看队伍人员详情
export async function queryTeamPersonView({ id }) {
  return request(`${URL_PREFIX}/emergencyTreamPer/${id}`);
}

// 新增队伍人员
export async function queryTeamPersonAdd(params) {
  return request(`${URL_PREFIX}/emergencyTreamPer`, {
    method: 'POST',
    body: params,
  });
}

// 编辑队伍人员
export async function queryTeamPersonEdit(params) {
  return request(`${URL_PREFIX}/emergencyTreamPer`, {
    method: 'PUT',
    body: params,
  });
}

// 删除队伍人员
export async function queryTeamPersonDel({ id }) {
  return request(`${URL_PREFIX}/emergencyTreamPer/${id}`, {
    method: 'DELETE',
  });
}
