import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Button, Switch, message } from 'antd';
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
  loading: loading.effects['maintenanceCompany/fetchDetail'],
}))
@Form.create()
export default class MaintenanceCmpanyEdit extends PureComponent {
  state = {
    hasSubcompany: false,
  };

  componentDidMount() {
    const that = this;

    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    dispatch({
      type: 'maintenanceCompany/fetchDetail',
      payload: {
        id,
      },
      callback(isBranch) {
        // console.log(isBranch);
        that.setState({ hasSubcompany: isBranch });
      },
    });
  }

  switchOnchange = checked => {
    this.setState({ hasSubcompany: checked });
  };

  handleUpdate(id) {
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        // console.log(err);
        return;
      }

      const { companyId, usingStatus, isBranch, parentId } = values;
      // console.log(values, usingStatus, usingStatus ? 1 : 0);

      dispatch({
        type: 'maintenanceCompany/updateMaintenanceCompanyAsync',
        payload: {
          id,
          companyId,
          parentId,
          usingStatus: usingStatus ? 1 : 0,
          isBranch: isBranch ? 1 : 0,
        },
        callback(code) {
          // console.log(code);
          if (code === 200) message.info('修改成功');
          else message.error('修改失败');
        },
      });
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
    const { hasSubcompany } = this.state;

    // console.log('data', data);

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
                valuePropName: 'checked',
                initialValue: !!data.usingStatus,
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
                valuePropName: 'checked',
                initialValue: !!data.isBranch,
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

            {hasSubcompany && (
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
            )}

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                onClick={() => this.handleUpdate(data.id)}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
