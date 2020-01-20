import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取列表 */
export async function getList(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/page?${stringify(params)}`);
}

/* 设置连接状态 */
export async function setSwitchStatus({ id, airSwitchStatus }) {
  return request(`/acloud_new/v2/monitor/airSwitch/${id}/${airSwitchStatus}`);
}

// 获取详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/${id}`);
}
