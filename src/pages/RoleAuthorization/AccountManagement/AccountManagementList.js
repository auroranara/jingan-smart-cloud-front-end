import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  Input,
  Spin,
  Row,
  Col,
  Select,
  AutoComplete,
  Icon,
  Modal,
  Table,
  Divider,
  Popconfirm,
  message,
  TreeSelect,
} from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import debounce from 'lodash/debounce';
import InfiniteScroll from 'react-infinite-scroller';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './AccountManagementList.less';
import { AuthLink, AuthButton, AuthSpan } from '@/utils/customAuth';
import codesMap from '@/utils/codes';
import{ getListByUnitId } from './utils';
import { MAI, GOV, OPE, COM } from '@/pages/RoleAuthorization/Role/utils';

const { TreeNode } = TreeSelect;
// 标题
const title = '账号管理';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
  },
  {
    title: '角色权限',
    name: '角色权限',
  },
  {
    title,
    name: '账号管理',
  },
];

const FormItem = Form.Item;

// 默认页面显示数量
const pageSize = 18;

// 默认的所属单位长度
const defaultPageSize = 20;

/* 账号状态 */
const statusList = {
  0: 'error-mark',
};
const statusLabelList = {
  0: '已禁用',
};
const unitTypeList = {
  1: '维保企业',
  2: '政府机构',
  3: '运营企业',
  4: '企事业主体',
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ account, user, loading }) => ({
    account,
    user,
    loading: loading.models.account,
  }),
  dispatch => ({
    fetch(action) {
      dispatch({
        type: 'account/fetch',
        ...action,
      });
    },
    appendfetch(action) {
      dispatch({
        type: 'account/appendfetch',
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
    saveAccounts(action) {
      dispatch({
        type: 'account/saveAccounts',
        ...action,
      });
    },
    chnageAccountStatus(action) {
      dispatch({
        type: 'account/chnageAccountStatus',
        ...action,
      });
    },
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },
    fetchGavUserTypes(action) {
      dispatch({
        type: 'account/fetchOptions',
        ...action,
      });
    },
    fetchUserType(action) {
      dispatch({
        type: 'account/fetchUserType',
        ...action,
      });
    },
    saveSearchInfo(action) {
      dispatch({
        type: 'account/saveSearchInfo',
        ...action,
      });
    },
    initPageNum(action) {
      dispatch({
        type: 'account/initPageNum',
        ...action,
      });
    },
    fetchRoles(action) {
      dispatch({ type: 'account/fetchRoles', ...action });
    },
    clearRoles() {
      dispatch({ type: 'account/queryRoles', payload: [] });
    },
    clearUnits() {
      dispatch({ type: 'account/queryUnits', payload: [] });
    },
  })
)
@Form.create()
export default class accountManagementList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      associatedUnits: [],
      currentLoginId: null,
      unitTypeChecked: undefined,
    };
  }

  // 生命周期函数
  componentDidMount() {
    const {
      fetchOptions,
      fetchUserType,
      clearRoles,
      clearUnits,
      fetchUnitsFuzzy,
    } = this.props;

    clearRoles();
    clearUnits();
    fetchUserType();
    fetchOptions(); // 获取单位类型和账户状态
    this.getInitValues();
    this.fetchLazyUnitsFuzzy = debounce(fetchUnitsFuzzy, 500);
  }

  componentWillUnmount() {
    const { initPageNum } = this.props;
    initPageNum();
  }

  isUnitUser() { // 是否是非运营的单位用户
    const { user: { currentUser: { unitId, unitType } } } = this.props;
    return unitId && +unitType !== OPE;
  }

  getInitValues = () => {
    const {
      fetch,
      fetchUnitsFuzzy,
      fetchRoles,
      account: { searchInfo },
      form: { setFieldsValue },
      user: { currentUser: { unitId, unitType } },
    } = this.props;

    const isUnitUser = this.isUnitUser();
    let listPayload;
    if (isUnitUser) {
      fetchRoles({ payload: { unitType, companyId: unitId } });
      listPayload = { pageSize, pageNum: 1, unitId };
    } else {
      let selectedUnitType;
      if (searchInfo) // 上次缓存在model里的筛选条件
        selectedUnitType = searchInfo.unitType;

      this.setState({ unitTypeChecked: selectedUnitType });

      // 如果有搜索条件，则填入并所属单位和账号列表
      if (searchInfo) {
        const { unitId: { key } = {}, ...other } = searchInfo;
        selectedUnitType === GOV
          ? fetchUnitsFuzzy({
              payload: { unitType: GOV },
            })
          : fetchUnitsFuzzy({
              payload: {
                unitType: selectedUnitType,
                pageNum: 1,
                pageSize: defaultPageSize,
              },
            });
        listPayload = { pageSize, pageNum: 1, unitId: key || null, ...other };
      } else { // 最初没有选择任何条件的状态
        fetchUnitsFuzzy({
          payload: {
            unitType: selectedUnitType,
            pageNum: 1,
            pageSize: defaultPageSize,
          },
        });
        listPayload = { pageSize, pageNum: 1 };
      }
    }

    searchInfo && setFieldsValue(searchInfo);
    fetch({ payload: listPayload });
  };

  /* 去除输入框里左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      fetch,
      saveSearchInfo,
      form: { getFieldsValue },
      user: { currentUser: { unitId } },
    } = this.props;

    const isUnitUser = this.isUnitUser();
    const data = getFieldsValue();
    const { unitId: { key } = {}, ...other } = data;
    if (isUnitUser)
      other.unitId = unitId;
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
        unitId: key || data.unitId || null,
        ...other,
      },
    });
    saveSearchInfo({
      payload: data,
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      fetch,
      fetchUnitsFuzzy,
      saveSearchInfo,
      form: { resetFields, getFieldValue },
      user: { currentUser: { unitId } },
    } = this.props;
    const isUnitUser = this.isUnitUser();
    const payload = { pageSize, pageNum: 1 };
    resetFields();
    if (isUnitUser) {
      payload.unitId = unitId;
    } else {
      const unitType = getFieldValue('unitType');
      this.setState({ unitTypeChecked: unitType }, () => {
        fetchUnitsFuzzy({
          payload: {
            unitType,
            pageNum: 1,
            pageSize: defaultPageSize,
          },
        });
      });
    }

    fetch({ payload });
    saveSearchInfo();
  };

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      appendfetch,
      account: { pageNum, isLast },
      form: { getFieldsValue },
    } = this.props;
    if (isLast) {
      return;
    }
    const data = getFieldsValue();
    const { unitId: { key } = {}, ...other } = data;
    // 请求数据
    appendfetch({
      payload: {
        pageSize,
        pageNum: pageNum + 1,
        unitId: key || data.unitId || null,
        ...other,
      },
    });
  };

  // 单位类型下拉框选择
  handleUnitTypeChange = value => {
    const {
      fetchRoles,
      clearRoles,
      fetchUnitsFuzzy,
      form: { setFieldsValue },
    } = this.props;

    setFieldsValue({ unitId: undefined });
    this.setState({ unitTypeChecked: value });

    if (value !== undefined && value !== null)
      fetchRoles({ payload: { unitType: value } });
    else
      clearRoles();

    // 根据当前选中的单位类型获取对应的所属单位列表
    if (value === GOV) {
      fetchUnitsFuzzy({
        payload: {
          unitType: value,
        },
      });
    } else if (value === null || value === undefined) {
      fetchUnitsFuzzy({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
        },
      });
    } else {
      fetchUnitsFuzzy({
        payload: {
          unitType: value,
          pageNum: 1,
          pageSize: defaultPageSize,
        },
      });
    }
  };

  handleUnitSelect = value => {
    const { fetchRoles, clearRoles } = this.props;
    const { unitTypeChecked } = this.state;

    if (!unitTypeChecked && !value)
      clearRoles();
    else
      fetchRoles({ payload: { unitType: unitTypeChecked, companyId: value.key } });
  };

  handleUnitSearch = value => {
    const {
      form: { getFieldValue },
    } = this.props;
    this.fetchLazyUnitsFuzzy({
      payload: {
        unitType: getFieldValue('unitType'),
        unitName: value && value.trim(),
        pageNum: 1,
        pageSize: defaultPageSize,
      },
    });
  };

  // 所属单位失焦
  handleUnitIdBlur = () => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const value = getFieldValue('unitId');

    // 搜索后没有选择就清空
    if (value && value.key === value.label) {
      setFieldsValue({ unitId: undefined });
    }
  };

  // 查看更多关联企业
  handleViewMore = (users, loginId) => {
    this.setState({
      modalVisible: true,
      associatedUnits: users,
      currentLoginId: loginId,
    });
  };

  handleModalClose = () => {
    this.setState({
      modalVisible: false,
    });
  };

  // 跳转到编辑关联企业
  handleToEdit = id => {
    router.push(`/role-authorization/account-management/associated-unit/edit/${id}`);
  };

  // 解绑/开启安全企业
  handleAccountStatus = ({ accountStatus, id, users, loginId }) => {
    const {
      saveAccounts,
      chnageAccountStatus,
      account: { list },
    } = this.props;
    const success = () => {
      const temp = users.map(item => (item.id === id ? { ...item, accountStatus } : item));
      const newList = list.map(
        item => (item.loginId === loginId ? { ...item, users: temp } : item)
      );
      saveAccounts({
        payload: newList,
      });
      message.success(`${!!accountStatus ? '开启成功！' : '解绑成功！'}`);
      this.setState({
        associatedUnits: temp,
      });
    };
    const error = msg => {
      message.error(msg);
    };
    chnageAccountStatus({
      payload: {
        id,
        accountStatus,
      },
      success,
      error,
    });
  };

  generateTressNode = data => {
    return data.map(item => {
      if (item.child && item.child.length) {
        return (
          <TreeNode title={item.name} key={item.id} value={item.id}>
            {this.generateTressNode(item.child)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={item.id} />;
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      account: { unitTypes, unitIds, roles },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const isUnitUser =this.isUnitUser(); // 单位用户且不为运营
    const { unitTypeChecked } = this.state;
    const { Option } = Select;

    return (
      <Card>
        <Form layout="inline">
          <Col span={18}>
            <FormItem label="用户">
              {getFieldDecorator('userName', {
                getValueFromEvent: this.handleTrim,
              })(<Input placeholder="用户名/姓名/手机号" style={{ width: 180 }} />)}
            </FormItem>
            {!isUnitUser && (
              <FormItem label="单位类型">
                {getFieldDecorator('unitType', {
                  // initialValue: unitTypes.length === 0 ? undefined : unitTypes[0].id,
                })(
                  <Select
                    placeholder="请选择单位类型"
                    allowClear
                    onChange={this.handleUnitTypeChange}
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
            )}

            {!isUnitUser && unitTypeChecked !== GOV && (
              <FormItem label="所属单位">
                {getFieldDecorator('unitId', {
                  rules: [
                    {
                      whitespace: true,
                      transform: value => value && value.label,
                    },
                  ],
                })(
                  <AutoComplete
                    allowClear
                    labelInValue
                    mode="combobox"
                    optionLabelProp="children"
                    placeholder="请选择所属单位"
                    notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                    onSelect={this.handleUnitSelect}
                    onSearch={this.handleUnitSearch}
                    onBlur={this.handleUnitIdBlur}
                    filterOption={false}
                    style={{ width: 230 }}
                  >
                    {unitIds.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </AutoComplete>
                )}
              </FormItem>
            )}

            {!isUnitUser && unitTypeChecked === GOV && (
              <FormItem label="所属单位">
                {getFieldDecorator('unitId')(
                  <TreeSelect
                    allowClear
                    placeholder="请选择所属单位"
                    // labelInValue
                    style={{ width: 230 }}
                  >
                    {this.generateTressNode(unitIds)}
                  </TreeSelect>
                )}
              </FormItem>
            )}
            <FormItem label="角色">
              {getFieldDecorator('userType')(
                <Select placeholder="请选择角色" style={{ width: 180 }} allowClear>
                  {roles.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.roleName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            {/* {unitTypeChecked &&
              unitTypeChecked === GOV && (
                <FormItem label="用户角色">
                  {getFieldDecorator('userType')(
                    <Select placeholder="请选择用户角色" style={{ width: 152 }} allowClear>
                      {gavUserTypes.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              )} */}
          </Col>

          {/* 按钮 */}
          <Col span={6}>
            <FormItem style={{ float: 'right' }}>
              <AuthButton
                code={codesMap.account.add}
                type="primary"
                href="#/role-authorization/account-management/add"
              >
                新增
              </AuthButton>
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
      user: { currentUser: { unitId, userId, unitType } },
      account: { list },
    } = this.props;

    const filteredList = getListByUnitId(list, unitType, unitId, userId);

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="loginId"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={filteredList}
          renderItem={item => {
            const { loginId, loginName, status } = item;
            const actions = [
              <AuthLink
                code={codesMap.account.detail}
                to={`/role-authorization/account-management/detail/${item.loginId}`}
              >
                查看
              </AuthLink>,
              <AuthLink
                code={codesMap.account.edit}
                to={`/role-authorization/account-management/edit/${item.loginId}`}
              >
                编辑
              </AuthLink>,
              <AuthLink
                code={codesMap.account.addAssociatedUnit}
                to={`/role-authorization/account-management/associated-unit/add/${
                  item.loginId
                }`}
              >
                关联单位
              </AuthLink>,
            ];

            if (unitId) // 有单位id则不能再关联其他单位
              actions.pop();

            return (
              <List.Item key={loginId}>
                <Card
                  title={loginName}
                  className={styles.card}
                  actions={actions}
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
                  <div>
                    <Row>
                      <Col span={12}>
                        <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                          姓名：
                          {item.userName || getEmptyData()}
                        </Ellipsis>
                      </Col>
                      <Col span={12}>
                        <p>电话: {item.phoneNumber || getEmptyData()}</p>
                      </Col>
                    </Row>
                    {item.users && item.users.length ? (
                      <Row>
                        <Col span={16}>
                          <Ellipsis tooltip lines={1} className={styles.ellipsisText} length={13}>
                            {unitTypeList[item.users[0].unitType]}
                            {item.users[0].unitName && `，${item.users[0].unitName}`}
                          </Ellipsis>
                        </Col>
                        <Col span={3}>
                          <AuthSpan
                            code={codesMap.account.editAssociatedUnit}
                            onClick={() => this.handleToEdit(item.users[0].id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Icon type="edit" />
                          </AuthSpan>
                        </Col>
                        <Col span={3}>
                          <Popconfirm
                            title={`确定要${
                              !!item.users[0].accountStatus ? '解绑' : '开启'
                            }关联企业吗？`}
                            onConfirm={() =>
                              this.handleAccountStatus({
                                accountStatus: Number(!item.users[0].accountStatus),
                                id: item.users[0].id,
                                users: item.users,
                                loginId: item.loginId,
                              })
                            }
                          >
                            <AuthSpan
                              code={codesMap.account.bindAssociatedUnit}
                              style={{ cursor: 'pointer' }}
                            >
                              {!!item.users[0].accountStatus ? (
                                <Icon type="link" />
                              ) : (
                                <Icon style={{ color: 'red' }} type="disconnect" />
                              )}
                            </AuthSpan>
                          </Popconfirm>
                        </Col>
                      </Row>
                    ) : (
                      <p>{getEmptyData()}</p>
                    )}
                    <p
                      onClick={() => this.handleViewMore(item.users, item.loginId)}
                      style={{
                        visibility: item.users && item.users.length > 1 ? 'visible' : 'hidden',
                      }}
                      className={styles.more}
                    >
                      更多...
                    </p>
                  </div>
                  {<div className={styles[statusList[status]]}>{statusLabelList[status]}</div>}
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  renderModal = () => {
    const { modalVisible, associatedUnits, currentLoginId } = this.state;
    const columns = [
      {
        title: '关联单位',
        key: 'unitName',
        dataIndex: 'unitName',
        align: 'center',
        width: '80%',
        render: (val, row) => {
          return val ? (
            <Fragment>
              <span>{val}</span>
            </Fragment>
          ) : (
            <Fragment>
              <span>运营企业</span>
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        key: '操作',
        dataIndex: '操作',
        align: 'center',
        render: (val, row) => {
          return (
            <Fragment>
              <AuthSpan
                code={codesMap.account.editAssociatedUnit}
                onClick={() => this.handleToEdit(row.id)}
                style={{ cursor: 'pointer' }}
              >
                <Icon type="edit" />
              </AuthSpan>
              <Divider type="vertical" />
              <Popconfirm
                title={`确定要${!!row.accountStatus ? '解绑' : '开启'}关联企业吗？`}
                onConfirm={() =>
                  this.handleAccountStatus({
                    accountStatus: Number(!row.accountStatus),
                    id: row.id,
                    users: associatedUnits,
                    loginId: currentLoginId,
                  })
                }
              >
                <AuthSpan code={codesMap.account.bindAssociatedUnit} style={{ cursor: 'pointer' }}>
                  {!!row.accountStatus ? (
                    <Icon type="link" />
                  ) : (
                    <Icon style={{ color: 'red' }} type="disconnect" />
                  )}
                </AuthSpan>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];
    const footer = (
      <Fragment>
        <Button onClick={this.handleModalClose}>关闭</Button>
      </Fragment>
    );

    return (
      <Modal
        title="关联单位"
        visible={modalVisible}
        onCancel={this.handleModalClose}
        footer={footer}
      >
        <Table
          bordered
          rowKey="id"
          columns={columns}
          dataSource={associatedUnits}
          pagination={false}
        />
      </Modal>
    );
  };

  render() {
    const {
      account: {
        data: {
          pagination: { total },
        },
        /*   list, */
        isLast,
      },
      loading,
    } = this.props;

    const content = (
      <div>
        <p>对账号进行增删改查，并对账号赋予角色，使得账号获得相关菜单、操作按钮以及数据权限等。</p>
        <p>
          账号总数：
          {total}
          {''}
        </p>
      </div>
    );

    return (
      <PageHeaderLayout title="账号管理" breadcrumbList={breadcrumbList} content={content}>
        {this.renderForm()}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={!isLast}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        >
          {this.renderList()}
        </InfiniteScroll>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
