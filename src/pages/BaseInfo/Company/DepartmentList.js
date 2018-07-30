import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Col, Table } from 'antd'
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

    return (
      <Card></Card>
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
