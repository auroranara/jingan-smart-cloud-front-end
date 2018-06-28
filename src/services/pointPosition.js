import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchPointPositionData(params) {
  return request(`/pointData/pointData/${stringify(params)}`);
}
