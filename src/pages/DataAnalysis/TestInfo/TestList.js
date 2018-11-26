import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Pagination, Select, DatePicker, Table, Spin } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import router from 'umi/router';

import InlineForm from '../../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

const { Option } = Select;
const { RangePicker } = DatePicker;

let pageSize = 10;
/* 标题 */
const title = '消防测试记录';

const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '数据分析',
    name: '数据分析',
  },
  {
    title,
    name: title,
  },
];
// 警情状态列表
const alertStatusList = [
  { id: '0', label: '全部' },
  { id: '1', label: '火警' },
  { id: '2', label: '故障' },
  { id: '3', label: '联动' },
  { id: '4', label: '监管' },
  { id: '5', label: '屏蔽' },
  { id: '6', label: '反馈' },
];

/* 去除两边空格 */
const transform = value => value.trim();
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');

const handleViewDetail = id => {
  router.push(`/data-analysis/test-info/detail/${id}`);
};

const COLUMNS = [
  {
    title: '警情状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 120,
  },
  {
    title: '测试时间',
    dataIndex: 'testTime',
    key: 'testTime',
    align: 'center',
    width: 180,
    render: val => {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  {
    title: '主机编号',
    dataIndex: 'clientAddr',
    key: 'clientAddr',
    align: 'center',
    width: 110,
  },
  {
    title: '回路故障号',
    dataIndex: 'failureCode',
    key: 'failureCode',
    align: 'center',
    width: 140,
  },
  {
    title: '设施部件类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    width: 130,
  },
  {
    title: '具体位置',
    dataIndex: 'installAddress',
    key: 'installAddress',
    align: 'center',
    width: 130,
  },
  {
    title: '服务单位',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    width: 130,
  },
  {
    title: '操作',
    dataIndex: '操作',
    key: '操作',
    align: 'center',
    fixed: 'right',
    width: 120,
    render: (val, record) => (
      <span>
        <a onClick={() => handleViewDetail(record.detailId)}>查看</a>
      </span>
    ),
  },
];

@connect(
  ({ fireTest, loading, user }) => ({
    fireTest,
    loading: loading.models.fireTest,
    user,
  }),
  dispatch => ({
    /* 获取测试火灾自动报警系统历史记录(web) */
    fetchAppHistories(action) {
      dispatch({
        type: 'fireTest/fetchAppHistories',
        ...action,
      });
    },
    // 测试查询条件预加载(web)
    fetchSelectCondition(action) {
      dispatch({
        type: 'fireTest/fetchSelectCondition',
        ...action,
      });
    },
    // 异常
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },
    dispatch,
  })
)
@Form.create()
export default class TestList extends PureComponent {
  state = {
    formData: {
      alertStatus: undefined,
      companyName: undefined,
      deviceCode: undefined,
      endTime: undefined,
      specificLocation: undefined,
      startTime: undefined,
      unitType: undefined,
    },
    isInit: false,
  };

  /* 挂载后 */
  componentDidMount() {
    const { fetchAppHistories, fetchSelectCondition } = this.props;
    /* 获取测试火灾自动报警系统历史记录(web) */
    fetchAppHistories({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
    // 测试查询条件预加载(web)
    fetchSelectCondition();
  }

  /* 查询点击事件 */
  handleSearch = ({ period: [startTime, endTime], ...restValues }) => {
    const { fetchAppHistories, goToException } = this.props;

    const formData = {
      startTime: startTime && startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime && endTime.format('YYYY-MM-DD HH:mm:ss'),
      ...restValues,
    };

    fetchAppHistories({
      payload: {
        ...formData,
        pageSize,
        pageNum: 1,
      },
      success: () => {
        // message.success('查询成功', 1);
        this.setState({
          formData,
        });
      },
      error: () => {
        // message.success('查询失败', 1);
        goToException();
      },
    });
  };

  /* 重置点击事件 */
  handleReset = () => {
    const { fetchAppHistories, goToException } = this.props;
    fetchAppHistories({
      payload: {
        pageSize,
        pageNum: 1,
      },
      success: () => {
        this.setState({
          formData: {
            alertStatus: undefined,
            companyName: undefined,
            deviceCode: undefined,
            endTime: undefined,
            specificLocation: undefined,
            startTime: undefined,
            unitType: undefined,
          },
        });
      },
      error: () => {
        goToException();
      },
    });
  };

  /* 渲染表单 */
  renderForm() {
    const {
      // fireAlarm: { dictDataList },
      fireTest: { dictDataList, deviceCodes },
    } = this.props;
    /* 表单字段 */
    const fields = [
      {
        id: 'companyName',
        render() {
          return <Input placeholder="请输入单位名称" />;
        },
        transform,
      },
      {
        id: 'alertStatus',
        render() {
          return (
            <Select
              allowClear
              placeholder="警情状态"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {alertStatusList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'deviceCode',
        render() {
          return (
            <Select
              allowClear
              showSearch
              placeholder="主机编号"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {[...new Set(deviceCodes)].map((item, index) => {
                return (
                  item && (
                    <Option value={item} key={index}>
                      {item}
                    </Option>
                  )
                );
              })}
            </Select>
          );
        },
      },
      {
        id: 'unitType',
        render() {
          return (
            <Select
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="设施部件类型"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {dictDataList.map(item => (
                <Option value={item.value} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'specificLocation',
        render() {
          return <Input placeholder="请输入具体位置" />;
        },
        transform,
      },
      {
        id: 'period',
        options: {
          initialValue: [],
        },
        render() {
          return (
            <RangePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              showTime={{
                defaultValue: [moment('0:0:0', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
              getCalendarContainer={getRootChild}
            />
          );
        },
      },
    ];

    return (
      <Card>
        <InlineForm
          fields={fields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
      </Card>
    );
  }

  // 获取历史纪录列表
  queryueryHistories = (pageNum = 1, pageSize = 10) => {
    const { fetchAppHistories, goToException } = this.props;
    const { formData } = this.state;
    fetchAppHistories({
      payload: {
        ...formData,
        pageSize,
        pageNum,
      },
      error: () => {
        goToException();
      },
    });
  };

  // 表格改变触发，包含分页变动
  handleTableChange = (pageNum, pageSize) => {
    this.queryueryHistories(pageNum, pageSize);
  };

  render() {
    const {
      loading,
      fireTest: { pagination, list },
    } = this.props;
    const { pageNum, pageSize, total } = pagination;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            列表记录：
            {total}
          </div>
        }
      >
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="detailId"
              loading={loading}
              columns={COLUMNS}
              dataSource={list}
              pagination={false}
            />
            <Pagination
              style={{ marginTop: '20px', float: 'right' }}
              // showTotal={false}
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['5', '10', '15', '20']}
              pageSize={pageSize}
              current={pageNum}
              total={total}
              onChange={this.handleTableChange}
              onShowSizeChange={this.handleTableChange}
              // showTotal={total => `共 ${total} 条`}
            />
          </Card>
        ) : (
          <Spin spinning={loading}>
            <Card style={{ marginTop: '20px', textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          </Spin>
        )}
      </PageHeaderLayout>
    );
  }
}
