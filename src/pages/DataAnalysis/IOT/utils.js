import moment from 'moment';

const DATE_FORMAT = 'YYYY/M/D H:m';
// const CONDITION_MAP = { 1: '≥', 2: '≤' };

export function addAlign(columns, align = 'center') {
  if (!columns) return;

  return columns.map(item => ({ ...item, align }));
}

export function getThisMonth() {
  return [moment().startOf('month'), moment().endOf('day')];
}

export function handleListFormVals(vals) {
  if (!vals) return {};

  const newVals = { ...vals };

  // 若没有检测类型，或者检测类型选择的是全部，即type=0，将type属性删除，默认全部
  if (!vals.type || vals.type === '0') delete newVals.type;

  return newVals;
}

// 将RangePicker中获取的moment数组转化成startTime及endTime属性
export function handleFormVals(vals) {
  if (!vals) return {};
  if (!('date' in vals)) return vals;

  const newVals = { ...vals };
  delete newVals.deviceType;
  delete newVals.date;
  // 若查询状态为全部，则删除该属性
  // if (vals.status === '0') delete newVals.status;

  // 若没有参数，或者参数选择的是全部，即code=0，将code属性删除，默认全部
  if (!vals.code || vals.code === '0') delete newVals.code;

  // 储罐异常参数查询时，若没有参数，或者参数选择的是全部，即modelCode=0，将modelCode属性删除，默认全部
  // if (!vals.modelCode || vals.modelCode === '0') delete newVals.modelCode;
  if (!vals.classModel || vals.classModel === '0') delete newVals.classModel;

  // [newVals.startTime, newVals.endTime] = vals.date.map(m => +m);
  [newVals.startTime, newVals.endTime] = vals.date.map(m => m.format(DATE_FORMAT));
  return newVals;
}

export function handleTableData(list = [], indexBase, deviceTypeMap={}) {
  return list.map((item, index) => {
    const {
      id,
      realtime,
      area,
      location,
      status,
      realtimeData,
      unit,
      limitValue,
      condition,
      desc,
      deviceType,
    } = item;
    const sts = Number.parseInt(status, 10);
    // 单位存在时，已divider(默认为|)分隔
    const u = handleUnit(unit);
    return {
      id,
      index: indexBase + index + 1,
      time: realtime ? moment(realtime).format('YYYY-MM-DD HH:mm:ss') : '-',
      area: area || '-',
      location: location || '-',
      status: sts,
      // value: sts === -1 || realtimeData === null ? '-' : `${realtimeData}${u}`,
      value: sts === -1 || realtimeData === null ? '-' : renderVal(realtimeData, u),
      limitValue: limitValue || limitValue === 0 ? renderVal(limitValue, u) : '-',
      // limitValue: <p style={{color: 'red'}}>limit</p>,
      // condition: sts === -1 ? '设备失联' : `${CONDITION_MAP[condition]}界限值`,
      // condition: sts === -25 ? '机械臂故障' : sts === -1 ? '设备失联' : condition ? `${condition}界限值` : '-',
      condition: getCondition(sts, condition, desc),
      parameter: sts === -1 || desc === null ? '-' : desc,
      deviceType: deviceTypeMap[deviceType],
    };
  });
}

function getCondition(status, condition, desc) {
  const sts = +status;
  if (sts === -25)
    return '机械臂故障';
  if (sts === -1)
    return '设备失联';
  if (sts === 0)
    return desc ? `${desc}正常` : '-';
  if (!condition)
    return '-';
  return `${desc}过${condition === '<=' ? '低' : '高'}`;
}

export function handleChemicalFormula(param = '') {
  if (param.length <= 1) return param;

  if (param === 'NOX')
    return (
      <span>
        NO
        <sub>x</sub>
      </span>
    );

  param = param.toUpperCase();

  const ms = param.match(/(\d+|\D+)/g);

  const children = ms.map((c, i) => {
    const n = Number.parseInt(c, 10);
    if (n) return <sub key={i}>{n}</sub>;
    return c;
  });

  return <span>{children}</span>;
}

// 处理单位
function handleUnit(unit) {
  // 单位不存在，或长度为1，或其中不含数字，原样返回
  if (!unit || unit.length === 1 || !/\d/.test(unit)) return unit;

  const ms = unit.match(/(\d+|\D+)/g);

  const children = ms.map(c => {
    const n = Number.parseInt(c, 10);
    if (n) return <sup>{n}</sup>;
    return c;
  });

  return children;
}

// 将数据与单位组合在一起
function renderVal(val, unit) {
  if (!unit) return val;

  if (!Array.isArray(unit)) return val + unit;

  return <span>{[val, ...unit]}</span>;
}

export function isDateDisabled(current, moments, months = 3) {
  const today = moment();
  if (!moments || !moments.length || moments.length === 2) return current > today;

  const m = moments[0];
  // 起始时间的前3个月或后3个月，今天之前都为可选
  return (
    current > m.clone().add(months, 'months') ||
    current < m.clone().subtract(months, 'months') ||
    current > today
  );
}
