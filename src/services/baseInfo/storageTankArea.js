import { stringify } from 'qs';
import request from '@/utils/request';

// 获取储罐区列表
export async function fetchStorageTankAreaForPage (params) {
  return request(`/acloud_new/v2/ci/tankArea/tankArea/page?${stringify(params)}`)
}
