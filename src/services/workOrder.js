import { stringify } from 'qs';
import request from '@/utils/request';

export async function getList(params) {
  return request(`/acloud_new/v2/fireManage/process/page?${stringify(params)}`);
}

// 获取详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/fireManage/process/${id}`);
}

// 获取消息列表
export async function getMessageList(params) {
  return request(`/acloud_new/v2/monitor/sensorProblemLog/page?${stringify(params)}`);
}
