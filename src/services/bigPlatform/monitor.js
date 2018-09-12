import request from '../../utils/request';
import { stringify } from 'qs';

// 获取传感器历史
export async function getGsmsHstData(params) {
  return request(`/acloud_new/v2/monitor/getGsmsHstData.json?${stringify(params)}`);
}

// 获取上下线的区块
export async function getPieces(params) {
  return request(`/acloud_new/v2/monitor/getPieces.json?${stringify(params)}`);
}
