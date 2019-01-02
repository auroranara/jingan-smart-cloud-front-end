import { DatePicker, Input, Select } from 'antd';
import moment from 'moment';
import { handleChemicalFormula, getThisMonth } from './utils';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const ELECTRICITY_TYPE = 1;
export const ELECTRICITY_TYPE_LABEL = '电气火灾异常数据分析';
export const TOXIC_GAS_TYPE = 2;
export const TOXIC_GAS_TYPE_LABEL = '可燃有毒气体异常数据分析';
export const WASTE_WATER_TYPE = 3;
export const WASTE_WATER_TYPE_LABEL = '废水异常数据分析';
export const WASTE_GAS_TYPE = 4;
export const WASTE_GAS_TYPE_LABEL = '废气异常数据分析';
export const STORAGE_TANK_TYPE = 5;
export const STORAGE_TANK_TYPE_LABEL = '储罐异常数据分析';
export const SMOKE_DETECTOR_TYPE = 6;
export const SMOKE_DETECTOR_TYPE_LABEL = '独立烟感异常数据分析';

export const PAGE_SIZE = 10;
const STATUS_MAP = { '-1': '失联', 1: '预警', 2: '告警' };
const SMOKE_STATUS_MAP = { '-1': '失联', 2: '火警' };
const STATUS_COLOR_MAP = { '-1': 'rgba(0,0,0,0.65)', 1: 'orange', 2: 'red' };

const OPTIONS = [
  { name: '全部', key: 0 },
  { name: '预警', key: 1 },
  { name: '告警', key: 2 },
  { name: '失联', key: -1 },
];

const SMOKE_OPTIONS = [
  { name: '全部', key: 0 },
  { name: '火警', key: 2 },
  { name: '失联', key: -1 },
];

export const SPAN_2 = { span: 2 };
export const SPAN_4 = { span: 4 };
export const SPAN_6 = { span: 6 };
export const SPAN_16 = { span: 16 };
export const SPAN_18 = { span: 18 };
export const LABEL_COL_2 = SPAN_2;
export const LABEL_COL_4 = SPAN_4;
export const LABEL_COL_6 = SPAN_6;
export const WRAPPER_COL = SPAN_18;
export const INPUT_SPAN = { lg: 6, md: 12, sm: 24 };

export const CONDITION_MAP = { 1: '≥', 2: '≤' };

export const ELECTRICITY_PARAMS = [
  { name: '全部', key: 0 },
  { name: '漏电电流', key: 'v1' },
  { name: 'A相温度', key: 'v2' },
  { name: 'B相温度', key: 'v3' },
  { name: 'C相温度', key: 'v4' },
  { name: '零线温度', key: 'v5' },
  { name: 'A相电流', key: 'ia' },
  { name: 'B相电流', key: 'ib' },
  { name: 'C相电流', key: 'ic' },
  { name: 'A相电压', key: 'ua' },
  { name: 'B相电压', key: 'ub' },
  { name: 'C相电压', key: 'uc' },
];

export const ELECTRICITY_COLUMNS = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '异常类别',
    dataIndex: 'status',
    key: 'status',
    render: sts => <span style={{ color: STATUS_COLOR_MAP[sts] }}>{STATUS_MAP[sts]}</span>,
  },
  {
    title: '异常参数',
    dataIndex: 'parameter',
    key: 'parameter',
  },
  {
    title: '监测数值',
    dataIndex: 'value',
    key: 'value',
    // render: value => handleUnit(value),
  },
  {
    title: '报警界限值',
    dataIndex: 'limitValue',
    key: 'limitValue',
  },
  {
    title: '报警描述',
    dataIndex: 'condition',
    key: 'condition',
  },
];

export const TOXIC_GAS_COLUMNS = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '异常类别',
    dataIndex: 'status',
    key: 'status',
    render: sts => <span style={{ color: STATUS_COLOR_MAP[sts] }}>{STATUS_MAP[sts]}</span>,
  },
  {
    title: '监测数值',
    dataIndex: 'value',
    key: 'value',
    // render: value => handleUnit(value),
  },
  {
    title: '报警界限值',
    dataIndex: 'limitValue',
    key: 'limitValue',
  },
  {
    title: '报警描述',
    dataIndex: 'condition',
    key: 'condition',
  },
];

export const WASTE_WATER_PARAMS = [
  { name: '全部', key: 0 },
  // {
  //   name: (
  //     <span>
  //       NH
  //       <sub>3</sub>
  //     </span>
  //   ),
  //   key: '060',
  // },
  // { name: 'COD', key: '011' },
  // { name: '总磷', key: '101' },
  // { name: '总氮', key: '065' },
  // { name: '瞬时流量', key: 'B01' },
  {
    name: (
      <span>
        NH
        <sub>3</sub>
      </span>
    ),
    key: 'w00000',
  },
  { name: '总磷', key: 'w21011' },
  { name: '总氮', key: 'w21001' },
  { name: '氨氮', key: 'w21003' },
  { name: '化学需氧量', key: 'w01018' },
];

export const WASTE_WATER_COLUMNS = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '异常类别',
    dataIndex: 'status',
    key: 'status',
    render: sts => <span style={{ color: STATUS_COLOR_MAP[sts] }}>{STATUS_MAP[sts]}</span>,
  },
  {
    title: '异常参数',
    dataIndex: 'parameter',
    key: 'parameter',
    render: param => handleChemicalFormula(param),
  },
  {
    title: '监测数值',
    dataIndex: 'value',
    key: 'value',
    // render: value => handleUnit(value),
  },
  {
    title: '报警界限值',
    dataIndex: 'limitValue',
    key: 'limitValue',
  },
  {
    title: '报警描述',
    dataIndex: 'condition',
    key: 'condition',
  },
];

export const WASTE_GAS_PARAMS = [
  { name: '全部', key: 0 },
  {
    name: (
      <span>
        SO
        <sub>2</sub>
      </span>
    ),
    key: 1,
  },
  {
    name: (
      <span>
        NO
        <sub>x</sub>
      </span>
    ),
    key: 2,
  },
  {
    name: (
      <span>
        SO
        <sub>2</sub>
        折算
      </span>
    ),
    key: 3,
  },
  {
    name: (
      <span>
        NO
        <sub>x</sub>
        折算
      </span>
    ),
    key: 4,
  },
];

export const WASTE_GAS_COLUMNS = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '异常类别',
    dataIndex: 'status',
    key: 'status',
    render: sts => <span style={{ color: STATUS_COLOR_MAP[sts] }}>{STATUS_MAP[sts]}</span>,
  },
  {
    title: '异常参数',
    dataIndex: 'parameter',
    key: 'parameter',
    render: param => handleChemicalFormula(param),
  },
  {
    title: '监测数值',
    dataIndex: 'value',
    key: 'value',
    // render: value => handleUnit(value),
  },
  {
    title: '报警界限值',
    dataIndex: 'limitValue',
    key: 'limitValue',
  },
  {
    title: '报警描述',
    dataIndex: 'condition',
    key: 'condition',
  },
];

export const STORAGE_TANK_PARAMS = [
  { name: '全部', key: 0 },
  { name: '压力', key: 1 },
  { name: '液位', key: 2 },
  { name: '温度', key: 3 },
];

export const STORAGE_TANK_COLUMNS = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '异常类别',
    dataIndex: 'status',
    key: 'status',
    render: sts => <span style={{ color: STATUS_COLOR_MAP[sts] }}>{STATUS_MAP[sts]}</span>,
  },
  {
    title: '异常参数',
    dataIndex: 'parameter',
    key: 'parameter',
    // render: param => handleChemicalFormula(param),
  },
  {
    title: '监测数值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '报警界限值',
    dataIndex: 'limitValue',
    key: 'limitValue',
  },
  {
    title: '报警描述',
    dataIndex: 'condition',
    key: 'condition',
  },
];

// export const SMOKE_DETECTOR_FIRE_CATEGORIES = [
//   { name: '全部', key: 0 },
//   { name: '真实', key: 1 },
//   { name: '误报', key: 2 },
//   { name: '待确认', key: 3 },
// ];

export const SMOKE_DETECTOR_COLUMNS = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '区域',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '异常类别',
    dataIndex: 'status',
    key: 'status',
    render: sts => <span style={{ color: STATUS_COLOR_MAP[sts] }}>{SMOKE_STATUS_MAP[sts]}</span>,
  },
  // {
  //   title: '火警类别',
  //   dataIndex: 'parameter',
  //   key: 'parameter',
  //   // render: param => handleChemicalFormula(param),
  // },
];

function dateValidator(rule, value, callback) {
  // console.log(value);
  // callback();

  if (value.length !== 2) {
    callback();
    return;
  }

  const [start, end] = value;
  const threeMore = start.clone().add(3, 'months');
  if (threeMore < end) callback('日期范围不能超过三个月');
  else callback();
}

export function getFields(type, params, methods) {
  switch (type) {
    case ELECTRICITY_TYPE:
    case WASTE_WATER_TYPE:
    case WASTE_GAS_TYPE:
    case STORAGE_TANK_TYPE:
      return [
        {
          id: 'area',
          label: '区域：',
          labelCol: LABEL_COL_4,
          wrapperCol: WRAPPER_COL,
          inputSpan: INPUT_SPAN,
          render: () => <Input placeholder="请输入区域" />,
          transform: v => v.trim(),
        },
        {
          id: 'location',
          label: '位置：',
          labelCol: LABEL_COL_4,
          wrapperCol: WRAPPER_COL,
          inputSpan: INPUT_SPAN,
          render: () => <Input placeholder="请输入位置" />,
          transform: v => v.trim(),
        },
        {
          id: 'status',
          label: '异常类别：',
          labelCol: LABEL_COL_6,
          wrapperCol: WRAPPER_COL,
          inputSpan: INPUT_SPAN,
          options: { initialValue: '0' },
          render: () => (
            <Select placeholder="请选择异常类别">
              {OPTIONS.map(({ name, key }) => (
                <Option key={key}>{name}</Option>
              ))}
            </Select>
          ),
        },
        {
          id: 'code',
          label: '异常参数：',
          labelCol: LABEL_COL_6,
          wrapperCol: WRAPPER_COL,
          inputSpan: INPUT_SPAN,
          options: { initialValue: '0' },
          render: () => (
            <Select placeholder="请选择异常参数">
              {params.map(({ name, key }) => (
                <Option key={key}>{name}</Option>
              ))}
            </Select>
          ),
        },
        {
          id: 'date',
          label: '日期：',
          labelCol: { span: 2 },
          wrapperCol: WRAPPER_COL,
          inputSpan: { span: 18 },
          options: {
            initialValue: getThisMonth(),
            rules: [{ validator: dateValidator }],
          },
          render: () => (
            <RangePicker
              // 在Form表单中，由于被getFieldDecorator包裹了，所以只能在options中设定初始值
              // defaultValue={[moment().startOf('month'), moment()]}
              // 禁用日期后有些小bug，且体验不太好
              // disabledDate={methods.disabledDate}
              // onCalendarChange={methods.onCalendarChange}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
              showTime={{
                format: 'HH:mm',
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
            />
          ),
        },
      ];
    case TOXIC_GAS_TYPE:
      return [
        {
          id: 'area',
          label: '区域',
          // labelCol: LABEL_COL_4,
          // wrapperCol: WRAPPER_COL,
          // inputSpan: INPUT_SPAN,
          render: () => <Input placeholder="请输入区域" />,
          transform: v => v.trim(),
        },
        {
          id: 'location',
          label: '位置',
          // labelCol: LABEL_COL_4,
          // wrapperCol: WRAPPER_COL,
          // inputSpan: INPUT_SPAN,
          render: () => <Input placeholder="请输入位置" />,
          transform: v => v.trim(),
        },
        {
          id: 'status',
          label: '异常类别',
          // labelCol: LABEL_COL_6,
          // wrapperCol: WRAPPER_COL,
          // inputSpan: INPUT_SPAN,
          options: { initialValue: '0' },
          render: () => (
            <Select placeholder="请选择异常类别">
              {OPTIONS.map(({ name, key }) => (
                <Option key={key}>{name}</Option>
              ))}
            </Select>
          ),
        },
        {
          id: 'date',
          label: '日期',
          // labelCol: LABEL_COL_2,
          // wrapperCol: WRAPPER_COL,
          span: {
            md: 12,
            sm: 24,
            xs: 24,
          },
          options: {
            initialValue: getThisMonth(),
            rules: [{ validator: dateValidator }],
          },
          render: () => (
            <RangePicker
              // disabledDate={methods.disabledDate}
              // onCalendarChange={methods.onCalendarChange}
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
              showTime={{
                format: 'HH:mm',
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
            />
          ),
        },
      ];
    case SMOKE_DETECTOR_TYPE:
      return [
        {
          id: 'area',
          label: '区域：',
          labelCol: LABEL_COL_4,
          wrapperCol: WRAPPER_COL,
          // inputSpan: INPUT_SPAN,
          render: () => <Input placeholder="请输入区域" />,
          transform: v => v.trim(),
        },
        {
          id: 'location',
          label: '位置：',
          labelCol: LABEL_COL_4,
          wrapperCol: WRAPPER_COL,
          // inputSpan: INPUT_SPAN,
          render: () => <Input placeholder="请输入位置" />,
          transform: v => v.trim(),
        },
        {
          id: 'status',
          label: '异常类别：',
          labelCol: LABEL_COL_6,
          wrapperCol: WRAPPER_COL,
          // inputSpan: INPUT_SPAN,
          options: { initialValue: '0' },
          render: () => (
            <Select placeholder="请选择异常类别">
              {SMOKE_OPTIONS.map(({ name, key }) => (
                <Option key={key}>{name}</Option>
              ))}
            </Select>
          ),
        },
        {
          id: 'date',
          label: '日期：',
          labelCol: LABEL_COL_2,
          wrapperCol: WRAPPER_COL,
          inputSpan: SPAN_16,
          options: {
            initialValue: getThisMonth(),
            rules: [{ validator: dateValidator }],
          },
          render: () => (
            <RangePicker
              // disabledDate={methods.disabledDate}
              // onCalendarChange={methods.onCalendarChange}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
              showTime={{
                format: 'HH:mm',
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
            />
          ),
        },
      ];
    default:
      // console.log('default');
      return [];
  }
}
