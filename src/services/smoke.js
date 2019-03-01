import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

// 大屏主页面显示
export async function getBigFlatformData(params) {
  return request(`${URL_PREFIX}/smoke/index?${stringify(params)}`);
}

// 异常单位统计数据
export async function getUnNormalCount(params) {
  return request(`${URL_PREFIX}/smoke/unNormalCompanyCount?${stringify(params)}`);
}

// 烟感地图数据
export async function getMapList(params) {
  return request(`${URL_PREFIX}/smoke/mapList?${stringify(params)}`);
}

// 公司烟感具体监测数据
export async function getCompanySmokeInfo(params) {
  return request(`${URL_PREFIX}/smoke/companySmokeInfo?${stringify(params)}`);
}

// 接入单位统计抽屉
export async function getImportingTotal(params) {
  return request(`${URL_PREFIX}/smoke/importing?${stringify(params)}`);
}

// 异常单位统计抽屉
export async function getAbnormalingTotal(params) {
  return request(`${URL_PREFIX}/smoke/abnormaling?${stringify(params)}`);
}

// 火警统计抽屉
export async function getFireHistory(params) {
  return request(`${URL_PREFIX}/shs/fireHistory?${stringify(params)}`);
}

// 传感器品牌故障统计
export async function getFaultByBrand(params) {
  return request(`${URL_PREFIX}/shs/countFaultByBrand?${stringify(params)}`);
}

// 获取告警信息列表
export async function getMessages(params) {
  return request(`${URL_PREFIX}/screen/screenMessageForGov?screenType=4`);
}

// 获取单位数据
export async function getUnitData(params) {
  return request(`${URL_PREFIX}/screen/elecSafe/companyList`);
}

// 视频列表
export async function getCameraList(params) {
  return request(`${URL_PREFIX}/hdf/getAllCamera.json?${stringify(params)}`);
}

// 报警处理流程
export async function getSmokeForMaintenance(params) {
  return request(`${URL_PREFIX}/shs/getSmokeForMaintenance?${stringify(params)}`);
}
