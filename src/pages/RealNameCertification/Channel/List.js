import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Col, Row, Select, Table, Input, Divider, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import codes from '@/utils/codes';
// import { hasAuthority } from '@/utils/customAuth';
import router from 'umi/router';
import ImagePreview from '@/jingan-components/ImagePreview';
import codes from '@/utils/codes';
import { AuthButton, AuthA, AuthPopConfirm } from '@/utils/customAuth';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';

const FormItem = Form.Item;

const {
  realNameCertification: {
    channel: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      view: viewCode,
    },
  },
} = codes;

const title = '通道管理';
const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };

//面包屑
const breadcrumbList = [
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
    title,
    name: title,
  },
];

@connect(({ realNameCertification, user, resourceManagement, loading }) => ({
  realNameCertification,
  user,
  resourceManagement,
  companyLoading: loading.effects['resourceManagement/fetchCompanyList'],
  tableLoading: loading.effects['realNameCertification/fetchChannelList'],
}))
@Form.create()
export default class ChannelList extends PureComponent {

  state = {
    company: {}, // 选择的单位
    visible: false,// 选择单位弹窗可见
    images: [], // 图片预览列表
    currentImage: 0,
  };

  componentDidMount () {
    const {
      user: { isCompany, currentUser: { companyId, companyName } },
      realNameCertification: { channelSearchInfo: searchInfo = {} },
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

  handleQuery = (payload = {}) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { company } = this.state;
    const values = getFieldsValue();
    dispatch({
      type: 'realNameCertification/fetchChannelList',
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

  // 点击新增
  handleToAdd = () => {
    router.push('/real-name-certification/channel/add')
  }

  // 点击查看
  handleView = id => {
    router.push(`/real-name-certification/channel/view/${id}`)
  }

  // 点击编辑
  handleEdit = id => {
    router.push(`/real-name-certification/channel/edit/${id}`)
  }

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/deleteChannel',
      payload: { id },
      callback: (success, msg) => {
        if (success) {
          message.success('删除成功');
          this.handleQuery();
        } else { message.error(msg || '删除失败') }
      },
    })
  }

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
      type: 'realNameCertification/saveChannelSearchInfo',
      payload: { company },
    })
  }

  // 渲染筛选栏
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      realNameCertification: {
        channelTypeDict,
      },
    } = this.props;

    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('channelName')(
                  <Input placeholder="通道名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('type')(
                  <Select placeholder="通道类型">
                    {channelTypeDict.map(({ key, value }) => (
                      <Select.Option key={key} value={key}>{value}</Select.Option>
                    ))}
                  </Select>
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
                <AuthButton type="primary" code={addCode} onClick={this.handleToAdd}>
                  新增
                </AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  // 渲染表格
  renderTable = () => {
    const {
      tableLoading,
      realNameCertification: {
        channel: {
          list,
          pagination: { pageNum = 1, pageSize = 10, total = 0 },
        },
        channelTypeDict,
      },
      user: { isCompany },
    } = this.props;
    const columns = [
      ...(isCompany ? [] : [{
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 250,
      }]),
      {
        title: '通道名称',
        dataIndex: 'channelName',
        align: 'center',
        width: 200,
      },
      {
        title: '位置',
        dataIndex: 'channelLocation',
        align: 'center',
        width: 200,
      },
      {
        title: '通道类型',
        dataIndex: 'type',
        align: 'center',
        width: 150,
        render: (val) => {
          const target = channelTypeDict.find(item => +item.key === +val);
          return target ? target.value : undefined;
        },
      },
      {
        title: '方向',
        dataIndex: 'direction',
        align: 'center',
        width: 150,
        render: (val, { type, exit, entrance }) => +type === 1 ? (
          <div>
            <div>入口</div>
            <Divider style={{ width: '100%' }} type="horizontal" />
            <div>出口</div>
          </div>
        ) : (exit ? '出口' : '入口'),
      },
      {
        title: '设备序列号',
        dataIndex: 'deviceCode',
        align: 'center',
        width: 250,
        render: (val, { type, exit, entrance }) => +type === 1 ? (
          <div>
            <div>{entrance}</div>
            <Divider style={{ width: '100%' }} type="horizontal" />
            <div>{exit}</div>
          </div>
        ) : (exit || entrance),
      },
      {
        title: '通道照片',
        dataIndex: 'accessoryDetails',
        align: 'center',
        width: 200,
        render: (val) => Array.isArray(val) ? val.map(({ webUrl, name }, i) => (
          <img
            key={i}
            style={{ width: '40px', height: '40px', margin: '0 5px', cursor: 'pointer' }}
            onClick={() => { this.setState({ images: val.map(item => item.webUrl), currentImage: i }) }}
            src={webUrl}
            alt="照片"
          />
        )) : '',
      },
      {
        title: '操作',
        key: 'id',
        align: 'center',
        width: 200,
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthA code={viewCode} onClick={() => this.handleView(row.id)}>查看</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleEdit(row.id)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              title="确认要删除该数据吗？"
              onConfirm={() => this.handleDelete(row.id)}
              code={deleteCode}
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
          loading={tableLoading}
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
            onChange: this.handleQuery,
            onShowSizeChange: (num, size) => {
              this.handleQuery(1, size);
            },
          }}
        />
      </Card>
    ) : (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>暂无数据</div>
      )
  }

  render () {
    const {
      companyLoading,
      resourceManagement: { companyList },
      user: { isCompany },
    } = this.props;
    const { company, visible, images, currentImage } = this.state;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <p>
              通道总数:
            <span style={{ paddingLeft: 8 }}>{0}</span>
            </p>
            {!isCompany && (
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
          </div>
        }
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
        {/* 图片查看 */}
        <ImagePreview images={images} currentImage={currentImage} />
      </PageHeaderLayout>
    )
  }
}
