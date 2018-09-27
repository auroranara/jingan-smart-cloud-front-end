import React, { PureComponent } from 'react';
import moment from 'moment';
import { Button, Card, DatePicker, Input, Select, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './index.less';
import InlineForm from '../BaseInfo/Company/InlineForm';

const { Option } = Select;
const { RangePicker } = DatePicker;

const LABEL_COL = { span: 4 };
const WRAPPER_COL = { span: 18 };

const OPTIONS = [
  { name: '全部', key: 0 },
  { name: '预紧', key: 1 },
  { name: '告警', key: 2 },
  { name: '失联', key: 3 },
];

// const INPUT_SPAN = { lg: 6, md: 12, sm: 24 };

const COLUMNS = [
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
    dataIndex: 'section',
    key: 'section',
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '异常类别',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '监测数值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '报警界限值',
    dataIndex: 'limit',
    key: 'limit',
  },
  {
    title: '报警描述',
    dataIndex: 'desc',
    key: 'desc',
  },
];

function addAlign(columns, align='center') {
  if (!columns)
    return;

  return columns.map(item => ({ ...item, align }));
}

const data = [...Array(10).keys()].map(i => ({ id: i, index: i+1, time: '2018-09-20 20:02:09', section: '厂区九车间', location: '氯乙烷压缩机东', category: '预警', value: 19.6, limit: '18', desc: '>=临界值' }));

export default class ToxicGas extends PureComponent {
  state = { moments: null };

  renderExportButton() {
    return (
      <Button type="primary" onClick={this.handleSelect} ghost>
        导出报表
      </Button>
    );
  }

  onCalendarChange = (dates, dateStrings) => {
    // console.log(dates);
    this.setState({ moments: dates });
  };

  disabledDate = (current) => {
    const { moments } = this.state;
    const today = moment();
    if (!moments || !moments.length || moments.length === 2)
      return current > today;

    const m = moments[0];
    // 起始时间的前3个月或后3个月，今天之前都为可选
    return current > m.clone().add(3, 'months') || current < m.clone().subtract(3, 'months') || current > today;
  };

  render() {
    const fields = [
      {
        id: 'name',
        label: '区域：',
        labelCol: LABEL_COL,
        wrapperCol: WRAPPER_COL,
        // inputSpan: INPUT_SPAN,
        render: () => <Input placeholder="请输入区域" />,
        transform: v => v.trim(),
      },
      {
        id: 'address',
        label: '位置：',
        labelCol: LABEL_COL,
        wrapperCol: WRAPPER_COL,
        // inputSpan: INPUT_SPAN,
        render: () => <Input placeholder="请输入位置" />,
        transform: v => v.trim(),
      },
      {
        id: 'category',
        label: '异常类别：',
        labelCol: { span: 6 },
        wrapperCol: WRAPPER_COL,
        // inputSpan: INPUT_SPAN,
        options: { initialValue: '0' },
        render: () => <Select placeholder="请选择异常类别">{OPTIONS.map(({ name, key }) => <Option key={key}>{name}</Option>)}</Select>,
      },
      {
        id: 'date',
        label: '日期：',
        labelCol: { span: 2 },
        wrapperCol: WRAPPER_COL,
        inputSpan: { span: 16 },
        options: { initialValue: [moment().startOf('month'), moment().endOf('day')] },
        render: () => (
          <RangePicker
            // 在Form表单中，由于被getFieldDecorator包裹了，所以只能在options中设定初始值
            // defaultValue={[moment().startOf('month'), moment()]}
            disabledDate={this.disabledDate}
            showTime={{ format: 'HH:mm', defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['开始时间', '结束时间']}
            onCalendarChange={this.onCalendarChange}
          />
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title="可燃有毒气体异常数据分析"
        content={<div>监测点：6</div>}
      >
        <Card className={styles.search}>
          <InlineForm
            fields={fields}
            action={this.renderExportButton()}
            buttonSpan={{ xl: 8, md: 12, sm: 24 }}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        <div className={styles.container}>
          <p className={styles.statistics}>查询数据统计：200</p>
          <Table columns={addAlign(COLUMNS)} dataSource={data} rowKey="id" />
        </div>
      </PageHeaderLayout>
    );
  }
}
