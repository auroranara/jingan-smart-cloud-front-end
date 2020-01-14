import request from '@/utils/request';
import { stringify } from 'qs';

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/fireManage/process/page?${stringify(params)}`);
}

// 获取消息列表
export async function getMessageList(params) {
  return request(`/acloud_new/v2/monitor/sensorProblemLog/page?${stringify(params)}`);
}

// 获取详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/fireManage/process/${id}`);
}

// 获取设备详情
export async function getDeviceDetail({ id }) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/${id}`);
}

// 获取监测趋势
export async function getMonitorTrend(params) {
  return request(`/acloud_new/v2/monitor/history/date?${stringify(params)}`);
}
