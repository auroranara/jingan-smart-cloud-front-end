export function getColorVal(status) {
  switch (+status) {
    case 0:
      return 'rgba(0, 0, 0, 0.65)';
    case 1:
      return 'rgb(250, 173, 20)';
    case 2:
      return '#f5222d';
    default:
      return;
  }
};

export const paststatusVal = {
  0: '未到期',
  1: '即将到期',
  2: '已过期',
  null: '-',
};
