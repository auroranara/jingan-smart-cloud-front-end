export { genCardsInfo } from '@/pages/BigPlatform/Smoke/utils';

export const ALL_DEVICES = 0;
export const HOST = 1;
export const SMOKE = 2;
export const ELEC = 3;
export const GAS = 4;
export const WATER = 5;
export const TYPE_KEYS = ['', 'fire', 'smoke', 'elec', 'gas', 'water'];
export const COUNT_BASE_KEY = 'DeviceCount';
export const COUNT_KEYS = ['Normal', 'Fire', 'Fault', 'UnConnect'];
export const TYPE_DESCES = ['服务单位', '消防主机', '独立烟感', '电气火灾', '可燃气体', '水系统'];
export const TYPE_COUNTS = [ // deviceType不同时对应的状态
  [1, 1, 1, 1],
  [1, 1, 1, 0],
  [1, 1, 1, 1],
  [1, 1, 0, 1],
  [1, 1, 1, 1],
  [1, 1, 0, 1],
];
export const PAGE_SIZE = 10;

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
    const status = getMapItemStatus(next, deviceType);
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

export function getUnitList(list, deviceType) {
  switch(deviceType) {
    case ALL_DEVICES:
      return list;
    case HOST:
      return list.filter(({ fireDeviceCount }) => fireDeviceCount);
    case SMOKE:
      return list.filter(({ smokeDeviceCount }) => smokeDeviceCount);
    default:
      return [];
  }
}

export function getUnitLists(list) {
  const lists = list.reduce((prev, next) => {
    prev.forEach((lst, i) => {
      if (next[`${TYPE_KEYS[i + 1]}DeviceCount`])
        lst.push(next);
    });
    return prev;
  }, [[], [], [], [], []]);
  return [list, ...lists];
}

export function hidePhone(phone) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export function sortUnits(units, deviceType) {
  if (!Array.isArray(units))
    return [];
  const [normal, fire, fault, loss] = units.reduce((prev, next) => {
    const status = getMapItemStatus(next, deviceType);
    prev[status].push(next);
    return prev;
  }, [[], [], [], []]);
  return [normal, loss, fault, fire].reduce((prev, next) => prev.concat(next), []);
}
