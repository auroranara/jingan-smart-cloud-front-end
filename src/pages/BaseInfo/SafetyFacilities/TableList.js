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
const itemsStyle = { style: { width: 'calc(47%)', marginRight: '10px' } };

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
  0: '未到期',
  1: '即将到期',
  2: '已过期',
};

const statusVal = {
  1: '正常',
  2: '维检',
  3: '报废',
  4: '使用中',
};

/* session前缀 */
const sessionPrefix = 'safety_fac';

@connect(({ safeFacilities, baseInfo, user, loading }) => ({
  safeFacilities,
  baseInfo,
  user,
  loading: loading.models.safeFacilities,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      categoryOneId: '', // 分类一列表选中Id
      categoryTwoId: '', // 分类二列表选中Id
      safeFacilitiesNameId: '', //分类三列表选中Id
      categoryOneName: undefined, // 分类一列表选中名称
      categoryTwoName: undefined, // 分类二列表选中名称
      categoryThreeName: undefined, // 分类三列表选中名称
      categoryOneList: [], // 分类一列表
      categoryTwoList: [], // 分类二列表
      facilitiesNameList: [], // 安全设施名称列表
    };
  }

  // 挂载后
  componentDidMount() {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    this.fetchDict({
      payload: { type: 'safeFacilities', parentId: 0 },
      callback: list => {
        this.setState({ categoryOneList: list });
      },
    });
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
    const { categoryOneId, categoryTwoId, safeFacilitiesNameId } = this.state;

    const { companyName, equipName, equipStatus, paststatus } = this.form.getFieldsValue();
    const payload = {
      category: categoryOneId ? categoryOneId + ',' + categoryTwoId : undefined,
      safeFacilitiesName: safeFacilitiesNameId ? safeFacilitiesNameId : undefined,
      companyName,
      equipName,
      equipStatus,
      paststatus,
    };

    this.fetchList(payload);
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  };

  // 重置
  handleReset = () => {
    this.fetchList();
    this.setState({
      categoryOneId: '',
      categoryOneName: undefined,
      categoryTwoId: '',
      categoryTwoName: undefined,
      safeFacilitiesNameId: '',
      categoryThreeName: undefined,
    });
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
        return 'rgba(0, 0, 0, 0.65)';
      case 1:
        return 'rgb(250, 173, 20)';
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

  // 获取字典
  fetchDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/fetchDict',
      ...actions,
    });
  };

  handleCategoryOneChange = val => {
    const { categoryOneList } = this.state;
    const typeOneName = categoryOneList.filter(item => item.id === val).map(item => item.label);
    this.setState({ categoryOneName: typeOneName });

    if (val) {
      this.fetchDict({
        payload: { type: 'safeFacilities', parentId: val },
        callback: list => {
          this.setState({ categoryTwoList: list });
        },
      });
    } else this.setState({ categoryOneList: [] });
    this.setState({ categoryOneId: val });
  };

  handleCategoryTwoChange = val => {
    const { categoryTwoList } = this.state;
    const typeTwoName = categoryTwoList.filter(item => item.id === val).map(item => item.label);
    this.setState({ categoryTwoName: typeTwoName });

    if (val) {
      this.fetchDict({
        payload: { type: 'safeFacilities', parentId: val },
        callback: list => {
          this.setState({ facilitiesNameList: list });
        },
      });
    } else this.setState({ categoryTwoList: [] });
    this.setState({ categoryTwoId: val });
  };

  handleNameChange = val => {
    const { facilitiesNameList } = this.state;
    const typeThreeName = facilitiesNameList
      .filter(item => item.id === val)
      .map(item => item.label);
    this.setState({ categoryThreeName: typeThreeName });
    this.setState({ safeFacilitiesNameId: val });
  };

  handleCategoryOneSelect = () => {
    this.setState({
      categoryTwoId: '',
      categoryTwoName: '',
      safeFacilitiesNameId: '',
      categoryThreeName: '',
    });
  };

  handleCategoryTwoSelect = () => {
    this.setState({
      safeFacilitiesNameId: '',
      categoryThreeName: '',
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

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 300,
      },
      {
        title: '分类',
        dataIndex: 'categoryName',
        align: 'center',
        width: 200,
        render: val => {
          return <span>{val ? val[0] + '/' + val[1] : []}</span>;
        },
      },
      {
        title: '安全设施名称',
        dataIndex: 'safeFacilitiesLabel',
        align: 'center',
        width: 200,
      },
      {
        title: '编号名称',
        dataIndex: 'info',
        align: 'center',
        width: 300,
        render: (val, text) => {
          const { specifications, leaveProductNumber, equipName } = text;
          return (
            <div>
              <p>
                规格型号:
                {specifications}
              </p>
              <p>
                出厂编号:
                {leaveProductNumber}
              </p>
              <p>
                设备名称:
                {equipName}
              </p>
            </div>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'equipStatus',
        align: 'center',
        width: 200,
        render: (val, record) => {
          const { paststatus } = record;
          return (
            <div>
              <span>{statusVal[val]}</span>
              <span style={{ color: this.getColorVal(paststatus), paddingLeft: 10 }}>
                {paststatusVal[paststatus]}
              </span>
            </div>
          );
        },
      },
      {
        title: '检验有效期至',
        dataIndex: 'useYear',
        align: 'center',
        width: 200,
        render: (val, record) => {
          const { endDate } = record;
          return endDate ? (
            <div>{endDate ? <span>{moment(endDate).format('YYYY-MM-DD')}</span> : ''}</div>
          ) : (
            '-'
          );
        },
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
      {
        title: '检验报告',
        dataIndex: 'report',
        width: 120,
        align: 'center',
        render: (val, text) => (
          <a href={`#/facility-management/safety-facilities/inspection-report/${text.id}`}>
            查看详情
          </a>
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
        // facNameList = [],
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;

    const {
      categoryOneList,
      categoryTwoList,
      facilitiesNameList,
      categoryOneName,
      categoryTwoName,
      categoryThreeName,
    } = this.state;

    const addCode = hasAuthority(addAuth, permissionCodes);

    const fields = [
      {
        id: 'equipName',
        label: '设备名称',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      },
      {
        id: 'category',
        label: '分类：',
        render: () => (
          <div style={{ width: '400px' }}>
            <Select
              value={categoryOneName}
              placeholder="请选择"
              {...itemsStyle}
              onChange={this.handleCategoryOneChange}
              onSelect={this.handleCategoryOneSelect}
            >
              {categoryOneList.map(({ id, label }) => (
                <Select.Option key={id} value={id}>
                  {label}
                </Select.Option>
              ))}
            </Select>
            <Select
              value={categoryTwoName}
              {...itemsStyle}
              placeholder="请选择"
              onChange={this.handleCategoryTwoChange}
              onSelect={this.handleCategoryTwoSelect}
            >
              {categoryTwoList.map(({ id, label }) => (
                <Select.Option key={id} value={id}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </div>
        ),
      },
      {
        id: 'facilitiesName',
        render: () => (
          <div>
            <Select
              value={categoryThreeName}
              onChange={this.handleNameChange}
              allowClear
              style={{ width: 'calc(55%)', marginLeft: '15%' }}
              placeholder="请选择"
            >
              {facilitiesNameList.map(({ id, label }) => (
                <Select.Option key={id} value={id}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </div>
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
        label: '检验到期状态：',
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
