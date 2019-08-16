export const CYAN_STYLE = { color: '#0FF' };

export function getMsgIcon(type, list) {
  const target = list.find(({ types }) => types.includes(+type));
  if (target)
    return target.icon;
}

export function vaguePhone(phone, phoneVisible) {
  if (!phone)
    return '';

  const newPhone =
    phoneVisible ? phone : `${phone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  return newPhone;
}

const NoPieData = [
  {
    value: 0,
    itemStyle: { color: '#334d6e' },
    tooltip: { show: false },
    label: { normal: { show: false }, emphasis: { show: false } },
    labelLine: { normal: { show: false }, emphasis: { show: false } },
  },
];
// 筛掉图表0的数据
export const filterChartValue = (chartData = []) => {
  const newData = chartData.filter(item => !!item.value);
  return newData.length ? newData : NoPieData;
};

export function getMaxNameLength(list) {
  list = list.filter(itm => itm);
  if (!list || !list.length)
    return 0;

  return Math.max(...list.map(({ name }) => name ? name.length : 0));
}
