import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Input,
  Pagination,
  Select,
  Button,
  Table,
  Spin,
  Cascader,
  Divider,
  Popconfirm,
  message,
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';

import { hasAuthority, AuthA } from '@/utils/customAuth';
import InlineForm from '../../../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import styles from './index.less';
import { getColorVal, paststatusVal } from '../utils';

const {
  baseInfo: {
    specialEquipment: { detail: detailCode, edit: editCode, add: addCode, delete: deleteCode },
  },
} = codes;
const addUrl = '/facility-management/special-equipment/add';

const { Option } = Select;
const title = '特种设备管理';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '设备设施管理',
    name: '设备设施管理',
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
const brandPayload = { type: '3', epuipmentType: '306' };
const NO_DATA = '暂无数据';

@connect(({ specialEquipment, user, loading, emergencyManagement }) => ({
  specialEquipment,
  user,
  loading: loading.effects['specialEquipment/fetchSpecialEquipList'],
  emergencyManagement,
}))
export default class SpecialEquipmentList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchDict({ type: 'specialEquipment' });
    this.fetchBrand(brandPayload);
    this.fetchList();
  }

  fetchList = (pageNum = 1, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'specialEquipment/fetchSpecialEquipList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
        category: filters.category && filters.category.join(','),
      },
    });
  };

  fetchBrand = (payload, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'specialEquipment/fetchBrandList', payload, callback });
  };

  fetchModel = (payload, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'specialEquipment/fetchModelList', payload, callback });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  handleBrandChange = brand => {
    // const {
    //   form: { setFieldsValue },
    // } = this.props;
    // setFieldsValue({ specification: undefined });
    this.fetchModel({ ...brandPayload, brand });
  };

  renderForm = () => {
    const {
      user: {
        currentUser: { permissionCodes, unitType },
      },
      emergencyManagement: { specialEquipment = [] },
      specialEquipment: { brandList = [], modelList = [] },
    } = this.props;
    const fields = [
      {
        id: 'code',
        render() {
          return <Input placeholder="请输入代码" />;
        },
      },
      {
        id: 'category',
        render: () => (
          <Cascader
            options={specialEquipment}
            fieldNames={{
              value: 'id',
              label: 'label',
              children: 'children',
              isLeaf: 'isLeaf',
            }}
            changeOnSelect
            placeholder="请选择分类"
            allowClear
          />
        ),
      },
      // {
      //   id: 'deviceCode',
      //   render() {
      //     const options = [];
      //     return (
      //       <Select
      //         allowClear
      //         showSearch
      //         placeholder="请选择类别"
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
      // {
      //   id: 'deviceCode',
      //   render() {
      //     const options = [];
      //     return (
      //       <Select
      //         allowClear
      //         showSearch
      //         placeholder="请选择品种"
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
        id: 'factoryNumber',
        render() {
          return <Input placeholder="请输入设备编号" />;
        },
        transform,
      },
      {
        id: 'equipName',
        render: () => {
          return <Input placeholder="请输入设备名称" />;
        },
        transform,
      },
      // {
      //   id: 'brand',
      //   render: () => (
      //     <Select placeholder="请选择品牌" onChange={this.handleBrandChange} allowClear>
      //       {brandList.map(({ id, name }) => (
      //         <Option key={id} value={id}>
      //           {name}
      //         </Option>
      //       ))}
      //     </Select>
      //   ),
      //   transform,
      // },
      {
        id: 'brand',
        render: () => <Input placeholder="请输入品牌" allowClear />,
        transform,
      },
      // {
      //   id: 'specification',
      //   render: () => (
      //     <Select placeholder="请选择型号" allowClear>
      //       {modelList.map(({ id, name }) => (
      //         <Option key={id} value={id}>
      //           {name}
      //         </Option>
      //       ))}
      //     </Select>
      //   ),
      //   transform,
      // },
      {
        id: 'specification',
        render: () => <Input placeholder="请输入型号" allowClear />,
        transform,
      },
      {
        id: 'paststatus',
        render() {
          const options = [
            { value: '0', name: '未到期' },
            { value: '1', name: '即将到期' },
            { value: '2', name: '已过期' },
          ];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择到期状态"
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
              新增
            </Button>
          }
        />
      </Card>
    );
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

  goToAdd = id => {
    router.push(addUrl);
  };

  goDetail = id => {
    router.push(`/facility-management/special-equipment/detail/${id}`);
  };

  goEdit = id => {
    router.push(`/facility-management/special-equipment/edit/${id}`);
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { formData } = this.state;
    dispatch({
      type: 'specialEquipment/deleteSpecialEquip',
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

  // 表格改变触发，包含分页变动
  handleTableChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  render() {
    const {
      loading = false,
      specialEquipment: {
        a: companyNum,
        list,
        pagination: { pageNum, pageSize, total },
      },
      user: {
        currentUser: { unitType },
      },
      emergencyManagement: { specialEquipment },
    } = this.props;

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        width: 200,
      },
      {
        title: '基本信息',
        key: 'project',
        align: 'center',
        width: 250,
        render: (val, row) => {
          const { equipName, factoryNumber, brand, specification } = row;
          return (
            <div className={styles.multi}>
              <div>
                名称：
                {equipName || NO_DATA}
              </div>
              <div>
                编号：
                {factoryNumber || NO_DATA}
              </div>
              <div>
                品牌：
                {brand || NO_DATA}
              </div>
              <div>
                型号：
                {specification || NO_DATA}
              </div>
            </div>
          );
        },
      },
      {
        title: '分类',
        dataIndex: 'category',
        key: 'category',
        align: 'center',
        width: 250,
        render: (val, row) => {
          const { code } = row;
          let treeData = specialEquipment;
          const string = val
            .split(',')
            .map(id => {
              const val = treeData.find(item => item.id === id) || {};
              treeData = val.children || [];
              return val.label;
            })
            .join('/');
          return (
            <div className={styles.multi}>
              <div>
                分类：
                {string || ''}
              </div>
              <div>
                代码：
                {code}
              </div>
            </div>
          );
        },
      },
      {
        title: '使用证编号',
        dataIndex: 'certificateNumber',
        key: 'certificateNumber',
        align: 'center',
        width: 200,
        render: val => val || '-',
      },
      {
        title: '有效期至',
        dataIndex: 'endDate',
        key: 'endDate',
        align: 'center',
        width: 250,
        render: (endDate, row) => {
          const { paststatus } = row;
          return endDate ? (
            <div>
              {/* <div style={{ color: +val === 2 ? '#f5222d' : 'rgba(0,0,0,0.65)' }}>
                {val && ['未到期', '即将到期', '已过期'][+val]}
              </div> */}
              {paststatus !== '0' && (
                <div style={{ color: getColorVal(paststatus) }}>{paststatusVal[paststatus]}</div>
              )}
              <div>{moment(endDate).format('YYYY年MM月DD日')}</div>
            </div>
          ) : (
            '-'
          );
        },
      },
      // {
      //   title: '已绑传感器',
      //   dataIndex: 'sensorInfo',
      //   key: 'sensorInfo',
      //   align: 'center',
      //   width: 120,
      //   render: (val, row) => {
      //     return 0;
      //   },
      // },
      // {
      //   title: '检验报告详情',
      //   dataIndex: 'detectReportFile',
      //   key: 'detectReportFile',
      //   align: 'center',
      //   width: 120,
      //   render: (val, row) => {
      //     if (val.length === 0) return '-';
      //     const { fileName, webUrl, id } = val[0];
      //     return (
      //       <a href={webUrl} target="_blank" rel="noopener noreferrer">
      //         检验报告
      //       </a>
      //     );
      //   },
      // },
      {
        title: '检验报告',
        dataIndex: 'report',
        width: 120,
        align: 'center',
        render: (val, text) => (
          <Link to={`/facility-management/special-equipment/inspection-report/${text.id}`}>
            查看详情
          </Link>
        ),
      },
      {
        title: '操作',
        key: 'opration',
        align: 'center',
        fixed: 'right',
        width: 200,
        render: (val, row) => (
          <Fragment>
            {/* <AuthA code={bindSensorCode} onClick={() => this.goDetail(row.id)}>
              绑定传感器
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={detailCode} onClick={() => this.goDetail(row.id)}>
              查看
            </AuthA>
            <Divider type="vertical" /> */}
            <AuthA code={editCode} onClick={() => this.goEdit(row.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该特种设备吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >
              <AuthA code={deleteCode}>删除</AuthA>
            </Popconfirm>
          </Fragment>
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
                {companyNum}
              </span>
            )}
            <span style={{ marginLeft: unitType !== 4 ? 15 : 0 }}>
              设备总数：
              {total}
            </span>
            {/* <span style={{ marginLeft: 15 }}>
              已绑传感器数：
              {0}
            </span> */}
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
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['5', '10', '15', '20']}
              pageSize={pageSize}
              current={pageNum}
              total={total}
              onChange={this.handleTableChange}
              onShowSizeChange={this.handleTableChange}
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
