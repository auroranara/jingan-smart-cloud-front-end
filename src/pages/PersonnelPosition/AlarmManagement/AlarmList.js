import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Input, Select, Table, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ToolBar from '@/components/ToolBar';
// import styles from './CompanyList.less';

const { Group: ButtonGroup } = Button;
const { Option } = Select;

const title = '报警策略列表';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: '报警管理', name: '报警管理', href: '/personnel-position/alarm-management/index' },
  { title, name: title },
];

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;
const COLUMNS = [{
  title: '区域编号',
  dataIndex: 'areaCode',
}, {
  title: '区域名称',
  dataIndex: 'areaName',
}, {
  title: '所属地图',
  dataIndex: 'mapName',
}, {
  title: '报警类型',
  dataIndex: 'typeNameList',
}, {
  title: '操作',
  dataIndex: 'operation',
  render: (text, record) => (<span>编辑</span>),
}];

@connect(({ personPositionAlarm, loading }) => ({ personPositionAlarm, loading: loading.effects['personPositionAlarm/fetchAlarmList'] }))
export default class AlarmList extends PureComponent {
  state = {
    selectedRowKeys: [],
    current: 1,
    total: 0,
  };

  componentDidMount() {
    this.fetchList(1);
  }

  fetchList = (pageNum) => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'personPositionAlarm/fetchAlarmList',
      payload: { pageNum, pageSize: PAGE_SIZE, companyId: id },
    });
  };

  handleSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  handlePageChange = (pagination, filters, sorter, extra) => {
    this.fetchList(pagination.current);
  };

  render() {
    const {
      loading,
      personPositionAlarm,
    } = this.props;
    const { selectedRowKeys, current, total } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const pagination = { current, total, pageSize: PAGE_SIZE };

    const list =  Array.isArray(personPositionAlarm.alarmList) ? personPositionAlarm.alarmList : [];

    const fields = [{
      id: 'areaCode',
      span: 6,
      render(onSearch, onReset) {
        return (
          <Input placeholder="区域编号" />
        );
      },
      transform(value) {
        return value.trim();
      },
    }, {
      id: 'areaName',
      span: 6,
      render(onSearch, onReset) {
        return (
          <Input placeholder="区域名称" />
        );
      },
      transform(value) {
        return value.trim();
      },
    }, {
      id: 'mapId',
      span: 6,
      render(onSearch, onReset) {
        return (
          <Select placeholder="报警地图">
            <Option value="0">全部报警地图</Option>
          </Select>
        );
      },
      transform(value) {
        return value.trim();
      },
    }, {
      id: 'type',
      span: 6,
      render(onSearch, onReset) {
        return (
          <Select placeholder="所属类型">
            <Option value="0">全部报警类型</Option>
          </Select>
        );
      },
      transform(value) {
        return value.trim();
      },
    },
  ];

  const buttons = (
    <ButtonGroup>
      <Button type="primary" ghost>新增</Button>
      <Button type="primary" ghost>删除</Button>
    </ButtonGroup>
  );

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <ToolBar fields={fields} action={buttons} />
        <Table
          loading={loading}
          columns={COLUMNS}
          rowSelection={rowSelection}
          pagination={pagination}
          dataSource={list}
          onChange={this.handlePageChange}
        />
      </PageHeaderLayout>
    );
  }
}
