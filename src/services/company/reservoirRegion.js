import { stringify } from 'qs';
import request from '../../utils/request';

/** 库区 */
// 列表
export async function queryAreaList(params) {
  return request(`/acloud_new/v2/warehouseArea/list?${stringify(params)}`);
}

// 获取数量
export async function queryCompanyNum(params) {
  return request(`/acloud_new/v2/warehouseArea/countCompanyNum?${stringify(params)}`);
}

// 新增
export async function queryAreaAdd(params) {
  return request(`/acloud_new/v2/warehouseArea/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryAreaEdit(params) {
  return request(`/acloud_new/v2/warehouseArea/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryAreaDelete({ ids }) {
  return request(`/acloud_new/v2/warehouseArea/delete/${ids}`, {
    method: 'DELETE',
  });
}

/** 重大危险源 */
// 列表
export async function queryDangerSourceList(params) {
  return request(`/acloud_new/v2/dangerSource/list?${stringify(params)}`);
}

// 新增
export async function queryDangerSourceaAdd(params) {
  return request(`/acloud_new/v2/dangerSource/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryDangerSourceEdit(params) {
  return request(`/acloud_new/v2/dangerSource/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryDangerSourceDelete({ ids }) {
  return request(`/acloud_new/v2/dangerSource/delete/${ids}`, {
    method: 'DELETE',
  });
}

// 获取物料列表列表
export async function queryMaterialInfoList(params) {
  return request(`/acloud_new/v2/materialInfo/list?${stringify(params)}`);
}

/** 危险化学品企业证书 */
// 列表
export async function queryCertificateList(params) {
  return request(
    `/acloud_new/v2/ci/hazardChemicalCertificate/hazardchemicalCertificate/page?${stringify(
      params
    )}`
  );
}

// 新增
export async function queryCertificateaAdd(params) {
  return request(`/acloud_new/v2/ci/hazardChemicalCertificate/hazardchemicalCertificate`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryCertificateEdit(params) {
  return request(`/acloud_new/v2/ci/hazardChemicalCertificate/hazardchemicalCertificate`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryCertificateDelete({ id }) {
  return request(`/acloud_new/v2/ci/hazardChemicalCertificate/hazardchemicalCertificate/${id}`, {
    method: 'DELETE',
  });
}

/** 注册安全工程师 */
// 列表
export async function querySafetyEngList(params) {
  return request(`/acloud_new/v2/companyFiles/safetyEngForPage?${stringify(params)}`);
}

// 新增
export async function querySafetyEngAdd(params) {
  return request(`/acloud_new/v2/companyFiles/safetyEng`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function querySafetyEngEdit(params) {
  return request(`/acloud_new/v2/companyFiles/safetyEng`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function querySafetyEngDelete({ ids }) {
  return request(`/acloud_new/v2/companyFiles/safetyEng/${ids}`, {
    method: 'DELETE',
  });
}

/** 生产许可证 */
// 列表
export async function queryProductLicenceList(params) {
  return request(`/acloud_new/v2/productLicence/list?${stringify(params)}`);
}

// 新增
export async function queryProductLicenceAdd(params) {
  return request(`/acloud_new/v2/productLicence/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryProductLicenceEdit(params) {
  return request(`/acloud_new/v2/productLicence/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryProductLicenceDelete({ ids }) {
  return request(`/acloud_new/v2/productLicence/delete/${ids}`, {
    method: 'DELETE',
  });
}

/** 安全设施 */
// 列表
export async function querySafeFacilitiesList(params) {
  return request(`/acloud_new/v2/ci/safeFacilities/safeFacilities/page?${stringify(params)}`);
}

// 新增
export async function querySafeFacilitiesAdd(params) {
  return request(`/acloud_new/v2/ci/safeFacilities/safeFacilities`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function querySafeFacilitiesEdit(params) {
  return request(`/acloud_new/v2/ci/safeFacilities/safeFacilities`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function querySafeFacilitiesDelete({ id }) {
  return request(`/acloud_new/v2/ci/safeFacilities/safeFacilities/${id}`, {
    method: 'DELETE',
  });
}

// 报告列表
export async function queryReportList(params) {
  return request(`/acloud_new/v2/ci/safeFacilities/safeFacilitiesReport/Page?${stringify(params)}`);
}

// 新增
export async function queryReportAdd(params) {
  return request(`/acloud_new/v2/ci/safeFacilities/safeFacilitiesReport`, {
    method: 'POST',
    body: params,
  });
}
