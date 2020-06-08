import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Cascader,
  Card,
  Input,
  Pagination,
  Select,
  Button,
  Table,
  Spin,
  Divider,
  Popconfirm,
  message,
} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import router from 'umi/router';

import { hasAuthority, AuthA } from '@/utils/customAuth';
import InlineForm from '../../../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { getColorVal, paststatusVal } from '@/pages/BaseInfo/SpecialEquipment/utils';

import styles from './index.less';

const {
  emergencyManagement: {
    emergencySupplies: {
      detail: detailCode,
      edit: editCode,
      add: addCode,
      delete: deleteCode,
      checkList: checkListCode,
      maintList: maintListCode,
    },
  },
} = codes;
const NO_DATA = '暂无数据';
const addUrl = '/emergency-management/emergency-supplies/add';

const { Option } = Select;
const title = '应急物资';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '应急管理',
    name: '应急管理',
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

const SuppliesCodes = [
  { value: '43B01', name: '43B01 防汛抗旱专用物资' },
  { value: '43B02', name: '43B02 防震减灾专用物资' },
  { value: '43B03', name: '43B03 防疫应急专用物资' },
  { value: '43B04', name: '43B04 有害生物灾害应急防控专用物资' },
  { value: '43B05', name: '43B05 危险化学品事故救援专用物资' },
  { value: '43B06', name: '43B06 矿山事故救援专用物资' },
  { value: '43B07', name: '43B07 油污染处置物资' },
  { value: '43B99', name: '43B99 其他专项救援物资储备' },
];
const LvlCodes = [
  { value: '1', name: '01 国家级' },
  { value: '2', name: '02 社会力量' },
  { value: '3', name: '99 其他' },
];

@connect(({ emergencyManagement, user, loading }) => ({
  emergencyManagement,
  user,
  loading: loading.models.emergencyManagement,
}))
export default class EmergencySuppliesList extends PureComponent {
  state = {
    formData: {},
  };

  pageNum = 1;
  pageSize = 10;

  componentDidMount() {
    this.fetchDict({ type: 'emergencyEquip' });
    this.fetchList(1);
  }

  fetchList = (pageNum = 1, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchSuppliesList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
        materialType: filters.materialType && filters.materialType.join(','),
      },
    });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  renderForm = () => {
    const {
      user: {
        currentUser: { permissionCodes, unitType },
      },
      emergencyManagement: { emergencyEquip = [] },
    } = this.props;
    const fields = [
      {
        id: 'materialName',
        render() {
          return <Input placeholder="请输入物资名称" />;
        },
        transform,
      },
      {
        id: 'materialType',
        render() {
          return (
            <Cascader
              options={emergencyEquip}
              fieldNames={{
                value: 'id',
                label: 'label',
                children: 'children',
                isLeaf: 'isLeaf',
              }}
              changeOnSelect
              placeholder="请选择物资分类"
              allowClear
              getPopupContainer={getRootChild}
            />
          );
        },
      },
      {
        id: 'materialCode',
        render() {
          return <Input placeholder="请输入物资编码" />;
        },
        transform,
      },
      {
        id: 'code',
        render() {
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择资源编码"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {SuppliesCodes.map(item => {
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
        id: 'levelCode',
        render() {
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择级别编码"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {LvlCodes.map(item => {
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
      {
        id: 'checkStatus',
        render() {
          const options = [
            { value: 0, name: '未到期' },
            { value: 1, name: '即将到期' },
            { value: 2, name: '已过期' },
          ];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择检查状态"
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
        id: 'maintStatus',
        render() {
          const options = [
            { value: 0, name: '未到期' },
            { value: 1, name: '即将到期' },
            { value: 2, name: '已过期' },
          ];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择维保状态"
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
    ];

    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

    return (
      <Card>
        <InlineForm
          fields={unitType === 4 ? fields.filter(item => item.id !== 'companyName') : fields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={
            <Button type="primary" onClick={this.goToAdd} disabled={!hasAddAuthority}>
              新增
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

  goDetail = id => {
    router.push(`/emergency-management/emergency-supplies/detail/${id}`);
  };

  goEdit = id => {
    router.push(`/emergency-management/emergency-supplies/edit/${id}`);
  };

  goCheck = id => {
    router.push(`/emergency-management/emergency-supplies/check/${id}/list`);
  };

  goMaint = id => {
    router.push(`/emergency-management/emergency-supplies/maint/${id}/list`);
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
      type: 'emergencyManagement/deleteSupplies',
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
        supplies: { list, pagination: { pageNum = 1, pageSize = 10, total = 0 } = {}, a },
        emergencyEquip = [],
      },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const { currentPage } = this.state;

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        width: 160,
      },
      {
        title: '物资名称',
        dataIndex: 'materialName',
        key: 'materialName',
        align: 'center',
        width: 120,
      },
      {
        title: '资源编码',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
        width: 160,
        render: data => {
          return SuppliesCodes.find(item => item.value === data).name;
        },
      },
      {
        title: '级别编码',
        dataIndex: 'levelCode',
        key: 'levelCode',
        align: 'center',
        width: 120,
        render: data => {
          return LvlCodes[data - 1].name;
        },
      },
      {
        title: '物资分类及编码',
        dataIndex: 'materialType',
        key: 'materialType',
        align: 'center',
        width: 200,
        render: (data, record) => {
          const { materialType, materialCode } = record;
          let treeData = emergencyEquip;
          const string = materialType
            .split(',')
            .map(id => {
              const val = treeData.find(item => item.id === id) || {};
              treeData = val.children || [];
              return val.label;
            })
            .join('/');
          return (
            <div className={styles.multi}>
              <div>{string}</div>
              <div>{materialCode}</div>
            </div>
          );
        },
      },
      {
        title: '物资数量',
        dataIndex: 'materialCount',
        key: 'materialCount',
        align: 'center',
        width: 100,
      },
      {
        title: '定期检查',
        dataIndex: 'daySpace',
        key: 'daySpace',
        align: 'center',
        width: 280,
        render: (data, record) => {
          const { daySpace, checkDate, checkStatus } = record;
          return (
            <div className={styles.multi}>
              <div style={{ color: getColorVal(checkStatus) }}>{paststatusVal[checkStatus]}</div>
              <div>
                检查间隔：
                {daySpace || daySpace === 0 ? daySpace + '天' : NO_DATA}
              </div>
              <div>
                下次检查日期：
                {checkDate ? moment(checkDate).format('YYYY-MM-DD') : NO_DATA}
              </div>
              <div>
                <AuthA code={checkListCode} onClick={() => this.goCheck(record.id)}>
                  检查记录
                </AuthA>
              </div>
            </div>
          );
        },
      },
      {
        title: '定期维保',
        dataIndex: 'dayMaintSpace',
        key: 'dayMaintSpace',
        align: 'center',
        width: 280,
        render: (data, record) => {
          const { dayMaintSpace, maintDate, maintStatus } = record;
          return (
            <div className={styles.multi}>
              <div style={{ color: getColorVal(maintStatus) }}>{paststatusVal[maintStatus]}</div>
              <div>
                维保间隔：
                {dayMaintSpace || dayMaintSpace === 0 ? dayMaintSpace + '天' : NO_DATA}
              </div>
              <div>
                下次维保日期：
                {maintDate ? moment(maintDate).format('YYYY-MM-DD') : NO_DATA}
              </div>
              <div>
                <AuthA code={maintListCode} onClick={() => this.goMaint(record.id)}>
                  维保记录
                </AuthA>
              </div>
            </div>
          );
        },
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
            <AuthA code={detailCode} onClick={() => this.goDetail(record.id)}>
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.goEdit(record.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该应急物资吗？"
              onConfirm={() => this.handleDelete(record.id)}
            >
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
            {unitType !== 4 && (
              <span>
                单位数量：
                {a}
              </span>
            )}
            <span style={{ marginLeft: unitType !== 4 ? 15 : 0 }}>
              应急物资数量：
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
              // pageSizeOptions={['5', '10', '15', '20']}
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
