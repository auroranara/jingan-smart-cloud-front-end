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
const COUNT_KEYS1 = ['Fire', 'Fault', 'UnConnect', 'Normal'];
export const COUNT_LABELS = ['正常', '报警', '故障', '失联'];
export const BAR_LABELS = COUNT_LABELS.slice(1);
export const BAR_COLORS = ['#f83329', '#ffb400', '#9f9f9f'];
export const TYPE_DESCES = ['服务单位', '消防主机', '独立烟感', '电气火灾', '可燃气体', '水系统'];
export const TYPE_COUNTS = [ // deviceType不同时对应的传感器状态类型是否显示
  [1, 1, 1, 1],
  [1, 1, 1, 0],
  [1, 1, 1, 1],
  [1, 1, 0, 1],
  [1, 1, 1, 1],
  [1, 1, 0, 1],
];
export const PAGE_SIZE = 10;

export function getStatuses(item) {
  return TYPE_KEYS.slice(1).map(k => COUNT_KEYS1.map(ck => {
    const value = item[`${k}${COUNT_BASE_KEY}For${ck}`];
    return value ? +value : 0;
  }));
}

export function getStatusImg(list, imgs) {
  let i = 0;
  for(; i < list.length; i++) {
    if (list[i])
      return imgs[i];
  }
  return imgs[i];
}

export function getMapItemStatus(item, deviceType) { // 0 正常 1 报警 2 故障 3 失联
  if (deviceType === ALL_DEVICES) // 所有设备，判断每一种，只要有报警/失联/故障，就显示为红色
    return +TYPE_KEYS.slice(1).some(k =>  COUNT_KEYS.slice(1).some(countKey => item[`${k}${COUNT_BASE_KEY}For${countKey}`]));

  let status = 0;
  const typeKey = TYPE_KEYS[deviceType];
  const typeCount = TYPE_COUNTS[deviceType];
  for (let i = 1; i < COUNT_KEYS.length; i++)
    if (typeCount[i] && item[`${typeKey}${COUNT_BASE_KEY}For${COUNT_KEYS[i]}`]) {
      status = i;
      break;
    }

  return status;
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

  const typeCount = TYPE_COUNTS[deviceType];
  const [normal, fire, fault, loss] = list.reduce(lambda, [0, 0, 0, 0]).map((n, i) => typeCount[i] ? n : undefined);
  return { normal, fire, fault, loss };
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

export function getAllDevicesCount(item) {
  return [0, [0, 0, 0, 0]];
}
