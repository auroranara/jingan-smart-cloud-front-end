import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Col,
  Row,
  Select,
  Table,
  Input,
  Divider,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import codes from '@/utils/codes';
// import { hasAuthority } from '@/utils/customAuth';
import router from 'umi/router';
import moment from 'moment';
import ImagePreview from '@/jingan-components/ImagePreview';
import codes from '@/utils/codes';
import { AuthButton, AuthA, AuthPopConfirm } from '@/utils/customAuth';

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

@connect(({ realNameCertification, user, loading }) => ({
  realNameCertification,
  user,
  // loading: loading.effects['realNameCertification/fetchIdentificationRecord'],
}))
@Form.create()
export default class ChannelList extends PureComponent {

  handleQuery = () => { }

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

  }

  // 渲染筛选栏
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      user: { isCompany },
      realNameCertification: {
        channelTypeDict,
      },
    } = this.props;

    return (
      <Card>
        <Form>
          <Row gutter={16}>
            {!isCompany && (
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('companyName')(
                    <Input placeholder="单位名称" />
                  )}
                </FormItem>
              </Col>
            )}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
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
                <Button type="primary" code={addCode} onClick={this.handleToAdd}>
                  新增
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  // 渲染表格
  renderList = () => {
    const {
      loading = false,
      realNameCertification: {
        channel: {
          list,
          pagination: { pageNum = 1, pageSize = 10, total = 0 },
        },
      },
      user: { isCompany },
    } = this.props;
    const columns = [
      ...isCompany ? [] : [{
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 150,
      }],
      {
        title: '通道名称',
        dataIndex: 'name',
        align: 'center',
        width: 150,
      },
      {
        title: '位置',
        dataIndex: 'location',
        align: 'center',
        width: 150,
      },
      {
        title: '通道类型',
        dataIndex: 'type',
        align: 'center',
        width: 150,
      },
      {
        title: '方向',
        dataIndex: 'direction',
        align: 'center',
        width: 150,
      },
      {
        title: '设备序列号',
        dataIndex: 'num',
        align: 'center',
        width: 150,
      },
      {
        title: '通道照片',
        dataIndex: 'pic',
        align: 'center',
        width: 150,
      },
      {
        title: '操作',
        key: 'id',
        align: 'center',
        width: 200,
        render: (val, row) => (
          <Fragment>
            <AuthA code={viewCode} onClick={() => this.handleView(val)}>查看</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleEdit(val)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              title="确认要删除该数据吗？"
              onConfirm={() => this.handleDelete(val)}
              code={deleteCode}
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
          loading={loading}
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
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <span>
            通道总数:
            <span style={{ paddingLeft: 8 }}>{0}</span>
          </span>
        }
      >
        {this.renderFilter()}
        {this.renderList()}
      </PageHeaderLayout>
    )
  }
}
