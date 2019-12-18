import request from '@/utils/request';
import { stringify } from 'qs';

// 获取存储介质列表
export async function getStorageMediumList(params) {
  return request(`/acloud_new/v2/materialInfo/list?${stringify(params)}`);
}

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/ci/gasHolderManage/gasholderManage/page?${stringify(params)}`);
}

// 获取详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/ci/gasHolderManage/gasholderManage/${id}`);
}

// 新增
export async function add(params) {
  return request(`/acloud_new/v2/ci/gasHolderManage/gasholderManage`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function edit(params) {
  return request(`/acloud_new/v2/ci/gasHolderManage/gasholderManage`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function remove({ id }) {
  return request(`/acloud_new/v2/ci/gasHolderManage/gasholderManage/${id}`, {
    method: 'DELETE',
  });
}

// 获取监测设备列表
export async function getMonitorDeviceList(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/page?${stringify(params)}`);
}

// 设置监测设备绑定状态
export async function setMonitorDeviceBindStatus(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/bind`, {
    method: 'POST',
    body: params,
  });
}
