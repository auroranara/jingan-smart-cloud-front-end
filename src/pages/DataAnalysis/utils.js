import moment from 'moment';

const DATE_FORMAT = 'YYYY/M/D';
const CONDITION_MAP = { 1: '≥', 2: '≤' };

export function addAlign(columns, align='center') {
  if (!columns)
    return;

  return columns.map(item => ({ ...item, align }));
}

export function getThisMonth() {
  return [moment().startOf('month'), moment().endOf('day')];
}

export function handleListFormVals(vals) {
  if (!vals)
    return {};

  const newVals = { ...vals };

  // 若没有检测类型，或者检测类型选择的是全部，即type=0，将type属性删除，默认全部
  if (!vals.type || vals.type === '0')
    delete newVals.type;
}

// 将RangePicker中获取的moment数组转化成startTime及endTime属性
export function handleFormVals(vals) {
  if (!vals)
    return {};

  if (!('date' in vals))
    return vals;

  const newVals = { ...vals };
  delete newVals.date;
  // 若查询状态为全部，则删除该属性
  if (vals.status === '0')
    delete newVals.status;

  // 若没有参数，或者参数选择的是全部，即code=0，将code属性删除，默认全部
  if (!vals.code || vals.code === '0')
    delete newVals.code;

  // [newVals.startTime, newVals.endTime] = vals.date.map(m => +m);
  [newVals.startTime, newVals.endTime] = vals.date.map(m => m.format(DATE_FORMAT));
  return newVals;
}

export function handleTableData(list=[], indexBase, divider='|') {
  return list.map((item, index) => {
    const { id, realtime, area, location, status, realtimeData, unit, limitValue, condition, desc } = item;
    const sts = Number.parseInt(status, 10);
    // 单位存在时，已divider(默认为|)分隔
    const u = unit ? `${divider}${unit}` : '';
    return {
      id,
      index: indexBase + index + 1,
      time: realtime ? moment(realtime).format('YYYY-MM-DD HH:MM:SS') : '-',
      area: area || '-',
      location: location || '-',
      status: sts,
      value: sts === -1 || realtimeData === null ? '-' : `${realtimeData}${u}`,
      limitValue: limitValue || '-',
      condition: sts === -1 ? '设备失联' : `${CONDITION_MAP[condition]}界限值`,
      parameter: sts === -1 || desc === null ? '-' : desc,
    };
  });
}

export function handleChemicalFormula(param='') {
  if (param.length <= 1)
    return param;

  if (param === 'NOX')
    return <span>NO<sub>x</sub></span>;

  param = param.toUpperCase();

  const ms = param.match(/(\d+|\D+)/g);

  const children = ms.map(c => {
    const n = Number.parseInt(c, 10);
    if (n)
      return <sub>{n}</sub>;
    return c;
  });

  return <span>{children}</span>;
}

// value值为val|unit，分开值及单位，然后单独处理单位
export function handleUnit(value, divider='|') {
  if (!value || !value.includes(divider) || value.length <= 1)
    return value;

  const [val, unit] = value.split('|');

  // 没有单位，直接返回数据
  if (!unit)
    return val;

  const ms = unit.match(/(\d+|\D+)/g);

  const children = ms.map(c => {
    const n = Number.parseInt(c, 10);
    if (n)
      return <sup>{n}</sup>;
    return c;
  });

  children.unshift(val);

  return <span>{children}</span>;
}

export function isDateDisabled(current, moments, months=3) {
  const today = moment();
    if (!moments || !moments.length || moments.length === 2)
      return current > today;

    const m = moments[0];
    // 起始时间的前3个月或后3个月，今天之前都为可选
    return current > m.clone().add(months, 'months') || current < m.clone().subtract(months, 'months') || current > today;
}
