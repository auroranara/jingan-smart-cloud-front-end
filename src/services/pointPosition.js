// import { stringify } from 'qs';
import request from '../utils/request';

// 根据主机id获取主机详情
export async function queryHostDetail(hostId) {
  return request(`/acloud_new/v2/fireControl/company/host/${hostId}`);
}
