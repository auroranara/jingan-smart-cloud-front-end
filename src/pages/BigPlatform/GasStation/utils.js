import moment from 'moment';

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

function calcItemColor(item, pieces) {
  const value = item.value[1];
  if (!pieces || pieces.length <= 0 || value === undefined) return item;
  pieces.forEach(p => {
    if (
      (p.condition === '1' && value >= p.limitValue) ||
      (p.condition === '2' && value <= p.limitValue)
    ) {
      item = {
        ...item,

      };
    }
  });
  return item;
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

export function getSplit(num) {

}
