import { stringify } from 'qs';
import request from '../utils/request';

// 添加监测场景
export async function addMonitoringScene(params) {
  return request('/acloud_new/v2/monitorScene/addMonitorScene', {
    method: 'POST',
    body: params,
  });
}

// 监测场景查询列表
export async function queryMonitorSceneList(params) {
  return request(`/acloud_new/v2/monitorScene/list?${stringify(params)}`);
}

// 添加人脸库
export async function addFaceDatatbase(params) {
  return request('/acloud_new/v2/faceDataBase/addFaceDatabase', {
    method: 'POST',
    body: params,
  });
}

// 人脸库列表
export async function queryFaceDatabaseList(params) {
  return request(`/acloud_new/v2/faceDataBase/list?${stringify(params)}`);
}

// 添加人脸
export async function addFaceInfo(params) {
  return request('/acloud_new/v2/faceInfo/addFaceInfo', {
    method: 'POST',
    body: params,
  });
}

// 修改人脸信息
export async function editFaceInfo(params) {
  return request('/acloud_new/v2/faceInfo/editFaceInfo', {
    method: 'PUT',
    body: params,
  });
}

// 删除人脸信息
export async function deleteFaceInfo({ ids }) {
  return request(`/acloud_new/v2/faceInfo/deleteFaceInfo/${ids}`, {
    method: 'DELETE',
  });
}

// 人脸列表
export async function queryFaceList(params) {
  return request(`/acloud_new/v2/faceInfo/selectFaceInfo?${stringify(params)}`);
}

// 导入人脸
export async function queryFaceExport(params) {
  return request('/acloud_new/v2/faceInfo/addFacePhoto', {
    method: 'POST',
    body: params,
  });
}

// 监测点列表
export async function queryMonitorDotList(params) {
  return request(`/acloud_new/v2/monitorDot/list?${stringify(params)}`);
}

// 添加监测点
export async function addMonitorDotInfo(params) {
  return request('/acloud_new/v2/monitorDot/addMonitorDot', {
    method: 'POST',
    body: params,
  });
}

// 修改监测点
export async function editMonitorDotInfo(params) {
  return request('/acloud_new/v2/monitorDot/edit', {
    method: 'PUT',
    body: params,
  });
}

// 删除监测点
export async function deleteMonitorDot({ id }) {
  return request(`/acloud_new/v2/monitorDot/delete/${id}`, {
    method: 'DELETE',
  });
}

// 人脸摄像机列表
export async function queryFaceCameraList(params) {
  return request(`/acloud_new/v2/videoCamera/list?${stringify(params)}`);
}

// 添加摄像机
export async function addFaceCameraInfo(params) {
  return request('/acloud_new/v2/videoCamera/add', {
    method: 'POST',
    body: params,
  });
}

// 修改摄像机
export async function editFaceCameraInfo(params) {
  return request('/acloud_new/v2/videoCamera/edit', {
    method: 'PUT',
    body: params,
  });
}

// 删除摄像机
export async function deleteCameraInfo({ id }) {
  return request(`/acloud_new/v2/videoCamera/delete/${id}`, {
    method: 'DELETE',
  });
}

// 报警历史记录
export async function queryAlarmRecord(params) {
  return request(`/acloud_new/v2/faceHistory/list?${stringify(params)}`);
}
