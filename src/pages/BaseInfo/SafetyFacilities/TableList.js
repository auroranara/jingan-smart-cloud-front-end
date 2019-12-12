import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Select, Table, Cascader, Divider, Popconfirm, message } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import moment from 'moment';
import ToolBar from '@/components/ToolBar';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
const { Option } = Select;
// 标题
const title = '安全设施';

export const ROUTER = '/facility-management/safety-facilities'; // modify
export const LIST_URL = `${ROUTER}/list`;

//面包屑
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
    name: '安全设施',
  },
];

// 权限
const {
  baseInfo: {
    safetyFacilities: { view: viewAuth, add: addAuth, edit: editAuth, delete: deleteAuth },
  },
} = codes;

const paststatusVal = {
  0: ' ',
  1: '即将到期',
  2: '已过期',
};

const statusVal = {
  1: '正常',
  2: '维检',
  3: '报废',
  4: '使用中',
};

// 获取根节点
const getRootChild = () => document.querySelector('#root>div');

/* session前缀 */
const sessionPrefix = 'safety_fac';

@connect(({ safeFacilities, user, loading }) => ({
  safeFacilities,
  user,
  loading: loading.models.safeFacilities,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 挂载后
  componentDidMount() {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    // 从sessionStorage中获取存储的控件值
    const sessionData = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`));
    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
    };
    this.fetchList({ ...payload });
    if (sessionData) {
      this.form.setFieldsValue({ ...payload });
    }
  }

  // 获取列表
  fetchList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safeFacilities/fetchSafeFacList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  // 查询
  handleSearch = () => {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    const { category, ...rest } = this.form.getFieldsValue();
    const payload = { category: category ? category.join(',') : undefined, ...rest };
    this.fetchList(payload);
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  };

  // 重置
  handleReset = () => {
    this.fetchList();
    sessionStorage.clear();
  };

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safeFacilities/fetchSafeFacDelete',
      payload: { id: id },
      success: () => {
        this.fetchList();
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  getColorVal = status => {
    switch (+status) {
      case 0:
        return '#1890ff';
      case 1:
        return '#f5222d';
      case 2:
        return '#f5222d';
      default:
        return;
    }
  };

  // 分页变动
  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      user: {
        currentUser: { id },
      },
    } = this.props;

    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'safeFacilities/fetchSafeFacList',
      payload: {
        ...payload,
        pageSize,
        pageNum,
      },
    });
  };

  // 渲染表格
  renderTable = () => {
    const {
      loading,
      safeFacilities: {
        safeFacData: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;

    // 权限
    const viewCode = hasAuthority(viewAuth, permissionCodes);
    const editCode = hasAuthority(editAuth, permissionCodes);
    const deleteCode = hasAuthority(deleteAuth, permissionCodes);

    const newColumns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 300,
      },
    ];

    const columns = [
      {
        title: '分类',
        dataIndex: 'category',
        align: 'center',
        width: 200,
        render: (val, record) => {
          return val ? (
            (val.split(',').length === 2 && <span> 预防事故设施/监测、报警设施</span>) ||
              (val.split(',').length === 1 && <span> 预防事故设施</span>)
          ) : (
            <span>---</span>
          );
        },
      },
      {
        title: '安全设施名称',
        dataIndex: 'safeFacilitiesName',
        align: 'center',
        width: 200,
        render: val => {
          return +val === 1 ? '压力表' : +val === 2 ? '温度计' : '液位仪';
        },
      },
      {
        title: '状态',
        dataIndex: 'equipStatus',
        align: 'center',
        width: 200,
        render: val => {
          return <div>{statusVal[val]}</div>;
        },
      },
      {
        title: '数量',
        dataIndex: 'equipNumber',
        align: 'center',
        width: 200,
      },
      {
        title: '有效期至',
        dataIndex: 'useYear',
        align: 'center',
        width: 200,
        render: (val, record) => {
          const { endDate, paststatus } = record;
          return endDate ? (
            <div>
              {endDate ? <span>{moment(endDate).format('YYYY-MM-DD')}</span> : ''}
              {/* <span style={{ color: this.getColorVal(paststatus), paddingLeft: 10 }}>
                {paststatusVal[paststatus]}
              </span> */}
            </div>
          ) : '-';
        },
      },
      {
        title: '有效期状态',
        dataIndex: 'pastStatus',
        width: 120,
        align: 'center',
        render: paststatus => (
          <span style={{ color: this.getColorVal(paststatus), paddingLeft: 10 }}>
            {paststatusVal[paststatus]}
          </span>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 200,
        render: (val, row) => (
          <Fragment>
            {viewCode ? (
              <Link to={`${ROUTER}/view/${row.id}`}>查看</Link>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>查看</span>
            )}
            <Divider type="vertical" />
            {editCode ? (
              <Link to={`${ROUTER}/edit/${row.id}`}>编辑</Link>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>编辑</span>
            )}
            <Divider type="vertical" />
            {deleteCode ? (
              <Popconfirm title="确认要删除数据吗？" onConfirm={() => this.handleDelete(row.id)}>
                <a>删除</a>
              </Popconfirm>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</span>
            )}
          </Fragment>
        ),
      },
    ];

    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={loading}
          columns={unitType === 4 ? columns : [...newColumns, ...columns]}
          dataSource={list}
          bordered
          scroll={{ x: 1400 }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.handlePageChange,
            onShowSizeChange: (num, size) => {
              this.handlePageChange(1, size);
            },
          }}
        />
      </Card>
    ) : (
      <div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>
    );
  };

  render() {
    const {
      safeFacilities: {
        safeFacData: { a },
        categoryList = [],
        facNameList = [],
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;

    const addCode = hasAuthority(addAuth, permissionCodes);

    const fields = [
      {
        id: 'safeFacilitiesName',
        label: '装备名称：',
        render: () => (
          <Select allowClear placeholder="请选择">
            {facNameList.map(({ key, label }) => (
              <Select.Option key={key} value={key}>
                {label}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'category',
        label: '分类：',
        render: () => (
          <Cascader
            placeholder="请选择"
            options={categoryList}
            allowClear
            changeOnSelect
            notFoundContent
            getPopupContainer={getRootChild}
          />
        ),
      },
      {
        id: 'equipStatus',
        label: '设备状态：',
        render: () => (
          <Select placeholder="请选择" allowClear>
            {['正常', '维检', '报废', '使用中'].map((r, i) => (
              <Option key={i + 1}>{r}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'paststatus',
        label: '到期状态：',
        render: () => (
          <Select placeholder="请选择" allowClear>
            {['未到期', '即将到期', '已过期'].map((r, i) => (
              <Option key={i}>{r}</Option>
            ))}
          </Select>
        ),
      },
    ];

    const newFields = [
      {
        id: 'companyName',
        label: '单位名称：',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              单位数量：
              {a}
            </span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={unitType === 4 ? fields : [...fields, ...newFields]}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={
              <Button type="primary" disabled={!addCode} href={`#${ROUTER}/add`}>
                新增
              </Button>
            }
            wrappedComponentRef={this.setFormReference}
          />
        </Card>
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
