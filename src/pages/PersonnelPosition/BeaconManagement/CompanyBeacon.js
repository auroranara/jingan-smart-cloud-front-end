import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Table, Form, Select, Divider, Modal, message, Popconfirm } from 'antd';
import codes from '@/utils/codes';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { ActionSheet } from 'antd-mobile';
import { treeAdapters } from '_parse5@3.0.3@parse5';

const Option = Select.Option;

// 权限代码
const {
  personnelPosition: {
    beaconManagement: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
    },
  },
} = codes

const title = "信标列表"
const breadcrumbList = [
  { title: '首页', name: '首页', href: "/" },
  { title: '人员定位', name: '人员定位' },
  { title: '信标管理', name: '信标管理', href: '/personnel-position/beacon-management/companies' },
  { title, name: title },
]
const defaultPageSize = 10;
// 用于配置信标状态
const statusInfo = [
  { label: '在线', value: '1' },
  { label: '离线', value: '0' },
]

const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }

@Form.create()
@connect(({ personnelPosition, user, loading }) => ({
  personnelPosition,
  user,
  loading: loading.effects['personnelPosition/fetchBeaconList'],
}))
export default class CompanyBeacon extends PureComponent {

  state = {
    detail: {},               // 信标详情
  }

  componentDidMount() {
    const {
      match: { params: { id: companyId } },
    } = this.props
    // 获取信标列表
    this.fetchBeacons({
      payload: { pageNum: 1, pageSize: defaultPageSize, companyId },
    })
    // 获取系统列表
    /* this.fetchSystemConfiguration({
      payload: { pageNum: 1, pageSize: 50, companyId },
    }) */
  }

  // 获取信标列表
  fetchBeacons = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchBeaconList',
      ...actions,
    })
  }

  // 获取系统配置列表
  fetchSystemConfiguration = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchSystemConfiguration',
      ...actions,
    })
  }

  // 处理翻页、页大小变化
  handlePageChange = (pageNum, pageSize) => {
    const {
      match: { params: { id: companyId } },
    } = this.props
    this.fetchBeacons({
      payload: {
        pageNum,
        pageSize,
        companyId,
      },
    })
  }

  // 点击查询
  handleQuery = () => {
    const {
      form: { getFieldsValue },
      match: { params: { id: companyId } },
      personnelPosition: {
        beaconManagement: {
          beaconPagination: { pageSize },
        },
      },
    } = this.props
    const { searchBeaconCode, searchBeaconStatus } = getFieldsValue()
    const payload = {
      pageNum: 1,
      pageSize,
      companyId,
      beaconCode: searchBeaconCode,
      status: searchBeaconStatus,
    }
    this.fetchBeacons({
      payload,
    })
  }

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields(['searchBeaconCode', 'searchBeaconStatus'])
    this.handleQuery()
  }

  // 更新state,key为键值
  changeState = (key, value) => {
    const state = this.state
    state[key] = value
    this.setState(state)
  }

  // 点击打开新增弹窗
  handleToAdd = () => {
    const {
      dispatch,
      match: { params: { id: companyId } },
      form: { resetFields },
    } = this.props
    // 获取当前单位的系统配置
    dispatch({
      type: 'personnelPosition/fetchSystemConfiguration',
      payload: { pageNum: 1, pageSize: 100, companyId },
    })
    this.setState({
      modalVisible: true,
      detail: {},
    })
    resetFields(['area'])
  }

  // 关闭弹窗
  handleCloseModal = () => {
    this.setState({
      modalVisible: false,
      detail: {},
    })
  }

  // 监听位置变化
  handleAreaChange = (value, key) => {
    const { form: { setFieldsValue, getFieldValue } } = this.props
    let area = getFieldValue('area') || {}
    area[key] = value
    setFieldsValue({
      area,
    })
  }

  // 验证信标坐标
  valiteArea = (rule, value = {}, callback) => {
    if (value.xarea && value.yarea && value.zarea) {
      const isXErr = isNaN(value.xarea),
        isYErr = isNaN(value.yarea),
        isZErr = isNaN(value.zarea)
      if (isXErr || isYErr || isZErr) {
        callback('请输入数字')
        return
      }
      callback()
    } else callback('请输入信标坐标')
  }

  // 点击打开编辑弹窗
  handleToEdit = (detail) => {
    const { form: { setFieldsValue } } = this.props
    const { xarea, yarea, zarea, beaconCode, sysId } = detail
    this.setState({ detail, modalVisible: true }, () => {
      setFieldsValue({
        sysId,
        beaconCode,
        area: { xarea, yarea, zarea },
        xarea,
        yarea,
        zarea,
      })
    })
  }

  // 点击删除信标
  handleDelete = (id) => {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'personnelPosition/deleteBeacon',
      payload: { id },
      success: () => {
        this.handleQuery()
      },
      error: () => {
        message.error('删除失败')
      },
    })
  }

  // 点击新增/编辑信标
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id: companyId } },
    } = this.props
    const { detail = {} } = this.state
    const success = () => {
      message.success(detail.id ? '编辑成功' : '新增成功')
      this.setState({
        modalVisible: false,
        detail: {},
      }, () => {
        this.handleQuery()
      })
    }
    const error = (msg) => {
      message.error(msg)
    }
    validateFields((err, values) => {
      if (err) return
      const { area, searchBeaconCode, searchBeaconStatus, ...others } = values
      const payload = { ...others, companyId }
      // 如果编辑
      if (detail.id) {
        dispatch({
          type: 'personnelPosition/editBeacon',
          payload: { ...payload, id: detail.id },
          success,
          error,
        })
      } else {
        // 新增
        dispatch({
          type: 'personnelPosition/addBeacon',
          payload,
          success,
          error,
        })
      }
    })
  }

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes },
      },
      personnelPosition: {
        /* 信标管理 */
        beaconManagement: {
          beaconList,
          beaconPagination: { pageNum, pageSize, total = 0 },
        },
        /* 系统配置 */
        systemConfiguration: {
          list: systemList,
        },
      },
    } = this.props
    const { detail = {}, modalVisible } = this.state

    // 添加权限
    const addAuth = hasAuthority(addCode, permissionCodes)
    // const editAuth = hasAuthority(editCode, permissionCodes)
    const deleteAuth = hasAuthority(deleteCode, permissionCodes)

    const columns = [
      {
        title: '信标编号',
        dataIndex: 'beaconCode',
        align: 'center',
        width: 200,
      },
      {
        title: '信标坐标',
        key: '坐标',
        align: 'center',
        render: (val, row) => (<span>{`(${row.xarea},${row.yarea},${row.zarea})`}</span>),
        width: 170,
      },
      {
        title: '所属系统',
        dataIndex: 'sysName',
        align: 'center',
        width: 300,
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render: (val) => (<span>{val ? +val === 1 ? '在线' : '离线' : '暂无数据'}</span>),
        width: 120,
      },
      {
        title: '电量',
        dataIndex: 'battery',
        align: 'center',
        render: (val) => (<span>{val ? `${val}%` : '暂无数据'}</span>),
        width: 120,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            {deleteAuth ? (
              <Popconfirm title="确认要删除该信标吗？" onConfirm={() => this.handleDelete(row.id)}>
                <a>删除</a>
              </Popconfirm>
            ) : (<a style={{ cursor: 'not-allowed', color: '#b3b3b3' }}>删除</a>)}
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleToEdit(row)}>编辑</AuthA>
            <Divider type="vertical" />
            <a>查看地图</a>
          </Fragment>
        ),
      },
    ]

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`信标总数：${total}`}
      >
        {/* 上方筛选栏 */}
        <Card>
          <Row gutter={18}>
            <Col {...colWrapper} style={{ padding: '4px 8px' }}>
              {getFieldDecorator('searchBeaconCode')(
                <Input placeholder="信标编号" />
              )}
            </Col>
            <Col {...colWrapper} style={{ padding: '4px 8px' }}>
              {getFieldDecorator('searchBeaconStatus')(
                <Select placeholder="信标状态" style={{ width: '100%' }}>
                  {statusInfo.map((item, i) => (
                    <Option key={i} value={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )}
            </Col>
            <Col {...colWrapper} style={{ padding: '4px 8px' }}>
              <Button type="primary" style={{ marginRight: '10px' }} onClick={this.handleQuery}>查询</Button>
              <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
              <Button type="primary" style={{ marginRight: '10px' }} onClick={this.handleToAdd} disabled={!addAuth}>新增</Button>
              {/* <Button style={{ marginRight: '10px' }} disabled={!deleteAuth}>删除</Button> */}
              {/* <Button type="primary" >导入</Button> */}
            </Col>
          </Row>
        </Card>
        {/* 信标表格 */}
        <Card style={{ marginTop: '24px' }}>
          {beaconList && beaconList.length > 0 ? (
            <Table
              rowKey="id"
              dataSource={beaconList}
              columns={columns}
              bordered
              loading={loading}
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
          ) : (<div style={{ textAlign: 'center' }}><span >暂无数据</span></div>)}
        </Card>
        {/* 添加、编辑信标弹窗 */}
        <Modal
          title={detail.id ? '编辑信标' : '新增信标'}
          visible={modalVisible}
          onCancel={this.handleCloseModal}
          onOk={this.handleSubmit}
          destroyOnClose
        >
          <Form>
            <Form.Item label="所属系统">
              {getFieldDecorator('sysId', {
                rules: [{ required: true, message: '请选择所属系统' }],
              })(
                <Select placeholder="请选择">
                  {systemList.map(({ sysName, id }, i) => (
                    <Select.Option key={i} value={id}>{sysName}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="信标编号">
              {getFieldDecorator('beaconCode', {
                getValueFromEvent: e => e.target.value.trim(),
                rules: [
                  { required: true, whitespace: true, message: '请输入信标编号' },
                  { pattern: /^\d+$/, message: '请输入数字' },
                ],
              })(
                <Input place="请输入" />
              )}
            </Form.Item>
            <Form.Item label="信标坐标">
              {getFieldDecorator('area', {
                rules: [
                  { required: true, validator: this.valiteArea },
                ],
              })(
                <Fragment>
                  <Input.Group>
                    <Col span={8}>
                      {getFieldDecorator('xarea')(
                        <Input placeholder="x坐标" onChange={(e) => this.handleAreaChange(e.target.value, 'xarea')} />
                      )}
                    </Col>
                    <Col span={8}>
                      {getFieldDecorator('yarea')(
                        <Input placeholder="y坐标" onChange={(e) => this.handleAreaChange(e.target.value, 'yarea')} />
                      )}
                    </Col>
                    <Col span={8}>
                      {getFieldDecorator('zarea')(
                        <Input placeholder="z坐标" onChange={(e) => this.handleAreaChange(e.target.value, 'zarea')} />
                      )}
                    </Col>
                  </Input.Group>
                </Fragment>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
