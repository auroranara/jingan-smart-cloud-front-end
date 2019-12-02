import React from 'react';
import moment from 'moment';
import { DatePicker, Input, Select } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 10;
export const ROUTER = '/facility-management/three-simultaneity'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [];

// 项目类型选项 对应值 1 2 3 4
export const PROJECT = ['新建项目', '改建项目', '扩建项目', '其他项目'];
// 程序选项 对应值 1 2
export const PROGRAM = ['一般程序', '简易程序'];
// 类别 对应值 1 2
export const TYPE = ['备案', '审查'];
export const CONCLUSION = ['通过', '不通过'];

// 格式化日期
export const formatTime = (time, formatStr = DATE_FORMAT) => time ? moment(time).format(formatStr) : '暂无数据';

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '一企一档', name: '一企一档' },
  { title: '三同时审批记录', name: '三同时审批记录', href: LIST_URL },
];

export const SEARCH_FIELDS = [ // modify
  {
    id: 'companyName',
    label: '单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'projectName',
    label: '项目名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'projectType',
    label: '项目类型',
    render: () => <Select placeholder="请选择" allowClear>{PROJECT.map((r, i) => <Option key={i + 1}>{r}</Option>)}</Select>,
  },
  {
    id: 'program',
    label: '程序',
    render: () => <Select placeholder="请选择" allowClear>{PROGRAM.map((r, i) => <Option key={i + 1}>{r}</Option>)}</Select>,
  },
  {
    id: 'registrationDate',
    label: '登记时间',
    render: () => (
      <RangePicker
        // format="YYYY-MM-DD HH:mm:ss"
        showTime={{
          defaultValue: [moment().startOf('day'), moment().endOf('day')],
        }}
        style={{ width: '100%' }}
        allowClear
      />
    ),
  },
];
