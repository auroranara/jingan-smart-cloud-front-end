import request from '../../utils/request';

// 获取平台名字
export async function getProjectName() {
  return request(`/acloud_new/v2/sfg/getProjectName.json`, {
    method: 'POST',
  });
}

// 获取地图中心点
export async function getLocationCenter() {
  return request(`/acloud_new/v2/sfg/getLocationCenter.json`, {
    method: 'POST',
  });
}

// 获取风险点总数
export async function getItemList() {
  return request(`/acloud_new/v2/sfg/report/itemList.json`, {
    method: 'POST',
    body: {
      start: 0,
      end: 24,
      pageSize: 25,
      item_type: 1,
    },
  });
}

// 政府大屏风险统计
export async function getCountDangerLocation() {
  return request(`/acloud_new/v2/sfg/countDangerLocation.json`, {
    method: 'POST',
  });
}
