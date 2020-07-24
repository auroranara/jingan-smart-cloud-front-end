import React from 'react';

export const LABEL_COL = {
  span: 6,
};
export const WRAPPER_COL = {
  span: 12,
};
export const COL = {
  span: 24,
};
export const BUTTON_WRAPPER_COL = {
  offset: 6,
};
export const LIST_PAGE_COL = {
  xxl: 6,
  xl: 8,
  lg: 12,
  md: 12,
  sm: 24,
  xs: 24,
};
export const FORMAT = 'YYYY-MM-DD';
export const RANGE_PICKER_PLACEHOLDER = ['开始时间', '结束时间'];
// 空值
export const EmptyText = () => <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>---</span>;
// 表格相关方法
export const showTotal = total => `共 ${total} 条记录`;
// 选择器相关方法
export const getSelectValueFromEvent = value =>
  value && { ...value, key: value.key || value.value, value: value.key || value.value };
