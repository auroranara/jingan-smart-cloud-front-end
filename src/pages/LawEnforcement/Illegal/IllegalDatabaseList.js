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
const title = '违法行为库';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '执法检查',
    name: '执法检查',
  },
  {
    title,
    name: '违法行为库',
  },
];

// 默认表单值
const defaultFormData = {
  businessType: undefined,
  typeCode: undefined,
  actContent: undefined,
};

const PageSize = 10;

@connect(({ illegalDatabase, user, loading }) => ({
  illegalDatabase,
  user,
  loading: loading.models.illegalDatabase,
}))
@Form.create()
export default class IllegalDatabaseList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    currentPage: 1,
  };

  // 跳转到详情页面
  goIllegalDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/law-enforcement/illegal/detail/${id}`));
  };

  // 跳转到编辑页面
  goIllegalEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/law-enforcement/illegal/edit/${id}`));
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      illegalDatabase: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 获取记录列表
    dispatch({
      type: 'illegalDatabase/fetchIllegalList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
    // 获取初始化选项
    dispatch({
      type: 'illegalDatabase/fetchOptions',
    });
    // 获取所属类别
    dispatch({
      type: 'illegalDatabase/fetchType',
    });
  }

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      illegalDatabase: {
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
      type: 'illegalDatabase/fetchIllegalList',
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
      illegalDatabase: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'illegalDatabase/fetchIllegalList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 删除 */
  handleDelete = id => {
    const {
      dispatch,
      form: { getFieldsValue },
      illegalDatabase: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    const data = getFieldsValue();
    dispatch({
      type: 'illegalDatabase/deleteLaws',
      payload: id,
      callback: response => {
        if (response && response.code === 200) {
          dispatch({
            type: 'illegalDatabase/fetchIllegalList',
            payload: {
              pageSize,
              pageNum: 1,
              ...data,
            },
          });
          message.success('删除成功！');
        } else message.success(response.msg);
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

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      illegalDatabase: { businessTypes, typeCodes },
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
              {getFieldDecorator('typeCode', {})(
                <Select style={{ width: 200 }} placeholder="请选择类别">
                  {typeCodes.map(item => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('actContent', {
                initialValue: defaultFormData.actContent,
                getValueFromEvent: e => e.target.value.trim(),
              })(<Input placeholder="请输入违法行为内容" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.handleClickToQuery}>
                查询
              </Button>
            </FormItem>
            <FormItem>
              <Button onClick={this.handleClickToReset}>重置</Button>
            </FormItem>
            <FormItem style={{ float: 'right' }}>
              <AuthButton
                type="primary"
                code={codesMap.lawEnforcement.illegal.add}
                href="#/law-enforcement/illegal/add"
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
      illegalDatabase: {
        data: { list },
      },
    } = this.props;

    const { currentPage } = this.state;
    const indexBase = (currentPage - 1) * PageSize;

    /* 配置描述 */
    const COLUMNS = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 100,
      },
      {
        title: '业务分类',
        dataIndex: 'businessTypeName',
        key: 'businessType',
        align: 'center',
        width: 200,
      },
      {
        title: '所属类别',
        dataIndex: 'typeCodeName',
        key: 'typeCode',
        align: 'center',
        width: 200,
      },
      {
        title: '违法行为',
        dataIndex: 'actContent',
        key: 'actContent',
        align: 'center',
        width: 680,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 220,
        render: (text, rows) => (
          <span>
            <AuthA
              code={codesMap.lawEnforcement.illegal.detail}
              onClick={() => this.goIllegalDetail(rows.id)}
            >
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA
              code={codesMap.lawEnforcement.illegal.edit}
              onClick={() => this.goIllegalEdit(rows.id)}
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该违法行为吗？"
              onConfirm={() => this.handleDelete(rows.id)}
            >
              <AuthA code={codesMap.lawEnforcement.illegal.delete}>删除</AuthA>
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
            pagination={{ pageSize: PageSize }}
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
      illegalDatabase: {
        data: { list },
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            列表记录：
            {list.length}{' '}
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
