import { stringify } from 'qs';
import request from '@/utils/request';

const data = {
  id: 1,
  status: 1,
  approveDate: +new Date(),
};

export async function getList(params) {
  // return request(`/acloud_new?${stringify(params)}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: [
            data,
            {
              id: 2,
              status: 2,
              approveDate: +new Date(),
            },
            {
              id: 3,
              status: 3,
              approveDate: +new Date(),
            },
          ],
          pagination: {
            total: 1,
            ...params,
          },
        },
      });
    }, 1000);
  });
}

export async function getDetail({ id }) {
  // return request(`/acloud_new/${id}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data,
      });
    }, 1000);
  });
}

export async function add(params) {
  // return request(`/acloud_new`, {
  //   method: "POST",
  //   body: params,
  // });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
      });
    }, 1000);
  });
}

export async function edit(params) {
  // return request(`/acloud_new`, {
  //   method: "PUT",
  //   body: params,
  // });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
      });
    }, 1000);
  });
}

export async function approve(params) {
  // return request(`/acloud_new/${id}`, {
  //   method: "POST",
  //   body: params,
  // });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
      });
    }, 1000);
  });
}
