import { stringify } from 'qs';
import request from '@/utils/request';

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/dangerSource/list?${stringify(params)}`);
}

// 获取详情
export async function getDetail(params) {
  return request(`/acloud_new/v2/dangerSource/list?${stringify(params)}`);
}

// 获取可燃气体监测点列表
export async function getCombustibleGasPointList(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/page?${stringify(params)}`);
}

// 获取有毒气体监测点列表
export async function getToxicGasPointList(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/page?${stringify(params)}`);
}

// 获取视频监控点列表
export async function getVideoPointList({ companyId }) {
  return request(`/acloud_new/v2/videoDevice/company/${companyId}/videoList`);
}

// 获取头部统计
export async function getCount({ id }) {
  return request(`/acloud_new/v2/dangerSource/${id}/detail/title`);
}

// 获取存储单元列表
export async function getLocationList(params) {
  return request(`/acloud_new/v2/monitor/beMonitorTarget/page?${stringify(params)}`);
}

// 获取存储单元统计
export async function getLocationCount(params) {
  return request(`/acloud_new/v2/monitor/target/count?${stringify(params)}`);
}

// 获取监测报警统计
export async function getAlarmCount(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/count?${stringify(params)}`);
}

// 获取罐区监测列表
export async function getTankAreaMonitorList(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/list?${stringify(params)}`);
}

// 获取安防措施列表
export async function getSecurityList(params) {
  return request(`/acloud_new/v2/msds/list?${stringify(params)}`);
}

// 获取周边环境列表
export async function getSurroundingList(params) {
  return request(
    `/acloud_new/v2/surroundEnvironment/surroundEnvironment/page?${stringify(params)}`
  );
}

// 获取报警消息列表
export async function getAlarmMessageList(params) {
  return request(`/acloud_new/v2/monitor/sensorStatusHistory/list?${stringify(params)}`);
}
