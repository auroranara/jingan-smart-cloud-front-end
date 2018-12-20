import { stringify } from 'qs';
import request from '../utils/request';

// 企业信息(包含人员数量四色图等)
export async function getCompanyMessage(params) {
  return request(`/acloud_new/v2/sfc/companyMessage.json?${stringify(params)}`);
}

// 特种设备
export async function getSpecialEquipmentCount(params) {
  return request(`/gsafe/special_equipment/special_equipment_for_v2.do?${stringify(params)}`);
}

// 获取风险点信息
export async function getPointInfoList(params) {
  return request(`/acloud_new/v2/sfc/selectCompanyLetter.json?${stringify(params)}`);
}

// 获取隐患列表
export async function getHiddenDangerList(params) {
  return request(`/acloud_new/v2/sfc/hiddenDangerList.json?${stringify(params)}`);
}

// 获取视频liebiao
export async function getVideoList(params) {
  return request(`/acloud_new/v2/hdf/getAllCamera.json?${stringify(params)}`);
}

/**
 * 获取监控球相关数据
 */
export async function getMonitorData(params) {
  return request(`/acloud_new/v2/monitor/countStatus.json?${stringify(params)}`);
}

// 企业大屏四色风险点
export async function getCountDangerLocation(params) {
  return request(`/acloud_new/v2/sfc/countDangerLocationForCompany.json?${stringify(params)}`);
}

// 风险点各检查状态统计 (正常，异常，待检查，已超时) 分开请求！？？
export async function getStatusCount(params) {
  return request(`/acloud_new/v2/sfc/itemList.json?${stringify(params)}`);
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
  return request(`/acloud_new/v2/sfc/companyCheckDataByPerson2.json?${stringify(params)}`);
}

// 获取安全人员信息
export async function getSafetyOfficer(params) {
  return request(`/acloud_new/v2/sfc/showSafePerson.json?${stringify(params)}`);
}

/**
 * 获取巡查记录详情
 */
export async function getInspectionPointData(params) {
  return request(`/acloud_new/v2/sfc/companyCheckDataById.json?${stringify(params)}`);
}

/**
 * 获取安全指数
 */
export async function getSafetyIndex(params) {
  return request(`/acloud_new/v2/mobile/getTotalScore.json`, {
    method: 'POST',
    body: {
      ...params,
      functionList: [
        "special_equipment",
        "emergency_material",
        "special_people",
        "company_training",
        "major_danger",
        "tank_info",
        "material_info",
        "dust_info",
        "limit_space",
        "metallurgy",
        "ammonia",
        "occupational",
        "fire_monitor",
        "independent_smoke",
        "electric_monitor",
        "gas_ponsion",
        "tank_monitor",
        "waste_gas",
        "waste_water",
        "video_monitor",
        "hidden_danger",
        "base_info",
        "check_point",
        "hidden_record",
        "company_people",
        "emergency_plan",
      ],
    },
  });
}

