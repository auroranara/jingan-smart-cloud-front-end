import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Input, BackTop, Spin, Row, Col, Select, AutoComplete, Icon, Modal, Table, Divider, Popconfirm, message } from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router'
import debounce from 'lodash/debounce';
import VisibilitySensor from 'react-visibility-sensor';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

import styles from './AccountManagementList.less';
import { AuthLink, AuthButton, AuthDiv } from 'utils/customAuth';
import codesMap from 'utils/codes';

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
    name: '账号管理',
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
const unitTypeList = {
  1: '维保企业',
  2: '政府机构',
  3: '运营企业',
  4: '企事业主体',
}

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
    goToDetail(url) {
      dispatch(routerRedux.push(url));
    },
    saveAccounts(action) {
      dispatch({
        type: 'account/saveAccounts',
        ...action,
      })
    },
    chnageAccountStatus(action) {
      dispatch({
        type: 'account/chnageAccountStatus',
        ...action,
      })
    },
  })
)
@Form.create()
export default class accountManagementList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
    this.state = {
      modalVisible: false,
      associatedUnits: [],
      currentLoginId: null,
    }
  }

  // 生命周期函数
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
    const {
      account: { isLast },
    } = this.props;
    if (!flag || isLast) {
      return;
    }
    const {
      appendfetch,
      account: { pageNum },
    } = this.props;
    // 请求数据
    appendfetch({
      payload: {
        pageSize,
        pageNum: pageNum + 1,
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

  // 查看更多关联企业
  handleViewMore = (users, loginId) => {
    this.setState({
      modalVisible: true,
      associatedUnits: users,
      currentLoginId: loginId,
    })
  }

  handleModalClose = () => {
    this.setState({
      modalVisible: false,
    })
  }

  // 跳转到编辑关联企业
  handleToEdit = (id) => {
    router.push(`/role-authorization/account-management/associated-unit/edit/${id}`)
  }

  // 解绑/开启安全企业
  handleAccountStatus = ({ accountStatus, id, users, loginId }) => {
    const { saveAccounts, chnageAccountStatus, account: { list } } = this.props
    const success = () => {
      const temp = users.map(item => (item.id === id ? { ...item, accountStatus } : item))
      const newList = list.map(item => (item.loginId === loginId ? { ...item, users: temp } : item))
      saveAccounts({
        payload: newList,
      })
      message.success(`${!!accountStatus ? '开启成功！' : '解绑成功！'}`)
      this.setState({
        associatedUnits: temp,
      })
    }
    const error = (msg) => {
      message.error(msg)
    }
    chnageAccountStatus({
      payload: {
        id,
        accountStatus,
      },
      success,
      error,
    })
  }

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
              {getFieldDecorator('userName', {
                getValueFromEvent: this.handleTrim,
              })(<Input placeholder="用户名/姓名/手机号" style={{ width: 180 }} />)}
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
                <AutoComplete
                  mode="combobox"
                  optionLabelProp="children"
                  placeholder="请选择所属单位"
                  notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                  onSearch={this.handleUnitIdChange}
                  filterOption={false}
                  style={{ width: 230 }}
                >
                  {unitIdes.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </AutoComplete>
              )}
            </FormItem>
          </Col>

          {/* 按钮 */}
          <Col span={6}>
            <FormItem style={{ float: 'right' }}>
              <AuthButton
                code={codesMap.account.add}
                type="primary"
                href="#/role-authorization/account-management/Add"
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
      account: { list },
      goToDetail,
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="loginId"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const { loginId, loginName, status } = item;
            return (
              <List.Item key={loginId}>
                <Card
                  title={loginName}
                  className={styles.card}
                  actions={[
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
                      to={`/role-authorization/account-management/associated-unit/add/${item.loginId}`}
                    >
                      关联单位
                  </AuthLink>,
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
                  <div>
                    <Col span={12}>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        姓名：
                        {item.userName || getEmptyData()}
                      </Ellipsis>
                    </Col>
                    <Col span={12}>
                      <p>电话: {item.phoneNumber || getEmptyData()}</p>
                    </Col>
                    {item.users && item.users.length ? (
                      <Row>
                        <Col span={16}>
                          <Ellipsis tooltip lines={1} className={styles.ellipsisText} length={13}>
                            {unitTypeList[item.users[0].unitType]}
                            {item.users[0].unitName && `，${item.users[0].unitName}`}
                          </Ellipsis>
                        </Col>
                        <Col span={3}>
                          <Icon onClick={() => this.handleToEdit(item.users[0].id)} className={styles['unit-edit-icon']} type="edit" />
                        </Col>
                        <Col span={3}>
                          <Popconfirm
                            title={`确定要${!!item.users[0].accountStatus ? '解绑' : '开启'}关联企业吗？`}
                            onConfirm={() => this.handleAccountStatus({ accountStatus: Number(!item.users[0].accountStatus), id: item.users[0].id, users: item.users, loginId: item.loginId })}
                          >
                            {!!item.users[0].accountStatus
                              ? (<Icon className={styles['unit-edit-icon']} type="link" />)
                              : (<Icon className={styles['unit-status-icon']} type="disconnect" />)}
                          </Popconfirm>
                        </Col>
                      </Row>) : (<p>{getEmptyData()}</p>)}
                    <p
                      onClick={() => this.handleViewMore(item.users, item.loginId)}
                      style={{ visibility: item.users && item.users.length > 1 ? 'visible' : 'hidden' }}
                      className={styles.more}>
                      更多...
                    </p>
                  </div>
                  {
                    <div className={styles[statusList[status]]}>
                      {statusLabelList[status]}
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

  renderModal = () => {
    const { modalVisible, associatedUnits, currentLoginId } = this.state
    const columns = [
      {
        title: '关联单位',
        key: 'unitName',
        dataIndex: 'unitName',
        align: 'center',
        render: (val, row) => {
          return val ? (
            <Fragment><span>{val}</span></Fragment>
          ) : (
              <Fragment><span>运营企业</span></Fragment>
            )
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
              <Icon onClick={() => this.handleToEdit(row.id)} className={styles['unit-edit-icon']} type="edit" />
              <Divider type="vertical" />
              <Popconfirm
                title={`确定要${!!row.accountStatus ? '解绑' : '开启'}关联企业吗？`}
                onConfirm={() => this.handleAccountStatus({ accountStatus: Number(!row.accountStatus), id: row.id, users: associatedUnits, loginId: currentLoginId })}
              >
                {!!row.accountStatus
                  ? (<Icon className={styles['unit-edit-icon']} type="link" />)
                  : (<Icon className={styles['unit-status-icon']} type="disconnect" />)}
              </Popconfirm>
            </Fragment>
          )
        },
      },
    ]
    const footer = (
      <Fragment>
        <Button onClick={this.handleModalClose}>关闭</Button>
      </Fragment>
    )

    return (
      <Modal
        title="关联单位"
        visible={modalVisible}
        onCancel={this.handleModalClose}
        footer={footer}
      >
        <Table bordered rowKey="id" columns={columns} dataSource={associatedUnits} pagination={false}></Table>
      </Modal>
    )
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
        {this.renderModal()}
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
