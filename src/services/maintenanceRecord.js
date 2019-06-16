import { stringify } from 'qs';
import request from '../utils/request';

/* 运维巡检记录列表*/
export async function queryMaintenanceCheck(params) {
  return request(
    `/acloud_new/v2/maintenanceCheck/maintenanceCheckRecordForPage?${stringify(params)}`
  );
}

/* 获取运维巡检记录详情*/
export async function queryMaintenanceRecordDetail({ id }) {
  return request(`/acloud_new/v2/maintenanceCheck/maintenanceCheckRecord/${id}`);
}
