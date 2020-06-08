import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  List,
  Card,
  Button,
  Input,
  Spin,
  Row,
  Col,
  Select,
  AutoComplete,
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
import { getListByUnitId, getScreenList, getUserPath } from './utils';
import { MAI, GOV, OPE, COM } from '@/pages/RoleAuthorization/Role/utils';

const { TreeNode } = TreeSelect;
const { Option } = Select;

const title = '账号管理'; // 标题
const breadcrumbList = [
  // 面包屑
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
  3: '平台管理',
  4: '社会单位',
};

const defaultSpan = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

/* 获取root下的div */
const getRootChild = () => document.querySelector('#root>div');

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ account, user, loading, hiddenDangerReport }) => ({
    account,
    user,
    hiddenDangerReport,
    loading: loading.models.account,
    screenListLoading:
      loading.effects['account/fetchAssociatedUnitDetail'] ||
      loading.effects['account/fetchRoles'] ||
      loading.effects['role/fetchRolePermissions'],
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
    fetchGridList(action) {
      dispatch({ type: 'hiddenDangerReport/fetchGridList', ...action });
    },
    fetchAllGridList(action) {
      dispatch({ type: 'hiddenDangerReport/fetchAllGridList', ...action });
    },
    dispatch,
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
      screenList: [],
      screenVisible: false,
      user: {}, // 选择登录大屏时选中的用户id
      screenCode: undefined, // 选择的登录大屏code
    };
  }

  // 生命周期函数
  componentDidMount() {
    const { fetchOptions, fetchUserType, clearRoles, clearUnits, fetchUnitsFuzzy } = this.props;

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

  isUnitUser() {
    // 是否是非运营的单位用户
    const {
      user: {
        currentUser: { unitId, unitType },
      },
    } = this.props;
    return unitId && +unitType !== OPE;
  }

  getInitValues = () => {
    const {
      fetch,
      fetchUnitsFuzzy,
      fetchRoles,
      fetchGridList,
      fetchAllGridList,
      account: { searchInfo },
      form: { setFieldsValue },
      user: {
        currentUser: { unitId, unitType },
      },
    } = this.props;

    const isUnitUser = this.isUnitUser(); // 是否非运营
    let selectedUnitType;
    let listPayload;
    if (isUnitUser) {
      fetchRoles({ payload: { unitType, companyId: unitId } });
      listPayload = { pageSize, pageNum: 1, unitId };
    } else {
      if (searchInfo)
        // 上次缓存在model里的筛选条件
        selectedUnitType = searchInfo.unitType;

      // 如果有搜索条件，则填入并所属单位和账号列表
      if (searchInfo) {
        const { unitId, ...other } = searchInfo;
        let key;
        if (selectedUnitType === GOV) {
          key = unitId || undefined;
          fetchUnitsFuzzy({
            payload: { unitType: GOV },
          });
        } else {
          key = unitId ? unitId.key : undefined;
          fetchUnitsFuzzy({
            payload: {
              unitType: selectedUnitType,
              pageNum: 1,
              pageSize: defaultPageSize,
            },
          });
        }
        listPayload = { pageSize, pageNum: 1, unitId: key || null, ...other };
        if (selectedUnitType)
          fetchRoles({ payload: { unitType: selectedUnitType, companyId: key } });
      } else {
        // 最初没有选择任何条件的状态
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
    // 获取网格列表
    selectedUnitType === GOV && fetchGridList();
    unitType === GOV && fetchAllGridList();
    this.setState({ unitTypeChecked: selectedUnitType }, () => {
      searchInfo && setFieldsValue(searchInfo);
    });
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
      user: {
        currentUser: { unitId },
      },
    } = this.props;

    const isUnitUser = this.isUnitUser();
    const data = getFieldsValue();
    const { unitId: { key } = {}, ...other } = data;
    if (isUnitUser) other.unitId = unitId;
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
      clearRoles,
      fetchUnitsFuzzy,
      saveSearchInfo,
      form: { resetFields, getFieldValue },
      user: {
        currentUser: { unitId, unitType },
      },
    } = this.props;
    const isUnitUser = this.isUnitUser();
    const payload = { pageSize, pageNum: 1 };
    if (+unitType === OPE) clearRoles();
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
      fetchGridList,
      fetchRoles,
      clearRoles,
      fetchUnitsFuzzy,
      form: { setFieldsValue },
    } = this.props;

    setFieldsValue({ unitId: undefined, roleId: undefined });
    this.setState({ unitTypeChecked: value });

    if (value !== undefined && value !== null) fetchRoles({ payload: { unitType: value } });
    else clearRoles();

    // 根据当前选中的单位类型获取对应的所属单位列表
    if (value === GOV) {
      fetchUnitsFuzzy({
        payload: {
          unitType: value,
        },
      });
      // 获取网格列表
      fetchGridList();
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
    const {
      fetchRoles,
      clearRoles,
      account: { unitIds },
      form: { setFieldsValue },
    } = this.props;
    const { unitTypeChecked } = this.state;

    setFieldsValue({ roleId: undefined });
    if (!unitTypeChecked && !value) clearRoles();
    else if (!unitTypeChecked && value) {
      const target = unitIds.find(({ id }) => id === value.key);
      fetchRoles({ payload: { unitType: target.type, companyId: value.key } });
    } else fetchRoles({ payload: { unitType: unitTypeChecked, companyId: value.key } });
  };

  handleUnitChange = value => {
    const {
      fetchRoles,
      clearRoles,
      form: { setFieldsValue },
    } = this.props;
    const { unitTypeChecked } = this.state;
    if (!unitTypeChecked && !value) {
      clearRoles();
      setFieldsValue({ roleId: undefined });
    } else if (unitTypeChecked && !value) {
      setFieldsValue({ roleId: undefined });
      fetchRoles({ payload: { unitType: unitTypeChecked } });
    }
  };

  handleGovChange = value => {
    const {
      fetchRoles,
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ roleId: undefined });
    fetchRoles({ payload: { unitType: GOV, companyId: value } });
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

  generateTreeNode = data => {
    return data.map(item => {
      if (item.child && item.child.length) {
        return (
          <TreeNode title={item.name} key={item.id} value={item.id}>
            {this.generateTreeNode(item.child)}
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
      hiddenDangerReport: { gridList },
      loading,
      user: {
        currentUser: { unitType },
      },
    } = this.props;

    const isUnitUser = this.isUnitUser(); // 单位用户且不为运营
    const { unitTypeChecked } = this.state;

    console.log(unitIds);

    return (
      <Card>
        <Form className={styles.form}>
          <Row gutter={16}>
            <Col {...defaultSpan}>
              <FormItem label="用户">
                {getFieldDecorator('userName', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="用户名/姓名/手机号" />)}
              </FormItem>
            </Col>

            {!isUnitUser && (
              <Col {...defaultSpan}>
                <FormItem label="单位类型">
                  {getFieldDecorator('unitType', {})(
                    <Select
                      placeholder="请选择单位类型"
                      allowClear
                      onChange={this.handleUnitTypeChange}
                      // style={{ width: 180 }}
                    >
                      {unitTypes.map(item => (
                        <Option value={item.id} key={item.id}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            )}
            {!isUnitUser &&
              unitTypeChecked !== GOV && (
                <Col {...defaultSpan}>
                  <FormItem label="所属单位">
                    {getFieldDecorator('unitId', {
                      rules: [
                        {
                          whitespace: true,
                          transform: value => value && value.label,
                        },
                      ],
                    })(
                      // <AutoComplete
                      //   allowClear
                      //   labelInValue
                      //   mode="combobox"
                      //   optionLabelProp="children"
                      //   placeholder="请选择所属单位"
                      //   notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                      //   onChange={this.handleUnitChange}
                      //   onSelect={this.handleUnitSelect}
                      //   onSearch={this.handleUnitSearch}
                      //   onBlur={this.handleUnitIdBlur}
                      //   filterOption={false}
                      //   style={{ width: 230 }}
                      // >
                      //   {unitIds.map(item => (
                      //     <Option value={item.id} key={item.id}>
                      //       {item.name}
                      //     </Option>
                      //   ))}
                      // </AutoComplete>
                      <Select
                        allowClear
                        showSearch
                        labelInValue
                        showArrow={false}
                        filterOption={false}
                        placeholder="请选择所属单位"
                        notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                        onChange={this.handleUnitChange}
                        onSelect={this.handleUnitSelect}
                        onSearch={this.handleUnitSearch}
                        // onBlur={this.handleUnitIdBlur}
                        // style={{ width: 230 }}
                      >
                        {unitIds.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              )}
            {!isUnitUser &&
              unitTypeChecked === GOV && (
                <Col {...defaultSpan}>
                  <FormItem label="所属单位">
                    {getFieldDecorator('unitId')(
                      <TreeSelect
                        allowClear
                        placeholder="请选择所属单位"
                        onChange={this.handleGovChange}
                        // style={{ width: 230 }}
                      >
                        {this.generateTreeNode(unitIds)}
                      </TreeSelect>
                    )}
                  </FormItem>
                </Col>
              )}
            <Col {...defaultSpan}>
              <FormItem label="角色">
                {getFieldDecorator('roleId')(
                  <Select placeholder="请选择角色" allowClear>
                    {roles.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.roleName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            {(unitTypeChecked === GOV || unitType === GOV) && (
              <Col {...defaultSpan}>
                <FormItem label="所属网格">
                  {getFieldDecorator('gridId')(
                    <TreeSelect
                      treeData={gridList}
                      placeholder="请选择"
                      getPopupContainer={getRootChild}
                      allowClear
                      dropdownStyle={{
                        maxHeight: '50vh',
                        zIndex: 50,
                      }}
                      // style={{ width: 180 }}
                    />
                  )}
                </FormItem>
              </Col>
            )}
            {/* 按钮 */}
            <Col {...defaultSpan}>
              <FormItem>
                <Button type="primary" onClick={this.handleClickToQuery} className={styles.btn}>
                  查询
                </Button>
                <Button onClick={this.handleClickToReset} className={styles.btn}>
                  重置
                </Button>
                <AuthButton
                  code={codesMap.account.add}
                  type="primary"
                  href="#/role-authorization/account-management/add"
                >
                  新增
                </AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      user: {
        currentUser: { unitId, userId, unitType },
      },
      account: { list },
    } = this.props;

    const filteredList = getListByUnitId(list, unitType, unitId);

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="loginId"
          grid={{ gutter: 24, column: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={filteredList}
          renderItem={item => {
            const { loginId, loginName, userName, phoneNumber, isBindWechat, status, users } = item;
            const isUsersExist = Array.isArray(users) && users.length;
            let isSelf = false;
            if (isUsersExist) {
              const ids = users.map(({ id }) => id);
              isSelf = ids.includes(userId);
            }
            const actions = [
              <AuthLink
                code={codesMap.account.detail}
                to={`/role-authorization/account-management/detail/${loginId}`}
                target="_blank"
              >
                查看
              </AuthLink>,
              <AuthLink
                code={codesMap.account.edit}
                // code={isSelf ? 'codeNotExist' : codesMap.account.edit}
                to={`/role-authorization/account-management/edit/${loginId}`}
                target="_blank"
              >
                编辑
              </AuthLink>,
              <AuthLink
                code={codesMap.account.addAssociatedUnit}
                to={`/role-authorization/account-management/associated-unit/add/${loginId}`}
                target="_blank"
              >
                关联单位
              </AuthLink>,
            ];

            if (unitId)
              // 有单位id则不能再关联其他单位
              actions.pop();

            return (
              <List.Item key={loginId}>
                <Card
                  title={
                    <div>
                      <span>{loginName}</span>
                      {!!isBindWechat && (
                        <span style={{ paddingLeft: 10 }}>
                          <span>{<LegacyIcon type="wechat" />}</span>
                          <span style={{ paddingLeft: 6 }}>{<LegacyIcon type="mobile" />}</span>
                        </span>
                      )}
                    </div>
                  }
                  className={styles.card}
                  actions={actions}
                >
                  <div>
                    <Row>
                      <Col span={12}>
                        <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                          姓名：
                          {userName || getEmptyData()}
                        </Ellipsis>
                      </Col>
                      <Col span={12}>
                        <p>电话: {phoneNumber || getEmptyData()}</p>
                      </Col>
                    </Row>
                    {isUsersExist ? (
                      <Row>
                        <Col span={16}>
                          <Ellipsis tooltip lines={1} className={styles.ellipsisText} length={13}>
                            {unitTypeList[users[0].unitType]}
                            {users[0].unitName && `，${users[0].unitName}`}
                          </Ellipsis>
                        </Col>
                        <Col span={3}>
                          <AuthSpan
                            code={codesMap.account.editAssociatedUnit}
                            onClick={() => this.handleToEdit(users[0].id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <LegacyIcon type="edit" />
                          </AuthSpan>
                        </Col>
                        {users[0].id !== userId && (
                          <Col span={3}>
                            <Popconfirm
                              title={`确定要${
                                !!users[0].accountStatus ? '解绑' : '开启'
                              }关联企业吗？`}
                              onConfirm={() =>
                                this.handleAccountStatus({
                                  accountStatus: Number(!users[0].accountStatus),
                                  id: users[0].id,
                                  users: users,
                                  loginId: loginId,
                                })
                              }
                            >
                              <AuthSpan
                                code={codesMap.account.bindAssociatedUnit}
                                style={{ cursor: 'pointer' }}
                              >
                                {!!users[0].accountStatus ? (
                                  <LegacyIcon type="link" />
                                ) : (
                                  <LegacyIcon style={{ color: 'red' }} type="disconnect" />
                                )}
                              </AuthSpan>
                            </Popconfirm>
                          </Col>
                        )}
                        <Col span={2}>
                          <LegacyIcon
                            type="login"
                            onClick={this.genHandleScreenModalOpen(users[0])}
                          />
                        </Col>
                      </Row>
                    ) : (
                      <p>{getEmptyData()}</p>
                    )}
                    <p
                      onClick={() => this.handleViewMore(users, loginId)}
                      style={{
                        visibility: users && users.length > 1 ? 'visible' : 'hidden',
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
    const {
      user: {
        currentUser: { userId },
      },
    } = this.props;
    const { modalVisible, associatedUnits, currentLoginId } = this.state;
    const columns = [
      {
        title: '关联单位',
        key: 'unitName',
        dataIndex: 'unitName',
        align: 'center',
        width: '75%',
        render: (val, row) => {
          return val ? (
            <Fragment>
              <span>{val}</span>
            </Fragment>
          ) : (
            <Fragment>
              <span>平台管理</span>
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
                <LegacyIcon type="edit" />
              </AuthSpan>
              {row.id !== userId && (
                <Fragment>
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
                    <AuthSpan
                      code={codesMap.account.bindAssociatedUnit}
                      style={{ cursor: 'pointer' }}
                    >
                      {!!row.accountStatus ? (
                        <LegacyIcon type="link" />
                      ) : (
                        <LegacyIcon style={{ color: 'red' }} type="disconnect" />
                      )}
                    </AuthSpan>
                  </Popconfirm>
                </Fragment>
              )}
              <Divider type="vertical" />
              <LegacyIcon type="login" onClick={this.genHandleScreenModalOpen(row)} />
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

  genHandleScreenModalOpen = user => e => {
    const { id } = user;
    this.setScreenList(id);
    this.setState({ screenVisible: true, user });
    this.getDashboard(id);
  };

  getDashboard(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchDashboard',
      payload: { key: id },
      callback: list => {
        if (list.length) this.setState({ screenCode: list[0].code });
      },
    });
  }

  setScreenList(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchAssociatedUnitDetail', // 获取账号详情(单位类型，单位id，对应角色id，额外权限id列表)
      payload: { userId: id },
      success: ({ unitType, unitId, roleId, permissions: extraPermissions }) => {
        dispatch({
          type: 'account/fetchRoles', // 获取当前单位对应的角色列表及完整的权限树
          payload: { unitType, companyId: unitId },
          success: (list, trees) => {
            const webPermissions = trees.webPermissions || [];
            dispatch({
              type: 'role/fetchRolePermissions', // 获取所选角色对应的权限id列表
              payload: { id: roleId },
              success: permissions => {
                this.setState({
                  screenList: getScreenList(webPermissions, permissions, extraPermissions),
                });
              },
            });
          },
        });
      },
    });
  }

  handleScreenModalClose = () => {
    this.setState({ screenVisible: false, user: {}, screenCode: undefined });
  };

  handleScreenModalOk = () => {
    const { dispatch } = this.props;
    const { user, screenCode } = this.state;
    const { id } = user;
    this.handleScreenModalClose();
    // const path = getUserPath(screenCode, user);
    dispatch({
      type: 'account/setDashboard',
      payload: {
        id,
        code: screenCode,
        // path: path,
      },
    });
  };

  handleScreenSelectChange = v => {
    this.setState({ screenCode: v });
  };

  renderScreenModal = () => {
    const { screenListLoading } = this.props;
    const { screenCode, screenList, screenVisible } = this.state;

    return (
      <Modal
        title="登录首页面设置"
        zIndex={1001}
        visible={screenVisible}
        onOk={this.handleScreenModalOk}
        onCancel={this.handleScreenModalClose}
      >
        <Select
          allowClear
          value={screenCode}
          loading={screenListLoading}
          disabled={screenListLoading}
          placeholder="请选择登陆首页面"
          className={styles.screenModal}
          onChange={this.handleScreenSelectChange}
        >
          {screenList.map(({ id, code, showZname }) => (
            <Option value={code} key={id}>
              {showZname.slice(2)}
            </Option>
          ))}
        </Select>
      </Modal>
    );
  };

  render() {
    const {
      account: {
        data: {
          pagination: { total },
        },
        isLast,
      },
      loading,
    } = this.props;

    const content = (
      <div>
        <p className={styles.desc}>
          账号总数：
          {total}
        </p>
        <p className={styles.desc}>
          对账号进行增删改查，关联单位，并对账号赋予角色，使得账号获得相关菜单、操作按钮以及数据权限等
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
        {this.renderScreenModal()}
      </PageHeaderLayout>
    );
  }
}
