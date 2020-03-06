import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  BackTop,
  Col,
  Row,
  Select,
  message,
  Table,
  Divider,
  Input,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { AuthButton, AuthA, AuthPopConfirm } from '@/utils/customAuth';
import router from 'umi/router';
import { stringify } from 'qs';
import { SEXES } from '@/pages/RoleAuthorization/AccountManagement/utils';
import ImagePreview from '@/jingan-components/ImagePreview';

const {
  realNameCertification: {
    personnelManagement: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
    },
  },
} = codes;

const FormItem = Form.Item;

const title = '人员列表';
const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };

@connect(({ realNameCertification, user, loading }) => ({
  realNameCertification,
  user,
  loading: loading.effects['realNameCertification/fetchPersonList'],
}))
@Form.create()
export default class PersonnelList extends PureComponent {

  state = {
    images: [],
    currentImage: 0,
  };

  componentDidMount () {
    this.handleQuery();
  }

  // 查询列表，获取人员列表
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
      match: { params: { companyId } },
    } = this.props;
    const values = getFieldsValue();
    // console.log('query', values);
    dispatch({
      type: 'realNameCertification/fetchPersonList',
      payload: { ...values, pageNum, pageSize, companyId },
    })
  }

  // 重置查询
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.handleQuery();
  }

  // 删除人员
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/deletePerson',
      payload: { id },
      callback: (success) => {
        if (success) {
          message.success('删除人员成功');
          this.handleQuery();
        } else {
          message.error('删除人员失败')
        }
      },
    })
  }

  handleToEdit = (id) => {
    const { match: { params: { companyId } } } = this.props;
    router.push({
      pathname: `/real-name-certification/personnel-management/edit/${id}`,
      query: { companyId },
    })
  }

  // 渲染筛选栏
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      match: { params: { companyId } },
      realNameCertification: { dutyDict, personTypeDict },
    } = this.props;
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('personType')(
                  <Select placeholder="人员类型" allowClear>
                    {personTypeDict.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="姓名" allowClear />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('telephone')(
                  <Input placeholder="电话" allowClear />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('duty')(
                  <Select placeholder="职务" allowClear>
                    {dutyDict.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('icnumber')(
                  <Input placeholder="IC卡号" allowClear />
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
                <AuthButton code={addCode} type="primary" onClick={() => { router.push(`/real-name-certification/personnel-management/add?${stringify({ companyId })}`) }}>
                  新增人员
                </AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  // 渲染列表
  renderList = () => {
    const {
      loading,
      realNameCertification: {
        person: {
          list = [],
          pagination: { pageNum = 1, pageSize = defaultPageSize, total = 0 },
        },
        dutyDict, // 职务
      },
    } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: 200,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        width: 150,
        render: (val) => {
          const target = SEXES.find(item => +item.key === +val);
          return target ? target.label : '';
        },
      },
      {
        title: '电话',
        dataIndex: 'telephone',
        align: 'center',
        width: 200,
      },
      {
        title: '职务',
        dataIndex: 'duty',
        align: 'center',
        width: 150,
        render: (val) => {
          const target = dutyDict.find(item => +item.key === +val);
          return target ? target.label : '';
        },
      },
      {
        title: 'IC卡号',
        dataIndex: 'icnumber',
        align: 'center',
        width: 200,
      },
      {
        title: '照片',
        dataIndex: 'photoDetails',
        align: 'center',
        width: 250,
        render: (val) => (
          <div>
            {val.map((item, i) => (
              <img
                onClick={() => { this.setState({ images: val.map(item => item.webUrl), currentImage: i }) }}
                style={{ width: '50px', height: '50px', objectFit: 'contain', cursor: 'pointer', margin: '5px' }}
                key={i}
                src={item.webUrl}
                alt="照片"
              />
            ))}
          </div>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (val, record) => (
          <Fragment>
            <AuthA code={editCode} onClick={() => this.handleToEdit(record.id)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该人员吗?删除人员后，将删除人员信息及人员所有授权信息。"
              onConfirm={() => this.handleDelete(record.id)}
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
    const {
      user: { isCompany },
      realNameCertification: { person: { pagination: { total = 0 } } },
    } = this.props;
    const { images, currentImage } = this.state;
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
      ...isCompany ? [] : [{
        title: '人员管理',
        name: '人员管理',
        href: '/real-name-certification/personnel-management/company-list',
      }],
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              人员总数:
              <span style={{ paddingLeft: 8 }}>{total}</span>
            </span>
            <Button type="primary" style={{ float: 'right' }}>批量导入照片</Button>
            <Button type="primary" style={{ float: 'right', marginRight: '10px' }}>批量导入</Button>
          </div>
        }
      >
        <BackTop />
        {this.renderFilter()}
        {this.renderList()}
        <ImagePreview images={images} currentImage={currentImage} />
      </PageHeaderLayout>
    )
  }
}
