import { stringify } from 'qs';
import request from '@/utils/request';

// 获取部门列表
export async function getDepartmentList(params) {
  return request(`/acloud_new/v2/sys/sysDepartment?${stringify(params)}`);
}

// 获取人员列表
export async function getPersonList(params) {
  return request(`/acloud_new/v2/education/examStudents?${stringify(params)}`);
}

// 获取培训计划列表
export async function getList(params) {
  return request(`/acloud_new/v2/education/trainingPlan/page?${stringify(params)}`);
}

// 获取培训计划详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/education/trainingPlan/${id}`);
}

// 新增培训计划
export async function add(params) {
  return request(`/acloud_new/v2/education/trainingPlan`, {
    method: 'POST',
    body: params,
  });
}

// 编辑培训计划
export async function edit(params) {
  return request(`/acloud_new/v2/education/trainingPlan`, {
    method: 'PUT',
    body: params,
  });
}

// 执行培训计划
export async function execute(params) {
  return request(`/acloud_new/v2/education/trainingPlan/execute`, {
    method: 'PUT',
    body: params,
  });
}

// 删除培训计划
export async function remove({ id }) {
  return request(`/acloud_new/v2/education/trainingPlan/${id}`, {
    method: 'DELETE',
  });
}
