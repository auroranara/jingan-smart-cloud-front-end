export const WIDTH = 2415;
export const HEIGHT = 1618;

export const PROCESSES = [
  { name: '丁二烯气相', position: [105, 32] },
  { name: '苯乙烯进料', position: [105, 130] },
  { name: '丁二烯进料', position: [105, 230] },
];

export const VALVES = [
  { name: 'KV1001', position: [410, 208] },
  { name: 'KV1003', position: [826, 104] },
  { name: 'KV1024', position: [680, 216], direction: 'right' },
  { name: 'PA1001', position: [584, 314] },
  { name: 'PA1002', position: [1082, 316] },
  { name: 'KV1002', position: [552, 744], direction: 'left' },
  { name: 'KV1004', position: [1046, 744], direction: 'left' },
  { name: 'P1001', position: [560, 814], direction: 'left' },
  { name: 'P1002', position: [1060, 806], direction: 'left' },
  { name: 'P1003', position: [1528, 760], direction: 'left' },
  { name: 'KV1026', position: [584, 996], direction: 'left'},
  { name: 'KV1005', position: [736, 996], direction: 'right' },
  { name: 'KV1025', position: [536, 1056], direction: 'left' },
  { name: 'KV1006', position: [786, 1056], direction: 'right' },
  { name: 'PA1003', position: [660, 1068] },
  { name: 'KV1007', position: [620, 1508], direction: 'left' },
  { name: 'P1004', position: [790, 1468] },
  { name: 'P1005', position: [790, 1568] },
  { name: 'KV1010', position: [1036, 1306] },
  { name: 'KV1013', position: [1036, 1428] },
  { name: 'KV1008', position: [1174, 1036], direction: 'left' },
  { name: 'KV1009', position: [1238, 998] },
  { name: 'PA1004', position: [1394, 1066] },
  { name: 'KV1011', position: [1440, 1008] },
  { name: 'KV1012', position: [1518, 1068], direction: 'right' },
  { name: 'TA1003', position: [1582, 1176] },
  { name: 'TA1001', position: [1582, 1318] },
  { name: 'TA1002', position: [1582, 1444] },
  { name: 'TV1001', position: [1642, 1520], direction: 'right' },
  { name: 'KV1016', position: [1814, 1304] },
  { name: 'KV1019', position: [1814, 1430] },
  { name: 'KV1014', position: [1950, 1010], direction: 'left' },
  { name: 'KV1015', position: [2040, 970] },
  { name: 'KV1017', position: [2214, 1008] },
  { name: 'KV1018', position: [2294, 1068], direction: 'right' },
  { name: 'PA1005', position: [2174, 1068] },
  { name: 'TA1006', position: [2360, 1176] },
  { name: 'TA1004', position: [2360, 1318] },
  { name: 'TA1005', position: [2360, 1444] },
  { name: 'TV1002', position: [2350, 1524], direction: 'left' },
];

export function getDirectionStyle(position, direction='top') {
  const [left, top] = position;
  const leftPercent = left/WIDTH*100;
  const topPercent = top/HEIGHT*100;

  switch(direction) {
    case 'top':
      return { left: `${leftPercent}%`, bottom: `${100 - topPercent}%`, transform: 'translateX(-50%)' };
    case 'left':
      return { right: `${100 - leftPercent}%`, top: `${topPercent}%`, transform: 'translateY(-50%)' };
    case 'right':
      return { left: `${leftPercent}%`, top: `${topPercent}%`, transform: 'translateY(-50%)' };
    case 'bottom':
      return { left: `${leftPercent}%`, top: `${topPercent}%`, transform: 'translateX(-50%)' };
    case 'center':
      return { left: `${leftPercent}%`, top: `${topPercent}%`, transform: 'translate(-50%, -50%)' };
    default: // left top
      return { left: `${leftPercent}%`, top: `${topPercent}%` };
  }
}

export const DATA = {
  processName: '光气及光气化工工艺',
  processType: '放热反应',
  material: '丁二烯',
  intermediate: '乙烯',
  product: '辛酸',
}
