import request from '@/utils/request';
import { stringify } from 'qs';

// 获取企业列表
export async function fetchCompanyList(params) {
  return request(`/acloud_new/v2/ci/HGFace/hgFaceInfoByAdmin/page?${stringify(params)}`);
}

// 获取人员列表
export async function fetchPersonList(params) {
  return request(`/acloud_new/v2/ci/HGFace/hgFaceInfo/page?${stringify(params)}`);
}

// 新增人员
export async function addPerson(body) {
  return request('/acloud_new/v2/ci/HGFace/hgFaceInfo', {
    method: 'POST',
    body,
  });
}

// 编辑人员
export async function editPerson(body) {
  return request('/acloud_new/v2/ci/HGFace/hgFaceInfo', {
    method: 'PUT',
    body,
  });
}

// 删除人员
export async function deletePerson(params) {
  return request(`/acloud_new/v2/ci/HGFace/hgFaceInfo/${params.id}`, {
    method: 'DELETE',
  });
}

// 批量授权人员（多人员）
export async function authorizationPerson(body) {
  return request('/acloud_new/v2/ci/HGFace/Authorization/hgAuthorizationManageAll', {
    method: 'PUT',
    body,
  });
}

// 批量导入照片记录
export async function queryRecordList(params) {
  return request(`/acloud_new/v2/HGFace/hgFacePhotoHistory/page?${stringify(params)}`);
}

// 导出人员列表
export async function queryPersonExport(body) {
  return request('/acloud_new/v2/ci/HGFace/exportPerson', {
    method: 'POST',
    body,
  });
}

// 获取授权列表
// export async function fetchAuthorizationList (params) {
//   return request(`/acloud_new/v2/ci/HGFace/hgAuthorizationInfoForPage?${stringify(params)}`)
// }

// 获取授权列表
export async function fetchAuthorizationList(params) {
  return request(
    `/acloud_new/v2/ci/HGFace/Authorization/hgAuthorizationManage/list?${stringify(params)}`
  );
}

// 全部销权
export async function deleteAllAuthorization(params) {
  return request(
    `/acloud_new/v2/ci/HGFace/Authorization/deleteAllAuthorization?${stringify(params)}`,
    {
      method: 'DELETE',
    }
  );
}

// 销权
export async function deleteAuthorization(params) {
  return request(`/acloud_new/v2/ci/HGFace/Authorization/unAuthorization?${stringify(params)}`, {
    method: 'DELETE',
  });
}

// 获取识别记录列表
export async function fetchIdentificationRecord(params) {
  return request(`/acloud_new/v2/ci/HGFace/History/hgRecognitionHistory/page?${stringify(params)}`);
}

// 获取通道设备列表
export async function fetchChannelDeviceList(params) {
  return request(`/acloud_new/v2/ci/hgEquipmentInfo/hgEquipmentInfo/page?${stringify(params)}`);
}

// 新增通道设备
export async function addChannelDevice(body) {
  return request('/acloud_new/v2/ci/hgEquipmentInfo/hgEquipmentInfo', {
    method: 'POST',
    body,
  });
}

// 编辑通道设备
export async function editChannelDevice(body) {
  return request('/acloud_new/v2/ci/hgEquipmentInfo/hgEquipmentInfo', {
    method: 'PUT',
    body,
  });
}

// 删除通道设备
export async function deleteChannelDevice(params) {
  return request(`/acloud_new/v2/ci/hgEquipmentInfo/hgEquipmentInfo/${params.id}`, {
    method: 'DELETE',
  });
}

// 获取通道列表
export async function fetchChannelList(params) {
  return request(`/acloud_new/v2/ci/hgChannelInfo/hgChannelInfo/page?${stringify(params)}`);
}

// 新增通道
export async function addChannel(body) {
  return request('/acloud_new/v2/ci/hgChannelInfo/hgChannelInfo', {
    method: 'POST',
    body,
  });
}

// 编辑通道
export async function editChannel(body) {
  return request('/acloud_new/v2/ci/hgChannelInfo/hgChannelInfo', {
    method: 'PUT',
    body,
  });
}

// 删除通道
export async function deleteChannel(params) {
  return request(`/acloud_new/v2/ci/hgChannelInfo/hgChannelInfo/${params.id}`, {
    method: 'DELETE',
  });
}

// 查看标签卡列表
export async function queryTagCardList(params) {
  return request(`/acloud_new/v2/HGFace/labelCard/page?${stringify(params)}`);
}

// 新增标签卡
export async function queryTagCardAdd(body) {
  return request('/acloud_new/v2/HGFace/labelCard', {
    method: 'POST',
    body,
  });
}

// 编辑标签卡
export async function queryTagCardEdit(body) {
  return request('/acloud_new/v2/HGFace/labelCard', {
    method: 'PUT',
    body,
  });
}

// 删除标签卡
export async function queryTagCardDel({ id }) {
  return request(`/acloud_new/v2/HGFace/labelCard/${id}`, {
    method: 'DELETE',
  });
}

// 导出标签卡
export async function queryTagExport(body) {
  return request('/acloud_new/v2/HGFace/exportLabel', {
    method: 'POST',
    body,
  });
}
