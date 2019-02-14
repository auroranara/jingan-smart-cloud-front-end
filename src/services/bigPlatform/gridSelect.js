import request from '../../utils/cockpitRequest';
// import { stringify } from 'qs';

// 获取网格列表
export async function getGrids(params) {
  return request('/acloud_new/v2/sfc/getGridData.json');
}
