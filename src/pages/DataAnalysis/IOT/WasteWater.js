import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, message, notification, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './index.less';
import ToolBar from '@/components/ToolBar';
import {
  WASTE_WATER_TYPE as TYPE,
  WASTE_WATER_TYPE_LABEL as TYPE_LABEL,
  WASTE_WATER_PARAMS as PARAMS,
  WASTE_WATER_COLUMNS as COLUMNS,
  PAGE_SIZE,
  getFields,
} from './constant';
import { addAlign, getThisMonth, handleFormVals, handleTableData } from './utils';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联网监测', name: '物联网监测' },
  {
    title: 'IOT数据分析',
    name: 'IOT数据分析',
    href: '/iot/IOT-abnormal-data/list',
  },
  { title: TYPE_LABEL, name: TYPE_LABEL },
];

@connect(({ loading, dataAnalysis }) => ({
  dataAnalysis,
  loading: loading.effects['dataAnalysis/fetchData'],
}))
export default class WasteWater extends PureComponent {
  state = {
    // moments: null,
    formVals: null,
    currentPage: 1,
  };

  componentDidMount() {
    const vals = { date: getThisMonth() };
    this.setState({ formVals: vals });
    this.fetchData(1, vals);
    this.fetchCompanyInfo();
  }

  fetchCompanyInfo() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({ type: 'dataAnalysis/fetchCompanyInfo', payload: { companyId: id } });
  }

  renderExportButton() {
    return (
      <Button type="primary" onClick={this.handleExport} ghost style={{ marginTop: '8px' }}>
        导出报表
      </Button>
    );
  }

  handleExport = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      dataAnalysis: {
        analysis: { list = [] },
        companyInfo: { name: companyName },
      },
    } = this.props;
    const { formVals } = this.state;

    if (list && list.length)
      dispatch({
        companyName,
        typeLabel: TYPE_LABEL,
        type: 'dataAnalysis/fetchExport',
        payload: { ...handleFormVals(formVals), classType: TYPE, companyId: id },
      });
    else
      notification.warning({
        duration: 3,
        message: '导出警告',
        description: '数据列表为空，无法导出报表',
      });
  };

  handleSearch = values => {
    this.setState({ formVals: values });
    this.fetchData(1, values, (code, msg) => this.setPage(code, 1, msg));
  };

  handleReset = () => {
    const vals = { date: getThisMonth() };
    this.setState({ formVals: vals });
    this.fetchData(1, vals, (code, msg) => this.setPage(code, 1, msg));
  };

  fetchData = (pageNum, values, callback) => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    let payload = { pageSize: PAGE_SIZE, pageNum, classType: TYPE, companyId: id };
    if (values) payload = { ...payload, ...handleFormVals(values) };
    dispatch({
      type: 'dataAnalysis/fetchData',
      payload,
      callback,
    });
  };

  setPage = (code, current, msg) => {
    if (code === 200) this.setState({ currentPage: current });
    else if (msg) message.error(msg);
  };

  onTableChange = (pagination, filters, sorter) => {
    // console.log(pagination);
    const { current } = pagination;
    const { formVals } = this.state;
    this.fetchData(current, formVals, (code, msg) => this.setPage(code, current, msg));
  };

  // onCalendarChange = (dates, dateStrings) => {
  //   // console.log(dates);
  //   this.setState({ moments: dates });
  // };

  // disabledDate = (current) => {
  //   const { moments } = this.state;
  //   return isDateDisabled(current, moments);
  // };

  render() {
    const {
      loading,
      match: {
        params: { count },
      },
      dataAnalysis: {
        companyInfo: { name: companyName },
        analysis: { list = [], pagination: { total } = { total: 0 } },
      },
    } = this.props;

    const { currentPage } = this.state;
    const indexBase = (currentPage - 1) * PAGE_SIZE;

    // const methods = {
    //   disabledDate: this.disabledDate,
    //   onCalendarChange: this.onCalendarChange,
    // };
    const fields = getFields(TYPE, PARAMS);

    return (
      <PageHeaderLayout
        title={TYPE_LABEL}
        breadcrumbList={breadcrumbList}
        content={
          <div className={styles.content}>
            <p>{companyName ? companyName : '暂无单位信息'}</p>
            <p className={styles.count}>
              监测点：
              {count}
            </p>
          </div>
        }
      >
        <Card className={styles.search}>
          {/* <InlineForm
            fields={fields}
            action={this.renderExportButton()}
            buttonSpan={{ xl: 6, md: 12, sm: 24 }}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          /> */}
          <ToolBar
            fields={fields}
            action={this.renderExportButton()}
            // buttonSpan={{ xl: 8, md: 12, sm: 24 }}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 12, sm: 24, xs: 24 }}
          />
        </Card>
        <div className={styles.container}>
          <p className={styles.statistics}>
            查询数据统计：
            {total}
          </p>
          <Table
            rowKey="id"
            loading={loading}
            columns={addAlign(COLUMNS)}
            // dataSource={list}
            dataSource={handleTableData(list, indexBase)}
            onChange={this.onTableChange}
            pagination={{ pageSize: PAGE_SIZE, total, current: currentPage }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
