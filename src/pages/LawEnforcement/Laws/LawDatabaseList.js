import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Table, Select, Divider } from 'antd';
// import { routerRedux } from 'dva/router';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import codesMap from '@/utils/codes';
// import { AuthA } from '@/utils/customAuth';

const FormItem = Form.Item;

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
    title: '执法检查',
    name: '执法检查',
  },
  {
    title,
    name: '法律法规库',
  },
];

// 默认表单值
const defaultFormData = {
  maintenanceName: undefined,
  serviceUnitName: undefined,
};

const PageSize = 10;

@connect(({ maintenanceRecord, user, loading }) => ({
  maintenanceRecord,
  user,
  loading: loading.models.maintenanceRecord,
}))
@Form.create()
export default class LawDatabaseList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {};

  // 挂载后
  componentDidMount() {}

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {};

  /* 重置按钮点击事件 */
  handleClickToReset = () => {};

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('businessClassify', {
              initialValue: defaultFormData.businessClassify,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Select placeholder="请选择业务分类" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('lawsRegulations', {
              initialValue: defaultFormData.lawsRegulations,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Select placeholder="请选择法律法规" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator(' lawsRegulationsInput', {
              initialValue: defaultFormData.lawsRegulationsInput,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入法律法规" />)}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
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
    ];

    /* 配置描述 */
    const COLUMNS = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'number',
      },
      {
        title: '业务分类',
        dataIndex: 'businessClassify',
        key: 'businessClassify',
        align: 'center',
      },
      {
        title: '所属法律法规',
        dataIndex: 'lawsRegulations',
        key: 'lawsRegulations',
        align: 'center',
      },
      {
        title: '所属条款',
        dataIndex: 'subClause',
        key: 'subClause',
        align: 'center',
      },
      {
        title: '法律法规内容',
        dataIndex: 'lawsRegulationsInput',
        key: 'lawsRegulationsInput',
        align: 'center',
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
            <a href="">查看</a>
            <Divider type="vertical" />
            <a href="">编辑</a>
            <Divider type="vertical" />
            <a href="">删除</a>
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
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        // content={
        //   <div>
        //     列表记录：
        //     {list.length}{' '}
        //   </div>
        // }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
