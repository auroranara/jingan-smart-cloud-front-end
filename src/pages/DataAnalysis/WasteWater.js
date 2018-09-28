import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Button, Card, DatePicker, Input, message, Select, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './index.less';
import InlineForm from '../BaseInfo/Company/InlineForm';
import { STATUS_MAP, STATUS_COLOR_MAP, addAlign, getThisMonth, handleFormVals, handleTableData, handleChemicalFormula, handleUnit } from './utils';

const { Option } = Select;
const { RangePicker } = DatePicker;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '数据分析', name: '数据分析' },
  { title: 'IOT异常数据分析', name: 'IOT异常数据分析', href: '/data-analysis/IOT-abnormal-data/list' },
  { title: '废水异常数据分析', name: '废水异常数据分析' },
];

const TYPE = 3;
const PAGE_SIZE = 10;

const LABEL_COL = { span: 4 };
const WRAPPER_COL = { span: 18 };

const OPTIONS = [
  { name: '全部', key: 0 },
  { name: '预紧', key: 1 },
  { name: '告警', key: 2 },
  { name: '失联', key: -1 },
];

const PARAMS = [
  { name: <span>NH<sub>3</sub></span>, key: '060' },
  { name: '总磷', key: '101' },
  { name: '总氮', key: '065' },
  { name: '瞬时流量', key: 'B01' },
  { name: 'COD', key: '011' },
];

const INPUT_SPAN = { lg: 6, md: 12, sm: 24 };

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
    render: value => handleUnit(value),
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

// const list = [...Array(20).keys()].map(i => ({ id: i, index: i+1, time: '2018-09-20 20:02:09', area: '厂区九车间', location: '氯乙烷压缩机东', status: 1, parameter: 'c2h5oh', value: '19.6|mg/m3', limitValue: '18', condition: 1 }));
// const total = list.length;

@connect(({ loading, dataAnalysis }) => ({ dataAnalysis, loading: loading.effects['dataAnalysis/fetchData'] }))
export default class ToxicGas extends PureComponent {
  state = {
    moments: null,
    formVals: null,
    currentPage: 1,
  };

  componentDidMount() {
    const vals = { date: getThisMonth() };
    this.setState({ formVals: vals });
    this.fetchData(1, vals);
  }

  renderExportButton() {
    return (
      <Button type="primary" onClick={this.handleSelect} ghost>
        导出报表
      </Button>
    );
  }

  handleSearch = (values) => {
    this.setState({ formVals: values });
    this.fetchData(1, values, (code, msg) => this.setPage(code, 1, msg));
  };

  handleReset = () => {
    const vals = { date: getThisMonth() };
    this.setState({ formVals: vals });
    this.fetchData(1, vals, (code, msg) => this.setPage(code, 1, msg));
  };

  fetchData = (pageNum, values, callback) => {
    const { dispatch, match: { params: { id } } } = this.props;
    let payload = { pageSize: PAGE_SIZE, pageNum, type: TYPE, companyId: id };
    if (values)
      payload = { ...payload, ...handleFormVals(values) };
    dispatch({
      type: 'dataAnalysis/fetchData',
      payload,
      callback,
    });
  };

  setPage = (code, current, msg) => {
    if (code === 200)
      this.setState({ currentPage: current });
    else if (msg)
      message.error(msg);
  };

  onTableChange = (pagination, filters, sorter) => {
    // console.log(pagination);
    const { current } = pagination;
    const { formVals } = this.state;
    this.fetchData(current, formVals, (code, msg) => this.setPage(code, current, msg));
  };

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
    const {
      loading,
      match: { params: { count } },
      dataAnalysis: {
        analysis: {
          list=[],
          pagination: {
            total,
          }={ total: 0 },
        },
      },
    } = this.props;

    const { currentPage } = this.state;

    const fields = [
      {
        id: 'area',
        label: '区域：',
        labelCol: LABEL_COL,
        wrapperCol: WRAPPER_COL,
        inputSpan: INPUT_SPAN,
        render: () => <Input placeholder="请输入区域" />,
        transform: v => v.trim(),
      },
      {
        id: 'location',
        label: '位置：',
        labelCol: LABEL_COL,
        wrapperCol: WRAPPER_COL,
        inputSpan: INPUT_SPAN,
        render: () => <Input placeholder="请输入位置" />,
        transform: v => v.trim(),
      },
      {
        id: 'status',
        label: '异常类别：',
        labelCol: { span: 6 },
        wrapperCol: WRAPPER_COL,
        inputSpan: INPUT_SPAN,
        options: { initialValue: '0' },
        render: () => <Select placeholder="请选择异常类别">{OPTIONS.map(({ name, key }) => <Option key={key}>{name}</Option>)}</Select>,
      },
      {
        id: 'code',
        label: '异常参数：',
        labelCol: { span: 6 },
        wrapperCol: WRAPPER_COL,
        inputSpan: INPUT_SPAN,
        render: () => <Select placeholder="请选择异常参数">{PARAMS.map(({ name, key }) => <Option key={key}>{name}</Option>)}</Select>,
      },
      {
        id: 'date',
        label: '日期：',
        labelCol: { span: 2 },
        wrapperCol: WRAPPER_COL,
        inputSpan: { span: 18 },
        options: { initialValue: getThisMonth() },
        render: () => (
          <RangePicker
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
        title="废水异常数据分析"
        breadcrumbList={breadcrumbList}
        content={<div className={styles.count}>监测点：{count}</div>}
      >
        <Card className={styles.search}>
          <InlineForm
            fields={fields}
            action={this.renderExportButton()}
            buttonSpan={{ xl: 6, md: 12, sm: 24 }}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        <div className={styles.container}>
          <p className={styles.statistics}>查询数据统计：{total}</p>
          <Table
            rowKey="id"
            loading={loading}
            columns={addAlign(COLUMNS)}
            // dataSource={list}
            dataSource={handleTableData(list)}
            onChange={this.onTableChange}
            pagination={{ pageSize: PAGE_SIZE, total, current: currentPage }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
