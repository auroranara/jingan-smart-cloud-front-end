import moment from 'moment';

export const DATE_FORMAT = 'YYYY/M/D';
export const STATUS_MAP = { '-1': '失联', 1: '预警', 2: '告警' };
export const STATUS_COLOR_MAP = { '-1': 'rgba(0,0,0,0.65)', 1: 'orange', 2: 'red' };
export const CONDITION_MAP = { 1: '≥', 2: '≤' };

export function addAlign(columns, align='center') {
  if (!columns)
    return;

  return columns.map(item => ({ ...item, align }));
}

export function getThisMonth() {
  return [moment().startOf('month'), moment().endOf('day')];
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
  // [newVals.startTime, newVals.endTime] = vals.date.map(m => +m);
  [newVals.startTime, newVals.endTime] = vals.date.map(m => m.format(DATE_FORMAT));
  return newVals;
}

export function handleTableData(list=[], divider='|') {
  return list.map((item, index) => {
    const { id, realtime, area, location, status, realtimeData, unit, limitValue, condition, desc } = item;
    const sts = Number.parseInt(status, 10);
    // 单位存在时，已divider(默认为|)分隔
    const u = unit ? `${divider}${unit}` : '';
    return {
      id,
      index: index + 1,
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

  if (!ms)
    return param;

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

  const ms = unit.match(/(\d+|\D+)/g);

  if (!ms)
    return val + unit;

  const children = ms.map(c => {
    const n = Number.parseInt(c, 10);
    if (n)
      return <sup>{n}</sup>;
    return c;
  });

  children.unshift(val);

  return <span>{children}</span>;
}
