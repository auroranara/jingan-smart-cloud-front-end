import request from '../utils/request';
import { stringify } from 'qs';
import moment from 'moment';

// 获取配电箱列表
export async function getDistributionBoxClassification(params) {
  return request(`/acloud_new/v2/deviceInfo/getCompanyDevicesByType?${stringify(params)}`);
}

// 获取配电箱当天监测数据
export async function getDistributionBoxTodayData(params) {
  return request(`/acloud_new/v2/deviceInfo/getDeviceDataHistory?${stringify({ ...params, queryDate: moment().startOf('day').format('YYYY/MM/DD HH:mm:ss'), historyDataType: 1 })}`);
}

// 获取配电箱历史报警统计
export async function getDistributionBoxAlarmCount(params) {
  return request(`/acloud_new/v2/sdgs/countHistoryIot?${stringify(params)}`);
}
