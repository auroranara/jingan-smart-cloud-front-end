import React, { PureComponent, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Table, Row, Col, Input, Button, Spin, Divider, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import { stringify } from 'qs';
import moment from 'moment';
import Link from 'umi/link';
import debounce from 'lodash/debounce';
import Select from '@/jingan-components/Form/Select';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Ellipsis from '@/components/Ellipsis';
import router from 'umi/router';
import styles from './index.less';
import {
  LIST_API,
  DETAIL_CODE,
  ADD_CODE,
  EDIT_CODE,
  DELETE_CODE,
  LIST_PATH,
  DETAIL_PATH,
  ADD_PATH,
  EDIT_PATH,
  DELETE_API,
  FourLvls,
} from './utils';
import { NO_DATA } from '@/pages/FacilityManagement/ProductionFacility/List';

const { Option } = Select;
const title = '风险四色图管理';

/* 面包屑 */
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '风险分级管控',
    name: '风险分级管控',
  },
  {
    title,
    name: title,
  },
];

/* 获取root下的div */
const getRootChild = () => document.querySelector('#root>div');

/* session前缀 */
const sessionPrefix = 'company_report_list_';

const GET_PAYLOAD_BY_QUERY = ({
  pageNum,
  pageSize,
  zoneCode,
  zoneName,
  zoneLevel,
  riskCorrectLevel,
  companyName,
}) => ({
  pageNum: pageNum > 0 ? +pageNum : 1,
  pageSize: pageSize > 0 ? +pageSize : 10,
  zoneCode: zoneCode ? decodeURIComponent(zoneCode) : undefined,
  zoneName: zoneName ? decodeURIComponent(zoneName) : undefined,
  zoneLevel,
  riskCorrectLevel,
  companyName: companyName ? decodeURIComponent(companyName) : undefined,
});
const GET_QUERY_BY_PAYLOAD = ({
  pageNum,
  pageSize,
  zoneCode,
  zoneName,
  zoneLevel,
  riskCorrectLevel,
  companyName,
}) => ({
  pageNum,
  pageSize,
  zoneCode: zoneCode ? encodeURIComponent(zoneCode.trim()) : undefined,
  zoneName: zoneName ? encodeURIComponent(zoneName.trim()) : undefined,
  zoneLevel,
  riskCorrectLevel,
  companyName: companyName ? encodeURIComponent(companyName.trim()) : undefined,
});

/**
 * 企业自查报表
 */
@connect(({ company, user, fourColors, loading }) => ({
  company,
  user,
  fourColors,
  loading: loading.models.fourColors,
}))
@Form.create()
export default class FourColorsList extends PureComponent {
  constructor(props) {
    super(props);
    const {
      user: {
        currentUser: { unitType },
      },
    } = props;
    /* 当前账号是否是企业 */
    const isCompany = unitType === 4;
    const isWbCompany = unitType === 1;

    this.state = {};
    // 是否是企业
    this.isCompany = isCompany;
    // 是否是维保
    this.isWbCompany = isWbCompany;
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      form: { setFieldsValue },
      location: { query },
    } = this.props;
    // 重置控件
    setFieldsValue({
      ...GET_PAYLOAD_BY_QUERY(query),
    });

    // 获取列表
    this.fetchList();
  }

  // 获取列表
  fetchList = () => {
    const {
      location: { query },
      dispatch,
    } = this.props;
    dispatch({
      type: LIST_API,
      payload: { pageNum: 1, pageSize: 10, ...GET_PAYLOAD_BY_QUERY(query) },
    });
  };

  /**
   * 查询
   */
  handleSearch = () => {
    const {
      form: { getFieldsValue },
      location: { pathname, query },
    } = this.props;
    const values = getFieldsValue();
    const payload = GET_PAYLOAD_BY_QUERY(query);
    const newQuery = GET_QUERY_BY_PAYLOAD({ ...payload, ...values, pageNum: 1 });
    router.replace({
      pathname,
      query: newQuery,
    });
    setTimeout(() => {
      this.fetchList();
    }, 0);
  };

  /**
   * 重置
   */
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.handleSearch();
  };

  /**
   * 加载更多
   */
  handleLoadMore = (num, size) => {
    const {
      location: { pathname, query },
    } = this.props;
    const payload = GET_PAYLOAD_BY_QUERY(query);
    const newQuery = GET_QUERY_BY_PAYLOAD({ ...payload, pageNum: num, pageSize: size });
    router.replace({
      pathname,
      query: newQuery,
    });
    setTimeout(() => {
      this.fetchList();
    }, 0);
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: DELETE_API,
      payload: { id },
      callback: (success, msg) => {
        if (success) {
          this.fetchList();
          message.success('删除成功');
        } else message.warning(msg);
      },
    });
  };

  /**
   * 筛选表单
   **/
  renderFilterForm() {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { unitType, permissionCodes },
      },
      location: { query },
    } = this.props;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);
    const queryString = stringify(query);

    return (
      <Form className={styles.form}>
        <Row gutter={{ md: 24 }}>
          {+unitType !== 4 && (
            <Col xl={8} md={12} sm={24} xs={24}>
              <Form.Item label={'单位名称'}>
                {getFieldDecorator('companyName')(<Input placeholder="请输入单位名称" />)}
              </Form.Item>
            </Col>
          )}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={'区域名称'}>
              {getFieldDecorator('zoneName')(<Input placeholder="请输入区域名称" />)}
            </Form.Item>
          </Col>
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={'区域编号'}>
              {getFieldDecorator('zoneCode')(<Input placeholder="请输入区域编号" />)}
            </Form.Item>
          </Col>
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={'风险等级'}>
              {getFieldDecorator('zoneLevel')(<Select list={FourLvls} mode={'edit'} />)}
            </Form.Item>
          </Col>
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={'风险校正等级'}>
              {getFieldDecorator('riskCorrectLevel')(<Select list={FourLvls} mode={'edit'} />)}
            </Form.Item>
          </Col>

          {/* 按钮 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item>
              <Button type="primary" onClick={this.handleSearch} style={{ marginRight: 16 }}>
                查询
              </Button>
              <Button onClick={this.handleReset} style={{ marginRight: 16 }}>
                重置
              </Button>
              <Button
                type="primary"
                href={`#${ADD_PATH}${queryString ? `?${queryString}` : ''}`}
                disabled={!hasAddAuthority}
              >
                新增
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 表格
   */
  renderTable() {
    const {
      fourColors: {
        list: { list, pagination: { pageSize, pageNum, total } = {} },
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      location: { query },
    } = this.props;
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);
    // query字符串
    const queryString = stringify(query);

    const columns = [
      ...(+unitType === 4
        ? []
        : [
            {
              title: '单位名称',
              dataIndex: 'companyName',
              render: val => (
                <Ellipsis tooltip length={14} style={{ overflow: 'visible' }}>
                  {val}
                </Ellipsis>
              ),
            },
          ]),
      {
        title: '区域名称',
        dataIndex: 'zoneName',
      },
      {
        title: '区域编号',
        dataIndex: 'zoneCode',
      },
      {
        title: '区域负责人',
        dataIndex: 'zoneChargerName',
      },
      {
        title: '联系电话',
        dataIndex: 'phoneNumber',
      },
      {
        title: '固有风险等级',
        dataIndex: 'inherentRiskLevel',
        render: val =>
          val ? (
            <span style={{ color: FourLvls[val - 1].color }}>{FourLvls[val - 1].value}</span>
          ) : (
            NO_DATA
          ),
      },
      {
        title: '控制风险等级',
        dataIndex: 'controlRiskLevel',
        render: val =>
          val ? (
            <span style={{ color: FourLvls[val - 1].color }}>{FourLvls[val - 1].value}</span>
          ) : (
            NO_DATA
          ),
      },
      {
        title: '风险等级',
        dataIndex: 'zoneLevel',
        render: val =>
          val ? (
            <span style={{ color: FourLvls[val - 1].color }}>{FourLvls[val - 1].value}</span>
          ) : (
            NO_DATA
          ),
      },
      {
        title: '风险校正等级',
        dataIndex: 'riskCorrectLevel',
        render: val =>
          val ? (
            <span style={{ color: FourLvls[val - 1].color }}>{FourLvls[val - 1].value}</span>
          ) : (
            NO_DATA
          ),
      },
      {
        title: '复评周期（月）',
        dataIndex: 'checkCircle',
      },
      {
        title: '操作',
        key: 'operation',
        width: 160,
        render: (_, data) => (
          <Fragment>
            <Link
              to={`${DETAIL_PATH}/${data.id}${queryString ? `?${queryString}` : ''}`}
              disabled={!hasDetailAuthority}
            >
              查看
            </Link>
            <Divider type="vertical" />
            <Link
              to={`${EDIT_PATH}/${data.id}${queryString ? `?${queryString}` : ''}`}
              disabled={!hasEditAuthority}
            >
              编辑
            </Link>
            <Divider type="vertical" />
            <Popconfirm
              title="您确定要删除这条数据吗？"
              onConfirm={() => this.handleDelete(data.id)}
              disabled={!hasDeleteAuthority}
            >
              <Link to="/" disabled={!hasDeleteAuthority}>
                删除
              </Link>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return list.length > 0 ? (
      <Table
        className={styles.table}
        rowKey="id"
        dataSource={list}
        columns={columns}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: this.handleLoadMore,
          onShowSizeChange: (num, size) => {
            this.handleLoadMore(1, size);
          },
        }}
      />
    ) : (
      <div style={{ textAlign: 'center' }}>
        <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>
      </div>
    );
  }

  /**
   * 渲染函数
   */
  render() {
    const { loading } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.pageHeaderLayout}
      >
        <Spin spinning={!!loading}>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            {this.renderFilterForm()}
          </Card>
          <Card bordered={false}>{this.renderTable()}</Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
