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

// 视频
export async function getAllCamera(params) {
  return request(`${URL_PREFIX}/hdf/getAllCamera.json?${stringify(params)}`);
}

// 视频
export async function getStartToPlay(params) {
  return request(`/acloud_new/dai/startToPlayForWeb.json?${stringify(params)}`);
}

export async function queryAlarmHandle({ id }) {
  // console.log('fetch handleAlarm');
  return request(`${URL_PREFIX}/fireManage/fireProcess/${id}/proceHistory`);
}

export async function queryLookUp() {
  return request(`${URL_PREFIX}/screenShowData/inspectionRecords`);
}

export async function queryCountdown() {
  return request(`${URL_PREFIX}/screenShowData/countDown`);
}

export async function postLookingUp() {
  return request(`${URL_PREFIX}/screenShowData/inspectionRecords`, { method: 'POST' });
}

export async function queryOffGuard(params) {
  return request(`${URL_PREFIX}/screenShowData/companyResponse?${stringify(params)}`);
}

/************************************** 单位消防 *********************************************** */
/**
 * 获取待处理信息
 */
export async function getPendingInfo(params) {
  return request(`/acloud_new/v2/fireData/dangerMessage.json?${stringify(params)}`);
}

/**
 * 获取待处理火警和待处理故障数量
 */
export async function getPendingNumber(params) {
  return request(`/acloud_new/v2/fireData/countPendingDanger.json?${stringify(params)}`);
}

/**
 * 超期未整改隐患数量
 */
export async function getOutOfDateNumber(params) {
  const props = {
    start: 0,
    end: 0,
    pageSize: 1,
    _status: 7,
    ...params,
  };
  return request(`/acloud_new/v2/hdf/list.json?${stringify(props)}`);
}

/**
 * 获取待整改隐患数量
 */
export async function getToBeRectifiedNumber(params) {
  const props = {
    start: 0,
    end: 0,
    pageSize: 1,
    _status: 2,
    ...params,
  };
  return request(`/acloud_new/v2/hdf/list.json?${stringify(props)}`);
}

/**
 * 获取待巡查任务数量
 */
export async function getToBeInspectedNumber(params) {
  const props = {
    start: 0,
    end: 0,
    pageSize: 1,
    taskStatus: 0,
    ...params,
  };
  return request(`/acloud_new/v2/hdf/listTask.json?${stringify(props)}`);
}

/**
 * 获取火灾报警系统
 */
export async function getFireAlarmSystem(params) {
  return request(`/acloud_new/v2/fireData/countDanger.json?${stringify(params)}`);
}

/**
 * 获取隐患巡查记录
 */
export async function getHiddenDangerRecords(params) {
  return request(`/acloud_new/v2/sfc/hiddenDangerList.json?${stringify(params)}`);
}

/**
 * 获取消防数据统计
 */
export async function getFireControlCount(params) {
  return request(`/acloud_new/v2/fireData/dangerChart.json?${stringify(params)}`);
}

/**
 * 获取隐患巡查统计
 */
export async function getHiddenDangerCount(params) {
  return request(`/acloud_new/v2/hdf/gov/newHomePage.json?${stringify(params)}`);
}

/**
 * 获取维保情况统计
 */
export async function getMaintenanceCount(params) {
  return request(`/acloud_new/v2/fireManage/faultScreen?${stringify(params)}`);
}

/**
 * 获取复位主机
 */
export async function getHosts(params) {
  return request(`/acloud_new/v2/fireData/getMainEngine.json?${stringify(params)}`);
}

/**
 * 复位单个主机
 */
export async function resetSingleHost(params) {
  return request(`/acloud_new/v2/fireData/recoveryMessage.json?${stringify(params)}`);
}

/**
 * 复位所有主机
 */
export async function resetAllHosts(params) {
  return request(`/acloud_new/v2/fireData/recoveryAllMessage.json?${stringify(params)}`);
}

/**
 * 获取视频列表
 */
export async function getVideoList(params) {
  return request(`/acloud_new/v2/hdf/getAllCamera.json?${stringify(params)}`);
}
