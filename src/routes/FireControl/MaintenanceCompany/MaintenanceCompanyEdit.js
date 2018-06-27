import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Button, Switch, message } from 'antd';
// import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import CompanyModal from '../../BaseInfo/Company/CompanyModal';

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

/* 默认分页参数 */
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};

@connect(
  ({ maintenanceCompany, company, loading }) => ({
    maintenanceCompany,
    company,
    loading: loading.effects['maintenanceCompany/fetchDetail'],
  }),
  dispatch => ({
    // 获取维保单位
    fetchModalList(action) {
      dispatch({
        type: 'company/fetchModalList',
        ...action,
      });
    },
    // 获取企业
    fetch(action) {
      dispatch({
        type: 'company/fetch',
        ...action,
      });
    },
    dispatch,
  })
)
@Form.create()
export default class MaintenanceCmpanyEdit extends PureComponent {
  state = {
    hasSubcompany: false,
    maintenanceModal: {
      visible: false,
      loading: false,
    },
    parentId: undefined,
  };

  componentDidMount() {
    const that = this;

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
      callback({ isBranch, parentId }) {
        // console.log(isBranch);
        that.setState({
          hasSubcompany: isBranch,
          parentId,
        });
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

      const { usingStatus, isBranch } = values;
      const { parentId } = this.state;
      // console.log(values, usingStatus, usingStatus ? 1 : 0);

      dispatch({
        type: 'maintenanceCompany/updateMaintenanceCompanyAsync',
        payload: {
          id,
          parentId,
          usingStatus: +usingStatus,
          isBranch: +isBranch,
        },
        callback(code) {
          // console.log(code);
          if (code === 200) message.info('修改成功');
          else message.error('修改失败');
        },
      });
    });
  }

  /* 显示选择维保模态框 */
  handleShowMaintenanceModal = () => {
    const { fetchModalList } = this.props;
    const { maintenanceModal } = this.state;
    this.setState({
      maintenanceModal: {
        type: 'company/fetchModalList',
        ...maintenanceModal,
        visible: true,
      },
    });
    fetchModalList({
      payload: {
        ...defaultPagination,
      },
    });
  };

  /* 隐藏维保模态框 */
  handleHideMaintenanceModal = () => {
    const { maintenanceModal } = this.state;
    this.setState({
      maintenanceModal: {
        ...maintenanceModal,
        visible: false,
      },
    });
  };

  /* 选择按钮点击事件 */
  handleSelectMaintenance = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ parentId: value.name });
    this.setState({
      parentId: value.id,
    });
    this.handleHideModal();
  };

  /* 渲染选择维保单位模态框 */
  renderMaintenanceModal() {
    const {
      maintenanceModal: { loading, visible },
    } = this.state;
    const {
      company: { modal },
      fetchModalList,
    } = this.props;
    const modalProps = {
      // 模态框是否显示
      visible,
      // 模态框点击关闭按钮回调
      onClose: this.handleHideMaintenanceModal,
      // 完全关闭后回调
      afterClose: () => {
        this.parentIdInput.blur();
      },
      modal,
      fetch: fetchModalList,
      // 选择回调
      onSelect: this.handleSelectMaintenance,
      // 表格是否正在加载
      loading,
    };

    return <CompanyModal {...modalProps} />;
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
      <PageHeaderLayout title="新增维保单位" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="企业名称">
              <div>{data.companyName}</div>
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
                })(
                  <Input
                    placeholder="所属总公司"
                    ref={input => {
                      this.parentIdInput = input;
                    }}
                    onClick={this.handleShowMaintenanceModal}
                  />
                )}
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
        {this.renderMaintenanceModal()}
      </PageHeaderLayout>
    );
  }
}
