import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Form, Input, Card, Switch, Button } from 'antd';
// import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

// const { Description } = DescriptionList;

const FormItem = Form.Item;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '消防维保',
    name: '消防维保',
  },
  {
    title: '维保公司',
    name: '维保公司',
    href: '/fire-control/maintenance-company/list',
  },
  {
    title: '维保单位详情',
    name: '维保单位详情',
  },
];

@connect(({ maintenanceCompany, loading }) => ({
  maintenanceCompany,
  loading: loading.models.maintenanceCompany,
}))
@Form.create()
export default class MaintenanceCmpanyDetail extends PureComponent {
  state = {
    hasSubCompany: false,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // console.log(id);
    dispatch({
      type: 'maintenanceCompany/fetchDetail',
      payload: {
        id,
      },
      callback: ({ isBranch }) => {
        this.setState({ hasSubCompany: !!isBranch });
      },
    });
  }

  render() {
    const {
      form,
      match: {
        params: { id },
      },
      maintenanceCompany: { detail: data },
    } = this.props;
    const { hasSubCompany } = this.state;

    const { getFieldDecorator } = form;

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

    return (
      <PageHeaderLayout title="维保公司详情" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="企业名称">
              {getFieldDecorator('companyName', {
                initialValue: data.companyName,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input disabled style={{ border: 0 }} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="启用状态">
              {getFieldDecorator('usingStatus', {
                valuePropName: 'checked',
                initialValue: !!data.usingStatus,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Switch disabled checkedChildren="启用" unCheckedChildren="禁用" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="是否为分公司">
              {getFieldDecorator('isBranch', {
                valuePropName: 'checked',
                initialValue: !!data.isBranch,
                rules: [
                  {
                    required: true,
                    message: '是否为分公司',
                  },
                ],
              })(<Switch disabled checkedChildren="是" unCheckedChildren="否" />)}
            </FormItem>

            {hasSubCompany && (
              <FormItem {...formItemLayout} label="所属总公司">
                {getFieldDecorator('parentId	', {
                  initialValue: data.parnetUnitName,
                  rules: [
                    {
                      required: true,
                      message: '所属总公司',
                    },
                  ],
                })(<Input disabled style={{ border: 0 }} />)}
              </FormItem>
            )}

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary">
                <Link to={`/fire-control/maintenance-company/edit/${id}`}>编辑</Link>
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
