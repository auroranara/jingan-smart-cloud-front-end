import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/education';

export async function getExamList(params) {
  return request(`${URL_PREFIX}/examForPage?${stringify(params)}`);
}
