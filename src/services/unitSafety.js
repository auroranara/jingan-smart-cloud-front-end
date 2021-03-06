import { stringify } from 'qs';
import request from '../utils/request';

// 企业信息(包含人员数量四色图等)
export async function getCompanyMessage (params) {
  return request(`/acloud_new/v2/sfc/companyInfo.json?${stringify(params)}`);
}

// 特种设备
export async function getSpecialEquipmentCount (params) {
  return request(`/gsafe/special_equipment/special_equipment_for_v2.do?${stringify(params)}`);
}

// 获取风险点信息
export async function getPointInfoList (params) {
  return request(`/acloud_new/v2/sfc/selectCompanyLetter.json?${stringify(params)}`);
}

// 获取隐患列表
export async function getHiddenDangerList (params) {
  return request(`/acloud_new/v2/sfc/hiddenDangerListForPage.json?${stringify(params)}`);
}

// 获取视频liebiao
export async function getVideoList (params) {
  return request(`/acloud_new/v2/hdf/getAllCamera.json?${stringify(params)}`);
}

// 获取视频树列表
export async function fetchVideoTree (params) {
  return request(`/acloud_new/v2/hdf/getTreeCamera.json?${stringify(params)}`);
}

/**
 * 获取监控球相关数据
 */
export async function getMonitorData (params) {
  return request(`/acloud_new/v2/monitor/countStatus.json?${stringify(params)}`);
}

// 企业大屏四色风险点
export async function getCountDangerLocation (params) {
  return request(`/acloud_new/v2/sfc/countDangerLocationForCompany.json?${stringify(params)}`);
}

// 风险点各检查状态统计 (正常，异常，待检查，已超时) 分开请求！？？
export async function getStatusCount (params) {
  return request(`/acloud_new/v2/sfc/itemList.json?${stringify(params)}`);
}

/**
 * 获取巡查人员列表
 */
export async function getStaffList (params) {
  return request(`/acloud_new/v2/sfc/companyCheckByPerson.json?${stringify(params)}`);
}

/**
 * 获取巡查人员记录
 */
export async function getStaffRecords (params) {
  return request(`/acloud_new/v2/sfc/companyCheckDataByPerson2.json?${stringify(params)}`);
}

// 获取安全人员信息
export async function getSafetyOfficer (params) {
  return request(`/acloud_new/v2/sfc/showSafePersonNew.json?${stringify(params)}`);
}

/**
 * 获取巡查记录详情
 */
export async function getInspectionPointData (params) {
  return request(`/acloud_new/v2/sfc/companyCheckDataById.json?${stringify(params)}`);
}

/**
 * 获取安全指数
 */
export async function getSafetyIndex (params) {
  return request(`/acloud_new/v2/mobile/getTotalScore.json`, {
    method: 'POST',
    body: {
      ...params,
      functionList: [
        'special_equipment',
        'emergency_material',
        'special_people',
        'company_training',
        'major_danger',
        'tank_info',
        'material_info',
        'dust_info',
        'limit_space',
        'metallurgy',
        'ammonia',
        'occupational',
        'fire_monitor',
        'independent_smoke',
        'electric_monitor',
        'gas_ponsion',
        'tank_monitor',
        'waste_gas',
        'waste_water',
        'video_monitor',
        'hidden_danger',
        'base_info',
        'check_point',
        'hidden_record',
        'company_people',
        'emergency_plan',
      ],
    },
  });
}

// 获取动态监测
export async function getMonitorList (params) {
  // return request(`/acloud_new/v2/fireData/systemMessage.json?${stringify(params)}`);
  return request(`/acloud_new/v2/fireData/getMonitor?${stringify(params)}`);
}

// 获取安全档案
export async function getSafeFiles (params) {
  return request(`/acloud_new/v2/sfm/getCompanyFiles`, {
    method: 'POST',
    body: {
      ...params,
      functionList: [
        'special_equipment',
        'emergency_material',
        'special_people',
        'company_training',
        // 'major_danger',
        // 'material_info',
        // 'dust_info',
        // 'limit_space',
        // 'metallurgy',
        // 'ammonia',
        // 'occupational',
        // 'tank_info',
      ],
    },
  });
}

// 获取动态监测数据
export async function getDynamicMonitorData (params) {
  return request(`/acloud_new/v2/sfc/getMonitorStatistics?${stringify(params)}`);
}

// 获取风险点的风险告知卡列表
export async function getRiskPointCardList (params) {
  return request(`/acloud_new/v2/sfc/fireCheckCardByItemId.json?${stringify(params)}`);
}

// 获取风险点的隐患列表
export async function getRiskPointHiddenDangerList (params) {
  return request(`/acloud_new/v2/sfc/fireCheckDataByItemId.json?${stringify(params)}`);
}

// 获取风险点的巡查列表
export async function getRiskPointInspectionList (params) {
  return request(`/acloud_new/v2/sfc/getItemByIdForPage?${stringify(params)}`);
}

// 获取风险点的隐患统计
export async function getRiskPointHiddenDangerCount (params) {
  return request(`/acloud_new/v2/sfc/fireCheckHiddenDataByItemId.json?${stringify(params)}`);
}

// 获取风险点的巡查统计
export async function getRiskPointInspectionCount (params) {
  return request(`/acloud_new/v2/sfc/getItemCountById?${stringify(params)}`);
}

// 获取点位
export async function getPoints (params) {
  return request(`/acloud_new/v2/sfc/selectPoints.json?${stringify(params)}`);
}

// 获取特种设备
export async function getSpecialEquipmentList (params) {
  return request(`/acloud_new/v2/sfc/specialEquipmentInfo?${stringify(params)}`);
}

// 获取设备统计列表
export async function getDeviceCountList (params) {
  return request(`/acloud_new/v2/fireData/getMonitorForAll?${stringify(params)}`);
}

// 获取温湿度监测点列表
export async function getHumiturePointList (params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/getMonitorForHumiture?${stringify(params)}`);
}

// 获取温湿度监测点详情
export async function getHumiturePointDetail (params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/getRealTimeDataForHumiture?${stringify(params)}`);
}

// 获取温湿度监测点监测趋势
export async function getHumiturePointTrend (params) {
  return request(`/acloud_new/v2/deviceInfo/getDeviceDataHistory?${stringify(params)}`);
}

// 获取隐患记录
export async function getHiddenDangerRecordList (params) {
  return request(`/acloud_new/v2/sfc/hiddenDangerListForAllPage.json?${stringify(params)}`);
}

// 获取标准及措施列表
export async function fetchStandardsAndMeasuresList (params) {
  return request(`/acloud_new/v2/sfm/getItemDetailsNew?${stringify(params)}`)
}

// 获取点位检查标准
export async function fetchpointInspectionStandards (params) {
  return request(`/acloud_new/v2/api/sp/itemFlows2?${stringify(params)}`)
}
