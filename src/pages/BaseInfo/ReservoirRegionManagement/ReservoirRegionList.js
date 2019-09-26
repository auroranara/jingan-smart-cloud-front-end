import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Table, Select, Divider, Popconfirm, message } from 'antd';
import ToolBar from '@/components/ToolBar';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';

const { Option } = Select;

// 标题
const title = '库区管理';

const envirList = {
  1: '一类区',
  2: '二类区',
  3: '三类区',
};

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '一企一档',
    name: '一企一档',
  },
  {
    title,
    name: '库区管理',
  },
];

// 权限
const {
  baseInfo: {
    reservoirRegionManagement: { add: addAuth, edit: editAuth, delete: deleteAuth },
  },
} = codes;

const spanStyle = { md: 8, sm: 12, xs: 24 };

/* session前缀 */
const sessionPrefix = 'reservoir_region_list_';

@connect(({ reservoirRegion, user, loading }) => ({
  reservoirRegion,
  user,
  loading: loading.models.reservoirRegion,
}))
// @Form.create()
export default class ReservoirRegionList extends PureComponent {
  state = { formData: {} };

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
    this.fetchCountNum({ ...payload });
    if (sessionData) {
      this.form.setFieldsValue({ ...payload });
    }
  }

  // 获取列表
  fetchList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchAreaList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  // 获取数量
  fetchCountNum = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchCount',
      payload: {
        ...params,
      },
    });
  };

  handleFormRef = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  // 查询
  handleSearch = () => {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    const { name, number, position, ...rest } = this.form.getFieldsValue();
    const payload = { name, number, position, ...rest };
    this.fetchList(payload);
    this.fetchCountNum(payload);
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  };

  // 重置
  handleReset = () => {
    this.fetchList();
    this.fetchCountNum();
    sessionStorage.clear();
  };

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchAreaDelete',
      payload: { ids: id },
      success: () => {
        this.fetchList();
        this.fetchCountNum();
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  // 分页变动
  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchAreaList',
      payload: {
        pageSize,
        pageNum,
      },
    });
  };

  // 渲染表格
  renderTable = () => {
    const {
      reservoirRegion: {
        areaData: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    // 权限
    const editCode = hasAuthority(editAuth, permissionCodes);
    const deleteCode = hasAuthority(deleteAuth, permissionCodes);

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 200,
      },
      {
        title: '基本信息',
        dataIndex: 'info',
        align: 'center',
        width: 250,
        render: (val, text) => {
          const { number, name, area } = text;
          return (
            <div>
              <p>
                库区编号:
                {number}
              </p>
              <p>
                库区名称:
                {name}
              </p>
              <p>
                库区面积（㎡）:
                {area}
              </p>
            </div>
          );
        },
      },
      {
        title: '库房个数',
        dataIndex: 'count',
        align: 'center',
        width: 200,
      },
      {
        title: '所处环境功能区',
        dataIndex: 'environment',
        align: 'center',
        width: 200,
        render: val => {
          return envirList[val];
        },
      },
      {
        title: '区域位置',
        dataIndex: 'position',
        align: 'center',
        width: 180,
      },
      {
        title: '已绑传感器',
        dataIndex: 'bind',
        align: 'center',
        width: 120,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 200,
        render: (val, row) => (
          <Fragment>
            <Link to="/base-info/reservoir-region-management/list">绑定传感器</Link>
            <Divider type="vertical" />
            {editCode ? (
              <Link to={`/base-info/reservoir-region-management/edit/${row.id}`}>编辑</Link>
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
          columns={columns}
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
      reservoirRegion: {
        areaData: {
          pagination: { total },
        },
        envirTypeList,
        areaCount: { companyNum },
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const addCode = hasAuthority(addAuth, permissionCodes);

    const fields = [
      {
        id: 'name',
        label: '库区名称',

        span: spanStyle,
        render: () => <Input placeholder="请输入库区名称" />,
        transform: v => v.trim(),
      },
      {
        id: 'number',
        label: '库区编号',
        span: spanStyle,
        render: () => <Input placeholder="请输入库区编号" />,
        transform: v => v.trim(),
      },
      {
        id: 'position',
        label: '区域-位置',
        span: spanStyle,
        render: () => <Input placeholder="请输入区域位置" />,
        transform: v => v.trim(),
      },
      {
        id: 'environment',
        label: '所处环境功能区',
        span: { md: 16, sm: 16, xs: 24 },
        render: () => (
          <Select allowClear placeholder="请选择所处环境功能区">
            {envirTypeList.map(({ key, value }) => (
              <Option key={key} value={key}>
                {value}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'companyName',
        label: '单位名称：',
        span: spanStyle,
        render: () => <Input placeholder="请输入单位名称" />,
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
              {companyNum}
            </span>
            <span style={{ paddingLeft: 20 }}>
              库区总数：
              {total}
            </span>
            <span style={{ paddingLeft: 20 }}>
              已绑传感器数：
              {0}
            </span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={
              <Button
                type="primary"
                href={`#/base-info/reservoir-region-management/add`}
                disabled={!addCode}
              >
                新增库区
              </Button>
            }
            wrappedComponentRef={this.handleFormRef}
          />
        </Card>

        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
