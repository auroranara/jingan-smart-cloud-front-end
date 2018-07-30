import React, { PureComponent, Fragment } from 'react';
import { Form, Card, Input, Button, Table } from 'antd'
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

const FormItem = Form.Item

const title = "部门管理"
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '一起一档',
    name: '一起一档',
  },
  {
    title: '企业单位',
    name: '企业单位',
    href: '/base-info/company/list',
  },
  {
    title,
    name: title,
  },
]

@connect(
  ({ department, loading }) => ({
    department,
    loading: loading.models.department,
  })
)

@Form.create()
export default class DepartmentList extends PureComponent {

  resetQuery = () => {
    const { form: { resetFields } } = this.props
    resetFields()
  }

  renderQuery() {
    const { form: { getFieldDecorator } } = this.props

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('name', {
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input style={{ width: '250px' }} placeholder="请输入部门名称"></Input>)}
          </FormItem>
          <FormItem>
            <Button type="primary">查询</Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.resetQuery()}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <Button type="primary">新增</Button>
          </FormItem>
        </Form>
      </Card>
    )
  }

  renderTable() {

    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '账号数量',
        dataIndex: 'number',
        key: 'number',
        width: '12%',
      },
      {
        title: '操作',
        key: '操作',
        width: '30%',
        render: (val, rows) => (
          <Fragment>
            <a >添加</a>
            <a >编辑</a>
            <a >删除</a>
          </Fragment>
        ),
      },
    ]

    const data = [
      {
        id: '001',
        name: 'test01',
        number: 123,
        children: [
          {
            id: 'oo2',
            name: 'test02',
            number: 45,
          },
        ],
      },
      {
        id: '003',
        name: 'test03',
        number: 445,
      },
    ]

    return (
      <Card style={{ marginTop: '20px' }}>
        <Table rowKey='id' columns={columns} dataSource={data}></Table>
      </Card>
    )
  }

  render() {
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderQuery()}
        {this.renderTable()}
      </PageHeaderLayout>
    )
  }
}
