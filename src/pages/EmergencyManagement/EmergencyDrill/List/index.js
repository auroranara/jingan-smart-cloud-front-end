import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Table,
  Card,
  Button,
  Divider,
  Row,
  Col,
  Input,
  Select,
  Cascader,
  Spin,
  Popconfirm,
  message,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import codes from '@/utils/codes';
import styles from './index.less';
import router from 'umi/router';

const {
  emergencyManagement: {
    emergencyDrill: { detail: detailCode, edit: editCode, add: addCode, delete: deleteCode },
  },
} = codes;

const FormItem = Form.Item;

const title = '应急演练计划';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '应急管理', name: '应急管理' },
  { title, name: title },
];
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
const statusList = [{ key: '1', label: '已执行' }, { key: '0', label: '未执行' }];
const NO_DATA = '暂无数据';

@Form.create()
@connect(({ emergencyManagement, user, loading }) => ({
  emergencyManagement,
  user,
  loading: loading.models.emergencyManagement,
}))
export default class EmergencyDrillList extends Component {
  state = {};
  pageNum = 1;
  pageSize = 10;

  componentDidMount() {
    this.fetchDict({ type: 'emergencyDrill' });
    this.fetchList(1);
  }

  fetchList = (pageNum = 1, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchDrillList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
      },
    });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  /**
   * 跳转到新增页面
   */
  jumpToAddPage = () => {
    router.push('/emergency-management/emergency-drill/add');
  };

  handleSearch = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    this.fetchList(1, this.pageSize, { ...getFieldsValue() });
  };

  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.fetchList(1, this.pageSize);
  };

  goDetail = id => {
    router.push(`/emergency-management/emergency-drill/detail/${id}`);
    // window.open(`${window.publicPath}#/emergency-management/emergency-drill/detail/${id}`);
  };

  goEdit = id => {
    // router.push(`/emergency-management/emergency-drill/edit/${id}`);
    window.open(`${window.publicPath}#/emergency-management/emergency-drill/edit/${id}`);
  };

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;

    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('projectName')(<Input placeholder="计划名称" />)}
              </FormItem>
            </Col>
            {/* <Col {...colWrapper}>
              <FormItem label="演练类型" {...formItemStyle}>
                {getFieldDecorator('planType', {
                  rules: [{ required: true, message: '请选择演练类型' }],
                })(
                  <Cascader
                    options={[]}
                    fieldNames={{
                      value: 'id',
                      label: 'name',
                      children: 'children',
                      isLeaf: 'isLeaf',
                    }}
                    loadData={selectedOptions => {
                      console.log('selectedOptions', selectedOptions);

                      // this.handleLoadData(['registerAddress'], selectedOptions);
                    }}
                    changeOnSelect
                    placeholder="请选择演练类型"
                    allowClear
                    getPopupContainer={getRootChild}
                  />
                )}
              </FormItem>
            </Col> */}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('planCode')(<Input placeholder="应急演练编码" />)}
              </FormItem>
            </Col>
            {unitType !== 4 && (
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('companyName')(<Input placeholder="单位名称" />)}
                </FormItem>
              </Col>
            )}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('projectStatus')(
                  <Select placeholder="计划状态">
                    {statusList.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('planName')(<Input placeholder="演练名称" />)}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem style={{ display: 'inline-block', top: '4px' }}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleSearch}>
                  查询
                </Button>
              </FormItem>
              <FormItem style={{ display: 'inline-block', top: '4px' }}>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
              </FormItem>
              <FormItem style={{ display: 'inline-block', top: '4px' }}>
                <Button type="primary" onClick={this.jumpToAddPage} disabled={!hasAddAuthority}>
                  新增
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

  // 表格改变触发，包含分页变动
  handleTableChange = (pageNum, pageSize) => {
    const {
      form: { getFieldsValue },
    } = this.props;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...getFieldsValue() });
  };

  handleDelete = id => {
    const {
      form: { getFieldsValue },
      dispatch,
    } = this.props;
    dispatch({
      type: 'emergencyManagement/deleteDrill',
      payload: {
        id,
      },
      success: () => {
        message.success('删除成功！');
        this.fetchList(this.pageNum, this.pageSize, { ...getFieldsValue() });
      },
      error: msg => {
        message.error(msg);
      },
    });
  };

  /**
   * 渲染列表
   */
  renderTable = () => {
    const {
      emergencyManagement: {
        drill: {
          list,
          pagination: { pageNum, pageSize, total },
        },
        emergencyDrill = [],
      },
      user: {
        currentUser: { unitType },
      },
      loading = false,
    } = this.props;
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
      },
      {
        title: '演练计划',
        key: 'project',
        align: 'center',
        // width: 250,
        render: (val, row) => {
          const { projectName, projectCode, draftBy, draftDate } = row;
          return (
            <div className={styles.multi}>
              <div>
                计划名称：
                {projectName || NO_DATA}
              </div>
              <div>
                版本号：
                {projectCode || NO_DATA}
              </div>
              <div>
                制定人：
                {draftBy || NO_DATA}
              </div>
              <div>
                制定日期：
                {draftDate ? moment(draftDate).format('YYYY-MM-DD') : NO_DATA}
              </div>
            </div>
          );
        },
      },
      {
        title: '演练信息',
        key: 'projectInfo',
        align: 'center',
        // width: 250,
        render: (val, row) => {
          const { planName, planCode } = row;
          return (
            <div className={styles.multi}>
              <div>
                演练名称：
                {planName || NO_DATA}
              </div>
              <div>
                演练编号：
                {planCode || NO_DATA}
              </div>
            </div>
          );
        },
      },
      {
        title: '演练分级及编码',
        dataIndex: 'typeCode',
        key: 'typeCode',
        align: 'center',
        // width: 250,
        render: (val, row) => {
          const { planType, typeCode } = row;
          let treeData = emergencyDrill;
          const string = planType
            .split(',')
            .map(id => {
              const val = treeData.find(item => item.id === id) || {};
              treeData = val.children || [];
              return val.label;
            })
            .join('/');
          return (
            <div className={styles.multi}>
              <div>{string || ''}</div>
              <div>{typeCode || ''}</div>
            </div>
          );
        },
      },
      {
        title: '发布信息',
        dataIndex: 'draftInfo',
        key: 'draftInfo',
        align: 'center',
        render: (val, row) => {
          const { draftBy, draftDate } = row;
          return (
            <div className={styles.multi}>
              <div>
                发布人：
                {draftBy || NO_DATA}
              </div>
              <div>
                发布日期：
                {draftDate ? moment(draftDate).format('YYYY-MM-DD') : NO_DATA}
              </div>
            </div>
          );
        },
      },
      {
        title: '操作',
        key: 'opration',
        align: 'center',
        fixed: 'right',
        // fixed: unitType === 4 ? undefined : 'right',
        width: 150,
        render: (val, row) => (
          <Fragment>
            <AuthA code={detailCode} onClick={() => this.goDetail(row.id)}>
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.goEdit(row.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该应急演练计划吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >
              <AuthA code={deleteCode}>删除</AuthA>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={loading}
          columns={unitType === 4 ? columns.slice(1, columns.length) : columns}
          dataSource={list}
          // bordered
          scroll={{ x: 1400 }}
          // scroll={unitType === 4 ? undefined : { x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            // pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.handleTableChange,
            onShowSizeChange: this.handleTableChange,
          }}
        />
      </Card>
    ) : (
      <Spin spinning={loading}>
        <Card style={{ marginTop: '20px', textAlign: 'center' }}>
          <span>暂无数据</span>
        </Card>
      </Spin>
    );
  };

  render() {
    const {
      emergencyManagement: {
        drill: {
          pagination: { total },
          a,
          b,
          c,
        },
      },
      user: {
        currentUser: { unitType },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            {unitType !== 4 && (
              <span>
                单位数量：
                {c}
              </span>
            )}
            <span style={{ marginLeft: unitType === 4 ? 0 : 15 }}>
              演练计划：
              {total}
            </span>
            <span style={{ marginLeft: 15 }}>
              未执行：
              {b}
            </span>
            <span style={{ marginLeft: 15 }}>
              已执行：
              {a}
            </span>
          </div>
        }
      >
        {this.renderFilter()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
