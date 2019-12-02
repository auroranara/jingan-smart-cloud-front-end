import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Table, Select, Divider, Col, Popconfirm, message } from 'antd';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codesMap from '@/utils/codes';
import { AuthA, AuthButton } from '@/utils/customAuth';

const FormItem = Form.Item;
const Option = Select.Option;

// 标题
const title = '法律法规库';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '安全生产制度法规',
    name: '安全生产制度法规',
  },
  {
    title,
    name: '法律法规库',
  },
];

// 默认表单值
const defaultFormData = {
  businessType: undefined,
  lawType: undefined,
  content: undefined,
};

const PAGE_SIZE = 10;

@connect(({ lawDatabase, user, loading }) => ({
  lawDatabase,
  user,
  loading: loading.models.lawDatabase,
}))
@Form.create()
export default class lawDatabaseList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    currentPage: 1,
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      lawDatabase: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 获取记录列表
    dispatch({
      type: 'lawDatabase/fetch',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
    // 获取初始化选项
    dispatch({
      type: 'lawDatabase/fetchOptions',
    });
  }

  // 跳转到详情页面
  goLawsDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/safety-production-regulation/laws/detail/${id}`));
  };

  // 跳转到编辑页面
  goLawsEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/safety-production-regulation/laws/edit/${id}`));
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      lawDatabase: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    dispatch({
      type: 'lawDatabase/fetch',
      payload: {
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
      lawDatabase: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'lawDatabase/fetch',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  /* 删除 */
  handleDelete = id => {
    const {
      dispatch,
      lawDatabase: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    dispatch({
      type: 'lawDatabase/deleteLaws',
      payload: { id },
      callback: response => {
        if (response && response.code === 200) {
          dispatch({
            type: 'lawDatabase/fetch',
            payload: {
              pageSize,
              pageNum: 1,
            },
          });
          message.success('删除成功！');
        } else message.warning('该法律法规有违法行为关联关系，不予删除！');
      },
    });
  };

  // 处理翻页
  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    dispatch({
      type: 'lawDatabase/fetch',
      payload: {
        pageSize,
        pageNum,
        ...data,
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      lawDatabase: { businessTypes, lawTypes },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <Col>
            <FormItem>
              {getFieldDecorator('businessType', {})(
                <Select style={{ width: 200 }} placeholder="请选择业务分类">
                  {businessTypes.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('lawType', {})(
                <Select style={{ width: 320 }} placeholder="请选择法律法规">
                  {lawTypes.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('content', {
                initialValue: defaultFormData.content,
                getValueFromEvent: e => e.target.value.trim(),
              })(<Input placeholder="请输入法律法规内容" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.handleClickToQuery}>
                查询
              </Button>
            </FormItem>
            <FormItem>
              <Button onClick={this.handleClickToReset}>重置</Button>
            </FormItem>
            <FormItem>
              <AuthButton
                type="primary"
                code={codesMap.lawEnforcement.laws.add}
                href="#/safety-production-regulation/laws/add"
              >
                新增
              </AuthButton>
            </FormItem>
          </Col>
        </Form>
      </Card>
    );
  }

  /* 渲染table */
  renderTable() {
    const {
      tableLoading,
      lawDatabase: {
        data: {
          list,
          pagination: { total, pageSize, pageNum },
        },
      },
    } = this.props;

    const { currentPage } = this.state;
    const indexBase = (currentPage - 1) * PAGE_SIZE;

    /* 配置描述 */
    const COLUMNS = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 70,
      },
      {
        title: '业务分类',
        dataIndex: 'businessTypeName',
        key: 'businessType',
        align: 'center',
        width: 100,
      },
      {
        title: '所属法律法规',
        dataIndex: 'lawTypeName',
        key: 'lawType',
        align: 'center',
        width: 260,
      },
      {
        title: '所属条款',
        dataIndex: 'article',
        key: 'article',
        align: 'center',
        width: 150,
      },
      {
        title: '法律法规内容',
        dataIndex: 'content',
        key: 'content',
        align: 'center',
        width: 650,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 180,
        render: (record, rows) => (
          <span>
            <AuthA
              code={codesMap.lawEnforcement.laws.detail}
              onClick={() => this.goLawsDetail(rows.id)}
            >
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA
              code={codesMap.lawEnforcement.laws.edit}
              onClick={() => this.goLawsEdit(rows.id)}
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该法律法规吗？"
              onConfirm={() => this.handleDelete(rows.id)}
            >
              <AuthA code={codesMap.lawEnforcement.laws.delete}>删除</AuthA>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Card style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            loading={tableLoading}
            rowKey="id"
            columns={COLUMNS}
            dataSource={this.handleTableData(list, indexBase)}
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
            scroll={{ x: 1400 }}
            bordered
          />
        ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
      </Card>
    );
  }

  render() {
    const {
      lawDatabase: {
        data: {
          pagination: { total },
        },
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            列表记录：
            {total}{' '}
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
