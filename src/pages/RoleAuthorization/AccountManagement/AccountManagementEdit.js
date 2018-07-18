import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Row, Col, Input, Select, message, Icon, Popover, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import debounce from 'lodash/debounce';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import { phoneReg } from 'utils/validate';
import styles from './AccountManagementEdit.less';

const { Option } = Select;

// 标题
const title = '编辑账号';
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
    href: '/role-authorization/account-management/list',
  },
  {
    title,
    name: '编辑账号',
  },
];

/* 表单标签 */
const fieldLabels = {
  loginName: '用户名',
  userName: '姓名',
  phoneNumber: '手机号',
  unitType: '单位类型',
  unitId: '所属单位',
  accountStatus: '账号状态',
  treeIds: '数据权限',
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

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

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
    validateFieldsAndScroll(
      (error, { loginName, accountStatus, userName, phoneNumber, unitType, unitId, treeIds }) => {
        if (!error) {
          this.setState({
            submitting: true,
          });
          updateAccountDetail({
            payload: {
              id,
              loginName: loginName.trim(),
              accountStatus,
              userName: userName.trim(),
              phoneNumber: phoneNumber.trim(),
              unitType,
              unitId: unitId.key,
              treeIds: treeIds.key,
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
      loading,
    } = this.props;

    return (
      <Card title="账号基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.loginName}>
                {getFieldDecorator('loginName', {
                  initialValue: loginName,
                  getValueFromEvent: this.handleTrim,
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
          data: { treeNames, treeIds },
        },
      },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    return (
      <Card title="角色权限配置" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.treeIds}>
                {getFieldDecorator('treeIds', {
                  initialValue: { key: treeIds, label: treeNames },
                  rules: [
                    {
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
          {this.renderRolePermission()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
