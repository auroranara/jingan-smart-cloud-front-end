export { genCardsInfo } from '@/pages/BigPlatform/Smoke/utils';

export const ALL_DEVICES = 0;
export const HOST = 1;
export const SMOKE = 2;

export function getStatusImg(list, imgs) {
  let i = 0;
  for(; i < list.length; i++) {
    if (list[i])
      return imgs[i];
  }
  return imgs[i];
}

const MAP_ITEM_PROPS = [
  'fireDeviceCountForFire',
  'fireDeviceCountForFault',
  'smokeDeviceCountForFire',
  'smokeDeviceCountForFault',
  'smokeDeviceCountForUnConnect',
];
export function getMapItemStatus(item, deviceType) { // 0 正常 1 报警 2 故障 3 失联
  const [fire, fault, fire1, fault1, loss] = MAP_ITEM_PROPS.map(p => item[p] ? +item[p]: 0);
  const host = [fire, fault];
  const smoke = [fire1, fault1, loss];
  let hostStatus = 0;
  let smokeStatus = 0;
  for (let i = 0; i < host.length; i++)
    if (host[i]) {
      hostStatus = i + 1;
      break;
    }
  for (let j = 0; j < smoke.length; j++)
    if (smoke[j]) {
      smokeStatus = j + 1;
      break;
    }

  switch(deviceType) {
    case ALL_DEVICES:
      return hostStatus || smokeStatus ? 1 : 0;
    case HOST:
      return hostStatus;
    case SMOKE:
      return smokeStatus;
    default:
      return 0;
  }
}

export function getMapLegendData(list, deviceType) {
  function lambda(prev, next) {
    const status = getMapItemStatus(next);
    prev[status] += 1;
    return prev;
  };

  if (deviceType === ALL_DEVICES) {
    const [normal, abnormal] = list.reduce(lambda, [0, 0]);
    return { normal, abnormal };
  }

  if (deviceType === HOST) {
    const [normal, fire, fault] = list.reduce(lambda, [0, 0, 0]);
    return { normal, fire, fault };
  }

  if (deviceType === SMOKE) {
    const [normal, fire, fault, loss] = list.reduce(lambda, [0, 0, 0, 0]);
    return { normal, fire, fault, loss };
  }

  return {};
}
