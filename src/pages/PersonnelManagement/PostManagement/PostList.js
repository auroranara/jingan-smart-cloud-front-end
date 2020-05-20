import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  List,
  Card,
  Button,
  Table,
  Spin,
  Col,
  Row,
  Input,
  Popconfirm,
  Select,
  message,
  Pagination,
  Divider,
} from 'antd';
import { Link } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import { routerRedux } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import styles from './PostList.less';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import moment from 'moment';

const { Option } = Select;
const FormItem = Form.Item;

// 权限代码
const {
  personnelManagement: {
    postManagement: { add: addCode, edit: editCode, detail: detailCode, delete: deleteCode },
  },
} = codes;

// 默认页面显示数量
const pageSize = 10;

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
const NODATA = '--';

@connect(({ postManagement, user, loading }) => ({
  postManagement,
  user,
  loading: loading.models.postManagement,
}))
@Form.create()
export default class PersonnelList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.pageNum = 1;
    this.pageSize = 10;
  }

  // 挂载后
  componentDidMount() {
    this.fetchList();
  }

  // 查询
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const payload = {
      ...getFieldsValue(),
    };
    // 重新请求数据
    dispatch({
      type: 'postManagement/fetchPostList',
      payload: {
        companyId,
        pageSize: this.pageSize,
        pageNum: 1,
        ...payload,
      },
    });
  };

  // 重置
  handleClickToReset = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 重新请求数据
    this.pageNum = 1;
    dispatch({
      type: 'postManagement/fetchPostList',
      payload: {
        companyId,
        pageSize: this.pageSize,
        pageNum: 1,
      },
    });
  };

  fetchList = (pageNum = 1, pageSize = 10, filters = {}) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'postManagement/fetchPostList',
      payload: {
        companyId,
        pageSize,
        pageNum,
        ...filters,
      },
    });
  };

  // 表格改变触发，包含分页变动
  handleTableChange = (pageNum, pageSize) => {
    const {
      form: { getFieldsValue },
    } = this.props;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...getFieldsValue() });
  };

  // 新增
  handleClickAdd = () => {
    const {
      match: {
        params: { unitId },
      },
      dispatch,
    } = this.props;
    dispatch(routerRedux.push(`/personnel-management/post-management/${unitId}/add`));
  };

  // 编辑
  handleClickEdit = id => {
    const {
      match: {
        params: { unitId },
      },
      dispatch,
    } = this.props;
    dispatch(routerRedux.push(`/personnel-management/post-management/${unitId}/edit/${id}`));
  };

  // 删除
  handleCardDelete = id => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    dispatch({
      type: 'postManagement/fetchPostDelete',
      payload: { id },
      success: () => {
        // 获取列表
        this.fetchList(this.pageNum, this.pageSize, getFieldsValue());
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };
  // 渲染form表单
  renderForm() {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    // 添加权限
    const addAuth = hasAuthority(addCode, permissionCodes);

    return (
      <Card className={styles.formCard}>
        <Form>
          <Row gutter={30}>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('jobName')(<Input placeholder="请输入岗位名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('jobSite')(<Input placeholder="请输入岗位地点" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button type="primary" onClick={this.handleClickToQuery}>
                  查询
                </Button>
                <Button onClick={this.handleClickToReset} style={{ marginLeft: '15px' }}>
                  重置
                </Button>
                <Button
                  disabled={!addAuth}
                  type="primary"
                  onClick={this.handleClickAdd}
                  style={{ marginLeft: '15px' }}
                >
                  新增
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  render() {
    const {
      loading,
      postManagement: {
        postData: {
          pagination: { total, pageSize, pageNum },
          list = [],
        },
      },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const title = '岗位信息列表';
    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '人员在岗在位管理',
        name: '人员在岗在位管理',
      },
      ...(unitType === 4
        ? []
        : [
            {
              title: '企业列表',
              name: '企业列表',
              href: '/personnel-management/post-management/company-list',
            },
          ]),
      {
        title,
        name: '岗位信息列表',
      },
    ];

    const columns = [
      {
        title: '岗位名称',
        dataIndex: 'jobName',
        key: 'jobName',
        align: 'center',
        width: 200,
      },
      {
        title: '岗位地点',
        dataIndex: 'jobSite',
        key: 'jobSite',
        align: 'center',
        width: 300,
        render: val => val || NODATA,
      },
      {
        title: '岗位时间',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
        width: 200,
        render: (val, row) => {
          const { startTime, endTime } = row;
          return startTime && endTime
            ? moment(startTime).format('HH:mm') + '~' + moment(endTime).format('HH:mm')
            : NODATA;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 160,
        render: (data, record) => (
          <span>
            {/* <AuthA code={detailCode} onClick={() => this.goDetail(record.id)}>
              查看
            </AuthA>
            <Divider type="vertical" /> */}
            <AuthA code={editCode} onClick={() => this.handleClickEdit(record.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该岗位吗？"
              onConfirm={() => this.handleCardDelete(record.id)}
            >
              <AuthA code={deleteCode}>删除</AuthA>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            岗位总数：
            {total}
          </div>
        }
      >
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={false}
              // scroll={{ x: 'max-content' }}
            />
            <Pagination
              style={{ marginTop: '20px', float: 'right' }}
              showQuickJumper
              showSizeChanger
              // pageSizeOptions={['5', '10', '15', '20']}
              pageSize={pageSize}
              current={pageNum}
              total={total}
              onChange={this.handleTableChange}
              onShowSizeChange={this.handleTableChange}
              // showTotal={total => `共 ${total} 条`}
            />
          </Card>
        ) : (
          <Spin spinning={loading}>
            <Card style={{ marginTop: '20px', textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          </Spin>
        )}
      </PageHeaderLayout>
    );
  }
}
