import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import { Button, Card, Input, message, Popconfirm, Select, Table } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './MList.less';
import { genOperateCallback } from '@/pages/PersonnelManagement/CheckPoint/utils';
import { deleteEmptyProps, handleTableData, INDEXES, RISK_CATEGORIES } from './utils';
import codes from '@/utils/codes';
import { AuthButton, AuthLink, AuthSpan } from '@/utils/customAuth';

const { Option } = Select;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '安全生产知识库', name: '安全生产知识库' },
  { title: '化学品安全说明书', name: '化学品安全说明书' },
  { title: '列表', name: '列表' },
];

const PAGE_SIZE = 20;
const SPAN = { md: 8, sm: 12, xs: 24 };
const FIELDS = [
  {
    id: 'chineName',
    label: '化学品：',
    span: SPAN,
    render: () => <Input placeholder="请输入中文名称/英文名" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'riskCateg',
    label: '危险品类别',
    span: SPAN,
    render: () => (
      <Select placeholder="请选择危险性类别" allowClear>
        {RISK_CATEGORIES.map((r, i) => (
          <Option key={i}>{r}</Option>
        ))}
      </Select>
    ),
  },
  {
    id: 'casNo',
    label: 'CAS号：',
    span: SPAN,
    render: () => <Input placeholder="CAS号" allowClear />,
    transform: v => v.trim(),
  },
];

function getColumns(genHandleDelete) {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '中文名',
      dataIndex: 'chineNames',
      key: 'chineNames',
      render(names) {
        return names.length === 2
          ? names.map((n, i) => (
              <p key={n} className={styles.p}>
                名称
                {INDEXES[i]}：{n}
              </p>
            ))
          : names[0];
      },
    },
    {
      title: '英文名',
      dataIndex: 'engName',
      key: 'engNames',
      render(names) {
        return names.length === 2
          ? names.map((n, i) => (
              <p key={n} className={styles.p}>
                名称
                {INDEXES[i]}：{n}
              </p>
            ))
          : names[0];
      },
    },
    {
      title: 'CAS号',
      dataIndex: 'casNo',
      key: 'casNo',
    },
    {
      title: '危险性类别',
      dataIndex: 'riskCateg',
      key: 'riskCateg',
    },
    {
      title: '技术说明书编码',
      dataIndex: 'bookCode',
      key: 'bookCode',
      align: 'center',
      render(txt, record) {
        return (
          <AuthLink
            to={`/safety-knowledge-base/msds/detail/${record.id}`}
            target="_blank"
            code={codes.safetyKnowledgeBase.msds.view}
          >
            {txt}
          </AuthLink>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render(id, record) {
        return (
          <Fragment>
            <AuthLink
              to={`/safety-knowledge-base/msds/edit/${id}`}
              target="_blank"
              code={codes.safetyKnowledgeBase.msds.edit}
            >
              编辑
            </AuthLink>
            <Popconfirm
              title="确定删除当前项目？"
              onConfirm={genHandleDelete(id)}
              okText="确定"
              cancelText="取消"
            >
              <AuthSpan className={styles.delete} code={codes.safetyKnowledgeBase.msds.delete}>
                删除
              </AuthSpan>
            </Popconfirm>
          </Fragment>
        );
      },
    },
  ];
}

@connect(({ msds, loading }) => ({ msds, loading: loading.models.msds }))
export default class MList extends PureComponent {
  state = {
    currentPage: 1,
    formVals: null,
  };

  componentDidMount() {
    this.fetchTableList(1);
  }

  handleSearch = values => {
    this.setState({ formVals: values });
    this.fetchTableList(1, values, (code, msg) => this.setPage(code, 1, msg));
  };

  handleReset = () => {
    this.setState({ formVals: {} });
    this.fetchTableList(1, null, (code, msg) => this.setPage(code, 1, msg));
  };

  fetchTableList = (pageNum, values, callback) => {
    const { dispatch } = this.props;
    let payload = { pageSize: PAGE_SIZE, pageNum };
    if (values) payload = { ...payload, ...deleteEmptyProps(values) };
    dispatch({
      type: 'msds/fetchTableList',
      payload,
      callback,
    });
  };

  getCurrentList = () => {
    const { currentPage, formVals } = this.state;
    this.fetchTableList(currentPage, formVals);
  };

  handleAdd = () => {
    router.push(`/safety-knowledge-base/msds/add`);
  };

  setPage = (code, current, msg) => {
    if (code === 200) this.setState({ currentPage: current });
    else if (msg) message.error(msg);
  };

  onTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    const { formVals } = this.state;
    this.fetchTableList(current, formVals, (code, msg) => this.setPage(code, current, msg));
  };

  genHandleDelete = id => e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'msds/deleteMSDS',
      payload: id,
      callback: genOperateCallback('', () => this.getCurrentList()),
    });
  };

  render() {
    const {
      loading,
      msds: { total, list },
    } = this.props;

    const { currentPage } = this.state;
    const indexBase = (currentPage - 1) * PAGE_SIZE;

    const toolBarAction = (
      <AuthButton
        type="primary"
        code={codes.safetyKnowledgeBase.msds.add}
        onClick={this.handleAdd}
        style={{ marginTop: '8px' }}
      >
        新增MSDS
      </AuthButton>
    );

    return (
      <PageHeaderLayout
        title="化学品安全说明书(MSDS)"
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles.total}>
            共计：
            {total}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={FIELDS}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 24, sm: 24, xs: 24 }}
          />
        </Card>
        <div className={styles.container}>
          <Table
            rowKey="id"
            loading={loading}
            columns={getColumns(this.genHandleDelete)}
            dataSource={handleTableData(list, indexBase)}
            onChange={this.onTableChange}
            pagination={{ pageSize: PAGE_SIZE, total, current: currentPage }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
