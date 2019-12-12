import request from '@/utils/request';
import { stringify } from 'qs';

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/ci/gasHolderManage/gasholderManage/page?${stringify(params)}`);
}

// 获取详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/ci/gasHolderManage/gasholderManage/${id}`);
}

// 获取监测趋势
export async function getMonitorTrend(params) {
  return request(`/acloud_new/v2/ci/gasHolderManage/gasholderManage/page?${stringify(params)}`);
}