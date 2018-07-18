import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Input, BackTop, Spin, Col, Select } from 'antd';
import { Link, routerRedux } from 'dva/router';
import debounce from 'lodash/debounce';
import VisibilitySensor from 'react-visibility-sensor';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

import styles from './AccountManagementList.less';

// 标题
const title = '账号管理';
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
    title,
    name:'账号管理',
  },
];

const FormItem = Form.Item;

// 默认页面显示数量
const pageSize = 18;

// 默认的所属单位长度
const defaultPageSize = 20;

// 默认表单值
const defaultFormData = {
  loginName: undefined,
  userName: undefined,
  phoneNumber: undefined,
  unitType: undefined,
  unitId: undefined,
  // accountStatus: undefined,
};

/* 账号状态 */
const statusList = {
  0: 'error-mark',
};
const statusLabelList = {
  0: '已禁用',
};

@connect(
  ({ account, loading }) => ({
    account,
    loading: loading.models.account,
  }),
  dispatch => ({
    fetch(action) {
      dispatch({
        type: 'account/fetch',
        ...action,
      });
    },
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
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
  }

  componentDidMount() {
    const { fetch, fetchOptions, fetchUnitsFuzzy } = this.props;

    // 获取账号列表
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
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

  /* 去除输入框里左右两边空白 */
  handleTrim = e => e.target.value.trim();

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
    const { account } = this.props;
    if (!flag || account.isLast) {
      return;
    }
    const {
      fetch,
      account: { pageNum },
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

  // 单位类型下拉框选择
  handleUnitTypeSelect = value => {
    const {
      fetchUnitsFuzzy,
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ unitId: undefined });
    fetchUnitsFuzzy({
      payload: {
        unitType: value,
      },
    });
  };

  // 所属单位下拉框输入
  handleUnitIdChange = value => {
    const {
      fetchUnitsFuzzy,
      form: { getFieldValue },
    } = this.props;
    fetchUnitsFuzzy({
      payload: {
        unitType: getFieldValue('unitType'),
        unitName: value && value.trim(),
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      account: { unitTypes, unitIdes },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const { Option } = Select;

    return (
      <Card>
        <Form layout="inline">
          <Col span={18}>
            <FormItem label="用户">
              {getFieldDecorator('input', {
                getValueFromEvent: this.handleTrim,
              })(<Input placeholder="用户名/姓名/手机号" />)}
            </FormItem>
            <FormItem label="单位类型">
              {getFieldDecorator('unitType')(
                <Select
                  placeholder="请选择单位类型"
                  onSelect={this.handleUnitTypeSelect}
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
              {getFieldDecorator('unitId', {
                rules: [
                  {
                    whitespace: true,
                    message: '请选择所属单位',
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
                  style={{ width: 180 }}
                >
                  {unitIdes.map(item => (
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
      account: { list },
      goToDetail,
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const { id, loginName, accountStatus } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={loginName}
                  className={styles.card}
                  actions={[
                    <Link to={`/role-authorization/account-management/detail/${item.id}`}>
                      查看
                    </Link>,
                    <Link to={`/role-authorization/account-management/edit/${item.id}`}>编辑</Link>,
                  ]}
                  // extra={
                  //   <Button
                  //     onClick={() => {
                  //       this.handleShowDeleteConfirm(id);
                  //     }}
                  //     shape="circle"
                  //     style={{ border: 'none', fontSize: '20px' }}
                  //   >
                  //     <Icon type="close" />
                  //   </Button>
                  // }
                >
                  <div
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
                  </div>
                  {
                    <div className={styles[statusList[accountStatus]]}>
                      {statusLabelList[accountStatus]}
                    </div>
                  }
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      account: { list, isLast },
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
