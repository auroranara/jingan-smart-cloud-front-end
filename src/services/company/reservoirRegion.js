import { stringify } from 'qs';
import request from '../../utils/request';

// 获取库区列表
export async function queryAreaList(params) {
  return request(`/acloud_new/v2/warehouseArea/list?${stringify(params)}`);
}

// 获取数量
export async function queryCompanyNum(params) {
  return request(`/acloud_new/v2/warehouseArea/countCompanyNum?${stringify(params)}`);
}

// 新增库区
export async function queryAreaAdd(params) {
  return request(`/acloud_new/v2/warehouseArea/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑库区
export async function queryAreaEdit(params) {
  return request(`/acloud_new/v2/warehouseArea/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除库区
export async function queryAreaDelete({ ids }) {
  return request(`/acloud_new/v2/warehouseArea/delete/${ids}`, {
    method: 'DELETE',
  });
}

// 获取危险源列表
export async function queryDangerSourceList(params) {
  return request(`/acloud_new/v2/dangerSource/list?${stringify(params)}`);
}

// 新增危险源
export async function queryDangerSourceaAdd(params) {
  return request(`/acloud_new/v2/dangerSource/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑危险源
export async function queryDangerSourceEdit(params) {
  return request(`/acloud_new/v2/dangerSource/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除危险源
export async function queryDangerSourceDelete({ ids }) {
  return request(`/acloud_new/v2/dangerSource/delete/${ids}`, {
    method: 'DELETE',
  });
}

// 获取物料列表列表
export async function queryMaterialInfoList(params) {
  return request(`/acloud_new/v2/materialInfo/list?${stringify(params)}`);
}

// 获取危险化学品企业证书列表
export async function queryCertificateList(params) {
  return request(
    `/acloud_new/v2/hazardChemicalCertificate/hazardchemicalCertificateForPage?${stringify(params)}`
  );
}

// 新增危险化学品企业证书
export async function queryCertificateaAdd(params) {
  return request(`/acloud_new/v2/hazardChemicalCertificate/hazardchemicalCertificate`, {
    method: 'POST',
    body: params,
  });
}

// 编辑危险化学品企业证书
export async function queryCertificateEdit(params) {
  return request(`/acloud_new/v2/hazardChemicalCertificate/hazardchemicalCertificate`, {
    method: 'PUT',
    body: params,
  });
}

// 删除危险化学品企业证书
export async function queryCertificateDelete({ id }) {
  return request(`/acloud_new/v2/hazardChemicalCertificate/hazardchemicalCertificate/${id}`, {
    method: 'DELETE',
  });
}

// 获取注册工程师列表
export async function querySafetyEngList(params) {
  return request(`/acloud_new/v2/companyFiles/safetyEngForPage?${stringify(params)}`);
}

// 新增注册工程师
export async function querySafetyEngAdd(params) {
  return request(`/acloud_new/v2/companyFiles/safetyEng`, {
    method: 'POST',
    body: params,
  });
}

// 编辑注册工程师
export async function querySafetyEngEdit(params) {
  return request(`/acloud_new/v2/companyFiles/safetyEng`, {
    method: 'PUT',
    body: params,
  });
}

// 删除注册工程师
export async function querySafetyEngDelete({ ids }) {
  return request(`/acloud_new/v2/companyFiles/safetyEng/${ids}`, {
    method: 'DELETE',
  });
}

// 获取生产许可证列表
export async function queryProductLicenceList(params) {
  return request(`/acloud_new/v2/productLicence/list?${stringify(params)}`);
}

// 新增生产许可证
export async function queryProductLicenceAdd(params) {
  return request(`/acloud_new/v2/productLicence/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑生产许可证
export async function queryProductLicenceEdit(params) {
  return request(`/acloud_new/v2/productLicence/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除生产许可证
export async function queryProductLicenceDelete({ ids }) {
  return request(`/acloud_new/v2/productLicence/delete/${ids}`, {
    method: 'DELETE',
  });
}
