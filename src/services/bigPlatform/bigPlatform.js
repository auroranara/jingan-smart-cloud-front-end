import request, { request1 } from '../../utils/cockpitRequest';
import { stringify } from 'qs';

// 政府大屏
// 获取平台名字
export async function getProjectName(params) {
  return request(`/acloud_new/v2/sfg/getProjectName.json?${stringify(params)}`);
}

// 获取地图中心点
export async function getLocationCenter(params) {
  return request(`/acloud_new/v2/sfg/getLocationCenter.json?${stringify(params)}`);
}

// 获取风险点总数
export async function getItemList(params) {
  return request(`/acloud_new/v2/sfg/report/itemList.json?${stringify(params)}`);
}

// 政府大屏风险统计
export async function getCountDangerLocation(params) {
  return request(`/acloud_new/v2/sfg/countDangerLocation.json?${stringify(params)}`);
}

// 地图坐标
export async function getLocation(params) {
  return request(`/acloud_new/v2/sfg/location.json?${stringify(params)}`);
}

// 大屏隐患点位等数据(1.0接口移入)
export async function getNewHomePage(params) {
  return request(`/acloud_new/v2/sfg/gov/newHomePage.json?${stringify(params)}`);
}

// 大屏隐患点位总数据(待检查已过期等)
export async function getListForMap(params) {
  return request(`/acloud_new/v2/sfg/listForMap.json?${stringify(params)}`);
}

// 大屏隐患点位等数据(1.0接口移入)
export async function getInfoByLocation(params) {
  return request(`/acloud_new/v2/sfg/infoByLocation.json?${stringify(params)}`);
}

// 查找重点和非重点单位
export async function getSearchAllCompany(params) {
  return request(`/acloud_new/v2/sfg/searchAllCompany.json?${stringify(params)}`);
}

// 政府专职人员列表
export async function getGovFulltimeWorkerList(params) {
  return request(`/acloud_new/v2/sfg/govFulltimeWorkerList.json?${stringify(params)}`);
}

// 政府专职人员列表
export async function getGovFulltimeWorkerListNew(params) {
  return request(`/acloud_new/v2/sfg/govFulltimeWorkerListNew.json?${stringify(params)}`);
}

// 获取超期未整改隐患企业列表
export async function getOverRectifyCompany(params) {
  return request(`/acloud_new/v2/sfg/overRectifyCompany.json?${stringify(params)}`);
}

// 查找重点单位
export async function getSearchImportantCompany(params) {
  return request(`/acloud_new/v2/sfg/searchImportantCompany.json?${stringify(params)}`);
}

// 风险点点击的具体信息
export async function getDangerLocationCompanyData(params) {
  return request(`/acloud_new/v2/sfg/dangerLocationCompanyData.json?${stringify(params)}`);
}

// 隐患单位数量以及具体信息
export async function getHiddenDangerCompany(params) {
  return request(`/acloud_new/v2/sfg/hiddenDangerCompany.json?${stringify(params)}`);
}

// 专职人员检查信息
export async function getCheckInfo(params) {
  return request(`/acloud_new/v2/sfg/checkInfo.json?${stringify(params)}`);
}

// 已超时单位信息
export async function getHiddenDangerOverTime(params) {
  return request(`/acloud_new/v2/sfg/hiddenDangerOverTime.json?${stringify(params)}`);
}

// 根据时间查询隐患列表
export async function getHiddenDangerListByDate(params) {
  return request(`/acloud_new/v2/sfg/hiddenDangerListByDate.json?${stringify(params)}`);
}

// 监督检查已查/未查企业信息
export async function getCheckedCompanyInfo(params) {
  return request(`/acloud_new/v2/sfm/getCheckedCompanyInfo.json?${stringify(params)}`);
}

// 获取已超时风险点总数
export async function getSelectOvertimeItemNum(params) {
  return request(`/acloud_new/v2/sfg/selectOvertimeItemNum.json?${stringify(params)}`);
}

// 安全政府-超时未查单位
export async function getOvertimeUncheckedCompany(params) {
  return request(`/acloud_new/v2/sfm/getOvertimeUncheckedCompany?${stringify(params)}`);
}

// 大屏隐患点位总数据
export async function getListForMapForOptimize(params) {
  return request(`/acloud_new/v2/sfg/listForMapForOptimize.json?${stringify(params)}`);
}

// 获取网格区域
export async function getMapLocation(params) {
  return request(`/acloud_new/v2/gridInfo/getMapLocation?${stringify(params)}`);
}

// 获取网格区域以及它的子区域
export async function getMapLocationByParent(params) {
  return request(`/acloud_new/v2/gridInfo/getMapLocationByParent?${stringify(params)}`);
}

// 专职人员检查信息 已检查和未检查单位数量
export async function getCompanyCheckCount(params) {
  return request(`/acloud_new/v2/sfg/companyCount.json?${stringify(params)}`);
}

// 未评级单位风险点与异常点
export async function getDangerLocationCompanyNotRatedData(params) {
  return request(`/acloud_new/v2/sfg/dangerLocationCompanyNotRatedData.json?${stringify(params)}`);
}

// 企业风险点
export async function getselfCheckPoint(params) {
  return request(`/acloud_new/v2/sfm/getselfCheckPoint?${stringify(params)}`);
}

// 各风险点具体信息
export async function getSelfCheckPointData(params) {
  return request(`/acloud_new/v2/sfm/getSelfCheckPointData?${stringify(params)}`);
}

// 公司各风险点数量
export async function getSelfCheckPointDataByCompanyId(params) {
  return request(`/acloud_new/v2/sfm/getSelfCheckPointDataByCompanyId?${stringify(params)}`);
}

// 隐患饼图下钻接口
export async function getListForMapForHidden(params) {
  return request(`/acloud_new/v2/sfg/listForMapForHidden.json?${stringify(params)}`);
}

// 12迭代 安全检查柱状图
export async function getSecurityCheck(params) {
  return request(`/acloud_new/v2/sfg/securityCheck.json?${stringify(params)}`);
}

// 企业大屏
// 企业风险点数 (正常，异常，待检查，已超时) 分开请求！？？
export async function getCoItemList(params) {
  return request(`/acloud_new/v2/sfc/itemList.json?${stringify(params)}`);
}

// 特种设备
export async function getSpecialEquipment(params) {
  return request(`/gsafe/special_equipment/special_equipment_for_v2.do?${stringify(params)}`);
}

// 企业信息(包含人员数量四色图等)
export async function getCompanyMessage(params) {
  return request(`/acloud_new/v2/sfc/companyMessage.json?${stringify(params)}`);
}

// 企业大屏四色风险点
export async function getCountDangerLocationForCompany(params) {
  return request(`/acloud_new/v2/sfc/countDangerLocationForCompany.json?${stringify(params)}`);
}

// 获取风险点信息
export async function getRiskPointInfo(params) {
  return request(`/acloud_new/v2/sfc/selectCompanyLetter.json?${stringify(params)}`);
}

// 获取隐患详情
export async function getRiskDetail(params) {
  return request(`/acloud_new/v2/sfc/hiddenDangerList.json?${stringify(params)}`);
}

// 隐患总数
export async function getHiddenDanger(params) {
  return request(`/acloud_new/v2/sfc/hiddenDanger.json?${stringify(params)}`);
}

// 获取安全人员信息
export async function getSafetyOfficer(params) {
  return request(`/acloud_new/v2/sfc/showSafePerson.json?${stringify(params)}`);
}

// 单位名称查找
export async function searchCompanies(params) {
  return request(`/acloud_new/v2/sfg/searchCompany.json?${stringify(params)}`);
}

// 视频
export async function getAllCamera(params) {
  return request(`/acloud_new/v2/hdf/getAllCamera.json?${stringify(params)}`);
}

// 视频路径
export async function getStartToPlay(params) {
  return request(`/acloud_new/dai/startToPlay?${stringify(params)}`);
}

/**
 * 获取监控球相关数据
 */
export async function getMonitorData(params) {
  return request(`/acloud_new/v2/monitor/countStatus.json?${stringify(params)}`);
}

/**
 * 获取巡查人员列表
 */
export async function getStaffList(params) {
  return request(`/acloud_new/v2/sfc/companyCheckByPerson.json?${stringify(params)}`);
}

/**
 * 获取巡查人员记录
 */
export async function getStaffRecords(params) {
  return request(`/acloud_new/v2/sfc/companyCheckDataByPerson.json?${stringify(params)}`);
}

/**
 * 获取隐患详情（分页）
 */
export async function getHiddenDangerListForPage(params) {
  return request(`/acloud_new/v2/sfc/hiddenDangerListForPage.json?${stringify(params)}`);
}

/**
 * 获取隐患详情（分页）
 */
export async function hiddenDangerListByDateForPage(params) {
  return request(`/acloud_new/v2/sfg/hiddenDangerListByDateForPage.json?${stringify(params)}`);
}

/**
 * 获取风险点列表（分页）
 */
export async function getSelfCheckPointDataForPage(params) {
  return request(`/acloud_new/v2/sfm/getSelfCheckPointDataForPage?${stringify(params)}`);
}

/**
 * 获取单位信息
 */
export async function getCompanyInfo(params) {
  return request(`/acloud_new/v2/sfc/companyInfo.json?${stringify(params)}`);
}

// 获取led数据
export async function getLedData(params) {
  return request(`/acloud_new/v2/ci/HGFace/getJobCountInProductArea?${stringify(params)}`, { headers: { Accept: 'text/plain' } });
}

// 获取企业最后一个安全承诺公告
export async function getLedPromise(params) {
  return request1(`/acloud_new/v2/notice/getLastCompanyPublic?${stringify(params)}`);
}
