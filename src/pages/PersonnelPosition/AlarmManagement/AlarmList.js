import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import { Button, Card, Input, Select, Table, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ToolBar from '@/components/ToolBar';
import styles from './CompanyList.less';
import { CK_OPTIONS, msgCallback } from './utils';

const { Group: ButtonGroup } = Button;
const { Option } = Select;

const PAGE_SIZE = 10;
const title = '报警策略列表';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: '报警管理', name: '报警管理', href: '/personnel-position/alarm-management/index' },
  { title, name: title },
];

@connect(({ personPositionAlarm, loading }) => ({ personPositionAlarm, loading: loading.effects['personPositionAlarm/fetchAlarmList'] }))
export default class AlarmList extends PureComponent {
  state = {
    selectedRowKeys: [],
    current: 1,
    total: 0,
  };

  componentDidMount() {
    const { dispatch, match: { params: { companyId } } } = this.props;

    this.fetchList(1);
    dispatch({ type: 'personPositionAlarm/fetchMapList', payload: { companyId, pageSize: 0 } });

    this.columns = [{
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
      render: (text, record) => {
        // console.log(text);
        return text.join(',');
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <Link to={`/personnel-position/alarm-management/detail/${companyId}/${record.id}`} style={{ marginRight: 8 }}>查看</Link>
          <Link to={`/personnel-position/alarm-management/edit/${companyId}/${record.id}`}>编辑</Link>
        </Fragment>
      ),
    }];
  }

  columns = [];
  pageIndex = 1;
  areaCode=undefined;
  areaName=undefined;
  mapId=undefined;
  alarmType=undefined;

  fetchList = (pageNum) => {
    const { dispatch, match: { params: { companyId } } } = this.props;
    dispatch({
      type: 'personPositionAlarm/fetchAlarmList',
      payload: {
        pageNum,
        companyId,
        areaCode: this.areaCode,
        areaName: this.areaName,
        mapId: this.mapId,
        type: this.alarmType,
        pageSize: PAGE_SIZE,
      },
      callback: pageIndex => {
        if (pageIndex)
          this.pageIndex = pageIndex;
      },
    });
  };

  handleSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  handlePageChange = (pagination, filters, sorter, extra) => {
    this.fetchList(pagination.current);
  };

  handleAdd = e => {
    const { match: { params: { companyId } } } = this.props;
    router.push(`/personnel-position/alarm-management/add/${companyId}`);
  };

  handleDelete = e => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;

    if (selectedRowKeys.length)
      dispatch({
        type: 'personPositionAlarm/delAlarmStartegy',
        payload: selectedRowKeys.join(','),
        callback: (code, msg) => {
          msgCallback(code, msg);
          this.fetchList(this.pageIndex);
        },
      });
  };

  handleSearch = () => {
    this.fetchList(1);
  };

  handleReset = () => {
    ['areaCode', 'areaName', 'mapId', 'alarmType'].forEach(p => this[p] = undefined);
    this.fetchList(1);
  };

  genHandleChange = (prop, type='input') => {
    return e => {
      let v = undefined;
      switch(type) {
        case 'input':
          v = e.target.value;
          break;
        case 'multipleSelect':
          v = e.join(',');
          // console.log(e, v);
          break;
        default:
          v = e;
      }

      this[prop] = v;
    };
  };

  render() {
    const {
      loading,
      personPositionAlarm: {
        mapList,
        alarmList,
      },
    } = this.props;
    const { selectedRowKeys, current, total } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    };

    const pagination = { current, total, pageSize: PAGE_SIZE };

    const list =  Array.isArray(alarmList) ? alarmList : [];

    const fields = [{
      id: 'areaCode',
      span: 6,
      render: (onSearch, onReset) => {
        return (
          <Input placeholder="区域编号" onChange={this.genHandleChange('areaCode')} />
        );
      },
      transform(value) {
        return value.trim();
      },
      }, {
        id: 'areaName',
        span: 6,
        render: (onSearch, onReset) => {
          return (
            <Input placeholder="区域名称" onChange={this.genHandleChange('areaName')} />
          );
        },
        transform(value) {
          return value.trim();
        },
      }, {
        id: 'mapId',
        span: 6,
        render: (onSearch, onReset) => {
          return (
            <Select placeholder="报警地图" onChange={this.genHandleChange('mapId', 'select')}>
              {mapList.map(({ id, mapName }) => <Option value={id} key={id}>{mapName}</Option>)}
            </Select>
          );
        },
        transform(value) {
          return value.trim();
        },
      }, {
        id: 'type',
        span: 6,
        render: (onSearch, onReset) => {
          return (
            <Select placeholder="所属类型" mode="multiple" onChange={this.genHandleChange('alarmType', 'multipleSelect')}>
              {CK_OPTIONS.map(({ label, value }) => <Option value={value} key={value}>{label}</Option>)}
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
        <Button type="primary" ghost onClick={this.handleAdd}>新增</Button>
        <Button type="primary" ghost onClick={this.handleDelete}>删除</Button>
      </ButtonGroup>
    );

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card>
          <ToolBar
            fields={fields}
            action={buttons}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        <Card className={styles.table}>
          <Table
            rowKey="id"
            loading={loading}
            columns={this.columns}
            rowSelection={rowSelection}
            pagination={pagination}
            dataSource={list}
            onChange={this.handlePageChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
