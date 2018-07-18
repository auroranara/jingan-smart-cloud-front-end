import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Row, Col, Input, Select, message, Icon, Popover, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import debounce from 'lodash/debounce';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from './../../layouts/PageHeaderLayout.js';
import { phoneReg,loginNameReg } from 'utils/validate';

import styles from './AccountManagementEdit.less';

// 标题
const title = '编辑账号';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
  },
  {
    title: '权限管理',
  },
  {
    title: '账号管理',
    href: '/role-authorization/account-management/list',
  },
  {
    title,
  },
];

/* 表单标签 */
const fieldLabels = {
  loginName: '用户名',
  password: '密码',
  userName: '姓名',
  phoneNumber: '手机号',
  unitType: '单位类型',
  unitId: '所属单位',
  accountStatus: '账号状态',
};

@connect(
  ({ account, loading }) => ({
    account,
    loading: loading.models.account,
  }),
  dispatch => ({
    // 修改账号
    updateAccountDetail(action) {
      dispatch({
        type: 'account/updateAccountDetail',
        ...action,
      });
    },

    // 获取账号详情
    fetchAccountDetail(action) {
      dispatch({
        type: 'account/fetchAccountDetail',
        ...action,
      });
    },

    // 获取单位类型与账号状态
    fetchOptions(action) {
      dispatch({
        type: 'account/fetchOptions',
        ...action,
      });
    },

    // 获取所属单位（根据所选单位类型选择所属单位）
    fetchUnitList(action) {
      dispatch({
        type: 'account/fetchUnitList',
        ...action,
      });
    },

    // 新增账号-根据单位类型和名称模糊搜索
    fetchUnitsFuzzy(action) {
      dispatch({
        type: 'account/fetchUnitListFuzzy',
        ...action,
      });
    },

    // 返回列表页面
    goBack() {
      dispatch(routerRedux.push('/role-authorization/account-management/list'));
    },
  })
)
@Form.create()
export default class accountManagementEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
  }

  state = {
    submitting: false,
  };

  /* 生命周期函数 */
  componentWillMount() {
    const {
      fetchAccountDetail,
      match: {
        params: { id },
      },
      fetchOptions,
      goToException,
    } = this.props;

    // 获取详情
    fetchAccountDetail({
      payload: {
        id,
      },
      error: () => {
        goToException();
      },
    });

    // 获取单位类型
    fetchOptions({
      payload: {
        type: 'unitType',
        key: 'unitTypes',
      },
    });

    // 获取账号状态
    fetchOptions({
      payload: {
        type: 'accountStatus',
        key: 'accountStatuses',
      },
    });
  }

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      updateAccountDetail,
      goBack,
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
    } = this.props;
    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });
        updateAccountDetail({
          payload: {
            id,
            ...values,
          },
          success: () => {
            message.success('修改成功！', () => {
              goBack();
            });
          },
          error: err => {
            message.error(err, () => {
              this.setState({
                submitting: false,
              });
            });
          },
        });
      }
    });
  };

  handleUnitTypeSelect = value => {
    const {
      fetchUnitsFuzzy,
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    setFieldsValue({ unitId: '' });
    fetchUnitsFuzzy({
      payload: {
        unitType: value || null,
        unitName: getFieldValue('unitId') || null,
      },
    });
  };

  handleUnitIdChange = value => {
    const {
      fetchUnitsFuzzy,
      form: { getFieldValue },
    } = this.props;
    fetchUnitsFuzzy({
      payload: {
        unitType: getFieldValue('unitType') || null,
        unitName: value || null,
      },
    });
  };

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      account: {
        detail: {
          data: { loginName, userName, phoneNumber, unitType, unitName, accountStatus },
        },
        unitTypes,
        accountStatuses,
        unitIdes,
      },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const { Option } = Select;

    return (
      <Card title="账号基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.loginName}>
                {getFieldDecorator('loginName', {
                  initialValue: loginName,
                })}
                <span> {loginName} </span>
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.accountStatus}>
                {getFieldDecorator('accountStatus', {
                  initialValue: accountStatus,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'integer',
                      message: '请选择账号状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择账号状态">
                    {accountStatuses.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.userName}>
                {getFieldDecorator('userName', {
                  initialValue: userName,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入姓名',
                    },
                  ],
                })(<Input placeholder="请输入姓名" min={1} max={10} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.phoneNumber}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: phoneNumber,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入手机号',
                    },
                    { pattern: phoneReg, message: '手机号格式格式不正确' },
                  ],
                })(<Input placeholder="请输入手机号" min={11} max={11} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitType}>
                {getFieldDecorator('unitType', {
                  initialValue: unitType,
                  rules: [
                    {
                      required: true,
                      message: '请选择单位类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择单位类型" onChange={this.handleUnitTypeSelect}>
                    {unitTypes.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitId}>
                {getFieldDecorator('unitId', {
                  initialValue: unitName,
                  rules: [
                    {
                      required: true,
                      message: '请选择所选单位',
                    },
                  ],
                })(
                  <Select
                    mode="combobox"
                    optionLabelProp="children"
                    placeholder="请选择所属单位"
                    notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                    onSearch={this.handleUnitIdChange}
                    filterOption={false}
                  >
                    {unitIdes.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染错误信息 */
  renderErrorInfo() {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { loading } = this.props;
    const { submitting } = this.state;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button type="primary" onClick={this.handleClickValidate} loading={loading || submitting}>
          提交
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    const { loading } = this.props;
    const { submitting } = this.state;
    const content = (
      <div>
        <p>编辑单个账号的基本信息，角色权限、数据权限</p>
      </div>
    );

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
        content={content}
      >
        <Spin spinning={loading || submitting}>
          {this.renderBasicInfo()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
