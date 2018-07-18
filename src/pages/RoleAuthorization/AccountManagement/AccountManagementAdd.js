import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Row, Col, Input, Select, Button, message, Icon, Popover, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import FooterToolbar from 'components/FooterToolbar';
import debounce from 'lodash/debounce';
import PageHeaderLayout from './../../layouts/PageHeaderLayout.js';

import styles from './AccountManagementAdd.less';

// 标题
const title = '新增账号';
// 返回地址
const href = '/role-authorization/account-management/list';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '权限管理',
  },
  {
    title: '账号管理',
    href,
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
  dataPermissions: '数据权限',
};
// 默认的所属单位长度
const defaultPageSize = 20;

@connect(
  ({ account, loading }) => ({
    account,
    loading: loading.models.account,
  }),
  dispatch => ({
    fetchOptions(action) {
      dispatch({
        type: 'account/fetchOptions',
        ...action,
      });
    },
    fetchUnitsFuzzy(action) {
      dispatch({
        type: 'account/fetchUnitListFuzzy',
        ...action,
      });
    },
    addAccount(action) {
      dispatch({
        type: 'account/addAccount',
        ...action,
      });
    },
    goBack() {
      dispatch(routerRedux.push(href));
    },
    checkAccountOrPhone(action) {
      dispatch({
        type: 'account/checkAccountOrPhone',
        ...action,
      })
    },
  })
)
@Form.create()
export default class accountManagementAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
  }

  state = {
    submitting: false,
  };

  /* 生命周期函数 */
  UNSAFE_componentWillMount() {
    const { fetchOptions, fetchUnitsFuzzy } = this.props;

    // 获取单位类型和账户状态
    fetchOptions({
      success: ({ unitType }) => {
        // 获取单位类型成功以后根据第一个单位类型获取对应的所属单位列表
        fetchUnitsFuzzy({
          payload: {
            unitType: unitType[0].id,
            pageNum: 1,
            pageSize: defaultPageSize,
          },
        });
      },
    });
  }

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      addAccount,
      goBack,
      form: { validateFieldsAndScroll },
    } = this.props;
    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll(
      (error, { loginName, password, accountStatus, userName, phoneNumber, unitType, unitId }) => {
        if (!error) {
          this.setState({
            submitting: true,
          });
          addAccount({
            payload: {
              loginName: loginName.trim(),
              password: password.trim(),
              accountStatus,
              userName: userName.trim(),
              phoneNumber: phoneNumber.trim(),
              unitType,
              unitId: unitId.key,
            },
            success: () => {
              message.success('新建成功！', () => {
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
      }
    );
  };

  // 单位类型下拉框选择
  handleUnitTypeSelect = value => {
    const {
      fetchUnitsFuzzy,
      form: { setFieldsValue },
    } = this.props;
    // 清除所属单位
    setFieldsValue({ unitId: undefined });
    // 根据当前选中的单位类型获取对应的所属单位列表
    fetchUnitsFuzzy({
      payload: {
        unitType: value,
        pageNum: 1,
        pageSize: defaultPageSize,
      },
    });
  };

  // 所属单位下拉框输入
  handleUnitIdChange = value => {
    const {
      fetchUnitsFuzzy,
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    // 根据输入值获取列表
    fetchUnitsFuzzy({
      payload: {
        unitType: getFieldValue('unitType'),
        unitName: value && value.trim(),
      },
    });
    // 清除数据权限输入框的值
    setFieldsValue({
      treeIds: undefined,
    });
  };

  // 所属单位下拉框选择
  handleDataPermissions = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    // 根据value从源数组中筛选出对应的数据，获取其
    setFieldsValue({
      treeIds: value.label,
    });
  };

  /** 所属单位下拉框失焦 */
  handleUnitIdBlur = value => {
    const {
      account: { unitIdes },
      form: { setFieldsValue },
    } = this.props;
    // 根据value判断是否是手动输入
    if (value && value.key === value.label) {
      // 从源数组中筛选出当前值对应的数据，如果存在，则将对应的数据为所属单位下拉框重新赋值
      const unitId = unitIdes.filter(item => item.name === value.label)[0];
      if (unitId) {
        setFieldsValue({
          unitId: {
            key: unitId.id,
            label: unitId.name,
          },
          treeIds: unitId.name,
        });
      } else {
        setFieldsValue({
          unitId: undefined,
        });
      }
    }
  };

  /* 异步验证用户名 */
  validateUserName = (rule, value, callback) => {
    if (value) {
      const { checkAccountOrPhone } = this.props
      checkAccountOrPhone({
        payload: {
          loginName: value,
        },
        callback(res) {
          if (res.code === 200) callback()
          else callback(res.msg)
        },
      })
    } else callback()
  }

  /* 异步验证手机号 */
  validatePhoneNumber = (rule, value, callback) => {
    if (value) {
      const { checkAccountOrPhone } = this.props
      checkAccountOrPhone({
        payload: {
          phoneNumber: value,
        },
        callback(res) {
          if (res.code === 200) callback()
          else callback(res.msg)
        },
      })
    } else callback()
  }

  /* 渲染基本信息 */
  renderBasicInfo() {
    const {
      account: { unitTypes, accountStatuses, unitIdes },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const { Option } = Select;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.loginName}>
                {getFieldDecorator('loginName', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入用户名',
                    },
                    { validator: this.validateUserName },
                  ],
                })(<Input placeholder="请输入用户名" min={1} max={20} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.password}>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入密码',
                    },
                  ],
                })(<Input placeholder="请输入密码" min={6} max={20} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.accountStatus}>
                {getFieldDecorator('accountStatus', {
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
            <Col span={24}>
              <Col lg={8} md={8} sm={24} style={{ paddingRight: 30 }}>
                <Form.Item label={fieldLabels.userName}>
                  {getFieldDecorator('userName', {
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
              <Col lg={8} md={12} sm={24} style={{ paddingLeft: 15, paddingRight: 15 }}>
                <Form.Item label={fieldLabels.phoneNumber}>
                  {getFieldDecorator('phoneNumber', {
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        type: 'string',
                        message: '请输入手机号',
                      },
                      { validator: this.validatePhoneNumber },
                    ],
                  })(<Input placeholder="请输入手机号" min={11} max={11} />)}
                </Form.Item>
              </Col>
            </Col>
            <Col span={24}>
              <Col lg={8} md={12} sm={24} style={{ paddingRight: 30 }}>
                <Form.Item label={fieldLabels.unitType}>
                  {getFieldDecorator('unitType', {
                    initialValue: unitTypes.length === 0 ? undefined : unitTypes[0].id,
                    rules: [
                      {
                        required: true,
                        message: '请选择单位类型',
                      },
                    ],
                  })(
                    <Select placeholder="请选择单位类型" onSelect={this.handleUnitTypeSelect}>
                      {unitTypes.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24} style={{ paddingLeft: 15, paddingRight: 15 }}>
                <Form.Item label={fieldLabels.unitId}>
                  {getFieldDecorator('unitId', {
                    rules: [
                      {
                        required: true,
                        transform: value => value && value.label,
                        message: '请选择所属单位',
                      },
                    ],
                  })(
                    <Select
                      mode="combobox"
                      labelInValue
                      optionLabelProp="children"
                      placeholder="请选择所属单位"
                      notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                      onSearch={this.handleUnitIdChange}
                      onSelect={this.handleDataPermissions}
                      onBlur={this.handleUnitIdBlur}
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
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染角色权限信息 */
  renderRolePermission() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card title="角色权限配置" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.dataPermissions}>
                {getFieldDecorator('treeIds')(<Input placeholder="单位名称" disabled />)}
                <p style={{ paddingTop: 10, fontSize: 12 }}>包括该组织下的所有数据</p>
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
        <p>创建单个账号，包括基本信息、角色权限等</p>
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
          {this.renderRolePermission()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
