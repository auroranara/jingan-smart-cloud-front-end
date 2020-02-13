import React, { Component } from 'react';
import { Card, Table, message, Empty, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import { getPageSize, setPageSize } from '@/utils/utils';
import { connect } from 'dva';
import moment from 'moment';
import { DEFAULT_FORMAT } from '../List';
import styles from './index.less';

const API = 'reevaluateWarning/getHistory';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控 ', name: '风险分级管控' },
  { title: '复评预警管理', name: '复评预警管理', href: '/risk-control/reevaluate-warning/list' },
  { title: '历史记录', name: '历史记录' },
];
const Fields = [
  {
    id: 'zoneName',
    label: '区域名称',
    transform: value => value.trim(),
    render: ({ handleSearch }) => (
      <InputOrSpan placeholder="请输入区域名称" onPressEnter={handleSearch} maxLength={50} />
    ),
  },
  {
    id: 'reviewDate',
    label: '应复评时间',
    render: () => (
      <DatePickerOrSpan placeholder="请选择应复评时间" allowClear className={styles.datePicker} />
    ),
  },
  {
    id: 'realityReviewDate',
    label: '实际复评时间',
    render: () => (
      <DatePickerOrSpan placeholder="请选择实际复评时间" allowClear className={styles.datePicker} />
    ),
  },
];
const Columns = [
  {
    title: '区域名称',
    dataIndex: 'zoneName',
    align: 'center',
  },
  {
    title: '区域编号',
    dataIndex: 'zoneCode',
    align: 'center',
  },
  {
    title: '所属图层',
    dataIndex: 'zoneType',
    align: 'center',
  },
  {
    title: '区域变更时间',
    dataIndex: 'changeDate',
    render: time => time && moment(time).format(DEFAULT_FORMAT),
    align: 'center',
  },
  {
    title: '原复评周期（月）',
    dataIndex: 'checkCircle',
    align: 'center',
  },
  {
    title: '变更后周期（月）',
    dataIndex: 'reviewCycle',
    align: 'center',
  },
  {
    title: '应复评时间',
    dataIndex: 'reviewDate',
    render: time => time && moment(time).format(DEFAULT_FORMAT),
    align: 'center',
  },
  {
    title: '实际复评时间',
    dataIndex: 'realityReviewDate',
    render: time => time && moment(time).format(DEFAULT_FORMAT),
    align: 'center',
  },
  {
    title: '复评人员',
    dataIndex: 'reviewPersonName',
    align: 'center',
    render: (val) => Array.isArray(val) ? val.join('，') : '',
  },
  {
    title: '附件',
    dataIndex: 'otherFileList',
    align: 'center',
    render: value => <CustomUpload className={styles.customUpload} value={value} type="span" />,
  },
];

@connect(
  ({ reevaluateWarning: { history }, loading }) => ({
    history,
    loading: loading.effects[API],
  }),
  dispatch => ({
    getHistory(payload, callback) {
      dispatch({
        type: API,
        payload,
        callback(success, data) {
          if (!success) {
            message.error('获取历史记录失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class ReevaluateWarningHistory extends Component {
  prevValues = null;

  componentDidMount() {
    this.handleSearchButtonClick(this.prevValues);
  }

  setFormReference = form => {
    this.form = form;
  };

  reload = () => {
    const {
      location: { query: { id } },
      history: { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = {},
      getHistory,
    } = this.props;
    getHistory({
      zoneId: id,
      pageNum,
      pageSize,
      ...this.prevValues,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  // 查询按钮点击事件
  handleSearchButtonClick = values => {
    const {
      location: { query: { id } },
      history: { pagination: { pageSize = getPageSize() } = {} } = {},
      getHistory,
    } = this.props;
    this.prevValues = values;
    getHistory({
      zoneId: id,
      pageNum: 1,
      pageSize,
      ...values,
    });
  };

  // 重置按钮点击事件
  handleResetButtonClick = values => {
    this.handleSearchButtonClick(values);
  };

  // 表格的change事件
  handleTableChange = ({ current, pageSize }) => {
    const {
      location: { query: { id } },
      history: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      getHistory,
    } = this.props;
    getHistory({
      zoneId: id,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
      ...this.prevValues,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  renderForm() {
    return (
      <Card className={styles.card}>
        <CustomForm
          fields={Fields}
          onSearch={this.handleSearchButtonClick}
          onReset={this.handleResetButtonClick}
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable() {
    const {
      history: { list = [], pagination: { total, pageNum, pageSize } = {} } = {},
      loading = false,
    } = this.props;

    return (
      <Card className={styles.card}>
        <Spin spinning={loading}>
          {list && list.length > 0 ? (
            <Table
              className={styles.table}
              dataSource={list}
              columns={Columns}
              rowKey="id"
              scroll={{
                x: true,
              }}
              onChange={this.handleTableChange}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                pageSizeOptions: ['5', '10', '15', '20'],
                // showTotal: showTotal && (total => `共 ${total} 条`),
                showQuickJumper: true,
                showSizeChanger: true,
              }}
            />
          ) : (
              <Empty />
            )}
        </Spin>
      </Card>
    );
  }

  render() {
    const { history: { pagination: { total } = {} } = {} } = this.props;

    return (
      <PageHeaderLayout
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
        breadcrumbList={BREADCRUMB_LIST}
        content={`共计：${total || 0} 条`}
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
