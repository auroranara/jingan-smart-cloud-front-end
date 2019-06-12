/**
 * description: 这个文件是用来存放字典的
 * author: sunkai
 * date: 2018年12月24日
 */
/****************************************************  以下为正文  ************************************************************/
import { generateEnum } from '@/utils/utils';
 /**
  * 隐患状态
  */
export const hiddenDangerStatus = generateEnum({
  '1': '新建',
  '2': '待整改',
  '3': '待复查',
  '4': '已关闭',
  '5': '全部',
  '7': '已超期',
});

/**
 * 隐患检查状态，和上面那个基本一样
 */
export const hiddenDangerCheckStatus = generateEnum({
  '2': '未超期',
  '3': '待复查',
  '4': '已关闭',
  '5': '全部',
  '7': '已超期',
});

/**
 * 隐患业务分类
 */
export const hiddenDangerType = generateEnum({
  '1': '安全生产',
  '2': '消防',
  '3': '环保',
  '4': '卫生',
});

/**
 * 隐患上报来源
 */
export const hiddenDangerSource = generateEnum({
  1: '企业自查',
  2: '政府监督',
  3: '维保检查',
});

/**
 * 点位风险等级
 */
export const PointLevel = generateEnum({
  '1': '红',
  '2': '橙',
  '3': '黄',
  '4': '蓝',
  '5': '未评级',
});

/**
 * 点位检查状态
 */
export const pointStatus = generateEnum({
  '1': '正常',
  '2': '异常',
  '3': '待检查',
  '4': '已超时',
});

/**
 * 设备状态
 */
export const deviceStatus = generateEnum({
  '-3': '故障',
  '-1': '失联',
  '0': '正常',
  '1': '预警',
  '2': '告警',
});

/**
 * 单位类型
 */
export const unitType = generateEnum({
  1: '维保',
  2: '政府',
  3: '运维',
  4: '企业',
});
