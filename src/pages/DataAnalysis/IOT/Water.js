import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, message, notification, Select, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './index.less';
import ToolBar from '@/components/ToolBar';
import {
  WATER_TYPE as TYPE,
  WATER_TYPE_LABEL as TYPE_LABEL,
  WATER_COLUMNS as COLUMNS,
  PAGE_SIZE,
  getFields,
} from './constant';
import { addAlign, getThisMonth, handleFormVals, handleTableData } from './utils';

const { Option } = Select;

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
export default class Water extends PureComponent {
  state = {
    formVals: null,
    currentPage: 1,
  };

  componentDidMount() {
    const vals = { date: getThisMonth() };
    this.setState({ formVals: vals });
    this.fetchData(1, vals);
    this.fetchCompanyInfo();
    this.fetchDeviceOptions();
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

  fetchDeviceOptions = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'dataAnalysis/fetchDeviceOptions' });
  };

  renderExportButton() {
    return (
      <Button type="primary" onClick={this.handleExport} ghost style={{ marginTop: '8px' }}>
        导出报表
      </Button>
    );
  }

  // 先查询后才能记录form表单的状态，然后导出，不能选完就导出，那样并不会记录form表单的状态
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
    const { deviceType } = formVals;
    console.log(formVals);

    if (list && list.length)
      dispatch({
        companyName,
        typeLabel: TYPE_LABEL,
        type: 'dataAnalysis/fetchExport',
        payload: { ...handleFormVals(formVals), classType: deviceType || TYPE, companyId: id },
      });
    else
      notification.warning({
        duration: 3,
        message: '导出警告',
        description: '数据列表为空，无法导出报表',
      });
  };

  handleSearch = values => {
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
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    const { deviceType } = values;
    let payload = { pageSize: PAGE_SIZE, pageNum, classType: deviceType || TYPE, companyId: id };
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

  render() {
    const {
      loading,
      match: {
        params: { count },
      },
      dataAnalysis: {
        companyInfo: { name: companyName },
        analysis: { list = [], pagination: { total } = { total: 0 } },
        deviceOptions,
      },
    } = this.props;

    const { currentPage } = this.state;
    const indexBase = (currentPage - 1) * PAGE_SIZE;
    const deviceTypeMap = deviceOptions.reduce((prev, next) => {
      const { type, typeDesc } = next;
      prev[type] = typeDesc;
      return prev;
    }, {});

    const fields = getFields(TYPE, deviceOptions);

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
          <ToolBar
            fields={fields}
            action={this.renderExportButton()}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            // buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xxl: 6, xl: 8, sm: 24, xs: 24 }}
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
            dataSource={handleTableData(list, indexBase, deviceTypeMap)}
            onChange={this.onTableChange}
            pagination={{ pageSize: PAGE_SIZE, total, current: currentPage }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
