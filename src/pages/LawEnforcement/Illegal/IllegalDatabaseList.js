import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Input,
  Table,
  Select,
  Divider,
  Col,
  Popconfirm,
  // message,
} from 'antd';
// import { routerRedux } from 'dva/router';

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
  maintenanceName: undefined,
  serviceUnitName: undefined,
};

const PageSize = 10;

@connect(({ lawDatabase, user, loading }) => ({
  lawDatabase,
  user,
  loading: loading.models.lawDatabase,
}))
@Form.create()
export default class IllegalDatabaseList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {};

  // 挂载后
  componentDidMount() {
    // const {
    //   dispatch,
    //   lawDatabase: {
    //     data: {
    //       pagination: { pageSize },
    //     },
    //   },
    // } = this.props;
    // // 获取记录列表
    // dispatch({
    //   type: 'lawDatabase/fetch',
    //   payload: {
    //     pageSize,
    //     pageNum: 1,
    //   },
    // });
  }

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    // const {
    //   dispatch,
    //   form: { getFieldsValue },
    //   lawDatabase: {
    //     data: {
    //       pagination: { pageSize },
    //     },
    //   },
    // } = this.props;
    // const data = getFieldsValue();
    // // 修改表单数据
    // this.formData = data;
    // // 重新请求数据
    // dispatch({
    //   type:'lawDatabase/fetch',
    //   payload:{
    //     pageSize,
    //     pageNum: 1,
    //     ...data,
    //   },
    // })
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    // const {
    //   dispatch,
    //   form: { resetFields },
    //   lawDatabase: {
    //     data: {
    //       pagination: { pageSize },
    //     },
    //   },
    // } = this.props;
    // // 清除筛选条件
    // resetFields();
    // this.formData = defaultFormData;
    // dispatch({
    //   type: 'lawDatabase/fetch',
    //   payload: {
    //     pageSize,
    //     pageNum: 1,
    //   },
    // });
  };

  /* 删除 */
  handleDelete = record => {
    // const { dispatch } = this.props;
    //   dispatch({
    //     type: 'lawDatabase/',
    //     payload: record.id,
    //     callback: response => {
    //       if (response && response.code === 200) {
    //         this.getDepartments();
    //         message.success('删除成功！');
    //       } else message.success(response.msg);
    //     },
    //   });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <Col span={18}>
            <FormItem>
              {getFieldDecorator('businessClassify', {})(
                <Select style={{ width: 200 }} placeholder="请选择业务分类">
                  <Option value="安全生产">安全生产</Option>
                  <Option value="消防">消防</Option>
                  <Option value="环保">环保</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('lawsRegulations', {})(
                <Select style={{ width: 200 }} placeholder="请选择类别" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator(' lawsRegulationsInput', {
                initialValue: defaultFormData.lawsRegulationsInput,
                getValueFromEvent: e => e.target.value.trim(),
              })(<Input placeholder="请输入违法行为" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.handleClickToQuery}>
                查询
              </Button>
            </FormItem>
            <FormItem>
              <Button onClick={this.handleClickToReset}>重置</Button>
            </FormItem>
          </Col>
          <Col span={6}>
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
    const { tableLoading } = this.props;

    const list = [
      {
        number: '001',
        businessClassify: '消防',
        lawsRegulations: '中华人民共和国安全生产法',
        subClause: '第八十九条',
        lawsRegulationsInput: '承担安全评价、认证、检测、检验工作的机构，出具虚假证明的……',
      },
      {
        number: '002',
        businessClassify: '消防',
        lawsRegulations: '中华人民共和国安全生产法',
        subClause: '第八十九条',
        lawsRegulationsInput: '承担安全评价、认证、检测、检验工作的机构，出具虚假证明的……',
      },
    ];

    /* 配置描述 */
    const COLUMNS = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        width: 70,
      },
      {
        title: '业务分类',
        dataIndex: 'businessClassify',
        key: 'businessClassify',
        align: 'center',
        width: 100,
      },
      {
        title: '所属类别',
        dataIndex: 'lawsRegulations',
        key: 'lawsRegulations',
        align: 'center',
        width: 260,
      },
      {
        title: '违法行为',
        dataIndex: 'lawsRegulationsInput',
        key: 'lawsRegulationsInput',
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
        render: (text, record) => (
          <span>
            <AuthA
              code={codesMap.lawEnforcement.illegal.detail}
              href="#/law-enforcement/illegal/detail"
            >
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA
              code={codesMap.lawEnforcement.illegal.edit}
              href="#/law-enforcement/illegal/edit"
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该违法行为库吗？"
              onConfirm={() => this.handleDelete(record)}
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
            dataSource={list}
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
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
