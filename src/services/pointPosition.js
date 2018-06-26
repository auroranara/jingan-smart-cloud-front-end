import { stringify } from 'qs';
import request from '../utils/request';

export async function api(params) {
  return request(`url/${stringify(params)}`);
}
