import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Icon, Input, BackTop, Spin, Col, Row, Cascader } from 'antd';
import { Link, routerRedux } from 'dva/router';
import VisibilitySensor from 'react-visibility-sensor';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';

import styles from './AccountManagementList.less';

// 标题
const title = '账号管理';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '权限管理',
    href: '/',
  },
  {
    title,
  },
];

const FormItem = Form.Item;

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  user: undefined,
  unitType: undefined,
  unitId: undefined,
};

@connect(
  ({ accountmanagement, loading }) => ({
    accountmanagement,
    loading: loading.models.accountmanagement,
  }),
  dispatch => ({
    fetch(action) {
      dispatch({
        type: 'accountmanagement/fetch',
        ...action,
      });
    },
    appendFetch(action) {
      dispatch({
        type: 'accountmanagement/appendFetch',
        ...action,
      });
    },
    goToDetail(url) {
      dispatch(routerRedux.push(url));
    },
  })
)
@Form.create()
export default class AccountManagementList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  componentDidMount() {
    // 获取账号列表
    this.props.fetch({
      payload: {
        pageSize,
      },
    });
  }

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      fetch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      fetch,
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = flag => {
    if (!flag || this.props.accountmanagement.isLast) {
      return;
    }
    const {
      appendFetch,
      accountmanagement: { pageNum },
    } = this.props;
    // 请求数据
    appendFetch({
      payload: {
        pageSize,
        pageNum,
        ...this.formData,
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <Col span={18}>
            <FormItem label="用户">
              {getFieldDecorator('user', {
                initialValue: defaultFormData.user,
                getValueFromEvent: e => e.target.value.trim(),
              })(<Input placeholder="用户名/姓名/手机号" />)}
            </FormItem>
            <FormItem label="单位类型">
              {getFieldDecorator('unitType', {
                initialValue: defaultFormData.unitType,
                getValueFromEvent: e => e.target.value.trim(),
              })(
                <Cascader
                  // options={ }
                  placeholder="请选择单位类型"
                />
              )}
            </FormItem>
            <FormItem label="所属单位">
              {getFieldDecorator('unitId', {
                initialValue: defaultFormData.unitId,
                getValueFromEvent: e => e.target.value.trim(),
              })(<Input placeholder="请选择所属单位" />)}
            </FormItem>
          </Col>

          {/* 按钮 */}
          <Col span={6}>
            <FormItem style={{ float: 'right' }}>
              <Button type="primary" href="#/role-authorization/account-management/Add">
                新增
              </Button>
            </FormItem>
            <FormItem style={{ float: 'right' }}>
              <Button onClick={this.handleClickToReset}>重置</Button>
            </FormItem>
            <FormItem style={{ float: 'right' }}>
              <Button type="primary" onClick={this.handleClickToQuery}>
                查询
              </Button>
            </FormItem>
          </Col>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      accountmanagement: { list },
      goToDetail,
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                title={item.name}
                className={styles.card}
                actions={[
                  <Link to={`/role-authorization/account-management/detail/${item.id}`}>查看</Link>,
                  <Link to={`/role-authorization/account-management/edit/${item.id}`}>编辑</Link>,
                ]}
                extra={
                  <Button
                    onClick={() => {
                      this.handleShowDeleteConfirm(item.id);
                    }}
                    shape="circle"
                    style={{ border: 'none', fontSize: '20px' }}
                  >
                    <Icon type="close" />
                  </Button>
                }
              >
                <Row
                  onClick={() => {
                    goToDetail(`/${item.id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Col span={12}>
                    <p>{`姓名：${item.subordinateCompanyCount}`}</p>
                  </Col>
                  <Col span={12}>
                    <p>{`电话: ${item.subordinateCompanyCount}`}</p>
                  </Col>
                  <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    {`公司名称：${item.practicalAddress}`}
                  </Ellipsis>
                  <Col span={12}>
                    <p>
                      角色：<a href="">查看</a>
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      权限：<a href="">查看</a>
                    </p>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }

  render() {
    const {
      accountmanagement: { list, isLast },
      loading,
    } = this.props;

    const content = (
      <div>
        <p>对账号进行增删改查，并对账号赋予角色，使得账号获得相关菜单、操作按钮以及数据权限等。</p>
      </div>
    );

    return (
      <PageHeaderLayout title="账号管理" breadcrumbList={breadcrumbList} content={content}>
        <BackTop />
        {this.renderForm()}
        {this.renderList()}
        {list.length !== 0 && <VisibilitySensor onChange={this.handleLoadMore} style={{}} />}
        {loading &&
          !isLast && (
            <div style={{ paddingTop: '50px', textAlign: 'center' }}>
              <Spin />
            </div>
          )}
      </PageHeaderLayout>
    );
  }
}
