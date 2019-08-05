import { PureComponent, Fragment } from 'react';
import { Card, Form, Input, Button, Table, Row, Col, Select, Divider, Modal, message, Popconfirm } from 'antd';
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
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultPageSize = 10;
const {
  deviceManagement: {
    sensorModel: {
      add: addCode,
      delete: deleteCode,
      // edit: editCode,
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
const MODELLABEL = { 'add': '新增', 'edit': '编辑', 'copy': '克隆' }
const noAuthStyle = { style: { color: 'rgba(0, 0, 0, 0.25)', cursor: 'not-allowed' } }

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
      sensorDetail: {},
      // 弹窗类型 add/edit/copy
      modalType: 'add',
    }
  }

  componentDidMount() {
    const {
      form: { setFieldsValue },
      sensor: { modelSearchInfo = {} },
    } = this.props
    const { pageNum, pageSize, ...others } = modelSearchInfo
    setFieldsValue({ ...others })
    this.fetchMonitoringTypeDict()
    this.fetchAllUnsetModelList()
    // this.fetchSensorModels({ payload: { pageNum: 1, pageSize: defaultPageSize, ...modelSearchInfo } })
    this.handleQuery(pageNum, pageSize)
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
   * 根据监测类型获取型号代码列表（对象包含描述和补充描述）,筛选掉已添加
   * @param {object} { { payload:{ type } } }
   */
  fetchUnsetModelList = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchUnsetModelList',
      ...actions,
    })
  }


  /**
   * 清空型号代码列表
   */
  saveModelCodeList = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/saveModelCodeList',
      ...actions,
    })
  }


  /**
   * 根据监测类型获取型号代码列表（对象包含描述和补充描述）
   */
  fetchAllUnsetModelList = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchAllUnsetModelList',
      ...actions,
    })
  }

  saveModelSearchInfo = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/saveModelSearchInfo',
      ...actions,
    })
  }


  /**
   * 筛选栏监测类型改变
   */
  handleMonitoringTypeChange = (type) => {
    const { form: { setFieldsValue } } = this.props
    const params = type ? { payload: { type } } : {}
    this.fetchAllUnsetModelList(params)
    setFieldsValue({ serTypeCode: undefined })
  }

  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      form: { getFieldsValue },
    } = this.props
    const { serMonitoringTypeId, serTypeCode } = getFieldsValue()
    this.fetchSensorModels({
      payload: {
        pageNum,
        pageSize,
        monitoringTypeId: serMonitoringTypeId,
        typeCode: serTypeCode,
      },
    })
    this.saveModelSearchInfo({ payload: { serMonitoringTypeId, serTypeCode, pageNum, pageSize } })
  }

  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleQuery()
    this.fetchMonitoringTypeDict()
    this.fetchAllUnsetModelList()
    // this.fetchSensorBrandDict()
    // this.fetchSensorTypeDict()
  }

  // 新增弹窗监测类型改变
  handleModalTypeChange = ({ key } = {}) => {
    const {
      form: { setFieldsValue },
    } = this.props
    // 获取型号代码列表
    this.fetchUnsetModelList({ payload: { type: key } })
    // 清空新增弹窗型号代码、描述、补充描述数据
    setFieldsValue({ typeCode: undefined, modelName: undefined, type: undefined })
  }

  // 新增弹窗型号代码改变
  handleModalTypeCodeChange = (value) => {
    const {
      form: { setFieldsValue },
      sensor: { modelCodeList = [] },
    } = this.props
    const { brand: modelName, msg: brandName } = modelCodeList.find(item => item.model === value) || {}
    setFieldsValue({ modelName, brandName })
  }

  /**
   * 打开新增弹窗（点击筛选栏新增按钮）
   */
  handleViewAddModel = () => {
    // 清空型号代码列表
    this.saveModelCodeList({ payload: [] })
    this.setState({ addModalVisible: true, modalType: 'add', sensorDetail: {} })
  }


  /**
   * 进行新增（编辑）传感器型号
   */
  handleAdd = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props
    const { sensorDetail = {}, modalType } = this.state
    const success = () => {
      message.success(`${MODELLABEL[modalType]}成功！`)
      this.setState({ addModalVisible: false })
      this.handleQuery()
    }
    const error = () => {
      message.error(`${MODELLABEL[modalType]}失败！`)
    }
    validateFields((errors, values) => {
      if (errors) return
      const { serBrand, serMonitoringTypeId, serType, monitoringType: { key: monitoringTypeId, label: monitoringType }, ...others } = values
      const payload = { ...others, monitoringType, monitoringTypeId }
      // 如果编辑
      // modalType === 'edit' && dispatch({
      //   type: 'sensor/editSensorModel',
      //   payload: { ...payload, id: sensorDetail.id },
      //   success,
      //   error,
      // })
      // 如果新增
      modalType === 'add' && dispatch({
        type: 'sensor/addSensorModel',
        payload: { ...payload },
        success,
        error,
      })
      // 如果克隆
      modalType === 'copy' && dispatch({
        type: 'sensor/copySensorModel',
        payload: { ...payload, copyId: sensorDetail.id },
        success,
        error,
      })
    })
  }

  /**
   * 点击编辑/克隆按钮
   */
  handleToEdit = (sensorDetail, modalType) => {
    const { form: { setFieldsValue } } = this.props
    // 获取监测参数列表
    this.fetchMonitoringTypeDict()
    // this.fetchSensorBrandDict({ payload: { monitoringTypeId: sensorDetail.monitoringTypeId } })
    this.setState({ sensorModelId: sensorDetail.id, addModalVisible: true, modalType, sensorDetail }, () => {
      const { monitoringType: label, monitoringTypeId: key, type, modelName, typeCode } = sensorDetail
      this.fetchUnsetModelList({ payload: { type: key } })
      if (modalType === 'copy') {
        // 如果是克隆
        setFieldsValue({ monitoringType: { key, label } })
        return
      }
      setFieldsValue({
        monitoringType: { key, label },
        type,
        modelName,
        typeCode,
      })
    })
  }


  /**
   * 删除传感器型号
   */
  handleDelete = ({ id }) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/deleteSensorModel',
      payload: { id },
      success: () => {
        message.success('删除成功！')
        this.handleQuery()
      },
      error: response => { message.error(response.msg) },
    })
  }

  /**
  * 渲染筛选栏
  */
  renderFilter = ({ addAuth }) => {
    const {
      form: { getFieldDecorator },
      sensor: {
        monitoringTypeDict = [],
        allModelCodeList = [],
      },
    } = this.props
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('serMonitoringTypeId')(
                  <Select placeholder="监测类型" dropdownStyle={{ zIndex: 50 }} onChange={this.handleMonitoringTypeChange} allowClear>
                    {monitoringTypeDict.map(({ value, key }) => (
                      <Option key={key} value={key}>{value}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('serTypeCode')(
                  <Select placeholder="型号代码">
                    {allModelCodeList.map(({ model }) => (
                      <Option key={model} value={model}>{model}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
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
  renderTable = ({ delAuth }) => {
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
        title: '监测类型',
        dataIndex: 'monitoringType',
        align: 'center',
        width: 200,
      },
      {
        title: '型号代码',
        dataIndex: 'typeCode',
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
        title: '品牌',
        dataIndex: 'brandName',
        align: 'center',
        width: 200,
      },
      {
        title: '型号',
        dataIndex: 'modelName',
        align: 'center',
        width: 300,
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
            <AuthA code={addCode} onClick={() => this.handleToEdit(row, 'copy')}>克隆</AuthA>
            <Divider type="vertical" />
            {delAuth ? (
              <Popconfirm title="确认要删除该传感器型号吗？" onConfirm={() => this.handleDelete(row)}>
                <a>删除</a>
              </Popconfirm>
            ) : (<span {...noAuthStyle}>删除</span>)}
            {/* <AuthA code={editCode} onClick={() => this.handleToEdit(row, 'edit')}>编辑</AuthA> */}
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
            scroll={{ x: 'max-content' }}
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
        modelCodeList = [],
      },
    } = this.props
    const {
      addModalVisible,
      modalType,
    } = this.state
    return (
      <Modal
        title={`${MODELLABEL[modalType]}传感器型号`}
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
              <Select labelInValue disabled={modalType === 'copy'} placeholder="请选择" onChange={this.handleModalTypeChange}>
                {monitoringTypeDict.map(({ value, key }) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="型号代码" {...formItemLayout}>
            {getFieldDecorator('typeCode', {
              rules: [
                { required: true, message: '请选择型号代码' },
              ],
              validateTrigger: 'onBlur',
            })(
              <Select placeholder="请选择" onChange={this.handleModalTypeCodeChange}>
                {modelCodeList.map(({ model }) => (
                  <Option key={model} value={model}>{model}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="品牌" {...formItemLayout}>
            {getFieldDecorator('modelName')(
              <Input placeholder="请先选择型号代码" disabled></Input>
            )}
          </FormItem>
          <FormItem label="品牌" {...formItemLayout}>
            {getFieldDecorator('brandName')(
              <Input placeholder="请先选择型号代码" disabled></Input>
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
    const delAuth = hasAuthority(deleteCode, permissionCodes)
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`传感器型号总数：${total}`}
      >
        {this.renderFilter({ addAuth })}
        {this.renderTable({ delAuth })}
        {this.renderAddModal()}
      </PageHeaderLayout>
    )
  }
}
