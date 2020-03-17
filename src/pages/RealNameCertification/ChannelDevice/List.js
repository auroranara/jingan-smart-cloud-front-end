import React, { Component, Fragment } from 'react';
import {
  Button,
  Input,
  Card,
  Table,
  Divider,
  Form,
  Row,
  Col,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { connect } from 'dva';
import router from 'umi/router';
import codes from '@/utils/codes'
import { AuthPopConfirm, AuthA, AuthButton } from '@/utils/customAuth';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';

export const LIST_PATH = '/real-name-certification/channelDevice/list';
export const ADD_PATH = '/real-name-certification/channelDevice/add'
// 到期状态
export const EXPIRE_STATUSES = [
  { key: '0', value: '未到期' /* , color: '#52c41a' */ },
  { key: '1', value: '即将到期', color: '#faad14' },
  { key: '2', value: '已过期', color: '#f5222d' },
];
// 审核状态
export const STATUSES = [
  { key: '1', value: '待审核' },
  { key: '2', value: '审核通过待发布' },
  { key: '3', value: '审核不通过' },
  { key: '4', value: '审核通过已发布' },
];
export const DEFAULT_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_FORMAT2 = 'YYYY-MM-DD HH:mm:ss';

const FormItem = Form.Item;

const {
  realNameCertification: {
    channelDevice: {
      view: viewCode,
      add: addCode,
      edit: editCode,
      delete: deleteCode,
    },
  },
} = codes;

const TITLE = '通道设备';
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '实名制认证系统',
    name: '实名制认证系统',
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const defaultPageSize = 10;

const colWrapper = {
  md: 8,
  sm: 12,
};
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };

@connect(({ user, realNameCertification, resourceManagement, loading }) => ({
  user,
  realNameCertification,
  resourceManagement,
  companyLoading: loading.effects['resourceManagement/fetchCompanyList'],
}))
@Form.create()
export default class ChannelDeviceList extends Component {

  state = {
    company: {},
    visible: false,
  };

  componentDidMount () {
    const {
      user: { isCompany, currentUser: { companyId, companyName } },
      realNameCertification: { deviceSearchInfo: searchInfo = {} },
    } = this.props;
    if (isCompany) {
      this.setState({ company: { id: companyId, name: companyName } }, () => {
        this.handleQuery();
      })
    } else if (searchInfo.company && searchInfo.company.id) {
      // 如果redux中保存了单位
      this.setState({ company: searchInfo.company }, () => { this.handleQuery() })
    } else {
      this.handleViewModal()
    }
  }

  setFormReference = form => {
    this.form = form;
  };

  handleQuery = (payload = {}) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { company } = this.state;
    const values = getFieldsValue();
    dispatch({
      type: 'realNameCertification/fetchChannelDeviceList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...payload,
        ...values,
        companyId: company.id,
      },
    })
  }

  // 获取单位列表
  fetchCompanyList = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'resourceManagement/fetchCompanyList', ...action });
  };

  handleReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.handleQuery();
  }

  handleToAdd = () => { router.push(ADD_PATH) }

  // 点击查看
  handleView = id => {
    router.push(`/real-name-certification/channelDevice/view/${id}`)
  }

  // 点击编辑
  handleEdit = id => {
    router.push(`/real-name-certification/channelDevice/edit/${id}`)
  }

  // 删除
  handleDelete = () => { }

  // 点击打开选择单位
  handleViewModal = () => {
    this.fetchCompanyList({
      payload: { pageNum: 1, pageSize: defaultPageSize },
      callback: () => {
        this.setState({ visible: true });
      },
    });
  }

  // 选择单位
  handleSelectCompany = company => {
    const { dispatch } = this.props;
    this.setState({ company, visible: false }, () => {
      this.handleQuery();
    });
    dispatch({
      type: 'realNameCertification/saveDeviceSearchInfo',
      payload: { company },
    })
  }

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card bordered={false}>
        <Form>
          <Row gutter={30}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceName')(
                  <Input placeholder="请输入设备名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceCode')(
                  <Input placeholder="请输入设备序列号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
                <AuthButton code={addCode} type="primary" onClick={this.handleToAdd}>
                  新增
                </AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  renderTable = () => {
    const {
      user: { isCompany },
      realNameCertification: {
        channelDevice: {
          list,
          pagination: { pageNum, pageSize, total },
        },
        onlineStateDict,
      },
    } = this.props;
    const columns = [
      ...isCompany ? [] : [{
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 250,
      }],
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        align: 'center',
        width: 200,
      },
      {
        title: '设备序列号',
        dataIndex: 'deviceCode',
        align: 'center',
        width: 200,
      },
      {
        title: '识别方式',
        dataIndex: 'recType',
        align: 'center',
        width: 200,
        render: (_, { recType }) => (+recType === 1 && '本地') || (+recType === 2 && '云端') || '',
      },
      {
        title: '在线状态',
        dataIndex: 'onlineState',
        align: 'center',
        width: 200,
        render: (val) => {
          const target = onlineStateDict.find(item => +item.key === +val);
          return target ? target.value : '';
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 200,
        align: 'center',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id, status }) => (
          <Fragment>
            <AuthA code={viewCode} onClick={() => this.handleView(id)} data-id={id}>
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleEdit(id)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该数据吗？"
              onConfirm={() => this.handleDelete()}
              style={{ color: '#ff4d4f' }}
            >
              删除
            </AuthPopConfirm>
          </Fragment>
        ),
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          // loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: (pageNum, pageSize) => {
              this.handleQuery({ pageNum, pageSize });
            },
            onShowSizeChange: (pageNum, pageSize) => {
              this.handleQuery({ pageNum, pageSize });
            },
          }}
        />
      </Card>
    ) : (
        <div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>
      );
  }

  render () {
    const {
      companyLoading,
      user: { isCompany },
      resourceManagement: { companyList },
    } = this.props;
    const { company, visible } = this.state;
    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        content={!isCompany && (
          <div>
            <Input
              disabled
              style={{ width: '300px' }}
              placeholder={'请选择单位'}
              value={company.name}
            />
            <Button type="primary" style={{ marginLeft: '5px' }} onClick={this.handleViewModal}>
              选择单位
              </Button>
          </div>
        )}
      >
        {company && company.id ? (
          <div>
            {this.renderForm()}
            {this.renderTable()}
          </div>
        ) : (<div style={{ textAlign: 'center' }}>请先选择单位</div>)}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={visible}
          modal={companyList}
          fetch={this.fetchCompanyList}
          onSelect={this.handleSelectCompany}
          onClose={() => { this.setState({ visible: false }) }}
        />
      </PageHeaderLayout>
    )
  }
}
