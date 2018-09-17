import request from '../../utils/cockpitRequest';
import { stringify } from 'qs';

// 视频列表
// export async function getAllCamera(params) {
//   return request(`${URL_PREFIX}/hdf/getAllCamera.json?${stringify(params)}`);
// }

// 视频播放
export async function getStartToPlay(params) {
  return request(`/acloud_new/dai/startToPlayForWeb.json?${stringify(params)}`);
}
