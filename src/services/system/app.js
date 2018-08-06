import { stringify } from 'qs';
import request from '../../utils/request';

// 获取手机软件条目,params = { currentPage: 1, pageSize: 10, type: 1 }
export async function queryApp(params) {
  // const { currentPage, pageSize, type } = params;
  return request(`/acloud_new/v2/mobileVersion/versions?${stringify(params)}`, { method: 'GET' });
}

// 删除手机条目,params = { udpateIds: [...], type: 1 }
export async function removeApp(params) {
  const { ids, type } = params;
  return request(`/acloud_new/v2/mobileVersion/version/${ids}/${type}`, {
    method: 'DELETE',
  });
}

export async function addApp(params) {
  return request('/acloud_new/v2/mobileVersion/version', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 修改手机条目,params同添加手机条目
export async function updateApp(params) {
  // const { updateId } = params;
  // console.log('params', { ...params });
  return request(`/acloud_new/v2/mobileVersion/version`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
