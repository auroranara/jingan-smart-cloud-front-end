import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Icon, Input, BackTop, Spin, Col, Row, Select } from 'antd';
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
  },
  {
    title: '权限管理',
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
  loginName: undefined,
  userName: undefined,
  phoneNumber: undefined,
  unitType: undefined,
  unitId: undefined,
};

@connect(
  ({ accountManagement, loading }) => ({
    accountManagement,
    loading: loading.models.accountManagement,
  }),
  dispatch => ({
    fetch(action) {
      dispatch({
        type: 'accountManagement/fetch',
        ...action,
      });
    },
    fetchOptions(action) {
      dispatch({
        type: 'accountManagement/fetchOptions',
        ...action,
      });
    },
    fetchUnitList(action) {
      dispatch({
        type: 'accountManagement/fetchUnitList',
        ...action,
      });
    },
    goToDetail(url) {
      dispatch(routerRedux.push(url));
    },
  })
)
@Form.create()
export default class accountManagementList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  componentDidMount() {
    const { fetch, fetchOptions, fetchUnitList } = this.props;

    // 获取账号列表
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
      },
    });

    // 获取单位类型
    fetchOptions({
      payload: {
        type: 'unitType',
        key: 'unitTypes',
      },
    });

    // 获取所属单位
    fetchUnitList({
      payload: {
        type: 'unitId',
        key: 'unitIds',
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
    const { accountManagement } = this.props;
    if (!flag || accountManagement.isLast) {
      return;
    }
    const {
      fetch,
      accountManagement: { pageNum },
    } = this.props;
    // 请求数据
    fetch({
      payload: {
        pageSize,
        pageNum,
        ...this.formData,
      },
    });
  };

  /* 选择单位类型以后查询所属单位 */
  handleQueryUnit = value => {
    const { fetchUnitList } = this.props;
    fetchUnitList({
      payload: {
        unitType: value,
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      accountManagement: { unitTypes, unitIds },
      form: { getFieldDecorator },
    } = this.props;

    const { Option } = Select;

    return (
      <Card>
        <Form layout="inline">
          <Col span={18}>
            <FormItem label="用户">
              {getFieldDecorator('input')(<Input placeholder="用户名/姓名/手机号" />)}
            </FormItem>
            <FormItem label="单位类型">
              {getFieldDecorator('unitType')(
                <Select
                  placeholder="请选择单位类型"
                  onChange={this.handleQueryUnit}
                  style={{ width: 180 }}
                >
                  {unitTypes.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="所属单位">
              {getFieldDecorator('unitId')(
                <Select placeholder="请选择所属单位" style={{ width: 180 }}>
                  {unitIds.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
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
      accountManagement: { list },
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
                title={item.loginName}
                className={styles.card}
                actions={[
                  <Link to={`/role-authorization/account-management/detail/${item.id}`}>查看</Link>,
                  <Link to={`/role-authorization/account-management/edit/${item.id}`}>编辑</Link>,
                ]}
                extra={
                  <Button
                    // onClick={() => {
                    //   this.handleShowDeleteConfirm(item.id);
                    // }}
                    shape="circle"
                    style={{ border: 'none', fontSize: '20px' }}
                  >
                    <Icon type="close" />
                  </Button>
                }
              >
                <Row
                  onClick={() => {
                    goToDetail(`/role-authorization/account-management/detail/${item.id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Col span={12}>
                    <p>{`姓名：${item.userName}`}</p>
                  </Col>
                  <Col span={12}>
                    <p>{`电话: ${item.phoneNumber}`}</p>
                  </Col>
                  <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    {`公司名称：${item.unitName}`}
                  </Ellipsis>
                  <Col span={12}>
                    <p>
                      角色：<a href="#">查看</a>
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      权限：<a href="#">查看</a>
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
      accountManagement: { list, isLast },
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
