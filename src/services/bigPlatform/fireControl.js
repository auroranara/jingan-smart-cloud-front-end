import request from '../../utils/cockpitRequest';
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

export async function querySys(params) {
  return request(`${URL_PREFIX}/baseInfo/systemAccess?${stringify(params)}`);
}

export async function queryFireTrend(params) {
  return request(`${URL_PREFIX}/fireManage/fireProcessTrend?${stringify(params)}`);
}

export async function queryDanger(params) {
  return request(`${URL_PREFIX}/hdfg/hiddenDangerMap.json?${stringify(params)}`);
}

// 获取隐患企业列表
export async function queryDangerList(params) {
  return request(`/acloud_new/v2/sfg/hiddenDangerList.json?${stringify(params)}`);
}

export async function getCompanyFireInfo(params) {
  return request(`${URL_PREFIX}/automaticFireAlarmSystem/getCompanyFireInfo?${stringify(params)}`);
}

// 视频列表
export async function getAllCamera(params) {
  return request(`${URL_PREFIX}/hdf/getAllCamera.json?${stringify(params)}`);
}

// 视频播放，已转移到services.videoPlay
// export async function getStartToPlay(params) {
//   return request(`/acloud_new/dai/startToPlayForWeb.json?${stringify(params)}`);
// }

export async function queryAlarmHandle({ id, gridId }) {
  // console.log('fetch handleAlarm');
  return request(
    `${URL_PREFIX}/fireManage/fireProcess/${id}/proceHistory?${stringify({ gridId })}`
  );
}

export async function queryLookUp(params) {
  return request(`${URL_PREFIX}/screenShowData/inspectionRecords?${stringify(params)}`);
}

export async function queryCountdown(params) {
  return request(`${URL_PREFIX}/screenShowData/countDown?${stringify(params)}`);
}

export async function postLookingUp(params) {
  return request(`${URL_PREFIX}/screenShowData/inspectionRecords?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function queryOffGuard(params) {
  return request(`${URL_PREFIX}/screenShowData/companyResponse?${stringify(params)}`);
}

export async function warnOffGuard(params) {
  return request(`${URL_PREFIX}/screenShowData/inspectionRecordsAlert?${stringify(params)}`);
}

// 获取网格区域
export async function getMapLocation(params) {
  return request(`${URL_PREFIX}/gridInfo/getMapLocation?${stringify(params)}`);
}

// 获取网格列表
export async function getGrids(params) {
  return request(`${URL_PREFIX}/sfc/getGridData.json`);
}

// 获取风险点
export async function getRiskPoints(params) {
  return request(`${URL_PREFIX}/sfc/countDangerLocationForCompany.json?${stringify(params)}`);
}

// 获取安全人员
export async function getSafeMan(params) {
  return request(`${URL_PREFIX}/sfc/showSafePerson.json?${stringify(params)}`);
}

// 获取最近十二个月主机报警数量
export async function getHostAlarmTrend(params) {
  return request(`${URL_PREFIX}/automaticFireAlarmSystem/getEveryMonthFireNum?${stringify(params)}`);
}

/************************************** 单位消防 ************************************************/
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
    businessType: 2,
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
    businessType: 2,
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

export async function getVideoLookUp(params) {
  return request(`${URL_PREFIX}/screenShowData/videoCheckRecords?${stringify(params)}`);
}

// 企业信息(包含人员数量四色图等)
export async function getCompanyMessage(params) {
  return request(`/acloud_new/v2/sfc/companyMessage.json?${stringify(params)}`);
}

// 视频路径
export async function getStartToPlay(params) {
  return request(`/acloud_new/dai/startToPlay?${stringify(params)}`);
}

// 获取风险点信息
export async function getRiskPointInfo(params) {
  return request(`/acloud_new/v2/sfc/selectCompanyLetter.json?${stringify(params)}`);
}

/**
 * 消防设施评分
 */
export async function getSystemScore(params) {
  return request(`${URL_PREFIX}/nanxiao/fire/systemScore?${stringify(params)}`);
}

/**
 * 获取当前隐患图表数据
 */
export async function fetchHiddenDangerNum(params) {
  return request(`/acloud_new/v2/nanxiao/fire/getHiddenDangerNum?${stringify(params)}`)
}
/**
 * 南消：点位巡查统计
 */
export async function getPointInspectionCount(params) {
  return request(`/acloud_new/v2/nanxiao/fire/getPointCheck?${stringify(params)}`);
}

/**
 * 南消：获取点位巡查列表
 */
export async function getPointInspectionList(params) {
  return request(`/acloud_new/v2/nanxiao/fire/getPointDetail?${stringify(params)}`);
}

/**
 * 南消：获取点位
 */
export async function getPointList(params) {
  return request(`/acloud_new/v2/nanxiao/fire/getPointLocation?${stringify(params)}`);
}

// 获取大屏消息
export async function getScreenMessage(params) {
  return request(`${URL_PREFIX}/nanxiao/fire/screenMessage?${stringify(params)}`);
}

/**
 * 检查点各状态数量
 */
export async function getCheckStatusCount(params) {
  return request(`/acloud_new/v2/sfm/getSelfCheckPointDataByCompanyId?${stringify(params)}`);
}

/**
 * 各检查点具体信息
 */
export async function getCheckDetail(params) {
  return request(`/acloud_new/v2/sfm/getSelfCheckPointData?${stringify(params)}`);
}

/**
 * 巡查点异常记录
 */
export async function getPonitRecord(params) {
  return request(`/acloud_new/v2/nanxiao/fire/getItemById?${stringify(params)}`);
}


/* 南消 */

// 动态火警详情列表
export async function queryAlarmHandleList({ companyId, dataId, ...rest }) {
  return request(`${URL_PREFIX}/mobileData/fireProcess/${companyId}/proceHistory/${dataId}?${stringify(rest)}`);
}

// 维保工单或维保动态详情
export async function queryWorkOrder(params) {
  return request(`${URL_PREFIX}/nanxiao/fire/getFaultForMaintenance?${stringify(params)}`);
}

// 获取火灾报警系统巡检记录
export async function fetchCheckRecord(params) {
  return request(`/acloud_new/v2/maintenanceCheck/getCheckRecordByType?${stringify(params)}`)
}

// 企业负责人和维保员信息
export async function queryCheckUsers(params) {
  return request(`/acloud_new/v2/maintenanceCheck/getCheckUsersForNanXiao?${stringify(params)}`);
}

// 故障列表
export async function queryFault(params) {
  return request(`${URL_PREFIX}/fireData/systemFaultMessage.json?${stringify(params)}`)
}

/**
 * 获取隐患详情
 */
export async function fetchHiddenDangerDetail({ id }) {
  return request(`/acloud_new/v2/hiddenDanger/hiddenDangerInfo/${id}`);
}
