import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

/* 查询企业 */
export async function queryCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/companies.json?${stringify(params)}`);
}

/* 删除企业 */
export async function deleteCompany({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`, {
    method: 'DELETE',
  });
}

/* 获取行业类别 */
export async function queryCompanyCategories() {
  return request(`/acloud_new/v2/baseInfo/company/categories`);
}

// 用户传输装置公司列表
export async function queryTransmissionDevice(params) {
  // return request(`/api/transmission_device_list?${stringify(params)}`);
  return request(`/acloud_new/api/transmission/companies?${stringify(params)}`);
}

// 用户传输装置公司详情
export async function queryTransmissionDeviceDetail(params) {
  return request(`/api/transmission_device_detail?${stringify(params)}`);
}

// 维保单位列表
export async function queryMaintenanceCompanies(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies.json?${stringify(params)}`);
}

// 查询维保单位列表
export async function queryMaintenanceCompany(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies.json?${stringify(params)}`);
}

// 删除维保单位
export async function deleteMaintenanceCompany(id) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies/${id}`, {
    method: 'DELETE',
  });
}

// 查看指定维保单位信息
export async function queryMaintenanceCompanyinfo(id) {
  return request(`acloud_new/v2/fireControl/maintenanceCompanies/${id}.json`);
}
