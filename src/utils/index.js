import React from 'react';
import moment from 'moment';

export const labelCol = {
  span: 6,
};
export const wrapperCol = {
  span: 12,
};
export const col = {
  span: 24,
};
export const buttonWrapperCol = {
  offset: 6,
};
export const listPageCol = {
  xxl: 6,
  xl: 8,
  lg: 12,
  md: 12,
  sm: 24,
  xs: 24,
};
export const hiddenCol = {
  span: 0,
};
export const timeRangePickerCol = {
  xxl: 12,
  xl: 16,
  lg: 24,
  md: 24,
  sm: 24,
  xs: 24,
};
// 日期格式
export const dateFormat = 'YYYY-MM-DD';
// 时间格式
export const timeFormat = 'YYYY-MM-DD HH:mm:ss';
// 精确到分钟的格式
export const minuteFormat = 'YYYY-MM-DD HH:mm';
// 日期范围选择器提示文字
export const dateRangePickerPlaceholder = ['开始日期', '结束日期'];
// 时间范围选择器提示文字
export const timeRangePickerPlaceholder = ['开始时间', '结束时间'];
// 默认每页显示数量
export const PAGE_SIZE = 10;
// 分页
export const pagination = {
  pageNum: 1,
  pageSize: PAGE_SIZE,
};
// 空值
export const EmptyText = () => <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>---</span>;
// 文本值
export const Text = ({
  type,
  value,
  addonAfter,
  options,
  labelInValue,
  mode,
  format,
  treeData,
  multiple,
}) => {
  if (value) {
    let result;
    switch (type) {
      case 'Select':
        if (mode === 'multiple') {
          if (value.length) {
            if (labelInValue) {
              result = value.map(item => item.label).join('、');
            } else if (options && options.length) {
              result = value
                .map(item => (options.find(option => option.value === item) || {}).label)
                .filter(v => v)
                .join('、');
            }
          }
        } else if (mode === 'tags') {
          if (value.length) {
            if (labelInValue) {
              result = value.map(item => item.label).join('、');
            } else {
              result = value
                .map(
                  item =>
                    ((options || []).find(option => option.value === item) || {}).label || item
                )
                .filter(v => v)
                .join('、');
            }
          }
        } else {
          if (labelInValue) {
            result = value.label;
          } else if (options && options.length) {
            result = (options.find(option => option.value === value) || {}).label;
          }
        }
        break;
      case 'TreeSelect':
        // 暂时先不做不为labelInValue的判断
        if (multiple) {
          if (labelInValue) {
            result = result = value.map(item => item.label).join('、');
          }
        } else {
          if (labelInValue) {
            result = value.label;
          }
        }
        break;
      case 'DatePicker':
        result = value.format(format);
        break;
      case 'RangePicker':
        if (value[0] && value[1]) {
          result = `${value[0].format(format)} ~ ${value[1].format(format)}`;
        }
        break;
      case 'Radio':
        result = (options.find(option => option.value === value) || {}).label;
        break;
      case 'TextArea':
        result = <div style={{ whiteSpace: 'pre-wrap' }}>{value}</div>;
        break;
      case 'Upload':
        if (value.length) {
          result = value.map((item, index) => (
            <div key={index}>
              <a href={item.webUrl} target="_blank" rel="noopener noreferrer">
                {item.fileName}
              </a>
            </div>
          ));
        }
        break;
      default:
        result = value;
        break;
    }
    return result ? (
      <div style={{ padding: '5px 0' }}>
        {result}
        {addonAfter}
      </div>
    ) : (
      <EmptyText />
    );
  }
  return <EmptyText />;
};
// 表格显示总数
export const showTotal = total => `共 ${total} 条记录`;
// 获取选择器值
export const getSelectValueFromEvent = value =>
  value && { ...value, key: value.key || value.value, value: value.key || value.value };
// 获取多选选择器值
export const getMultipleSelectValueFromEvent = value =>
  value &&
  value.map(item => ({ ...item, key: item.key || item.value, value: item.key || item.value }));
// 获取输入框值
export const getInputValue = ({ target: { value } }) => value && value.trim();
// 获取预设时间范围快捷选择
export const getRanges = (
  rangeList = ['今天', '最近一周', '最近一个月', '最近三个月', '最近半年', '最近一年']
) =>
  rangeList.reduce((result, item) => {
    switch (item) {
      case '今天':
        result['今天'] = [moment().startOf('day'), moment().endOf('day')];
        break;
      case '最近一周':
        result['最近一周'] = [
          moment()
            .startOf('day')
            .subtract(1, 'weeks')
            .add(1, 'days'),
          moment().endOf('day'),
        ];
        break;
      case '最近一个月':
        result['最近一个月'] = [
          moment()
            .startOf('day')
            .subtract(1, 'months')
            .add(1, 'days'),
          moment().endOf('day'),
        ];
        break;
      case '最近三个月':
        result['最近三个月'] = [
          moment()
            .startOf('day')
            .subtract(1, 'quarters')
            .add(1, 'days'),
          moment().endOf('day'),
        ];
        break;
      case '最近半年':
        result['最近半年'] = [
          moment()
            .startOf('day')
            .subtract(6, 'months')
            .add(1, 'days'),
          moment().endOf('day'),
        ];
        break;
      case '最近一年':
        result['最近一年'] = [
          moment()
            .startOf('day')
            .subtract(1, 'years')
            .add(1, 'days'),
          moment().endOf('day'),
        ];
        break;
      default:
        break;
    }
    return result;
  }, {});
