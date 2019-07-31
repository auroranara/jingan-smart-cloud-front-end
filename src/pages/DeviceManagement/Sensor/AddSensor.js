import { Component, Fragment } from 'react';
import { Card, Form, Input, Select, Button, Table, Row, Modal, Col, message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import debounce from 'lodash/debounce';
import styles from './AddSensor.less';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
const defaultPageSize = 10;
const numberReg = /^(0|[1-9][0-9]*)(\.[0-9]{1,3})?$/;

@Form.create()
@connect(({ sensor, loading }) => ({
  sensor,
  companyLoading: loading.effects['sensor/fetchModelList'],
}))
export default class AddSensor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // 当前监测参数
      currentParameter: {},
      // 储存配置报警策略
      alarmStrategy: [],
      // 配置报警策略弹窗可见
      alarmStrategyModalVisible: false,
      // 选择企业弹窗
      compayModalVisible: false,
      // 选中的企业
      selectedCompany: {},
    }
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
    } = this.props
    this.fetchMonitoringTypeDict()
    // this.fetchSensorBrandDict()
    // 如果编辑
    if (id) {
      // 获取传感器详情
      dispatch({
        type: 'sensor/fetchSensorDetail',
        payload: { id },
        callback: (response) => {
          const { companyId, companyName, monitoringParameters, monitoringTypeId, typeId, brandName, deviceName, relationDeviceId, area, location } = response.data
          setFieldsValue({ companyId, monitoringTypeId, typeId, brandName, deviceName, relationDeviceId, area, location })
          this.setState({
            selectedCompany: { id: companyId, name: companyName },
          })
          this.fetchSensorTypeDict({ payload: { monitoringTypeId } })
          dispatch({
            type: 'sensor/saveState',
            payload: { key: 'monitoringParameters', value: monitoringParameters },
          })
        },
      })
    } else {
      // 如果新增
      this.fetchSensorTypeDict()
    }
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
   * 获取监测参数列表
   */
  fetchMonitoringParameter = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchMonitoringParameter',
      ...actions,
    })
  }

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sensor/fetchModelList', payload });
  };

  handleSubmit = () => {
    const {
      dispatch,
      sensor: {
        monitoringParameters,
      },
      form: { validateFields },
      match: { params: { id } },
    } = this.props

    validateFields((error, { normalLower, normalUpper, ...formData }) => {
      if (!error) {
        const payload = { ...formData, monitoringParameters }
        // console.log('提交',payload)
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！')
          router.push('/device-management/sensor/list')
        }
        const error = () => { message.error(id ? '编辑失败' : '新增失败！') }
        if (id) {
          dispatch({
            type: 'sensor/editSensor',
            payload: { ...payload, deviceId: id },
            success,
            error,
          })
        } else {
          dispatch({
            type: 'sensor/addSensor',
            payload,
            success,
            error,
          })
        }
      }
    })
  }

  /**
   * 监测类型改变
   */
  handlemonitoringTypeChange = (monitoringTypeId) => {
    const { form: { resetFields } } = this.props
    // this.fetchSensorBrandDict({ payload: { monitoringTypeId, typeId } })
    this.fetchSensorTypeDict({ payload: { monitoringTypeId } })
    resetFields(['typeId', 'brandName'])
  }

  /**
   * 品牌改变
   */
  // handleBrandChange = (brandId) => {
  //   const { form: { getFieldsValue, resetFields } } = this.props
  //   const { monitoringTypeId } = getFieldsValue()
  //   // this.fetchMonitoringTypeDict({ payload: { typeId, brandId } })
  //   this.fetchSensorTypeDict({ payload: { brandId, monitoringTypeId } })
  //   resetFields(['typeId'])
  // }

  /**
   * 传感器型号改变
   */
  handleTypeChange = (typeId) => {
    const {
      sensor: {
        typeDict = [],
      },
      form: { setFieldsValue },
    } = this.props
    this.fetchMonitoringParameter({ payload: { typeId } })
    const selItem = typeDict.find(item => item.id === typeId) || {}
    setFieldsValue({ brandName: selItem.modelDesc })
  }

  /**
   * 打开配置报警策略
   */
  handleAlarmStrategy = (currentParameter) => {
    const { setFieldsValue } = this.props.form
    const { normalLower, normalUpper } = currentParameter
    this.setState({
      currentParameter: { ...currentParameter },
      alarmStrategyModalVisible: true,
    }, () => {
      setFieldsValue({
        normalLower,
        normalUpper,
      })
    })
  }


  /**
   * 选择企业
   */
  handleSelectCompany = (selectedCompany) => {
    const {
      form: { setFieldsValue },
    } = this.props
    this.setState({ selectedCompany, companyModalVisible: false })
    setFieldsValue({ companyId: selectedCompany.id })
  }


  /**
   * 打开选择单位弹窗
   */
  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true })
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    })
  }


  /**
   * 保存已配置的报警策略
   */
  // handleSaveAlarmStrategy = (key, value) => {
  //   let currentParameter = this.state.currentParameter
  //   currentParameter[key] = value
  //   this.setState({ currentParameter })
  // }


  /**
   * 点击确认配置报警策略弹窗
   */
  handleConfirmAlarmStrategy = () => {
    const {
      dispatch,
      sensor: { monitoringParameters },
      form: { validateFields },
    } = this.props
    validateFields(['normalLower', 'normalUpper'], (errors, { normalLower, normalUpper }) => {
      if (!errors) {
        let { currentParameter } = this.state
        currentParameter = {
          ...currentParameter,
          normalLower,
          normalUpper,
          smallLower: null,
          largeUpper: null,
        }
        const newMonitoringParameters = monitoringParameters.map(item => {
          return item.id === currentParameter.id ? currentParameter : item
        })
        dispatch({
          type: 'sensor/saveState',
          payload: { key: 'monitoringParameters', value: newMonitoringParameters },
        })
        this.setState({ alarmStrategyModalVisible: false })
      }
    })
  }


  /**
   * 验证--预警下限
   */
  validateNormalLower = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (numberReg.test(value)) {
      // 如果是数字
      // const { getFieldsValue } = this.props.form
      // const { normalLower, normalUpper, smallLower, largeUpper } = getFieldsValue()
      if (+value < 0) {
        callback('请输入大于0的数字')
        return
      }
      // if (normalUpper && +value >= +normalUpper) {
      //   callback('预警下限需小于预警上限')
      //   return
      // }
      // if (smallLower && +value <= +smallLower) {
      //   callback('预警下限需大于告警下限')
      //   return
      // }
      callback()
    } else callback('请输入数字')
  }


  /**
   * 验证--预警上限
   */
  validateNormalUpper = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (numberReg.test(value)) {
      // const { getFieldsValue } = this.props.form
      // const { normalLower, normalUpper, smallLower, largeUpper } = getFieldsValue()
      if (+value < 0) {
        callback('请输入大于0的数字')
        return
      }
      // if (normalLower && +value <= +normalLower) {
      //   callback('预警上限需大于预警下限')
      //   return
      // }
      // if (largeUpper && +value >= +largeUpper) {
      //   callback('预警上限需小于告警上限')
      //   return
      // }
      callback()
    } else callback('请输入数字')
  }


  /**
   * 验证--告警下限
   */
  validateSmallLower = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (numberReg.test(value)) {
      // const { getFieldsValue } = this.props.form
      // const { normalLower, normalUpper, smallLower, largeUpper } = getFieldsValue()
      if (+value < 0) {
        callback('请输入大于0的数字')
        return
      }
      // if (largeUpper && +value >= +largeUpper) {
      //   callback('告警下限需小于告警上限')
      //   return
      // }
      // if (normalLower && +value >= +normalLower) {
      //   callback('告警下限需小于预警下限')
      //   return
      // }
      callback()
    } else callback('请输入数字')
  }


  /**
   * 验证--告警上限
   */
  validateLargeUpper = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (numberReg.test(value)) {
      // const { getFieldsValue } = this.props.form
      // const { normalLower, normalUpper, smallLower, largeUpper } = getFieldsValue()
      if (+value < 0) {
        callback('请输入大于0的数字')
        return
      }
      // if (smallLower && +value <= +smallLower) {
      //   callback('告警上限需大于告警下限')
      //   return
      // }
      // if (normalUpper && +value <= +normalUpper) {
      //   callback('告警上限需大于预警上限')
      //   return
      // }
      callback()
    } else callback('请输入数字')
  }

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
      sensor: {
        // 监测类型字典
        monitoringTypeDict = [],
        // 传感器品牌字典
        brandDict = [],
        // 传感器型号字典
        typeDict = [],
        // 监测参数列表
        monitoringParameters = [],
      },
    } = this.props
    const { selectedCompany } = this.state
    const columns = [
      {
        title: '监测参数编码',
        dataIndex: 'code',
        align: 'center',
      },
      {
        title: '描述',
        dataIndex: 'desc',
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        align: 'center',
      },
      {
        title: '报警策略数量',
        key: '报警策略数量',
        align: 'center',
        render: (val, { normalUpper, normalLower }) => (
          <span>{(numberReg.test(normalUpper) || numberReg.test(normalLower)) ? 1 : 0}</span>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (<a onClick={() => this.handleAlarmStrategy(row)}>配置报警策略</a>),
      },
    ]
    const typeId = getFieldValue('typeId')
    return (
      <Card>
        <Form>
          <FormItem label="所属单位" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择所属单位' }],
            })(
              <Fragment>
                <Input {...itemStyles} disabled value={selectedCompany.name} placeholder="请选择" />
                <Button type="primary" onClick={this.handleViewCompanyModal}>选择单位</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="监测类型" {...formItemLayout}>
            {getFieldDecorator('monitoringTypeId', {
              rules: [{ required: true, message: '请选择监测类型' }],
            })(
              <Select placeholder="请选择" {...itemStyles} onChange={this.handlemonitoringTypeChange} allowClear>
                {monitoringTypeDict.map(({ key, value }) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="传感器型号" {...formItemLayout}>
            {getFieldDecorator('typeId', {
              rules: [{ required: true, message: '请选择传感器型号' }],
            })(
              <Select placeholder="请选择" {...itemStyles} onChange={this.handleTypeChange}>
                {typeDict.map(({ classModel, id }) => (
                  <Option key={id} value={id}>{classModel}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="品牌" {...formItemLayout}>
            {getFieldDecorator('brandName', {
              rules: [{ required: true, message: '请选择品牌' }],
            })(
              <Input disabled placeholder="请先选择传感器型号" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="传感器名称" {...formItemLayout}>
            {getFieldDecorator('deviceName')(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          {/* <FormItem label="传感器位号" {...formItemLayout}>
            {getFieldDecorator('b', {
              rules: [{ required: true, message: '请输入传感器名称' }],
            })(
              <Input {...itemStyles} />
            )}
          </FormItem> */}
          <FormItem label="传感器ID" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入传感器ID' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          {typeId && (
            <FormItem label="监测参数" {...formItemLayout}>
              <Fragment>
                <Table rowKey="id" dataSource={monitoringParameters} columns={columns} bordered />
              </Fragment>
            </FormItem>
          )}
          <FormItem label="所在区域" {...formItemLayout}>
            {getFieldDecorator('area', {
              rules: [{ required: true, message: '请输入所在区域' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="位置详情" {...formItemLayout}>
            {getFieldDecorator('location', {
              rules: [{ required: true, message: '请输入位置详情' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          {/* <FormItem label="地图定位" {...formItemLayout}></FormItem> */}
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button onClick={() => { router.push('/device-management/sensor/list') }}>取消</Button>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleSubmit}>确定</Button>
        </Row>
      </Card>
    )
  }


  /**
   * 配置报警策略弹窗
   */
  renderAlarmStrategyModal = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    const {
      alarmStrategyModalVisible,
      currentParameter: { desc, unit } = {},
    } = this.state
    return (
      <Modal
        title={desc ? `配置报警策略--${desc}` : '配置报警策略'}
        width={800}
        visible={alarmStrategyModalVisible}
        onCancel={() => { this.setState({ alarmStrategyModalVisible: false }) }}
        onOk={this.handleConfirmAlarmStrategy}
        destroyOnClose
      >
        <Card className={styles.alarmStrategyModalCard}>
          <Form>
            {/* <Col span={7}>
              <FormItem>
                <span className={styles.labelText}>报警等级：</span>
                预警
              </FormItem>
            </Col> */}
            <Col span={10}>
              <FormItem style={{ display: 'inline-block' }} label="报警阈值"></FormItem>
              <FormItem style={{ width: '180px', display: 'inline-block' }}>
                {getFieldDecorator('normalLower', {
                  rules: [{ validator: this.validateNormalLower }],
                  getValueFromEvent: e => e.target.value.trim() || null,
                })(
                  <Input addonBefore="≤" addonAfter={unit} style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem>
                {getFieldDecorator('normalUpper', {
                  rules: [{ validator: this.validateNormalUpper }],
                  getValueFromEvent: e => e.target.value.trim() || null,
                })(
                  <Input addonBefore="≥" addonAfter={unit} style={{ width: '180px' }} />
                )}
              </FormItem>
            </Col>
          </Form>
        </Card>
        {/* <Card className={styles.alarmStrategyModalCard} style={{ marginTop: '15px' }}>
          <Form>
            <Col span={7}>
              <FormItem>
                <span className={styles.labelText}>报警等级：</span>
                告警
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem style={{ display: 'inline-block' }} label="告警阈值"></FormItem>
              <FormItem style={{ width: '180px', display: 'inline-block' }}>
                {getFieldDecorator('normalLower', {
                  rules: [{ validator: this.validateSmallLower }],
                  getValueFromEvent: e => e.target.value.trim() || null,
                })(
                  <Input addonBefore="≤" addonAfter={unit} style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem>
                {getFieldDecorator('normalUpper', {
                  rules: [{ validator: this.validateLargeUpper }],
                  getValueFromEvent: e => e.target.value.trim() || null,
                })(
                  <Input addonBefore="≥" addonAfter={unit} style={{ width: '180px' }} />
                )}
              </FormItem>
            </Col>
          </Form>
        </Card> */}
      </Modal>
    )
  }

  render() {
    const {
      companyLoading,
      match: { prams: { id = null } = {} },
      sensor: { companyModal },
    } = this.props
    const { companyModalVisible } = this.state
    const title = id ? '编辑传感器' : '新增传感器'
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '传感器管理', name: '传感器管理', href: '/device-management/sensor/list' },
      { title, name: title },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderForm()}
        {/* 选择企业弹窗 */}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyModalVisible}
          modal={companyModal}
          fetch={this.fetchCompany}
          onSelect={this.handleSelectCompany}
          onClose={() => { this.setState({ companyModalVisible: false }) }}
        />
        {this.renderAlarmStrategyModal()}
      </PageHeaderLayout>
    )
  }
}
