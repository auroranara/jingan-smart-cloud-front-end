import request from '../../utils/request';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

export async function queryOvAlarmCounts(params) {
  return request(`${URL_PREFIX}/fireManage/fireProcessCount?${stringify(params)}`);
}

export async function queryOvDangerCounts(params) {
  return request(`${URL_PREFIX}/sfg/listForMap.json?${stringify(params)}`);
}

export async function queryCompanyOv(params) {
  return request(`${URL_PREFIX}/sfc/companyMessage.json?${stringify(params)}`);
}

export async function queryAlarm(params) {
  return request(`${URL_PREFIX}/automaticFireAlarmSystem/getFireInfo?${stringify(params)}`);
}

export async function querySys() {
  return request(`${URL_PREFIX}/baseInfo/systemAccess`);
}

export async function queryFireTrend(params) {
  return request(`${URL_PREFIX}/fireManage/fireProcessTrend?${stringify(params)}`);
}

export async function queryDanger(params) {
  return request(`${URL_PREFIX}//hdfg/hiddenDangerMap.json?${stringify(params)}`);
}

export async function getCompanyFireInfo() {
  return request(`${URL_PREFIX}/automaticFireAlarmSystem/getCompanyFireInfo`);
}

export async function queryAlarmHandle({ id, companyId }) {
  return request(
    `${URL_PREFIX}/fireManage/fireProcess/${id}/proceHistory?${stringify({ companyId })}`
  );
}

export async function queryLookUp() {
  return request(`${URL_PREFIX}/screenShowData/inspectionRecords`);
}

export async function queryOffGuard(params) {
  return request(`${URL_PREFIX}/screenShowData/companyResponse?${stringify(params)}`);
}
