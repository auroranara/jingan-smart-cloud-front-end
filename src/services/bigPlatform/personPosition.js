import request from '../../utils/cockpitRequest';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

export async function queryInitialPositions(params) {
  return request(`${URL_PREFIX}/accessCard/getAllCardLocation?${stringify(params)}`);
}
