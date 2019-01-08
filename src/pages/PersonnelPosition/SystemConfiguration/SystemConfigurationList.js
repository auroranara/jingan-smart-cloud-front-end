import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import {
  Card,
  Button,
  Input,
  Form,
  Row,
  Col,
  List,
  Spin,
  Popconfirm,
  Modal,
  message,
  Table,
  Divider,
} from 'antd';
// import Ellipsis from '@/components/Ellipsis';
// import { Link } from 'dva/router';
// import InfiniteScroll from 'react-infinite-scroller';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import codes from '@/utils/codes';
import styles from './SystemConfigurationList.less';

// const ListItem = List.Item;
const FormItem = Form.Item;

const title = '系统配置';
// 默认页大小
const defaultPageSize = 10;

const {
  personnelPosition: {
    systemConfiguration: { add: addCode, edit: editCode, delete: deleteCode },
  },
} = codes;

// 获取无数据
/* const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
}; */

@connect(({ user, personnelPosition, loading }) => ({
  user,
  personnelPosition,
  listLoading: loading.effects['personnelPosition/fetchSystemConfiguration'],
  companyLoading: loading.effects['personnelPosition/fetchCompanyList'],
}))
@Form.create()
// 系统配置
export default class SystemConfiguration extends PureComponent {
  state = {
    modalVisible: false, // 添加或编辑弹窗可见
    isAdd: true, // 是否编辑
    companyVisible: false, // 选择企业可见
    currentId: null, // 当前编辑的系统配置id
  };

  componentDidMount() {
    // 获取列表
    this.fetchList({ payload: { pageNum: 1, pageSize: defaultPageSize } });
  }

  // 获取系统配置列表
  fetchList = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchSystemConfiguration',
      ...actions,
    });
  };

  // 获取企业列表
  fetchCompanyList = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchCompanyList',
      ...actions,
    });
  };

  handleToAdd = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['company', 'sysName', 'sysKey']);
    this.setState({
      isAdd: true,
      modalVisible: true,
    });
  };

  // 点击编辑
  handleToEdit = ({ companyId, companyName, sysKey, sysName, id }) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      company: { id: companyId, name: companyName },
      sysKey,
      sysName,
    });
    this.setState({
      isAdd: false,
      modalVisible: true,
      currentId: id,
    });
  };

  // 点击删除
  handleToDelete = ({ id }) => {
    const {
      dispatch,
      personnelPosition: {
        systemConfiguration: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    dispatch({
      type: 'personnelPosition/deleteSystemConfiguration',
      payload: { id },
      success: () => {
        message.success('删除成功');
        this.fetchList({ payload: { pageNum: 1, pageSize } });
      },
      error: () => {
        message.error('删除失败');
      },
    });
  };

  // 加载更多列表数据
  /* handleLoadMore = () => {
    const {
      personnelPosition: {
        systemConfiguration: {
          pagination: { pageNum, pageSize },
        },
      },
    } = this.props
    this.fetchList({
      payload: {
        pageNum: pageNum + 1,
        pageSize,
      },
    })
  } */

  // 处理翻页和每页数量变化
  handlePageChange = (pageNum, pageSize) => {
    this.fetchList({
      payload: {
        pageNum,
        pageSize,
      },
    });
  };

  // 点击搜索
  handleQuery = () => {
    const {
      form: { getFieldValue },
      personnelPosition: {
        systemConfiguration: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    const value = getFieldValue('searchName');
    this.fetchList({
      payload: {
        pageNum: 1,
        pageSize,
        companyName: value || null,
      },
    });
  };

  // 点击重置
  handleResetQuery = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['searchName']);
    this.fetchList({
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
      },
    });
  };

  // 选择企业
  handleSelectCompany = company => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ companyVisible: false });
    setFieldsValue({ company });
  };

  // 关闭选择企业弹窗
  handleCompanyModalCLose = () => {
    this.setState({
      companyVisible: false,
    });
  };

  // 点击打开选择企业弹窗
  handleViewCompanyModal = () => {
    this.fetchCompanyList({
      payload: { pageNum: 1, pageSize: defaultPageSize },
      callback: () => {
        this.setState({ companyVisible: true });
      },
    });
  };

  // 点击关闭添加（编辑）弹窗
  handleCloseModal = () => {
    this.setState({ modalVisible: false, companyVisible: false });
  };

  // 点击确认提交（添加、编辑）
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      personnelPosition: {
        systemConfiguration: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    const { isAdd, currentId } = this.state;

    const success = () => {
      message.success(isAdd ? '新增成功' : '编辑成功');
      this.setState({ modalVisible: false, companyVisible: false });
      this.fetchList({ payload: { pageNum: 1, pageSize } });
    };
    const error = () => {
      message.error(isAdd ? '新增失败' : '编辑失败');
      this.setState({ modalVisible: false, companyVisible: false });
    };
    validateFields((err, values) => {
      if (err) return;
      // 筛选掉搜索栏的数据
      const { searchName, company, ...others } = values;
      const payload = { ...others, companyId: company.id };
      // 新增
      if (isAdd) {
        dispatch({
          type: 'personnelPosition/addSystemConfiguration',
          payload,
          success,
          error,
        });
      } else {
        dispatch({
          type: 'personnelPosition/editSystemConfiguration',
          payload: { ...payload, id: currentId },
          success,
          error,
        });
      }
    });
  };

  validateCompany = (rule, value, callback) => {
    if (value && value.id) {
      callback();
    } else callback('请选择企业');
  };

  render() {
    const {
      listLoading,
      companyLoading,
      form: { getFieldDecorator, getFieldValue },
      user: {
        currentUser: { permissionCodes },
      },
      personnelPosition: {
        systemConfiguration: {
          list = [],
          isLast,
          companyList = [],
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props;
    const { modalVisible, isAdd, companyVisible } = this.state;

    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { title, name: title },
    ];
    const company = getFieldValue('company') || {};

    // 权限
    const addAuth = hasAuthority(addCode, permissionCodes);
    // const editAuth = hasAuthority(editCode, permissionCodes)
    const deleteAuth = hasAuthority(deleteCode, permissionCodes);

    const columns = [
      {
        title: '企业名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
      },
      {
        title: '系统名称',
        dataIndex: 'sysName',
        key: 'sysName',
        align: 'center',
      },
      {
        title: '注册号',
        dataIndex: 'sysKey',
        key: 'sysKey',
        align: 'center',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <span>
            <AuthA code={editCode} onClick={() => this.handleToEdit(row)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            {deleteAuth ? (
              <Popconfirm
                title="确认要删除该系统配置吗？"
                onConfirm={() => this.handleToDelete(row)}
              >
                <a>删除</a>
              </Popconfirm>
            ) : (
              <a className={styles.disabled}>删除</a>
            )}
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {/* 删选栏 */}
        <Card>
          <Form>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24} xs={24}>
                <FormItem style={{ margin: '0', padding: '4px 0' }}>
                  {getFieldDecorator('searchName')(<Input placeholder="请输入企业名称" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24} xs={24}>
                <FormItem style={{ margin: '0', padding: '4px 0' }}>
                  <Button type="primary" onClick={this.handleQuery}>
                    查询
                  </Button>
                  <Button onClick={this.handleResetQuery} style={{ marginLeft: '10px' }}>
                    重置
                  </Button>
                  <Button
                    type="primary"
                    disabled={!addAuth}
                    onClick={this.handleToAdd}
                    style={{ marginLeft: '10px' }}
                  >
                    新增
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        {/* 表格 */}
        <Card className={styles.systemConfigurationList}>
          <Table
            rowKey="id"
            loading={listLoading}
            columns={columns}
            dataSource={list}
            bordered
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handlePageChange,
              onShowSizeChange: (num, size) => {
                this.handlePageChange(1, size);
              },
            }}
          />
        </Card>
        {/* 添加和编辑弹窗 */}
        <Modal
          title={isAdd ? '新增系统配置' : '编辑系统配置'}
          visible={modalVisible}
          onCancel={this.handleCloseModal}
          onOk={this.handleSubmit}
        >
          <Form>
            <FormItem label="企业名称">
              {getFieldDecorator('company', {
                rules: [{ required: true, validator: this.validateCompany }],
              })(
                <Fragment>
                  <Input
                    disabled
                    style={{ width: '375px' }}
                    placeholder={'请选择单位'}
                    value={company.name}
                  />
                  <Button
                    type="primary"
                    style={{ marginLeft: '5px' }}
                    onClick={this.handleViewCompanyModal}
                  >
                    选择单位
                  </Button>
                </Fragment>
              )}
            </FormItem>
            <FormItem label="系统名称">
              {getFieldDecorator('sysName', {
                getValueFromEvent: e => e.target.value.trim(),
                rules: [{ required: true, whitespace: true, message: '请输入系统名称' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="注册号">
              {getFieldDecorator('sysKey', {
                getValueFromEvent: e => e.target.value.trim(),
                rules: [{ required: true, whitespace: true, message: '请输入注册号' }],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
        {/* 选择企业弹窗 */}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyVisible}
          modal={companyList}
          fetch={this.fetchCompanyList}
          onSelect={this.handleSelectCompany}
          onClose={this.handleCompanyModalCLose}
        />
      </PageHeaderLayout>
    );
  }
}
