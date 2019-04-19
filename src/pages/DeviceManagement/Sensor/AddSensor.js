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
    // 如果编辑
    if (id) {
      // 获取传感器详情
      dispatch({
        type: 'sensor/fetchSensorDetail',
        payload: { id },
        callback: (response) => {
          const { companyId, companyName, monitoringParameters, monitoringTypeId, type, brand, deviceName, relationDeviceId } = response.data
          setFieldsValue({ companyId, monitoringTypeId, type, brand, deviceName, relationDeviceId })
          this.setState({
            selectedCompany: { id: companyId, name: companyName },
          })
          this.fetchMonitoringTypeDict({ payload: { type, brand } })
          this.fetchSensorBrandDict({ payload: { monitoringTypeId, type } })
          this.fetchSensorTypeDict({ payload: { monitoringTypeId, brand } })
          dispatch({
            type: 'sensor/saveState',
            payload: { key: 'monitoringParameters', value: monitoringParameters },
          })
        },
      })
    } else {
      // 如果新增
      this.fetchMonitoringTypeDict()
      this.fetchSensorBrandDict()
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

    validateFields((error, values) => {
      if (!error) {
        const payload = { ...values, monitoringParameters }
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
    const { form: { getFieldsValue } } = this.props
    const { type, brand } = getFieldsValue()
    this.fetchSensorBrandDict({ payload: { monitoringTypeId, type } })
    this.fetchSensorTypeDict({ payload: { monitoringTypeId, brand } })
    this.judgeRender({ type, brand, monitoringTypeId })
  }

  /**
   * 品牌改变
   */
  handleBrandChange = (brand) => {
    const { form: { getFieldsValue } } = this.props
    const { type, monitoringTypeId } = getFieldsValue()
    this.fetchMonitoringTypeDict({ payload: { type, brand } })
    this.fetchSensorTypeDict({ payload: { brand, monitoringTypeId } })
    this.judgeRender({ type, brand, monitoringTypeId })
  }

  /**
   * 类型改变
   */
  handleTypeChange = (type) => {
    const { form: { getFieldsValue } } = this.props
    const { brand, monitoringTypeId } = getFieldsValue()
    this.fetchMonitoringTypeDict({ payload: { type, brand } })
    this.fetchSensorBrandDict({ payload: { type, monitoringTypeId } })
    this.judgeRender({ type, brand, monitoringTypeId })
  }

  /**
   * 判断是否渲染监测参数
   */
  judgeRender = ({ monitoringTypeId, type, brand }) => {
    monitoringTypeId && type && brand && this.fetchMonitoringParameter({ payload: { monitoringTypeId, type, brand } })
  }


  /**
   * 打开配置报警策略
   */
  handleAlarmStrategy = (currentParameter) => {
    this.setState({ currentParameter: { ...currentParameter }, alarmStrategyModalVisible: true })
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

  handleSaveAlarmStrategy = (key, value) => {
    let currentParameter = this.state.currentParameter
    currentParameter[key] = value
    this.setState({ currentParameter })
  }


  /**
   * 点击确认配置报警策略弹窗
   */
  handleConfirmAlarmStrategy = () => {
    const {
      dispatch,
      sensor: { monitoringParameters },
    } = this.props
    const { currentParameter } = this.state
    const newMonitoringParameters = monitoringParameters.map(item => {
      return item.id === currentParameter.id ? currentParameter : item
    })
    dispatch({
      type: 'sensor/saveState',
      payload: { key: 'monitoringParameters', value: newMonitoringParameters },
    })
    this.setState({ alarmStrategyModalVisible: false })
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
        render: (val, { normalUpper, normalLower, largeUpper, smallLower }) => (
          <span>{(!!normalUpper || !!normalLower) + (!!largeUpper || !!smallLower)}</span>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (<a onClick={() => this.handleAlarmStrategy(row)}>配置报警策略</a>),
      },
    ]
    const monitoringTypeId = getFieldValue('monitoringTypeId')
    const type = getFieldValue('type')
    const brand = getFieldValue('brand')
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
          <FormItem label="品牌" {...formItemLayout}>
            {getFieldDecorator('brand', {
              rules: [{ required: true, message: '请选择品牌' }],
            })(
              <Select placeholder="请选择" {...itemStyles} onChange={this.handleBrandChange} allowClear>
                {brandDict.map(({ key, value }) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="传感器型号" {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择传感器型号' }],
            })(
              <Select placeholder="请选择" {...itemStyles} onChange={this.handleTypeChange} allowClear>
                {typeDict.map(({ key, value }) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="传感器名称" {...formItemLayout}>
            {getFieldDecorator('deviceName', {
              rules: [{ required: true, message: '请输入传感器名称' }],
            })(
              <Input {...itemStyles} />
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
              rules: [{ required: true, message: '请输入传感器名称' }],
            })(
              <Input {...itemStyles} />
            )}
          </FormItem>
          {monitoringTypeId && type && brand && (
            <FormItem label="监测参数" {...formItemLayout}>
              <Fragment>
                <Table rowKey="id" dataSource={monitoringParameters} columns={columns} bordered />
              </Fragment>
            </FormItem>
          )}
          <FormItem label="所在区域" {...formItemLayout}>
            {getFieldDecorator('d')(
              <Input {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="位置详情" {...formItemLayout}>
            {getFieldDecorator('e')(
              <Input {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="地图定位" {...formItemLayout}></FormItem>
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
      alarmStrategyModalVisible,
      currentParameter: {
        normalUpper, // 预警上限
        normalLower, // 预警下限
        largeUpper, // 告警上限
        smallLower, // 告警下限
      } = {},
    } = this.state
    return (
      <Modal
        title="配置报警策略-A相电压"
        width={800}
        visible={alarmStrategyModalVisible}
        onCancel={() => { this.setState({ alarmStrategyModalVisible: false }) }}
        onOk={this.handleConfirmAlarmStrategy}
      >
        <Card className={styles.alarmStrategyModalCard}>
          <Row className={styles.row}>
            <Col span={8}>
              <span className={styles.labelText}>报警等级：</span>
              预警
            </Col>
            <Col span={16}>
              <span className={styles.labelText}>报警阈值：</span>
              <Input onChange={e => this.handleSaveAlarmStrategy('normalLower', Number(e.target.value) || null)} value={normalLower} addonBefore="下限" addonAfter="V" style={{ width: '180px' }} />
              <span style={{ margin: '0 1em' }}></span>
              <Input onChange={e => this.handleSaveAlarmStrategy('normalUpper', Number(e.target.value) || null)} value={normalUpper} addonBefore="上限" addonAfter="V" style={{ width: '180px' }} />
            </Col>
          </Row>
        </Card>
        <Card className={styles.alarmStrategyModalCard} style={{ marginTop: '15px' }}>
          <Row className={styles.row}>
            <Col span={8}>
              <span className={styles.labelText}>报警等级：</span>
              告警
            </Col>
            <Col span={16}>
              <span className={styles.labelText}>报警阈值：</span>
              <Input onChange={e => this.handleSaveAlarmStrategy('smallLower', Number(e.target.value) || null)} value={smallLower} addonBefore="下限" addonAfter="V" style={{ width: '180px' }} />
              <span style={{ margin: '0 1em' }}></span>
              <Input onChange={e => this.handleSaveAlarmStrategy('largeUpper', Number(e.target.value) || null)} value={largeUpper} addonBefore="上限" addonAfter="V" style={{ width: '180px' }} />
            </Col>
          </Row>
        </Card>
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
