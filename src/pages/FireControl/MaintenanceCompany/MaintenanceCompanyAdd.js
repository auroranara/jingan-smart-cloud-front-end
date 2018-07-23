import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Switch, message } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { phoneReg } from 'utils/validate';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import styles from './MaintenanceCompany.less';

const FormItem = Form.Item;

// 面包屑
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
    title: '新增维保单位',
    name: '新增维保单位',
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

  switchOnchange = checked => {
    this.setState({
      current: {
        isBranch: checked,
      },
    });
  };

  // 提交表单验证信息
  handleSubmit = () => {
    const { dispatch, form, goBack } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { isBranch, principalName, principalPhone } = values;
      const { companyId, parentId } = this.state;

      dispatch({
        type: 'maintenanceCompany/addMaintenanceCompanyAsync',
        payload: {
          companyId,
          parentId,
          principalName,
          principalPhone,
          isBranch: +isBranch,
        },
        callback(code) {
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

  // 渲染维保单位表单信息
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
        <Card title="单位详情" className={styles.card} bordered={false}>
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="维保单位">
              {getFieldDecorator('companyId', {
                rules: [
                  {
                    required: true,
                    message: '请选择维保单位',
                  },
                ],
              })(
                <Input
                  placeholder="请选择维保单位"
                  ref={input => {
                    this.CompanyIdInput = input;
                  }}
                  onClick={this.handleShowCompanyModal}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="主要负责人">
              {getFieldDecorator('principalName', {
                rules: [
                  {
                    required: true,
                    message: '请输入主要负责人',
                  },
                ],
              })(<Input placeholder="请输入主要负责人" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="联系电话">
              {getFieldDecorator('principalPhone', {
                rules: [
                  { required: true, message: '请输入主要负责人联系方式' },
                  { pattern: phoneReg, message: '主要负责人联系方式格式不正确' },
                ],
              })(<Input placeholder="请输入联系电话" />)}
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
                  rules: [
                    {
                      required: true,
                      message: '请选择一家维保公司为总公司',
                    },
                  ],
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
              <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
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
