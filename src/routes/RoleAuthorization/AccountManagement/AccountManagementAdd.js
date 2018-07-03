import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Row, Col, Input, Select, Button, Spin } from 'antd';
import FooterToolbar from 'components/FooterToolbar';
import debounce from 'lodash/debounce';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';

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
  user: '用户名',
  name: '姓名',
  phone: '手机号',
  unitType: '单位类型',
  hasUnit: '所属单位',
  accountStatus: '账号状态',
};

/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
@connect(
  ({ accountmanagement, loading }) => ({
    accountmanagement,
    loading: loading.models.accountmanagement,
  }),
  dispatch => ({
    fetchOptions(action) {
      dispatch({
        type: 'accountmanagement/fetchOptions',
        ...action,
      });
    },
  })
)
@Form.create()
export default class AccountManagementAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUnit = debounce(this.fetchUnit, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  };

  /* 生命周期函数 */
  componentWillMount() {
    const { fetchOptions } = this.props;
    // 获取单位类型
    fetchOptions({
      payload: {
        type: 'unitType',
        key: 'unitTypes',
      },
    });
  }

  fetchUnit = () => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch()
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this.lastFetchId) {
          return;
        }
        const data = body.results.map(hasUnit => ({
          text: `${hasUnit.name.first} ${hasUnit.name.last}`,
          value: hasUnit,
        }));
        this.setState({ data, fetching: false });
      });
  };

  // '所属单位'选择器点击事件
  handleChange = value => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 渲染基本信息 */
  renderBasicInfo() {
    const {
      accountmanagement: { unitTypes },
      form: { getFieldDecorator },
    } = this.props;

    const { Option } = Select;

    const { fetching, data, value } = this.state;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.user}>
                {getFieldDecorator('user', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入用户名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.name}>
                {getFieldDecorator('name', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.phone}>
                {getFieldDecorator('phone', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入手机号" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitType}>
                <Select placeholder="请选择单位类型" getPopupContainer={getRootChild}>
                  {unitTypes.map(item => (
                    <Option setFieldsValue={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.hasUnit}>
                {getFieldDecorator('hasUnit', {
                  getValueFromEvent: this.handleTrim,
                })(
                  <Select
                    mode="multiple"
                    labelInValue
                    value={value}
                    placeholder="所属单位"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.fetchUnit}
                    onChange={this.handleChange}
                  >
                    {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.accountStatus}>
                <Select defaultValue="启用">
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { loading } = this.props;
    return (
      <FooterToolbar>
        <Button>取消</Button>
        <Button type="primary" loading={loading}>
          提交
        </Button>
      </FooterToolbar>
    );
  }

  render() {
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
        {this.renderBasicInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
