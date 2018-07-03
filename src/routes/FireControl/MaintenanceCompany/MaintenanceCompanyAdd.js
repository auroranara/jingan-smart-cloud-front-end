import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Switch, message } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

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
    title: '新增维保单位',
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
    loading: loading.effects['maintenanceCompany/addMaintenanceCompanyAsync'],
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
    fetchCompanyList(action) {
      dispatch({
        type: 'maintenanceCompany/fetchCompanyList',
        ...action,
      });
    },
    // 返回列表頁面
    goBack() {
      dispatch(routerRedux.push('/fire-control/maintenance-company/list'));
    },
    dispatch,
  })
)
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    current: {
      isBranch: false,
    },
    companyModal: {
      visible: false,
      loading: false,
    },
    maintenanceModal: {
      visible: false,
      loading: false,
    },
    companyId: undefined,
    parentId: undefined,
  };

  componentDidMount() {}

  switchOnchange = checked => {
    this.setState({
      current: {
        isBranch: checked,
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, goBack } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        // console.log(err);
        return;
      }

      const { usingStatus, isBranch } = values;
      // console.log(values, usingStatus, usingStatus ? 1 : 0);
      const { companyId, parentId } = this.state;

      dispatch({
        type: 'maintenanceCompany/addMaintenanceCompanyAsync',
        payload: {
          companyId,
          parentId,
          usingStatus: +usingStatus,
          isBranch: +isBranch,
        },
        callback(code) {
          // console.log(code);
          if (code === 200)
            message.success('保存成功', () => {
              goBack();
            });
          else message.error('保存失败');
        },
      });
    });
  };

  /* 显示选择企业模态框 */
  handleShowCompanyModal = () => {
    const { fetchCompanyList } = this.props;
    const { companyModal } = this.state;
    // 显示模态框
    this.setState({
      companyModal: {
        type: 'maintenanceCompany/fetchCompanyList',
        ...companyModal,
        visible: true,
      },
    });
    // 初始化表格数据
    fetchCompanyList({
      payload: {
        ...defaultPagination,
      },
    });
  };

  /* 显示选择维保模态框 */
  handleShowMaintenanceModal = () => {
    const { fetchModalList } = this.props;
    const { maintenanceModal, companyId } = this.state;
    this.setState({
      maintenanceModal: {
        type: 'company/fetchModalList',
        ...maintenanceModal,
        visible: true,
      },
    });
    fetchModalList({
      payload: {
        companyId,
        ...defaultPagination,
      },
    });
  };

  /* 隐藏企业模态框 */
  handleHideCompanyModal = () => {
    const { companyModal } = this.state;
    this.setState({
      companyModal: {
        ...companyModal,
        visible: false,
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

  /* 企业选择按钮点击事件 */
  handleSelectCompany = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ companyId: value.name });
    this.setState({
      companyId: value.id,
    });
    this.handleHideCompanyModal();
  };

  /* 维保选择按钮点击事件 */
  handleSelectMaintenance = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ parentId: value.name });
    this.setState({
      parentId: value.id,
    });
    this.handleHideMaintenanceModal();
  };

  /* 渲染选择企业模态框 */
  renderCompanyModal() {
    const {
      companyModal: { loading, visible },
    } = this.state;
    const {
      maintenanceCompany: { modal },
      fetchCompanyList,
    } = this.props;
    const modalProps = {
      // 模态框是否显示
      visible,
      // 模态框点击关闭按钮回调
      onClose: this.handleHideCompanyModal,
      // 完全关闭后回调
      afterClose: () => {
        this.CompanyIdInput.blur();
      },
      modal,
      fetch: fetchCompanyList,
      // 选择回调
      onSelect: this.handleSelectCompany,
      // 表格是否正在加载
      loading,
    };

    return <CompanyModal {...modalProps} />;
  }

  /* 渲染选择维保单位模态框 */
  renderMaintenanceModal() {
    const {
      maintenanceModal: { loading, visible },
      companyId,
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
      payload: {
        companyId,
      },
      fetch: fetchModalList,
      // 选择回调
      onSelect: this.handleSelectMaintenance,
      // 表格是否正在加载
      loading,
    };

    return <CompanyModal {...modalProps} />;
  }

  render() {
    const {
      submitting,
      form: { getFieldDecorator },
    } = this.props;
    const { current } = this.state;

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
      <PageHeaderLayout title="新增维保单位" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="企业名称">
              {getFieldDecorator('companyId', {
                rules: [
                  {
                    required: true,
                    message: '请选择企业',
                  },
                ],
              })(
                <Input
                  placeholder="请选择企业"
                  ref={input => {
                    this.CompanyIdInput = input;
                  }}
                  onClick={this.handleShowCompanyModal}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="是否启用">
              {getFieldDecorator('usingStatus', {
                initialValue: '1',
              })(<Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />)}
            </FormItem>

            <FormItem {...formItemLayout} label="是否为分公司">
              {getFieldDecorator('isBranch', {
                initialValue: current.isBranch,
              })(
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  onChange={this.switchOnchange}
                />
              )}
            </FormItem>

            {current.isBranch && (
              <FormItem {...formItemLayout} label="总公司名称">
                {getFieldDecorator('parentId', {
                  rules: [{ message: '请选择一家维保公司为总公司' }],
                  initialValue: current.parentId,
                })(
                  <Input
                    placeholder="请选择总公司"
                    ref={input => {
                      this.parentIdInput = input;
                    }}
                    onClick={this.handleShowMaintenanceModal}
                  />
                )}
              </FormItem>
            )}

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>
        {this.renderCompanyModal()}
        {this.renderMaintenanceModal()}
      </PageHeaderLayout>
    );
  }
}