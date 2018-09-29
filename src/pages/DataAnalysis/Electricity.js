import React, { PureComponent } from 'react';
// import moment from 'moment';
import { connect } from 'dva';
import { Button, Card, message, notification, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './index.less';
import InlineForm from '../BaseInfo/Company/InlineForm';
import { ELECTRICITY_TYPE, ELECTRICITY_PARAMS as PARAMS, ELECTRICITY_COLUMNS as COLUMNS, PAGE_SIZE, getFields } from './constant';
import { addAlign, getThisMonth, handleFormVals, handleTableData, isDateDisabled } from './utils';

// 用电安全
const TYPE = ELECTRICITY_TYPE;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '数据分析', name: '数据分析' },
  { title: 'IOT异常数据分析', name: 'IOT异常数据分析', href: '/data-analysis/IOT-abnormal-data/list' },
  { title: '用电安全异常数据分析', name: '用电安全异常数据分析' },
];

// const data = [...Array(10).keys()].map(i => ({ id: i, index: i+1, time: '2018-09-20 20:02:09', section: '厂区九车间', location: '氯乙烷压缩机东', category: '预警', parameter: '漏电电流', value: 19.6, limit: '18', desc: '>=临界值' }));

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
      <Button type="primary" onClick={this.handleExport} ghost>
        导出报表
      </Button>
    );
  }

  // 先查询后才能记录form表单的状态，然后导出，不能选完就导出，那样并不会记录form表单的状态
  handleExport = () => {
    const {
      dispatch,
      match: { params: { id } },
      dataAnalysis: { analysis: { list=[] } },
    } = this.props;
    const { formVals } = this.state;

    if (list && list.length)
      dispatch({
        type: 'dataAnalysis/fetchExport',
        payload: { ...handleFormVals(formVals), type: TYPE, companyId: id },
      });
    else
      notification.warning({
        duration: 3,
        message: '导出警告',
        description: '数据列表为空，无法导出报表',
      });
  };

  handleSearch = (values) => {
    // console.log(values);
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
    return isDateDisabled(current, moments);
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
      // location: { num },
    } = this.props;

    const { currentPage } = this.state;
    const indexBase = (currentPage - 1) * PAGE_SIZE;

    const methods = {
      disabledDate: this.disabledDate,
      onCalendarChange: this.onCalendarChange,
    };
    const fields = getFields(ELECTRICITY_TYPE, methods, PARAMS);

    return (
      <PageHeaderLayout
        title="用电安全异常数据分析"
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
            dataSource={handleTableData(list, indexBase)}
            onChange={this.onTableChange}
            pagination={{ pageSize: PAGE_SIZE, total, current: currentPage }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
