import { stringify } from 'qs';
import request from '@/utils/request';

const list = [...Array(11).keys()].map(id => ({ id }));

export async function getList(params) {
  // return request(`/acloud_new?${stringify(params)}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list,
          pagination: {
            total: list.length,
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
        data: list[0],
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

export async function remove({ id }) {
  // return request(`/acloud_new/${id}`, {
  //   method: "DELETE",
  // });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
      });
    }, 1000);
  });
}
