export { genCardsInfo } from '@/pages/BigPlatform/Smoke/utils';

export const MAP_THEMES = [
  { desc: '标准', value: 0 },
  { desc: '静蓝', value: 1 },
];

export const ALL_DEVICES = 0;
export const HOST = 1;
export const SMOKE = 2;
export const ELEC = 3;
export const GAS = 4;
export const WATER = 5;

export const GAS_CODE = 'value';
export const ARM_CODE = '_arm_status';

export const TYPE_KEYS = ['all', 'fire', 'smoke', 'elec', 'gas', 'water'];
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
  const COUNT_KEYS_1 = COUNT_KEYS.slice(1);
  if (deviceType === ALL_DEVICES) // 所有设备，判断每一种，只要有报警/失联/故障，就显示为红色
    return +TYPE_KEYS.slice(1).some(k => COUNT_KEYS_1.some(countKey => item[`${k}${COUNT_BASE_KEY}For${countKey}`]));

  return getMapItemStatus1(item, deviceType);
}

function getMapItemStatus1(item, deviceType) {
  let status = 0;
  const typeKey = TYPE_KEYS[deviceType];
  const typeCount = TYPE_COUNTS[deviceType];
  for (let i = 1; i < COUNT_KEYS.length; i++)
    if (typeCount[i] && item[`${typeKey}${COUNT_BASE_KEY}For${COUNT_KEYS[i]}`]) {
      status = i;
      break;
    }

  return deviceType ? status : +!!status; // deviceType(0)为全部设备，只有0/1两个图标，所以要特殊处理
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
  addAllStatusCount(list);
  const lists = list.reduce((prev, next) => {
    prev.forEach((lst, i) => {
      if (next[`${TYPE_KEYS[i + 1]}DeviceCount`])
        lst.push(next);
    });
    return prev;
  }, [[], [], [], [], []]);
  const allLists = [list, ...lists];
  allLists.forEach(sortByStatus);
  return allLists;
}

export function aggregateByLocation(lists) {
  const aggregationLists =  lists.map(list => list.reduce((prev, next) => {
    const { latitude, longitude } = next;
    const target = prev.find(({ latitude: lat, longitude: lon }) => lat === latitude && lon === longitude);
    if (target)
      target.list.push(next);
    else
      prev.push({ isAgg: true, latitude, longitude, key: `${latitude}${longitude}`, list: [next], icon: undefined });
    return prev;
  }, []));
  getAggregationStatus(aggregationLists);
  // console.log(aggregationLists);
  return aggregationLists;
}

function getAggregationStatus(lists) {
  lists.forEach((lst, index) => {
    const baseKey = `${TYPE_KEYS[index]}${COUNT_BASE_KEY}`;
    lst.forEach(item => {
      const { list } = item;
      const aggItem = COUNT_KEYS.reduce((prev, next) => {
        const prop = `${baseKey}For${next}`;
        prev[prop] = list.reduce((prv, nxt) => prv + (nxt[prop] ? nxt[prop] : 0), 0);
        return prev;
      }, {});
      item.icon = getMapItemStatus1(aggItem, index);
    });
  });
}

function addAllStatusCount(list) {
  const allKey = TYPE_KEYS[0];
  const deviceKeys = TYPE_KEYS.slice(1);
  list.forEach(item => {
    COUNT_KEYS.forEach(k => {
      const baseKey = `${COUNT_BASE_KEY}For${k}`;
      item[`${allKey}${baseKey}`] = deviceKeys.reduce((prev, next) => {
        const count = item[`${next}${baseKey}`];
        return count ? prev + count : prev;
      }, 0);
    });
    item[`${allKey}${COUNT_BASE_KEY}`] = deviceKeys.reduce((prev, next) => prev + item[`${next}${COUNT_BASE_KEY}`], 0);
    item.icons = TYPE_KEYS.map((k, i) => getMapItemStatus1(item, i));
  });
}

function sortByStatus(list, index) {
  const typeLabel = TYPE_KEYS[index];
  const typeCount = TYPE_COUNTS[index];
  const factors = COUNT_KEYS.filter((k, i) => typeCount[i]).map(k => `${typeLabel}DeviceCountFor${k}`);
  let first = factors.shift();
  factors.push(first, 'companyName');
  sortByFactors(list, factors);
}

function isNumber(n) {
  return typeof n === 'number' && !Number.isNaN(n);
}

function sortByFactors(list, factors) {
  const length = list.length;
  if (!list || !length || length === 1 || !factors || !factors.length)
    return list;
  const prop = factors[0];
  const nextFactors = factors.slice(1);
  list.sort((a, b) => {
    const [a1, b1] = [a, b].map(o => o[prop]);
    const [na, nb] = [a1, b1].map(s => Number.parseFloat(s));
    if ([na, nb].every(isNumber))
      return nb - na;
    return a1.localeCompare(b1);
  });

  let flag;
  let accumList = [];
  for (let i = 0; i < list.length; i++) {
    const o = list[i];
    const v = o[prop];
    if (flag !== v) {
      flag = v;
      accumList.push([o]);
    } else
      accumList[accumList.length - 1].push(o);
  }
  accumList.forEach(lst => sortByFactors(lst, nextFactors));

  let accumIndex = 0;
  accumList.forEach(lst => lst.forEach(o => list[accumIndex++] = o));

  return list;
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
  return TYPE_KEYS.slice(1).reduce((prev, next) => {
    const baseKey = `${next}${COUNT_BASE_KEY}`;
    prev[0] += item[baseKey];
    COUNT_KEYS.forEach((ck, i) => {
      prev[1][i] += item[`${baseKey}For${ck}`] || 0;
    });
    return prev;
  }, [0, [0, 0, 0, 0]]);
}

export function findAggUnit(origin, units) {
  const { companyId } = origin;
  return units.find(({ list }) => list.map(({ companyId }) => companyId).includes(companyId));
}
