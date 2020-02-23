import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/ci';

/** 安全生产指标管理 */

// 列表
export async function queryIndexManageList(params) {
  return request(`${URL_PREFIX}/goalDutyManage/safeProductGoalManage/page?${stringify(params)}`);
}

// 新增
export async function queryIndexManageAdd(params) {
  return request(`${URL_PREFIX}/goalDutyManage/safeProductGoalManage`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryIndexManageEdit(params) {
  return request(`${URL_PREFIX}/goalDutyManage/safeProductGoalManage`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryIndexManageDelete({ id }) {
  return request(`${URL_PREFIX}/goalDutyManage/safeProductGoalManage/${id}`, {
    method: 'DELETE',
  });
}

/** 目标责任制定实施 */

// 列表
export async function queryTargetSettingList(params) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesign/page?${stringify(params)}`);
}

// 详情
export async function queryTargetSettingView({ id }) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesign/${id}`);
}

// 新增考核
export async function queryExamAdd(params) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesignExam`, {
    method: 'POST',
    body: params,
  });
}

// 考核详情
export async function queryExamView({ id }) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesignExamList/${id}`);
}

// 新增
export async function queryTargetSettingAdd(params) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesign`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryTargetSettingEdit(params) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesign`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryTargetSettingDelete({ id }) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesign/${id}`, {
    method: 'DELETE',
  });
}

/** 目标责任分析报表 */

// 月，季度，年目标达成率
export async function queryMonthQuarterYear(params) {
  return request(`${URL_PREFIX}/goalDutyExcel/monthQuarterYear?${stringify(params)}`);
}

// 各单位部门指标达成情况
export async function queryUnitPartGoal(params) {
  return request(`${URL_PREFIX}/goalDutyExcel/unitPartGoal?${stringify(params)}`);
}

// 各指标变化趋势
export async function queryGoalChange(params) {
  return request(`${URL_PREFIX}/goalDutyExcel/goalChange?${stringify(params)}`);
}

// 年度目标达成率排名
export async function queryYearGoal(params) {
  return request(`${URL_PREFIX}/goalDutyExcel/yearGoal?${stringify(params)}`);
}

// 部门目标达成率
export async function queryPartGoal(params) {
  return request(`${URL_PREFIX}/goalDutyExcel/partGoal?${stringify(params)}`);
}
