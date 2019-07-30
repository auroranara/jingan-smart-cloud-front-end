export function vaguePhone(phone, phoneVisible) {
  const newPhone =
    phoneVisible || !phone ? phone : `${phone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
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
