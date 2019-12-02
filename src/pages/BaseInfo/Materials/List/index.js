import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Divider,
  Card,
  Input,
  Pagination,
  Select,
  Button,
  Table,
  Spin,
  message,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import router from 'umi/router';

import { hasAuthority, AuthA } from '@/utils/customAuth';
import InlineForm from '../../../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { RISK_CATEGORIES } from '@/pages/SafetyKnowledgeBase/MSDS/utils';

import styles from './index.less';
import index from '../../StorageAreaManagement';

const {
  baseInfo: {
    materials: { detail: detailCode, edit: editCode, add: addCode, delete: deleteCode },
  },
} = codes;
const addUrl = '/major-hazard-info/materials/add';

const { Option } = Select;
const title = '物料信息';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '重大危险源基本信息',
    name: '重大危险源基本信息',
  },
  {
    title,
    name: title,
  },
];

/* 去除两边空格 */
const transform = value => value.trim();
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');
const NO_DATA = '暂无数据';

@connect(({ materials, user, loading }) => ({
  materials,
  user,
  loading: loading.models.materials,
}))
export default class MaterialsList extends PureComponent {
  state = {
    formData: {},
  };

  componentDidMount() {
    this.fetchList(1);
  }

  pageNum = 1;
  pageSize = 10;

  fetchList = (pageNum, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'materials/fetchMaterialsList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
      },
    });
  };

  renderForm = () => {
    const {
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;
    const fields = [
      {
        id: 'chineName',
        render() {
          return <Input placeholder="请输入品名" />;
        },
        transform,
      },
      {
        id: 'riskCateg',
        render() {
          const options = RISK_CATEGORIES.map((item, index) => ({ value: index, name: item }));
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择危险性类别"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        id: 'reservesLocation',
        render() {
          return <Input placeholder="请输入存储场所" />;
        },
        transform,
      },
      // {
      //   id: 'majorHazard',
      //   render() {
      //     const options = [{ value: '0', name: '否' }, { value: '1', name: '是' }];
      //     return (
      //       <Select
      //         allowClear
      //         showSearch
      //         placeholder="是否是重大危险源"
      //         getPopupContainer={getRootChild}
      //         style={{ width: '100%' }}
      //       >
      //         {options.map(item => {
      //           const { value, name } = item;
      //           return (
      //             <Option value={value} key={value}>
      //               {name}
      //             </Option>
      //           );
      //         })}
      //       </Select>
      //     );
      //   },
      // },
      {
        id: 'casNo',
        render() {
          return <Input placeholder="请输入CAS号" />;
        },
        transform,
      },
      {
        id: 'highlyToxicChem',
        render() {
          const options = [{ value: '0', name: '否' }, { value: '1', name: '是' }];
          return (
            <Select
              allowClear
              showSearch
              placeholder="是否剧毒化学品"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        id: 'easyMakePoison',
        render() {
          const options = [{ value: '0', name: '否' }, { value: '1', name: '是' }];
          return (
            <Select
              allowClear
              showSearch
              placeholder="是否易制毒"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        id: 'easyMakeExplode',
        render() {
          const options = [{ value: '0', name: '否' }, { value: '1', name: '是' }];
          return (
            <Select
              allowClear
              showSearch
              placeholder="是否易制爆"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        id: 'type',
        render() {
          const options = [
            { value: '1', name: '生产原料' },
            { value: '2', name: '中间产品' },
            { value: '3', name: '最终产品' },
          ];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择物料类型"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        id: 'companyName',
        render() {
          return <Input placeholder="请输入单位名称" />;
        },
        transform,
      },
    ];

    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

    return (
      <Card>
        <InlineForm
          fields={unitType === 4 ? fields.slice(0, fields.length - 1) : fields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={
            <Button type="primary" onClick={this.goToAdd} disabled={!hasAddAuthority}>
              新增物料
            </Button>
          }
        />
      </Card>
    );
  };

  goToAdd = () => {
    router.push(addUrl);
  };

  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  goEdit = id => {
    router.push(`/major-hazard-info/materials/edit/${id}`);
  };

  // 表格改变触发，包含分页变动
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
      type: 'materials/deleteMaterials',
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
      user: {
        currentUser: { unitType },
      },
      materials: {
        list,
        pagination: { pageNum = 1, pageSize = 10, total = 0 } = {},
        companyNum = 0,
      },
    } = this.props;
    const { currentPage } = this.state;

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        // width: 160,
      },
      {
        title: '基本信息',
        key: 'basicInfo',
        align: 'center',
        // width: 250,
        render: (data, record) => {
          const { type, unifiedCode, chineName, riskCateg, superviseChemicals, casNo } = record;
          return (
            <div className={styles.multi}>
              <div>{['生产原料', '中间产品', '最终产品'][type - 1]}</div>
              <div>
                统一编码：
                {unifiedCode}
              </div>
              <div>
                品名：
                {chineName}
              </div>
              <div>
                危险性类别：
                {RISK_CATEGORIES[riskCateg]}
              </div>
              <div>
                重点监管危险化学品：
                {superviseChemicals === '0' ? '否' : '是'}
              </div>
              <div>
                CAS号：
                {casNo}
              </div>
            </div>
          );
        },
      },
      {
        title: '存储量',
        key: 'storageInfo',
        align: 'center',
        // width: 280,
        render: (data, record) => {
          const {
            type,
            annualConsumption,
            annualConsumptionUnit,
            maxStoreDay,
            maxStoreDayUnit,
            actualReserves,
            actualReservesUnit,
            annualThroughput,
            annualThroughputUnit,
          } = record;
          return (
            <div className={styles.multi}>
              {type === '1' ? (
                <div>
                  年生产能力：
                  {annualThroughput}
                  {annualThroughputUnit}
                </div>
              ) : (
                <Fragment>
                  <div>
                    年消耗量：
                    {annualConsumption}
                    {annualConsumptionUnit}
                  </div>
                  <div>
                    最大存储量：
                    {maxStoreDay}
                    {maxStoreDayUnit}
                  </div>
                </Fragment>
              )}
              <div>
                实际存储量：
                {actualReserves}
                {actualReservesUnit}
              </div>
            </div>
          );
        },
      },
      {
        title: '重大危险源',
        dataIndex: 'dangerSources',
        key: 'dangerSources',
        align: 'center',
        // width: 100,
        render: data => {
          return data && data.length > 0 ? '是' : '否';
        },
      },
      {
        title: '剧毒化学品/易制毒/易制爆',
        dataIndex: 'highlyToxicChem',
        key: 'highlyToxicChem',
        align: 'center',
        // width: 160,
        render: (data, record) => {
          const { highlyToxicChem, easyMakePoison, easyMakeExplode } = record;
          const dataList = [highlyToxicChem, easyMakePoison, easyMakeExplode].map(
            item => (item === '1' ? '是' : '否')
          );
          return dataList.join('/');
        },
      },
      {
        title: '存储场所',
        dataIndex: 'reservesLocation',
        key: 'reservesLocation',
        align: 'center',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 160,
        render: (data, record) => (
          <span>
            <AuthA code={editCode} onClick={() => this.goEdit(record.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该物料吗？" onConfirm={() => this.handleDelete(record.id)}>
              <AuthA code={deleteCode}>删除</AuthA>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位数量：
            {companyNum}
            <span style={{ marginLeft: 15 }}>
              物料数量：
              {total}
            </span>
          </div>
        }
      >
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              loading={loading}
              columns={unitType === 4 ? columns.slice(1, columns.length) : columns}
              dataSource={list}
              pagination={false}
              scroll={{ x: 'max-content' }}
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
