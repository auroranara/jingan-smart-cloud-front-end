import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

// 到期提醒数量
export async function queryPastStatusCount(params) {
  return request(`${URL_PREFIX}/ci/pastStatusCount/Count?${stringify(params)}`);
}

// 统计监测对象各个类型的数量
export async function beMonitorTargetTypeCountDto(params) {
  return request(`${URL_PREFIX}/monitor/beMonitorTargetTypeCountDto/list?${stringify(params)}`);
}

// 两重点一重大的数量
export async function countDangerSource(params) {
  return request(`${URL_PREFIX}/ci/sfcc/countDangerSource?${stringify(params)}`);
}

// app储罐列表
export async function getTankList(params) {
  return request(`${URL_PREFIX}/ci/tank/tank/pageForMobile?${stringify(params)}`);
}

// 风险点列表
export async function riskPointForPage(params) {
  return request(`${URL_PREFIX}/pointManage/riskPointForPage?${stringify(params)}`);
}

// 监测设备列表
export async function monitorEquipment(params) {
  return request(`${URL_PREFIX}/monitor/monitorEquipment/page?${stringify(params)}`);
}
