import moment from 'moment';

export const MAX_MPa = 2;
export const MAX_M = 10;
export const WATER_TYPES = [101, 102, 103];

export function getWaterTotal(list) {
  if (!list || !list.length)
    return 0;

  const target = list.find(s => s.code === 'value');
  return target && target.value ? target.value : 0;
}

export function legendFormatter(limits, unit) {
  const [lower, upper] = limits;
  const lowerDesc = lower ? `≤${lower}${unit}` : '';
  const upperDesc = upper ? `≥${upper}${unit}` : '';
  return lower || upper ? `报警范围：${lowerDesc}${lower && upper ? '或' : ''}${upperDesc}` : null;
};

export function tooltipFormatter(params) {
  if (Array.isArray(params)) {
    return (
      `${moment(params[0].name).format('HH:mm')}<br/>` +
      params
        .map(item => {
          return `${item.marker}<span style="color: ${
            item.color === '#e01919' ? '#e01919' : '#fff'
          }">${item.seriesName}：${item.value[1]}</span>`;
        })
        .join('<br/>')
    );
  } else {
    return (
      `${moment(params.name).format('HH:mm')}<br/>` +
      `${params.marker}<span style="color: ${params.color === '#e01919' ? '#e01919' : '#fff'}">${
        params.seriesName
      }：${params.value[1]}</span><br/>`
    );
  }
};

function isBeyond(value, limits) {
  if (Number.isNaN(value))
    return false;

  const [lower, upper] = limits;
  return isExist(lower) && value < lower || isExist(upper) && value > upper;
}

function isExist(value) {
  return value !== null && value !== undefined;
}

function convertToTimestamp(timeflag) {
  const date = moment().format('YYYY-MM-DD');
  return +moment(`${date} ${timeflag}`);
}

export function getChartList(list, limits) {
  return list.map(({ timeFlag, value }) => {
    const val = +value;
    const time = convertToTimestamp(timeFlag);
    const item = { name: time, value: [time, val] };
    if (isBeyond(val, limits))
      return { ...item, itemStyle: { color: '#e01919' } };
    return item;
  });
}

// 传感器状态 -1 失联 0 正常 1 告警 2 预警
export function getStatusCount(water) {
  const { list, ...restProps } = water;
  return list.reduce((prev, next) => {
    const { deviceDataList: [{ status }] } = next;
    const sts = +status;
    if (!sts)
      prev.normal += 1;
    else if (sts === -1)
      prev.loss += 1;
    else if (sts > 0)
      prev.alarm += 1;
    return prev;
  }, { ...restProps, alarm: 0, loss: 0, normal: 0, total: list.length });
}

export function formatTime(time) {
  const diff = moment().diff(moment(time));
  if (diff >= 2 * 24 * 60 * 60 * 1000) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
  } else if (diff >= 24 * 60 * 60 * 1000) {
    return moment(time).format('昨日 HH:mm:ss');
  } else if (diff >= 60 * 60 * 1000) {
    return moment(time).format('今日 HH:mm:ss');
  } else if (diff >= 60 * 1000) {
    return `${moment.duration(diff).minutes()}分钟前`;
  } else {
    return '刚刚';
  }
}

const LENGTH_UNITS = ['mm', 'cm', 'dm', 'm'];
export function isLengthUnit(unit) {
  return unit ? LENGTH_UNITS.includes(unit.trim().toLowerCase()) : false;
}

export function getMaxDeep(max, unit) {
  return max ? getMaxDeepByNum(max) : getMaxDeepByUnit(unit);
}

function getMaxDeepByNum(n) {
  if (n < 1)
    return 1;

  let m = n;
  let i = 0;
  while(m > 10) {
    m /= 10;
    i++;
  }
  return getFlagNum(m) * (10 ** i);
}

const FLAG_NUM = 2.5;
function getFlagNum(n) {
  for (let i = 1; i < 5; i++) {
    const flag = i * FLAG_NUM;
    if (n < flag)
      return flag;
  }
}

function getMaxDeepByUnit(unit) {
  const u = unit.trim().toLowerCase();
  let coefficient = 1;
  switch(u) {
    case 'cm':
      coefficient *= 10;
      break;
    case 'mm':
      coefficient *= 100;
      break;
    default:
      console.log('default');
  }

  return coefficient * MAX_M;
}

// waterTabItem 0 消火栓 1 喷淋 2 水池/水箱  0，1-> Gauge 2->WaterTank
export function isGauge(tab, unit) {
  if (tab !== undefined)
    return tab === 0 || tab === 1 ? true : false;
  return !isLengthUnit(unit);
}

export function getMin(...args) {
  return getTarget(0, args);
}

export function getMax(...args) {
  return getTarget(1, args);
}

function getTarget(type, nums) {
  const ns = nums.filter(n => n !== undefined && n !== null);
  if (ns.length)
    return Math[type ? 'max' : 'min'](...ns);
  return null;
}

export function getStatusDesc(value, limitLists, descs) {
  const val = Number.parseFloat(value);
  if (Number.isNaN(val))
    return;

  const limits = limitLists.reduce((prev, next) => {
    next.forEach((n, i) => prev[i].push(n));
    return prev;
  }, [[], []])
  const [min, max] = limits.map((ns, i) => getTarget(i, ns));
  if (min !== null && val <= min)
    return descs[0];
  else if (max !== null && val >= max)
    return descs[1];
}

export const LOSS = -1;
export function getStatusColor(status, colors) {
  let index = 0;
  if (status === LOSS)
    index = 0;
  else if (status === 0)
    index = 1;
  else if (status > 0)
    index = 2;

  return colors[index];
}
