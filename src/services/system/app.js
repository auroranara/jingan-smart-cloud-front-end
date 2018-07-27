// import { stringify } from 'qs';
import request from '../../utils/request';

// 获取手机软件条目,params = { currentPage: 1, pageSize: 10, type: 1 }
export async function queryApp(params) {
  const { currentPage, pageSize, type } = params;
  return request(`/eye/api/versions?currentPage=${currentPage}&pageSize=${pageSize}&type=${type}`, { method: 'GET' });
}

// 删除手机条目,params = { udpateIds: [...], type: 1 }
export async function removeApp(params) {
  const { updateIds, type } = params;
  return request(`/eye/api/version/${updateIds.join(',')}/${type}`, {
    method: 'DELETE',
  });
}

export async function addApp(params) {
  return request('/eye/api/version', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 修改手机条目,params同添加手机条目
export async function updateApp(params) {
  const { updateId } = params;
  // console.log('params', { ...params });
  return request(`/eye/api/version/${updateId}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
