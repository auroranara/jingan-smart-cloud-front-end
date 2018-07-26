import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Row, Col, Input, Select, message, Icon, Popover, Spin, Transfer } from 'antd';
import { routerRedux } from 'dva/router';
import debounce from 'lodash/debounce';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import styles from './AccountManagementEdit.less';

const { Option } = Select;

// 编辑页面标题
const editTitle = '编辑账号';
// 添加页面标题
const addTitle = '新增账号';
// 返回地址
const href = '/role-authorization/account-management/list';

/* 表单标签 */
const fieldLabels = {
  loginName: '用户名',
  password: '密码',
  userName: '姓名',
  phoneNumber: '手机号',
  unitType: '单位类型',
  unitId: '所属单位',
  accountStatus: '账号状态',
  treeIds: '数据权限',
  roleIds: '配置角色',
};

// 默认的所属单位长度
const defaultPageSize = 20;

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

    // 新增账号
    addAccount(action) {
      dispatch({
        type: 'account/addAccount',
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

    // 检验是否符合规则
    checkAccountOrPhone(action) {
      dispatch({
        type: 'account/checkAccountOrPhone',
        ...action,
      })
    },

    // 清除详情
    clearDetail() {
      dispatch({
        type: 'account/clearDetail',
      });
    },

    // 获取角色列表
    fetchRoles() {
      dispatch({
        type: 'account/fetchRoles',
      });
    },

    // 跳转到500
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },

    dispatch,
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
  componentDidMount() {
    const {
      fetchAccountDetail,
      match: {
        params: { id },
      },
      fetchOptions,
      goToException,
      fetchUnitsFuzzy,
      clearDetail,
      fetchRoles,
    } = this.props;

    // 如果id存在的话，就获取详情，即编辑状态
    if (id) {
      // 获取详情
      fetchAccountDetail({
        payload: {
          id,
        },
        error: () => {
          goToException();
        },
      });
    }
    else {
      clearDetail();
    }

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

    // 获取角色列表
    fetchRoles({
      error: goToException,
    });
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      updateAccountDetail,
      addAccount,
      goBack,
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
    } = this.props;
    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll(
      (error, { loginName, accountStatus, userName, phoneNumber, unitType, unitId, treeIds, password, roleIds }) => {
        if (!error) {
          this.setState({
            submitting: true,
          });
          const payload = {
            id,
            loginName: loginName.trim(),
            password: password && password.trim(),
            accountStatus,
            userName: userName.trim(),
            phoneNumber: phoneNumber.trim(),
            unitType,
            unitId: unitId.key,
            treeIds: treeIds.key,
            roleIds: roleIds.join(','),
          };
          console.log(payload);
          const success = () => {
            const msg = id ? '编辑成功！' : '新增成功！';
            message.success(msg, 1, goBack);
          };
          const error = (err) => {
            message.error(err, 1);
            this.setState({
              submitting: false,
            });
          };
          // 如果id存在的话，为编辑
          if (id) {
            updateAccountDetail({
              payload,
              success,
              error,
            });
          }
          else {
            addAccount({
              payload,
              success,
              error,
            });
          }
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
        pageNum: 1,
        pageSize: defaultPageSize,
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
    // 根据value从源数组中筛选出对应的数据，获取其值
    setFieldsValue({
      treeIds: value,
    });
  };

  /** 所属单位下拉框失焦 */
  handleUnitIdBlur = value => {
    const {
      fetchUnitsFuzzy,
      account: { unitIdes },
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    // 根据value判断是否是手动输入
    if (value && value.key === value.label) {
      this.handleUnitIdChange.cancel();
      // 从源数组中筛选出当前值对应的数据，如果存在，则将对应的数据为所属单位下拉框重新赋值
      const unitId = unitIdes.filter(item => item.name === value.label)[0];
      if (unitId) {
        const treeIds = {
          key: unitId.id,
          label: unitId.name,
        };
        setFieldsValue({
          unitId: treeIds,
          treeIds,
        });
      } else {
        setFieldsValue({
          unitId: undefined,
          treeIds: undefined,
        });
        fetchUnitsFuzzy({
          payload: {
            unitType: getFieldValue('unitType'),
            pageNum: 1,
            pageSize: defaultPageSize,
          },
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
      const { checkAccountOrPhone, match: { params: { id } } } = this.props
      checkAccountOrPhone({
        payload: {
          id,
          phoneNumber: value,
        },
        callback(res) {
          if (res.code === 200) callback()
          else callback(res.msg)
        },
      })
    } else callback()
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      account: {
        detail: {
          data: { loginName, userName, phoneNumber, unitType, unitName, accountStatus, unitId },
        },
        unitTypes,
        accountStatuses,
        unitIdes,
      },
      form: { getFieldDecorator },
      match: { params: { id } },
      loading,
    } = this.props;

    const isValidateLoginName = id ? [] : [{ validator: this.validateUserName }];

    return (
      <Card title="账号基本信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.loginName}>
                {getFieldDecorator('loginName', {
                  initialValue: loginName,
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入用户名',
                    },
                    ...isValidateLoginName,
                  ],
                })(id ? <span>{loginName}</span> : <Input placeholder="请输入用户名" min={1} max={20} />)}
              </Form.Item>
            </Col>
            {id ? null : (
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
                  })(<Input placeholder="请输入密码" min={6} max={20} type="password" />)}
                </Form.Item>
              </Col>
            )}
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.accountStatus}>
                {getFieldDecorator('accountStatus', {
                  initialValue: id ? accountStatus : (accountStatuses.length === 0 ? undefined : accountStatuses[0].id),
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
                  getValueFromEvent: this.handleTrim,
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
                  getValueFromEvent: this.handleTrim,
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
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitType}>
                {getFieldDecorator('unitType', {
                  initialValue: id ? unitType : (unitTypes.length === 0 ? undefined : unitTypes[0].id),
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
                  initialValue: { key: unitId, label: unitName },
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
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染角色权限信息 */
  renderRolePermission() {
    const {
      account: {
        detail: {
          data: { treeNames, treeIds, roleIds },
        },
        roles,
      },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const roleList = roles.map(({ id, name }) => ({ key: id, title: name }));

    return (
      <Card title="角色权限配置" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col span={24}>
              <Form.Item label={fieldLabels.roleIds}>
                  {getFieldDecorator('roleIds', {
                    initialValue: roleIds ? roleIds.split(',') : [],
                    valuePropName: "targetKeys",
                    rules: [
                      {
                        required: true,
                        transform: value => value && value.join(','),
                        message: '请配置角色',
                      },
                    ],
                  })(
                    <Transfer
                      dataSource={roleList}
                      titles={['所选角色', '角色列表']}
                      render={item => item.title}
                    />
                  )}
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.treeIds}>
                {getFieldDecorator('treeIds', {
                  initialValue: { key: treeIds, label: treeNames },
                  rules: [
                    {
                      required: true,
                      transform: value => value && value.label,
                      message: '单位名称不能为空',
                    },
                  ],
                })(
                  <Select
                    mode="combobox"
                    labelInValue
                    optionLabelProp="children"
                    placeholder="请选择单位名称"
                    notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                    filterOption={false}
                    disabled
                  >
                    {[].map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
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
        <Button
          type="primary"
          size="large"
          onClick={this.handleClickValidate}
          loading={loading || submitting}
          style={{ fontSize: 16 }}
        >
          提交
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    const { loading, match: { params: { id } } } = this.props;
    const { submitting } = this.state;
    const title = id ? editTitle : addTitle;
    const content = (
      <div>
        <p>{id ? '编辑单个账号的基本信息，角色权限、数据权限' : '创建单个账号，包括基本信息、角色权限等'}</p>
      </div>
    );

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
      },
      {
        title: '权限管理',
        name: '权限管理',
      },
      {
        title: '账号管理',
        name: '账号管理',
        href,
      },
      {
        title,
        name: title,
      },
    ];

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
