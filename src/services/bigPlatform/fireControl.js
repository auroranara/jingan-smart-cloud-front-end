import request from '../../utils/request';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

export async function queryOvAlarmCounts() {
  return request(`${URL_PREFIX}/fireManage/fireProcessCount`);
}

export async function queryOvDangerCounts() {
  return request(`${URL_PREFIX}/sfg/listForMap.json`);
}

export async function queryAlarm(params) {
  return request(`${URL_PREFIX}/automaticFireAlarmSystem/getFireInfo?${stringify(params)}`);
}

export async function querySys() {
  return request(`${URL_PREFIX}/baseInfo/systemAccess`);
}

export async function queryFireTrend() {
  return request(`${URL_PREFIX}/fireManage/fireProcessTrend`);
}

export async function queryDanger() {
  return request(`${URL_PREFIX}//hdfg/hiddenDangerMap.json`);
}

export async function getCompanyFireInfo() {
  return request(`${URL_PREFIX}/automaticFireAlarmSystem/getCompanyFireInfo`);
}


/************************************** 单位消防 *********************************************** */
/**
 * 获取待处理信息
 */
export async function getPendingInfo(params) {
  return request(`/acloud_new/v2/fireData/dangerMessage.json?${Math.random()}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取待处理火警和待处理故障数量
 */
export async function getPendingNumber(params) {
  return request(`/acloud_new/v2/fireData/countPendingDanger.json?${Math.random()}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 超期未整改隐患数量
 */
export async function getOutOfDateNumber(params) {
  return request(`/acloud_new/v2/hdf/list.json?${Math.random()}`, {
    method: 'POST',
    body: {
      start: 0,
      end: 0,
      pageSize: 1,
      _status: 2,
      ...params,
    },
  });
}

/**
 * 获取待整改隐患数量
 */
export async function getToBeRectifiedNumber(params) {
  return request(`/acloud_new/v2/hdf/list.json?${Math.random()}`, {
    method: 'POST',
    body: {
      start: 0,
      end: 0,
      pageSize: 1,
      _status: 7,
      ...params,
    },
  });
}

/**
 * 获取待维保任务数量（注：未完成，需变更）
 */
export async function getToBeMaintainedNumber(params) {
  return request(`/acloud_new/v2/hdf/list.json?${Math.random()}`, {
    method: 'POST',
    body: {
      start: 0,
      end: 0,
      pageSize: 1,
      _status: 1,
      ...params,
    },
  });
}

/**
 * 获取待巡查任务数量
 */
export async function getToBeInspectedNumber(params) {
  return request(`/acloud_new/v2/hdf/listTask.json?${Math.random()}`, {
    method: 'POST',
    body: {
      start: 0,
      end: 0,
      pageSize: 1,
      taskStatus: 0,
      ...params,
    },
  });
}

/**
 * 获取火灾报警系统
 */
export async function getFireAlarmSystem(params) {
  return request(`/acloud_new/v2/fireData/countDanger.json?${Math.random()}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取隐患巡查记录
 */
export async function getHiddenDangerRecords(params) {
  return request(`/acloud_new/v2/hdf/dangerList.json`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取消防数据统计
 */
export async function getFireControlCount(params) {
  return request(`/acloud_new/v2/fireData/dangerChart.json?${Math.random()}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取隐患巡查统计
 */
export async function getHiddenDangerCount(params) {
  return request(`/acloud_new/v2/hdf/gov/newHomePage.json`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取维保情况统计
 */
export async function getMaintenanceCount(params) {
  return request(`/acloud_new/v2/fireManage/faultScreen?${stringify(params)}`);
}
