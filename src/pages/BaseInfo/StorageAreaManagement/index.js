import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Input,
  Select,
  Table,
  Divider,
  Popconfirm,
  Pagination,
  Spin,
  message,
} from 'antd';
import router from 'umi/router';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import BindSensorModal from '@/pages/DeviceManagement/Components/BindSensorModal';
import styles from './Edit.less';

const {
  baseInfo: {
    storageAreaManagement: {
      // detail: detailCode,
      edit: editCode,
      add: addCode,
      delete: deleteCode,
      bindSensor: bindSensorCode,
    },
  },
} = codes;
const { Option } = Select;
// 标题
const title = '储罐区管理';

const dangerTypeList = [{ key: '1', value: '是' }, { key: '0', value: '否' }];

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
    name: '储罐区管理',
  },
];

const spanStyle = { md: 8, sm: 12, xs: 24 };
const fields = [
  {
    id: 'areaName',
    label: '储罐区名称',
    span: spanStyle,
    render: () => <Input placeholder="请输入储罐区名称" />,
    transform: v => v.trim(),
  },
  {
    id: 'code',
    label: '统一编码',
    span: spanStyle,
    render: () => <Input placeholder="请输入统一编码" />,
    transform: v => v.trim(),
  },
  {
    id: 'location',
    label: '区域位置',
    span: spanStyle,
    render: () => <Input placeholder="请输入区域位置" />,
    transform: v => v.trim(),
  },
  {
    id: 'chineName',
    label: '存储介质',
    span: spanStyle,
    render: () => <Input placeholder="请输入存储介质" />,
    transform: v => v.trim(),
  },
  {
    id: 'isDanger',
    label: '重大危险源',
    span: spanStyle,
    render: () => (
      <Select allowClear placeholder="请选择危险性类别">
        {dangerTypeList.map(({ key, value }) => (
          <Option key={key} value={key}>
            {value}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    id: 'companyName',
    label: '单位名称',
    span: spanStyle,
    render: () => <Input placeholder="请输入单位名称" />,
    transform: v => v.trim(),
  },
];

@connect(({ loading, storageAreaManagement, user }) => ({
  loading: loading.models.storageAreaManagement,
  storageAreaManagement,
  user,
}))
@Form.create()
export default class StorageAreaManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
    this.exportButton = (
      <Button type="primary" href={`#/base-info/storage-area-management/add`}>
        新增
      </Button>
    );
    this.pageNum = 1;
    this.pageSize = 10;
  }

  // 挂载后
  componentDidMount() {
    this.fetchList();
  }

  fetchList = (pageNum = 1, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storageAreaManagement/fetchTankAreaList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
      },
    });
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

  goEdit = id => {
    router.push(`/base-info/storage-area-management/edit/${id}`);
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { formData } = this.state;
    dispatch({
      type: 'storageAreaManagement/deleteTankArea',
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

  handleViewBind = () => {};

  // 渲染表格
  renderTable = () => {
    const {
      loading,
      user: {
        currentUser: { unitType },
      },
      storageAreaManagement: {
        list,
        pagination: { pageNum, pageSize, total },
      },
    } = this.props;

    const columns = [
      {
        title: '单位名称',
        key: 'companyName',
        dataIndex: 'companyName',
        align: 'center',
        width: 200,
      },
      {
        title: '基本信息',
        key: 'info',
        dataIndex: 'info',
        align: 'center',
        width: 300,
        render: (val, row) => {
          const { code, areaName, tankCount } = row;
          return (
            <div className={styles.multi}>
              <div>
                统一编码：
                {code}
              </div>
              <div>
                储罐区名称：
                {areaName}
              </div>
              <div>
                储罐个数：
                {tankCount}
              </div>
            </div>
          );
        },
      },
      {
        title: '存储介质',
        key: 'chineNameList',
        dataIndex: 'chineNameList',
        align: 'center',
        width: 300,
        render: val => val.join(', '),
      },
      {
        title: '重大危险源',
        key: 'isDanger',
        dataIndex: 'isDanger',
        align: 'center',
        width: 120,
        render: val => (+val === 0 ? '否' : '是'),
      },
      {
        title: '区域位置',
        key: 'location',
        dataIndex: 'location',
        align: 'center',
        width: 200,
      },
      {
        title: '已绑传感器',
        key: 'sensor',
        dataIndex: 'sensor',
        align: 'center',
        width: 120,
        render: () => 0,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 200,
        render: (val, row) => (
          <Fragment>
            {/* <AuthA code={bindSensorCode} onClick={() => this.handleViewBind(row)}>
              绑定传感器
            </AuthA>
            <Divider type="vertical" /> */}
            <AuthA code={editCode} onClick={() => this.goEdit(row.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              // title="确认要删除该储罐区吗？如继续删除，已绑定传感器将会自动解绑！"
              title="确认要删除该储罐区吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >
              <AuthA code={deleteCode}>删除</AuthA>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return list && list.length ? (
      <Spin spinning={loading}>
        <Card style={{ marginTop: '24px' }}>
          <Table
            rowKey="id"
            // loading={loading}
            // columns={unitType===4?columns.slice(1, columns.length):columns}
            columns={columns}
            dataSource={list}
            scroll={{ x: 'max-content' }}
            pagination={false}
            // pagination={{
            //   current: pageNum,
            //   pageSize,
            //   total,
            //   showQuickJumper: true,
            //   showSizeChanger: true,
            //   pageSizeOptions: ['5', '10', '15', '20'],
            //   onChange: this.handleQuery,
            //   onShowSizeChange: (num, size) => {
            //     this.handleQuery(1, size);
            //   },
            // }}
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
      </Spin>
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
      user: {
        currentUser: { permissionCodes, unitType },
      },
      storageAreaManagement: {
        a: companyNum,
        pagination: { total },
      },
    } = this.props;
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

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
              储罐区总数：
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
            fields={unitType === 4 ? fields.slice(0, fields.length - 1) : fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={
              <Button
                type="primary"
                href={`#/base-info/storage-area-management/add`}
                disabled={!hasAddAuthority}
              >
                新增
              </Button>
            }
          />
        </Card>

        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
