import React, { PureComponent, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { Card, Form, Button, Input, Select, Row, Col, Modal, Table, message } from 'antd';
import router from 'umi/router';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { connect } from 'dva';

const Option = Select.Option;
const FormItem = Form.Item;

// 标签分类选项
const typesInfo = [
  { label: '普通卡', value: '0' },
  { label: '临时卡', value: '1' },
]
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
const defaultPageSize = 10;

@Form.create()
@connect(({ personnelPosition, loading }) => ({
  personnelPosition,
  companyLoading: loading.effects['personnelPosition/fetchTagCompanies'],
}))
export default class TagManagementAdd extends PureComponent {

  state = {
    employModalVisible: false, // 选择持卡人弹窗可见
    company: {},               // 选中的单位信息
    companyVisible: false,      // 选择单位弹窗
    currentPersonnelList: [],    // 分页后当前显示的人员
    pagination: {
      pageNum: 1,
      pageSize: defaultPageSize,
      total: 0,
    },
    selectedPersonnerlKeys: [],    // 选中的人员keys
    selectedRows: [],               // 选中人员列表
    personnel: {},       // 选中的人员信息
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props
    if (id) {
      // 获取详情
      dispatch({
        type: 'personnelPosition/fetchTagDetail',
        payload: { pageNum: 1, pageSize: 0, cardId: id },
        callback: ({ code = null, companyId = null, companyName = null, sysId = null, type = null, userId = null, userName = null, phoneNumber = null }) => {
          // 获取单位下的系统配置和人员
          this.fetchEmployees({ payload: { companyId } })
          this.fetchSystems({ payload: { pageNum: 1, pageSize: 0, companyId } })
          this.setState({
            company: { id: companyId, name: companyName },
            personnel: { id: userId, userName },
          })
        },
      })
    }
  }

  // 获取单位列表
  fetchTagCompanies = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchTagCompanies',
      ...actions,
    })
  }

  // 获取单位人员
  fetchEmployees = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchEmployees',
      ...actions,
    })
  }

  // 获取系统配置列表
  fetchSystems = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchSystemConfiguration',
      ...actions,
    })
  }

  // 点击关闭选择单位弹窗
  handleCloseEmployeeModal = () => {
    this.setState({
      employeeModalVisible: false,
      companyVisible: false,
    })
  }

  // 点击打开选择人员弹窗
  handleToSelectEmployee = () => {
    const {
      personnelPosition: { tag: { personnelList = [] } },
    } = this.props
    const {
      company,
    } = this.state
    if (company.id) {
      const currentPersonnelList = personnelList.slice(0, defaultPageSize)
      this.setState({
        employeeModalVisible: true,
        currentPersonnelList,
        pagination: {
          pageNum: 1,
          pageSize: defaultPageSize,
          total: personnelList ? personnelList.length : 0,
        },
      })
    } else {
      message.error('请先选择单位')
    }
  }

  // 点击打开选择单位弹窗
  handleViewCompanyModal = () => {
    this.fetchTagCompanies({
      payload: { pageNum: 1, pageSize: defaultPageSize },
      callback: () => {
        this.setState({
          companyVisible: true,
        })
      },
    })
  }

  // 关闭选择单位弹窗
  handleCompanyModalCLose = () => {
    this.setState({
      companyVisible: false,
    })
  }

  // 选择单位并关闭弹窗
  handleSelectCompany = (company) => {
    const {
      form: { setFieldsValue, resetFields },
    } = this.props
    // 获取系统列表
    this.fetchSystems({
      payload: { pageNum: 1, pageSize: 0, companyId: company.id },
      callback: () => {
        this.setState({
          companyVisible: false,
          company,
          personnel: {},
        })
        resetFields(['sysId', 'personnel', 'phoneNumber'])
        setFieldsValue({ company, sysId: undefined, phoneNumber: undefined, personnel: undefined })
      },
    })
    // 获取人员列表
    this.fetchEmployees({
      payload: { companyId: company.id },
    })
  }

  // 人员列表页面变化
  handlePageChange = (pageNum, pageSize) => {
    const {
      personnelPosition: {
        tag: { personnelList },
      },
    } = this.props
    this.setState({
      currentPersonnelList: personnelList.slice((pageNum - 1) * pageSize, pageNum * pageSize),
      pagination: {
        ...this.state.pagination,
        pageNum,
      },
    })
  }

  // 渲染无数据
  emptyTip = (content) => {
    return (<div style={{ padding: '24px 24px 0 24px', textAlign: 'center', color: 'rgba(0, 0, 0, 0.45)' }}><span>{content}</span></div>)
  }

  // 点击确认持卡人
  selectPersonnel = () => {
    const {
      form: { setFieldsValue },
    } = this.props
    const {
      selectedRows = [],
    } = this.state
    if (!selectedRows || selectedRows.length <= 0) {
      message.error('请选择持卡人')
      return
    }
    const [personnel] = selectedRows,
      { phoneNumber } = personnel
    this.setState({ personnel, employeeModalVisible: false })
    setFieldsValue({ personnel, phoneNumber })
  }

  // 点击提交
  handleSubmit = () => {
    // 需要加一个参数name ，默认叫标签
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
    } = this.props
    validateFields((err, values) => {
      if (err) return
      const { personnel = {}, company = {}, ...others } = values
      const payload = +values.type === 0 ? {
        companyId: company.id,
        userId: personnel.id,
        name: '标签',
        ...others,
      } : {
          companyId: company.id,
          name: '标签',
          ...others,
        }
      const success = () => {
        message.success(id ? '编辑成功！' : '新增成功！')
        router.push('/personnel-position/tag-management/list')
      }
      const error = () => {
        message.error(id ? '编辑失败！' : '新增失败！')
      }
      if (id) {
        // 如果编辑
        dispatch({
          type: 'personnelPosition/editTag',
          payload: { ...payload, id },
          success,
          error,
        })
      } else {
        // 如果新增
        dispatch({
          type: 'personnelPosition/addTag',
          payload,
          success,
          error,
        })
      }
    })
  }

  render() {
    const {
      companyLoading,
      form: { getFieldDecorator, getFieldValue },
      personnelPosition: {
        systemConfiguration: { list: systemList },
        tagCompany = {},
        tag: { detail = {} },
      },
      match: { params: { id } },
    } = this.props
    const {
      employeeModalVisible,
      company,
      companyVisible,
      currentPersonnelList,
      pagination: {
        pageNum,
        pageSize,
        total,
      },
      selectedPersonnerlKeys,
      personnel = {},
    } = this.state

    const type = getFieldValue('type') || '0'
    const title = id ? '编辑标签' : '新增标签'
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { title: '标签管理', name: '标签管理', href: '/personnel-position/tag-management/list' },
      { title, name: title },
    ]
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        align: 'center',
      },
    ]
    const rowSelection = {
      selectedRowKeys: selectedPersonnerlKeys,
      onChange: (selectedPersonnerlKeys, selectedRows) => {
        this.setState({ selectedPersonnerlKeys, selectedRows })
      },
      type: 'radio',
    }

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card>
          <Form>
            <FormItem label="标签号" {...formItemLayout}>
              {getFieldDecorator('code', {
                getValueFromEvent: e => e.target.value.trim(),
                initialValue: id ? detail.code : undefined,
                rules: [{ required: true, message: '请输入标签号' }],
              })(
                <Input placeholder="请输入" {...itemStyles} />
              )}
            </FormItem>
            <FormItem label="所属单位" {...formItemLayout}>
              {getFieldDecorator('company', {
                initialValue: id ? { id: detail.companyId, name: detail.companyName } : undefined,
                rules: [{ required: true, type: 'object', message: '请选择所属单位' }],
              })(
                <div style={{ display: 'inline-block', width: '100%' }}>
                  <Input value={company.name} placeholder="请选择" disabled {...itemStyles} />
                  <Button type="primary" onClick={this.handleViewCompanyModal}>选择单位</Button>
                </div>
              )}
            </FormItem>
            <FormItem label="所属系统" {...formItemLayout}>
              {getFieldDecorator('sysId', {
                initialValue: id ? detail.sysId : undefined,
                rules: [{ required: true, message: '请选择所属系统' }],
              })(
                <Select placeholder="请选择" {...itemStyles} notFoundContent="暂无数据" >
                  {systemList.map(({ sysName, id }) => (
                    <Option key={id}>{sysName}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="标签分类" {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: id ? detail.type : undefined,
                rules: [{ required: true, message: '请选择标签分类' }],
              })(
                <Select placeholder="请选择" {...itemStyles} notFoundContent="暂无数据">
                  {typesInfo.map(({ value, label }, i) => (
                    <Option key={i} value={value}>{label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            {type === '0' && (
              <Fragment>
                <FormItem label="持卡人" {...formItemLayout}>
                  {getFieldDecorator('personnel', {
                    initialValue: id ? { id: detail.userId, userName: detail.userName } : undefined,
                  })(
                    <div style={{ display: 'inline-block', width: '100%' }}>
                      <Input value={personnel.userName} placeholder="请选择" disabled {...itemStyles} />
                      <Button type="primary" onClick={this.handleToSelectEmployee}>选择人员</Button>
                    </div>
                  )}
                </FormItem>
                <FormItem label="联系方式" {...formItemLayout}>
                  {getFieldDecorator('phoneNumber', {
                    initialValue: id ? detail.phoneNumber : undefined,
                  })(
                    <Input disabled {...itemStyles} />
                  )}
                </FormItem>
              </Fragment>
            )}
          </Form>
          <Row style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button onClick={() => { router.push('/personnel-position/tag-management/list') }}>取消</Button>
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleSubmit}>确定</Button>
          </Row>
        </Card>
        <Modal
          title="选择持卡人"
          width={800}
          visible={employeeModalVisible}
          onCancel={this.handleCloseEmployeeModal}
          onOk={this.selectPersonnel}
        >
          {company.id ? (
            <Table
              rowKey="id"
              style={{ marginTop: '10px' }}
              columns={columns}
              dataSource={currentPersonnelList}
              bordered
              rowSelection={rowSelection}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                onChange: this.handlePageChange,
                onShowSizeChange: (num, size) => {
                  this.handlePageChange(1, size);
                },
              }}
            ></Table>
          ) : this.emptyTip('请先选择单位')}
        </Modal>
        {/* 选择单位弹窗 */}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyVisible}
          modal={tagCompany}
          fetch={this.fetchTagCompanies}
          onSelect={this.handleSelectCompany}
          onClose={this.handleCompanyModalCLose}
        />
      </PageHeaderLayout>
    )
  }
}
