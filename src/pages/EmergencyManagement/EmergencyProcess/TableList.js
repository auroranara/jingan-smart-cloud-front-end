import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Button, Card, Table, message, Popconfirm, Divider, Input, Select, Cascader } from 'antd';
import moment from 'moment';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import {
  BREADCRUMBLIST,
  LIST,
  PAGE_SIZE,
  ROUTER,
  // SEARCH_FIELDS as FIELDS,
  // TABLE_COLUMNS as COLUMNS,
} from './utils';
import styles from './styles.less';

const getRootChild = () => document.querySelector('#root>div');
@connect(({ emergencyManagement, user, loading }) => ({
  emergencyManagement,
  user,
  loading: loading.models.emergencyManagement,
}))
export default class TableList extends PureComponent {
  state = {
    formData: {},
  };
  pageNum = 1;
  pageSize = 10;

  componentDidMount() {
    this.fetchDict({ type: 'simAccidentType' });
    this.fetchList();
  }

  fetchList = (pageNum = 1, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchProcessList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
        accidType:
          filters.accidType && filters.accidType.length > 0
            ? filters.accidType.join(',')
            : undefined,
      },
    });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  // 查询
  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  // 重置
  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  handleTableChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { formData } = this.state;
    dispatch({
      type: 'emergencyManagement/deleteProcess',
      payload: {
        id,
      },
      success: () => {
        message.success('删除成功！');
        this.fetchList(this.pageNum, this.pageSize, { ...formData });
      },
      error: msg => {
        message.error(msg);
      },
    });
  };

  render() {
    const {
      loading = false,
      emergencyManagement: {
        process: {
          list,
          pagination: { pageNum, pageSize, total },
          a,
        },
        simAccidentType = [],
      },
      user: {
        currentUser: { unitType },
      },
    } = this.props;

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
    const toolBarAction = (
      <Button type="primary" onClick={this.handleAdd} style={{ marginTop: '8px' }}>
        新增
      </Button>
    );

    const SEARCH_FIELDS = [
      // modify
      {
        id: 'planName',
        label: '方案名称：',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      },
      {
        id: 'treatType',
        label: '演练类型：',
        render: () => (
          <Select placeholder="请选择" allowClear>
            {/* {[].map((r, i) => (
              <Option key={i}>{r}</Option>
            ))} */}
          </Select>
        ),
      },
      {
        id: 'accidName',
        label: '事故名称：',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      },
      {
        id: 'accidType',
        label: '模拟事故类型：',
        render: () => (
          <Cascader
            options={simAccidentType}
            fieldNames={{
              value: 'id',
              label: 'label',
              children: 'children',
              isLeaf: 'isLeaf',
            }}
            changeOnSelect
            placeholder="请选择"
            allowClear
            getPopupContainer={getRootChild}
          />
        ),
      },
      {
        id: 'companyName',
        label: '单位名称：',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      },
    ];

    const COLUMNS = [
      // modify
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '方案名称',
        dataIndex: 'planName',
        key: 'planName',
      },
      {
        title: '演练信息',
        dataIndex: 'drillInfo',
        key: 'drillInfo',
        render(_, row) {
          const { projectName, treatType, startTime, endTime, place } = row;
          return (
            <div className={styles.multi}>
              <div>
                演练名称：
                {projectName}
              </div>
              <div>
                演练类型：
                {treatType}
              </div>
              <div>
                起止时间：
                {`${moment(startTime).format('YYYY-MM-DD')}~${moment(endTime).format(
                  'YYYY-MM-DD'
                )}`}
              </div>
              <div>
                演练地点：
                {place}
              </div>
            </div>
          );
        },
      },
      {
        title: '事故信息',
        dataIndex: 'accidentInfo',
        key: 'accidentInfo',
        render(_, row) {
          const { accidName, accidType } = row;
          const types = accidType.split(',');
          let treeData = simAccidentType;
          const string = types
            .map(id => {
              const val = treeData.find(item => item.id === id) || {};
              treeData = val.children;
              return val.label;
            })
            .join('/');
          return (
            <div className={styles.multi}>
              <div>
                事故名称：
                {accidName}
              </div>
              <div>
                模拟事故类型：
                {string}
              </div>
            </div>
          );
        },
      },
      {
        title: '演练过程描述',
        dataIndex: 'treatmentList',
        key: 'treatmentList',
        render(data) {
          return (
            <Fragment>
              {data.map(item => {
                const { fileName, webUrl, id } = item;
                const fileNames = fileName.split('.');
                const name = fileNames.slice(0, fileNames.length - 1).join('.');
                return (
                  <div key={id}>
                    <a href={webUrl} target="_blank" rel="noopener noreferrer">
                      {name}
                    </a>
                  </div>
                );
              })}
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: id => {
          return (
            <Fragment>
              <Link to={`${ROUTER}/view/${id}`}>查看</Link>
              <Divider type="vertical" />
              <Link to={`${ROUTER}/edit/${id}`}>编辑</Link>
              <Divider type="vertical" />
              <Popconfirm
                title="确定要删除改演练过程吗？"
                onConfirm={() => this.handleDelete(id)}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            {unitType !== 4 && (
              <span>
                单位数量：
                {a}
              </span>
            )}
            <span style={{ marginLeft: unitType === 4 ? 0 : 15 }}>
              演练过程：
              {total}
            </span>
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={
              unitType === 4 ? SEARCH_FIELDS.slice(0, SEARCH_FIELDS.length - 1) : SEARCH_FIELDS
            }
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
          />
        </Card>
        <div className={styles1.container}>
          <Table
            rowKey="id"
            loading={loading}
            columns={unitType === 4 ? COLUMNS.slice(1, COLUMNS.length) : COLUMNS}
            dataSource={list}
            onChange={this.onTableChange}
            scroll={{ x: 1500 }} // 项目不多时注掉
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handleTableChange,
              onShowSizeChange: this.handleTableChange,
            }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
