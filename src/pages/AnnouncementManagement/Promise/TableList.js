import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Button,
  AutoComplete,
  Card,
  Table,
  DatePicker,
  message,
  Popconfirm,
  Select,
  Divider,
  Spin,
} from 'antd';
import Link from 'umi/link';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import debounce from 'lodash/debounce';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

import { BREADCRUMBLIST, ROUTER, TABLE_COLUMNS_COMPANY, TABLE_COLUMNS as COLUMNS } from './utils';

// 权限
const {
  announcementManagement: {
    promise: { view: viewAuth, delete: deleteAuth, edit: editAuth, add: addAuth },
  },
} = codes;

const { Option } = Select;

@connect(({ loading, twoInformManagement, hiddenDangerReport, company, user }) => ({
  company,
  twoInformManagement,
  hiddenDangerReport,
  companyLoading: loading.effects['company/fetchModelList'],
  user,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
    this.state = {
      formData: {},
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchList();
    // 获取模糊搜索单位列表
    this.fetchUnitList();
  }

  // 获取列表
  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyPromiseList',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  handleSearch = values => {
    const { companyId, createDate } = values;
    this.setState({ formData: { companyId, createDate } });
    this.fetchList(1, this.pageSize, {
      createDate: createDate && createDate.format('YYYY-MM-DD'),
      companyId: companyId ? companyId.key : undefined,
    });
  };

  handleReset = (vals, form) => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  handleDeleteClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyPromiseDel',
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

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  handlePageChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  fetchUnitList = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
      payload: {
        pageNum: payload || 1,
        pageSize: 18,
      },
    });
  };

  handleUnitIdChange = value => {
    const { dispatch } = this.props;
    // 根据输入值获取列表
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
      payload: {
        unitName: value && value.trim(),
        pageNum: 1,
        pageSize: 18,
      },
    });
  };

  render() {
    const {
      loading = false,
      twoInformManagement: {
        safetyPromiseData: {
          a,
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      hiddenDangerReport: { unitIdes },
    } = this.props;

    const FIELDS = [
      {
        id: 'companyId',
        label: '单位名称',
        render: () => (
          // <AutoComplete
          //   allowClear
          //   mode="combobox"
          //   optionLabelProp="children"
          //   placeholder="请选择单位"
          //   notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
          //   onSearch={this.handleUnitIdChange}
          //   filterOption={false}
          // >
          //   {unitIdes.map(({ id, name }) => (
          //     <Option value={id} key={id}>
          //       {name}
          //     </Option>
          //   ))}
          // </AutoComplete>
          <Select
            allowClear
            showSearch
            labelInValue
            showArrow={false}
            placeholder="请选择单位"
            notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
            onSearch={this.handleUnitIdChange}
            filterOption={false}
          >
            {unitIdes.map(({ id, name }) => (
              <Option value={id} key={id}>
                {name}
              </Option>
            ))}
          </Select>
        ),
        // transform: v => v.trim(),
      },
      {
        id: 'createDate',
        label: '提交日期',
        render: () => <DatePicker placeholder="请选择日期" allowClear style={{ width: 260 }} />,
        options: { initialValue: null },
      },
    ];

    // 权限
    const viewCode = hasAuthority(viewAuth, permissionCodes);
    const deleteCode = hasAuthority(deleteAuth, permissionCodes);
    const editCode = hasAuthority(editAuth, permissionCodes);
    const addCode = hasAuthority(addAuth, permissionCodes);

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
    const toolBarAction = (
      <Button
        type="primary"
        onClick={this.handleAdd}
        disabled={!addCode}
        style={{ marginTop: '8px' }}
      >
        新增
      </Button>
    );

    const extraColumns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        fixed: 'right',
        width: 160,
        render: (val, text) => {
          return (
            <Fragment>
              {viewCode ? (
                <Link to={`${ROUTER}/view/${text.id}`} target="_blank">查看</Link>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>查看</span>
              )}
              <Divider type="vertical" />
              {editCode ? (
                <Link to={`${ROUTER}/edit/${text.id}`} target="_blank">编辑</Link>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>编辑</span>
              )}
              <Divider type="vertical" />
              {deleteCode ? (
                <Popconfirm
                  title="确定删除当前该内容吗？"
                  onConfirm={() => this.handleDeleteClick(text.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <span className={styles1.delete}>删除</span>
                </Popconfirm>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</span>
              )}
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
            单位数量：
            {a}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={unitType === 4 ? FIELDS.slice(1, FIELDS.length) : FIELDS}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
          />
        </Card>
        <div className={styles1.container}>
          {list.length > 0 ? (
            <Table
              rowKey="id"
              loading={loading}
              columns={
                unitType === 4
                  ? [...COLUMNS.slice(1, COLUMNS.length), ...extraColumns]
                  : [...COLUMNS, ...extraColumns]
              }
              dataSource={list}
              onChange={this.onTableChange}
              scroll={{ x: 1360 }} // 项目不多时注掉
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                // pageSizeOptions: ['5', '10', '15', '20'],
                onChange: this.handlePageChange,
                onShowSizeChange: (num, size) => {
                  this.handlePageChange(1, size);
                },
              }}
            />
          ) : (
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          )}
        </div>
      </PageHeaderLayout>
    );
  }
}
