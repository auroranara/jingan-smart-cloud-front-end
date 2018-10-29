import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Input, Button, Select, Spin, DatePicker, Table } from 'antd';
import { Link, routerRedux } from 'dva/router';
import router from 'umi/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';

import InlineForm from '../../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';

import styles from '../Contract/Contract.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PAGE_SIZE = 10;
/* 标题 */
const title = '消防测试记录';

const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '消防维保',
    name: '消防维保',
  },
  {
    title,
    name: title,
  },
];
console.log(urls);

// 获取链接地址
const {
  contract: { detail: detailUrl, edit: editUrl, add: addUrl },
} = urls;
// 获取code
const {
  contract: { detail: detailCode, edit: editCode, add: addCode },
} = codes;
/* 去除两边空格 */
const transform = value => value.trim();
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
// 阻止默认行为
const preventDefault = e => {
  e.preventDefault();
};

const handleViewDetail = id => {
  router.push(`/fire-control/test-info/detail/${id}`);
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
    dataIndex: 'time',
    key: 'time',
    align: 'center',
    width: 180,
  },
  {
    title: '主机编号',
    dataIndex: 'deviceId',
    key: 'deviceId',
    align: 'center',
    width: 110,
  },
  {
    title: '回路故障号',
    dataIndex: 'errorId',
    key: 'errorId',
    align: 'center',
    width: 140,
  },
  {
    title: '设施部件类型',
    dataIndex: 'deviceType',
    key: 'deviceType',
    align: 'center',
    width: 130,
  },
  {
    title: '具体位置',
    dataIndex: 'location',
    key: 'location',
    align: 'center',
    width: 130,
  },
  {
    title: '主体单位',
    dataIndex: 'company',
    key: 'company',
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
        <a onClick={() => handleViewDetail(record.id)}>查看</a>
      </span>
    ),
  },
];

@connect(
  ({ contract, user, loading }) => ({
    contract,
    user,
    loading: loading.models.contract,
  }),
  dispatch => ({
    /* 获取合同列表 */
    fetchList(action) {
      dispatch({
        type: 'contract/fetchList',
        ...action,
      });
    },
    /* 追加维保合同列表 */
    appendList(action) {
      dispatch({
        type: 'contract/appendList',
        ...action,
      });
    },
    /* 获取单位状态 */
    fetchStatusList(action) {
      dispatch({
        type: 'contract/fetchStatusList',
        ...action,
      });
    },
    /* 跳转到详情页面 */
    goToDetail(id) {
      dispatch(routerRedux.push(detailUrl + id));
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
    formData: {},
    isInit: false,
  };

  /* 挂载后 */
  componentDidMount() {
    const {
      fetchList,
      fetchStatusList,
      contract: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    /* 获取合同列表 */
    fetchList({
      payload: {
        pageSize,
        pageNum: 1,
      },
      success: () => {
        this.setState({
          isInit: true,
        });
      },
    });
    /* 获取单位状态列表 */
    fetchStatusList();
  }

  /* 查询点击事件 */
  handleSearch = ({ period: [startTime, endTime], ...restValues }) => {
    const {
      fetchList,
      goToException,
      contract: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;

    const formData = {
      startTime: startTime && startTime.format('YYYY-MM-DD'),
      endTime: endTime && endTime.format('YYYY-MM-DD'),
      ...restValues,
    };
    fetchList({
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
    const {
      fetchList,
      goToException,
      contract: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    fetchList({
      payload: {
        pageSize,
        pageNum: 1,
      },
      success: () => {
        // message.success('重置成功', 1);
        this.setState({
          formData: {},
        });
      },
      error: () => {
        // message.success('重置失败', 1);
        goToException();
      },
    });
  };

  /* 渲染表单 */
  renderForm() {
    const {
      contract: { statusList },
      goToAdd,
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    /* 表单字段 */
    const fields = [
      {
        id: 'name',
        render() {
          return <Input placeholder="请输入单位名称" />;
        },
        transform,
      },
      {
        id: 'contractStatus',
        render() {
          return (
            <Select
              allowClear
              placeholder="警情状态"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {statusList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.value}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'contractStatus2',
        render() {
          return (
            <Select
              allowClear
              placeholder="主机编号"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {statusList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.value}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'contractStatus3',
        render() {
          return (
            <Select
              allowClear
              placeholder="设施部件类型"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {statusList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.value}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'location',
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
          return <RangePicker style={{ width: '100%' }} getCalendarContainer={getRootChild} />;
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

  render() {
    const {
      loading,
      contract: {
        data: {
          pagination: { total },
        },
      },
    } = this.props;
    const list = [
      {
        id: '1111',
        status: '火警',
        time: '2018-05-11 12:00:00',
        deviceId: 'ZXY-001',
        errorId: '2回路0001号',
        deviceType: '点型光电烟火探测器',
        location: 'A建筑',
        company: '无锡长城物业',
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：
            {total}{' '}
          </div>
        }
      >
        {this.renderForm()}
        <Card style={{ marginTop: '24px' }}>
          <Table
            rowKey="id"
            loading={loading}
            columns={COLUMNS}
            dataSource={list}
            // onChange={this.onTableChange}
            // pagination={{ pageSize: PAGE_SIZE, total, current: currentPage }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
