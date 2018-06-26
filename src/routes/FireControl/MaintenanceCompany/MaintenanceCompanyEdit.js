import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Button, Switch } from 'antd';
// import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

// const { Description } = DescriptionList;

const FormItem = Form.Item;

const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '消防维保',
  },
  {
    title: '维保公司',
    href: '/fire-control/maintenance-company/list',
  },
  {
    title: '修改维保单位',
  },
];

@connect(({ maintenanceCompany, loading }) => ({
  maintenanceCompany,
  loading: loading.effects['maintenanceCompany/editcompany'],
}))
@Form.create()
export default class MaintenanceCmpanyEdit extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    dispatch({
      type: 'maintenanceCompany/editcompany',
      payload: {
        id,
      },
    });
  }

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const {
      maintenanceCompany: { detail: data },
    } = this.props;

    return (
      <PageHeaderLayout title="修改维保单位" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="企业名称">
              {getFieldDecorator('companyId', {
                initialValue: data.companyId,
                rules: [
                  {
                    required: true,
                    message: '请选择企业',
                  },
                ],
              })(<Input placeholder="请选择企业" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="企业状态">
              {getFieldDecorator('usingStatus', {
                initialValue: data.usingStatus === 1 ? '启用' : '禁用',
                rules: [
                  {
                    required: true,
                    message: '企业状态',
                  },
                ],
              })(<Switch checkedChildren="启用" unCheckedChildren="禁用" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="是否为分公司">
              {getFieldDecorator('isBranch', {
                initialValue: data.isBranch === 1 ? '是' : '否',
                rules: [
                  {
                    required: true,
                    message: '是否为分公司',
                  },
                ],
              })(
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  onChange={this.switchOnchange}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="所属总公司">
              {getFieldDecorator('parentId	', {
                initialValue: data.parentId,
                rules: [
                  {
                    required: true,
                    message: '所属总公司',
                  },
                ],
              })(<Input placeholder="所属总公司" />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
