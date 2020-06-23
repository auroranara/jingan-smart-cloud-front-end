import { toFixed } from '@/utils/utils';

export const STATUSES = [
  { key: '2', value: '待处理' },
  { key: '0', value: '处理中' },
  { key: '1', value: '已处理' },
];
export const FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const GET_TRANSFORMED_TIME = time => {
  if (time < 60 * 1000) {
    return '小于1min';
  } else {
    const day = Math.floor(time / (24 * 60 * 60 * 1000));
    time %= 24 * 60 * 60 * 1000;
    const hour = Math.floor(time / (60 * 60 * 1000));
    time %= 60 * 60 * 1000;
    const minute = Math.floor(time / (60 * 1000));
    // time %= 60 * 1000;
    // const second = Math.floor(time / 1000);
    return [
      day && `${day}d`,
      hour && `${hour}h`,
      minute && `${minute}min` /* , second && `${second}s` */,
    ]
      .filter(v => v)
      .join('');
  }
};
export const GET_MESSAGE_CONTENT = ({
  statusType,
  fixType,
  warnLevel,
  paramDesc,
  monitorValue,
  paramUnit,
  limitValue,
  monitorEquipmentTypeName,
  faultTypeName,
  condition,
}) => {
  if (+statusType === -1) {
    if (+fixType === 5) {
      return `${monitorEquipmentTypeName}发生火警`;
    } else if (+warnLevel === 1) {
      return `${monitorEquipmentTypeName}发生预警，${paramDesc}为${monitorValue}${paramUnit ||
        ''}，${condition === '>=' ? '超过' : '低于'}预警值${toFixed(
        Math.abs(limitValue - monitorValue)
      )}${paramUnit || ''}`;
    } else if (+warnLevel === 2) {
      return `${monitorEquipmentTypeName}发生告警，${paramDesc}为${monitorValue}${paramUnit ||
        ''}，${condition === '>=' ? '超过' : '低于'}告警值${toFixed(
        Math.abs(limitValue - monitorValue)
      )}${paramUnit || ''}`;
    }
  } else if (+statusType === -2) {
    return `${monitorEquipmentTypeName}发生失联`;
  } else if (+statusType === -3) {
    return `${monitorEquipmentTypeName}发生故障（${faultTypeName}）`;
  } else if (+statusType === 1) {
    if (+fixType === 5) {
      return `${monitorEquipmentTypeName}火警解除`;
    } else {
      return `${monitorEquipmentTypeName}报警解除（${paramDesc}）`;
    }
  } else if (+statusType === 2) {
    return `${monitorEquipmentTypeName}恢复在线`;
  } else if (+statusType === 3) {
    return `${monitorEquipmentTypeName}故障消除（${faultTypeName}）`;
  }
};
