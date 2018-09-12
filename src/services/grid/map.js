import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchGridLocationById(params) {
  return request(`/acloud_new/v2/gridInfo/getMapLocation?${stringify(params)}`);
}

export async function updateGridLocation(params) {
  return request('/acloud_new/v2/gridInfo/updateMapLocation', {
    method: 'POST',
    body: params,
  });
}
