import request from '../utils/request';
import { stringify } from 'qs';

// const URL_PREFIX = '/mock/28/acloud_new/v2/baseInfo';
const URL_PREFIX = '/acloud_new/v2';

// 新增视频设备信息
export async function addVideoDevice({ companyId, ...params }) {
  return request(`${URL_PREFIX}/videoDevice/company/${companyId}/videoDevice`, {
    method: 'POST',
    body: { companyId, ...params },
  });
}

// 修改视频设备信息
export async function updateVideoDevice({ companyId, videoId, ...params }) {
  return request(`${URL_PREFIX}/videoDevice/company/${companyId}/videoDevice/${videoId}`, {
    method: 'PUT',
    body: { companyId, videoId, ...params },
  });
}

// 删除视频设备
export async function deleteVideoDevice({ companyId, videoId, ...params }) {
  return request(`${URL_PREFIX}/videoDevice/company/${companyId}/videoDevice/${videoId}`, {
    method: 'DELETE',
  });
}

// 视频企业列表
export async function queryVideoCompaniesList(params) {
  return request(`${URL_PREFIX}/videoDevice/companies?${stringify(params)}`);
}

// 视频设备列表
export async function queryVideoList(params) {
  return request(
    `${URL_PREFIX}/videoDevice/company/${params.companyId}/videoList?${stringify(params)}`
  );
}

// 查詢设备詳情
export async function queryVideoDetail(videoId) {
  return request(`${URL_PREFIX}/videoDevice/company/videoDevice/${videoId}`);
}

/* 企业列表弹出框 */
export async function queryModelList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

// 获取当前摄像头绑定的标签
export async function fetchVideoBeacons(params) {
  return request(`/acloud_new/v2/video/bind/selectBeanconForVideo?${stringify(params)}`);
}

// 获取当前摄像头可绑定的标签
export async function fetchVideoBeaconsAvailable(params) {
  return request(`/acloud_new/v2/video/bind/selectBeaconNotBind?${stringify(params)}`);
}

// 绑定信标（可批量）
export async function bindBeacon({ videoId, beaconIds, ...others }) {
  return request('/acloud_new/v2/video/bind/bindBeacon', {
    method: 'POST',
    body: { videoId, beaconIds, ...others },
  });
}

// 解绑标签
export async function unBindBeacon({ videoId, beaconIds, ...others }) {
  return request('/acloud_new/v2/video/bind/unbindBeacon', {
    method: 'POST',
    body: { videoId, beaconIds, ...others },
  });
}

// 获取系统列表
export async function fetchSystemList(params) {
  return request(`/acloud_new/v2/video/bind/locationSysList?${stringify(params)}`);
}

// 获取当前摄像头绑定的设备（动态监测）
export async function fetchBindedMonitorDevice(params) {
  return request(`/acloud_new/v2/video/bind/getHasBindVideos?${stringify(params)}`);
}

// 获取当前摄像头未绑定设备（动态监测）
export async function fetchUnBindedMonitorDevice(params) {
  return request(`/acloud_new/v2/video/bind/getHasNotBindVideos?${stringify(params)}`);
}

// 视频绑定设备（动态监测）
export async function bindedMonitorDevice(params) {
  return request(`/acloud_new/v2/video/bind/bindVideoAndDevice?${stringify(params)}`);
}

// 视频解绑设备（动态监测）
export async function unbindedMonitorDevice(params) {
  return request(`/acloud_new/v2/video/bind/unbindVideoAndDevice?${stringify(params)}`);
}

// 当前摄像头绑定的报警点位(火灾报警系统)
export async function fetchBindedFireDevice(params) {
  return request(`/acloud_new/v2/video/bind/selectFireForVideo?${stringify(params)}`);
}

// 当前摄像头可绑定的报警点位(火灾报警系统)
export async function fetchUnBindedFireDevice(params) {
  return request(`/acloud_new/v2/video/bind/selectFireNotBindForVideo?${stringify(params)}`);
}

// 绑定摄像头（批量）(火灾报警系统)
export async function bindedFirerDevice(params) {
  return request('/acloud_new/v2/video/bind/bindFire', {
    method: 'POST',
    body: params,
  });
}
// 解除绑定关系(火灾报警系统)
export async function unbindedFirerDevice(params) {
  return request('/acloud_new/v2/video/bind/unbindFire', {
    method: 'POST',
    body: params,
  });
}

// 获取品牌列表
export async function getOptionalList() {
  return request('/acloud_new/v2/video/bind/getOptionalList');
}

// 获取产品型号列表
export async function getModelDescList() {
  return request('/acloud_new/v2/video/bind/getModelDescList');
}

// 获取监测类型列表
export async function getClassTypeList() {
  return request('/acloud_new/v2/video/bind/getClassTypeList');
}

// 获取消控主机和设施部件列表
export async function fetchFireFilterList(params) {
  return request(
    `/acloud_new/v2/automaticFireAlarmSystem/company/${params.companyId}/selectCondition`
  );
}

// 获取字典列表
export async function fetchDictList(params) {
  return request(`/acloud_new/v2/sys/dict/list?${stringify(params)}`);
}
