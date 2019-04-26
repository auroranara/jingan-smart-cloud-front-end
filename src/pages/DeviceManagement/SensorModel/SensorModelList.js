import { PureComponent, Fragment } from 'react';
import { Card, Form, Input, Button, Table, Row, Col, Select, Divider, Modal, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import codes from '@/utils/codes';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

const FormItem = Form.Item;
const Option = Select.Option;

const title = '传感器型号管理'
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title, name: title },
]
const colWrapper = { lg: 12, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultPageSize = 10;
const {
  deviceManagement: {
    sensorModel: {
      add: addCode,
      edit: editCode,
      model: {
        listView: viewModelCode,
      },
    },
  },
} = codes
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
const modalLabel = { 'add': '新增', 'edit': '编辑', 'copy': '复制' }

@Form.create()
@connect(({ sensor, resourceManagement, user, loading }) => ({
  sensor,
  resourceManagement,
  user,
  loading: loading.effects['sensor/fetchSensorModels'],
}))
export default class SensorModelList extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      // 新增传感器型号弹窗
      addModalVisible: false,
      // 监测类型字典
      monitoringTypeDict: [],
      // 传感器品牌字典
      brandDict: [],
      // 传感器型号字典
      typeDict: [],
      sensorModelId: null,
      sensorDetail: {},
      // 弹窗类型 add/edit/copy
      modalType: 'add',
    }
  }

  componentDidMount() {
    this.fetchMonitoringTypeDict()
    this.fetchSensorBrandDict()
    this.handleQuery()
  }


  /**
   * 获取传感器型号列表
   */
  fetchSensorModels = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchSensorModels',
      ...actions,
    })
  }

  /**
  * 获取监测类型列表（字典）
  */
  fetchMonitoringTypeDict = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchMonitoringTypeDict',
      ...actions,
    })
  }

  /**
   * 获取传感器品牌列表（字典）
   */
  fetchSensorBrandDict = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchSensorBrandDict',
      ...actions,
    })
  }

  /**
   * 获取传感器类型列表（字典）
   */
  fetchSensorTypeDict = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchSensorTypeDict',
      ...actions,
    })
  }

  /**
   * 筛选栏监测类型改变
   */
  // handlemonitoringTypeChange = (monitoringTypeId, justState = false) => {
  //   this.fetchSensorBrandDict({
  //     payload: { monitoringTypeId, justState },
  //     callback: (brandDict) => {
  //       this.setState({ brandDict })
  //     },
  //   })
  //   this.fetchSensorTypeDict({
  //     payload: { monitoringTypeId, justState },
  //     callback: (typeDict) => {
  //       this.setState({ typeDict })
  //     },
  //   })
  // }


  /**
   * 筛选栏品牌改变
   */
  // handleBrandChange = (brand, justState = false) => {
  //   this.fetchMonitoringTypeDict({
  //     payload: { brand, justState },
  //     callback: (monitoringTypeDict) => {
  //       this.setState({ monitoringTypeDict })
  //     },
  //   })
  //   this.fetchSensorTypeDict({
  //     payload: { brand, justState },
  //     callback: (typeDict) => {
  //       this.setState({ typeDict })
  //     },
  //   })
  // }


  /**
   * 筛选栏类型改变
   */
  // handleTypeChange = (type) => {
  //   this.fetchMonitoringTypeDict({ payload: { type } })
  //   this.fetchSensorBrandDict({ payload: { type } })
  // }

  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      form: { getFieldsValue },
    } = this.props
    const { serMonitoringTypeId, serBrand, serType } = getFieldsValue()
    this.fetchSensorModels({
      payload: {
        pageNum,
        pageSize,
        monitoringTypeId: serMonitoringTypeId,
        brandId: serBrand,
        type: serType,
      },
    })
  }

  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleQuery()
    this.fetchMonitoringTypeDict()
    this.fetchSensorBrandDict()
    this.fetchSensorTypeDict()
  }


  /**
   * 打开新增弹窗（点击筛选栏新增按钮）
   */
  handleViewAddModel = () => {
    this.setState({ addModalVisible: true, modalType: 'add', sensorModelId: null, sensorDetail: {} })
  }


  /**
   * 进行新增（编辑）传感器型号
   */
  handleAdd = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props
    const { sensorModelId, modalType } = this.state
    const success = () => {
      message.success(`${modalLabel[modalType]}成功！`)
      this.setState({ addModalVisible: false })
      this.handleQuery()
    }
    const error = () => {
      message.error(`${modalLabel[modalType]}失败！`)
    }
    validateFields((errors, values) => {
      if (errors) return
      const { serBrand, serMonitoringTypeId, serType, monitoringType: { key: monitoringTypeId, label: monitoringType }, ...others } = values
      const payload = { ...others, monitoringType, monitoringTypeId }
      // 如果编辑
      if (modalType === 'edit') {
        dispatch({
          type: 'sensor/editSensorModel',
          payload: { ...payload, id: sensorModelId },
          success,
          error,
        })
      } else if (modalType === 'add') {
        // 如果新增
        dispatch({
          type: 'sensor/addSensorModel',
          payload: { ...payload },
          success,
          error,
        })
      } else {
        // 如果复制
        dispatch({
          type: 'sensor/copySensorModel',
          payload: { ...payload, copyId: sensorModelId },
          success,
          error,
        })
      }
    })
  }

  validateType = (rule, type, callback) => {
    const { sensorDetail } = this.state
    const preType = sensorDetail && sensorDetail.type
    if (type && preType !== type) {
      const { dispatch } = this.props
      dispatch({
        type: 'sensor/fetchModelCount',
        payload: { type },
        callback: ({ count }) => {
          if (+count > 0) {
            callback('传感器型号已存在')
          } else callback()
        },
      })
    } else callback()
  }

  validateTypeCode = (rule, typeCode, callback) => {
    const { sensorDetail } = this.state
    const preTypeCode = sensorDetail && sensorDetail.typeCode
    if (typeCode && preTypeCode !== typeCode) {
      const { dispatch } = this.props
      dispatch({
        type: 'sensor/fetchModelCount',
        payload: { typeCode },
        callback: ({ count }) => {
          if (+count > 0) {
            callback('型号代码已存在')
          } else callback()
        },
      })
    } else callback()
  }

  /**
   * 点击编辑按钮
   */
  handleToEdit = (sensorDetail, modalType) => {
    const { form: { setFieldsValue } } = this.props
    this.fetchMonitoringTypeDict({ payload: { brandId: sensorDetail.brandId } })
    this.fetchSensorBrandDict({ payload: { monitoringTypeId: sensorDetail.monitoringTypeId } })
    this.setState({ sensorModelId: sensorDetail.id, addModalVisible: true, modalType, sensorDetail }, () => {
      const { monitoringType: label, monitoringTypeId: key, type, brandId, typeCode } = sensorDetail
      if (modalType === 'copy') {
        // 如果是复制
        setFieldsValue({
          monitoringType: { key, label },
          brandId,
        })
        return
      }
      setFieldsValue({
        monitoringType: { key, label },
        type,
        brandId,
        typeCode,
      })
    })
  }

  /**
  * 渲染筛选栏
  */
  renderFilter = ({ addAuth }) => {
    const {
      form: { getFieldDecorator },
      sensor: {
        monitoringTypeDict,
        brandDict,
        typeDict,
      },
    } = this.props
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('serMonitoringTypeId')(
                  <Select placeholder="监测类型" dropdownStyle={{ zIndex: 50 }}>
                    {monitoringTypeDict.map(({ value, key }) => (
                      <Option key={key} value={key}>{value}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('serBrand')(
                  <Select placeholder="品牌">
                    {brandDict.map(({ value, key }) => (
                      <Option key={key} value={key}>{value}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('serType')(
                  <Input placeholder="传感器型号" />
                )}
              </FormItem>
            </Col>
            {/* <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('serType')(
                  <Select placeholder="传感器型号" onChange={(value) => this.handleTypeChange(value, false)}>
                    {typeDict.map(({ value, key }) => (
                      <Option key={key} value={key}>{value}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col> */}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                <Button type="primary" disabled={!addAuth} onClick={this.handleViewAddModel}>新增</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  /**
  * 渲染表格
  */
  renderTable = () => {
    const {
      loading,
      sensor: {
        sensorModel: {
          list = [],
          pagination: {
            pageNum,
            pageSize,
            total,
          },
        },
      },
    } = this.props
    const columns = [
      {
        title: '监测类型代码',
        dataIndex: 'monitoringTypeId',
        align: 'center',
        width: 200,
      },
      {
        title: '监测类型',
        dataIndex: 'monitoringType',
        align: 'center',
        width: 200,
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        align: 'center',
        width: 150,
      },
      {
        title: '型号代码',
        dataIndex: 'typeCode',
        align: 'center',
        width: 150,
      },
      {
        title: '传感器型号',
        dataIndex: 'type',
        align: 'center',
        width: 150,
      },
      {
        title: '型号参数',
        key: '型号参数',
        align: 'center',
        width: 300,
        render: (val, row) => {
          if (row.monitoringParameters && row.monitoringParameters.length > 0) {
            return row.monitoringParameters.map(item => item.code).sort().join(' ')
          } else return null
        },
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 200,
        render: (val, row) => (
          <Fragment>
            <AuthA code={viewModelCode} onClick={() => router.push(`/device-management/sensor-model/model/${row.id}`)}>配置参数</AuthA>
            <Divider type="vertical" />
            <AuthA code={addCode} onClick={() => this.handleToEdit(row, 'copy')}>复制</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleToEdit(row, 'edit')}>编辑</AuthA>
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '24px' }}>
        {list && list.length > 0 ? (
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={list}
            scroll={{ x: 1300 }}
            bordered
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
        ) : (<div style={{ width: '100%', textAlign: 'center' }}><span>暂无数据</span></div>)}
      </Card>
    )
  }


  /**
  * 渲染新增弹窗
   */
  renderAddModal = () => {
    const {
      form: { getFieldDecorator },
      sensor: {
        monitoringTypeDict,
        brandDict,
      },
    } = this.props
    const {
      addModalVisible,
      modalType,
    } = this.state
    return (
      <Modal
        title={(modalType === 'add' && '新增传感器型号') || (modalType === 'edit' && '编辑传感器型号') || (modalType === 'copy' && '复制传感器型号')}
        width={700}
        destroyOnClose
        visible={addModalVisible}
        onCancel={() => { this.setState({ addModalVisible: false }) }}
        onOk={this.handleAdd}
      >
        <Form>
          <FormItem label="监测类型" {...formItemLayout}>
            {getFieldDecorator('monitoringType', {
              rules: [{ required: true, message: '请选择监测类型' }],
              validateTrigger: 'onBlur',
            })(
              <Select labelInValue placeholder="请选择">
                {monitoringTypeDict.map(({ value, key }) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="品牌" {...formItemLayout}>
            {getFieldDecorator('brandId', {
              rules: [{ required: true, message: '请选择品牌' }],
              validateTrigger: 'onBlur',
            })(
              <Select placeholder="请选择">
                {brandDict.map(({ value, key }) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="传感器型号" {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [
                { required: true, message: '请输入传感器型号' },
                { validator: this.validateType },
              ],
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="型号代码" {...formItemLayout}>
            {getFieldDecorator('typeCode', {
              rules: [
                { required: true, message: '请输入型号代码' },
                { validator: this.validateTypeCode },
              ],
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

  render() {
    const {
      user: { currentUser: { permissionCodes } },
      sensor: { sensorModel: { pagination: { total = 0 } } },
    } = this.props
    const addAuth = hasAuthority(addCode, permissionCodes)
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`传感器型号总数：${total}`}
      >
        {this.renderFilter({ addAuth })}
        {this.renderTable()}
        {this.renderAddModal()}
      </PageHeaderLayout>
    )
  }
}
