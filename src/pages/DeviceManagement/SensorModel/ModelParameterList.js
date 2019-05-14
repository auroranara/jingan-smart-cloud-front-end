import { PureComponent, Fragment } from 'react';
import { Card, Form, Row, Col, Button, Table, Divider, Popconfirm, Modal, Input, message } from 'antd';
import { connect } from 'dva';
import codes from '@/utils/codes';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from '../Sensor/AddSensor.less';

const FormItem = Form.Item;

const title = "型号参数管理";
const colWrapper = { lg: 8, md: 8, sm: 24, xs: 24 }
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const noAuthStyle = { style: { color: 'rgba(0, 0, 0, 0.25)', cursor: 'not-allowed' } }
const defaultPageSize = 10;
const {
  deviceManagement: {
    sensorModel: {
      model: {
        alarmStrategy: alarmStrategyCode,
        add: addCode,
        edit: editCode,
        delete: deleteCode,
      },
    },
  },
} = codes
const numberReg = /^(0|[1-9][0-9]*)(\.[0-9]{1,3})?$/;

@Form.create()
@connect(({ sensor, user, loading }) => ({
  sensor,
  user,
  loading: loading.effects['sensor/fetchModelParameters'],
}))
export default class ModelParameterList extends PureComponent {

  state = {
    // 编辑时保存的表格当前行数据
    parameterDetail: {},
    // 新增弹窗可见
    addModalVisible: false,
    // 配置报警策略弹窗可见
    alarmStrategyModalVisible: false,
  }

  componentDidMount() {
    this.handleQuery()
  }


  /**
   * 获取参数列表
   */
  handleQuery = () => {
    const {
      dispatch,
      match: { params: { modelId } },
    } = this.props
    dispatch({
      type: 'sensor/fetchModelParameters',
      payload: { modelId },
    })
  }


  /**
   * 删除参数
   */
  handleDelete = ({ id }) => {
    const {
      dispatch,
      match: { params: { modelId } },
    } = this.props
    dispatch({
      type: 'sensor/deleteModelParameter',
      payload: { modelId, id },
      success: () => {
        message.success('删除成功')
        this.handleQuery()
      },
      error: (res) => { message.error(res.msg ? `删除失败，${res.msg}` : '删除失败') },
    })
  }


  /**
   * 量程最小值改变
   */
  handleminValueChange = (e) => {
    const minValue = e.target.value.trim() || null
    const { setFieldsValue, getFieldValue } = this.props.form
    const range = getFieldValue('range')
    // const maxValue=getFieldValue('maxValue')
    // 如果是数字或无输入
    if (!minValue || numberReg.test(minValue)) {
      setFieldsValue({ range: { ...range, minValue } })
    }
  }


  /**
   * 量程最大值改变
   */
  handlemaxValueChange = (e) => {
    const maxValue = e.target.value.trim() || null
    const { setFieldsValue, getFieldValue } = this.props.form
    const range = getFieldValue('range')
    // const minValue=getFieldValue('maxValue')
    // 如果是数字
    if (!maxValue || numberReg.test(maxValue)) {
      setFieldsValue({ range: { ...range, maxValue } })
    }
  }


  /**
   * 添加（编辑）参数
   */
  handleAddParameter = () => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { modelId } },
    } = this.props
    const { parameterDetail } = this.state
    const id = parameterDetail && parameterDetail.id || null
    validateFields(['code', 'desc', 'unit', 'range'], (error, values) => {
      if (!error) {
        const { code, unit, desc, range } = values
        const payload = { code, unit: unit || '', desc: desc || '', ...range, modelId }
        const success = () => {
          message.success(id ? '编辑成功！' : '添加成功！')
          this.setState({ addModalVisible: false })
          this.handleQuery()
        }
        const error = () => { message.error(id ? '编辑失败！' : '添加成功！') }
        if (id) {
          dispatch({
            type: 'sensor/editModelParameter',
            payload: { ...payload, id },
            success,
            error,
          })
        } else {
          dispatch({
            type: 'sensor/addModelParameter',
            payload,
            success,
            error,
          })
        }
      }
    })
  }

  /**
   * 验证量程
   */
  validateRange = (rule, { minValue, maxValue } = {}, callback) => {
    if (minValue && maxValue && +minValue > +maxValue) {
      callback('量程下限需小于上限')
    } else if (+minValue < 0 || +maxValue < 0) {
      callback('请输入大于0的数字')
    } else callback()
  }

  /**
   * 验证--预警下限
   */
  validateNormalLower = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (numberReg.test(value)) {
      // 如果是数字
      const { getFieldsValue } = this.props.form
      const { normalLower, normalUpper, smallLower, largeUpper } = getFieldsValue()
      if (+value < 0) {
        callback('请输入大于0的数字')
        return
      }
      if (normalUpper && +value >= +normalUpper) {
        callback('预警下限需小于预警上限')
        return
      }
      if (smallLower && +value <= +smallLower) {
        callback('预警下限需大于告警下限')
        return
      }
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
      const { getFieldsValue } = this.props.form
      const { normalLower, normalUpper, smallLower, largeUpper } = getFieldsValue()
      if (+value < 0) {
        callback('请输入大于0的数字')
        return
      }
      if (normalLower && +value <= +normalLower) {
        callback('预警上限需大于预警下限')
        return
      }
      if (largeUpper && +value >= +largeUpper) {
        callback('预警上限需小于告警上限')
        return
      }
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
      const { getFieldsValue } = this.props.form
      const { normalLower, normalUpper, smallLower, largeUpper } = getFieldsValue()
      if (+value < 0) {
        callback('请输入大于0的数字')
        return
      }
      if (largeUpper && +value >= +largeUpper) {
        callback('告警下限需小于告警上限')
        return
      }
      if (normalLower && +value >= +normalLower) {
        callback('告警下限需小于预警下限')
        return
      }
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
      const { getFieldsValue } = this.props.form
      const { normalLower, normalUpper, smallLower, largeUpper } = getFieldsValue()
      if (+value < 0) {
        callback('请输入大于0的数字')
        return
      }
      if (smallLower && +value <= +smallLower) {
        callback('告警上限需大于告警下限')
        return
      }
      if (normalUpper && +value <= +normalUpper) {
        callback('告警上限需大于预警上限')
        return
      }
      callback()
    } else callback('请输入数字')
  }


  /**
   * 点击打开编辑参数弹窗
   */
  handleToEdit = (parameterDetail) => {
    const { form: { setFieldsValue } } = this.props
    const { code, desc, unit, minValue, maxValue } = parameterDetail
    const range = { minValue, maxValue }
    this.setState({ parameterDetail, addModalVisible: true, range }, () => {
      setFieldsValue({ code, desc, unit, range })
    })
  }

  /**
     * 打开配置报警策略
     */
  handleAlarmStrategy = (parameterDetail) => {
    const { setFieldsValue } = this.props.form
    const { largeUpper, normalLower, normalUpper, smallLower } = parameterDetail
    this.setState({
      parameterDetail: { ...parameterDetail },
      alarmStrategyModalVisible: true,
    }, () => {
      setFieldsValue({ largeUpper, normalLower, normalUpper, smallLower })
    })
  }


  /**
   * 保存报警策略
   */
  handleConfirmAlarmStrategy = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props
    validateFields(['normalLower', 'normalUpper', 'smallLower', 'largeUpper'], (errors, { normalLower, normalUpper, smallLower, largeUpper }) => {
      if (!errors) {
        const { parameterDetail } = this.state
        const payload = { ...parameterDetail, normalLower, normalUpper, smallLower, largeUpper }
        this.setState({ alarmStrategyModalVisible: false })
        dispatch({
          type: 'sensor/editModelParameter',
          payload,
          success: () => {
            message.success('配置报警策略成功！')
            this.handleQuery()
          },
          error: () => { message.error('配置报警策略失败！') },
        })
      }
    })
  }

  /**
   * 打开新增弹窗
   */
  handleToAdd = () => {
    const { setFieldsValue } = this.props.form
    this.setState({ addModalVisible: true, parameterDetail: {} }, () => {
      setFieldsValue({ range: {} })
    })
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = ({ addAuth }) => {
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button disabled={!addAuth} onClick={this.handleToAdd} type="primary">添加参数</Button>
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
  renderTable = ({ deleteAuth }) => {
    const {
      loading,
      sensor: {
        modelParameters = [],
      },
    } = this.props
    const columns = [
      {
        title: '参数编码',
        dataIndex: 'code',
        align: 'center',
        width: 150,
      },
      {
        title: '描述',
        dataIndex: 'desc',
        align: 'center',
        width: 200,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        align: 'center',
        width: 130,
      },
      {
        title: '量程',
        dataIndex: '',
        align: 'center',
        width: 220,
        render: (val, { minValue, maxValue }) => (<span>{minValue && maxValue ? `${minValue}~${maxValue}` : '——'}</span>),
      },
      {
        title: '报警策略数量',
        key: '报警策略数量',
        align: 'center',
        width: 130,
        render: (val, { normalUpper, normalLower, largeUpper, smallLower }) => (
          <span>{(numberReg.test(normalUpper) || numberReg.test(normalLower)) + (numberReg.test(largeUpper) || numberReg.test(smallLower))}</span>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            <AuthA code={alarmStrategyCode} onClick={() => this.handleAlarmStrategy(row)}>配置报警策略</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleToEdit(row)}>编辑</AuthA>
            <Divider type="vertical" />
            {deleteAuth ? (
              <Popconfirm title="确认要删除该型号参数吗？" onConfirm={() => this.handleDelete(row)}>
                <a>删除</a>
              </Popconfirm>
            ) : (<span {...noAuthStyle}>删除</span>)}
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={modelParameters}
          bordered
        />
      </Card>
    )
  }


  /**
   * 渲染新增弹窗
   */
  renderAddModal = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props
    const { parameterDetail: { id, unit }, addModalVisible } = this.state
    const range = getFieldValue('range') || {}
    return (
      <Modal
        title={id ? '编辑参数' : '添加参数'}
        visible={addModalVisible}
        destroyOnClose
        width={700}
        onCancel={() => { this.setState({ addModalVisible: false, parameterDetail: {} }) }}
        onOk={this.handleAddParameter}
      >
        <Form>
          <FormItem label="编码" {...formItemLayout}>
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '请输入编码' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="描述" {...formItemLayout}>
            {getFieldDecorator('desc', {
              getValueFromEvent: e => e.target.value.trim(),
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="单位" {...formItemLayout}>
            {getFieldDecorator('unit', {
              getValueFromEvent: e => e.target.value.trim(),
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="量程" {...formItemLayout}>
            {getFieldDecorator('range', {
              rules: [{ validator: this.validateRange }],
              validateTrigger: 'onBlur',
            })(
              <Fragment>
                <Input placeholder="请输入" value={range.minValue} onChange={this.handleminValueChange} style={{ width: 'calc(50% - 1em)' }} addonBefore="下限" addonAfter={unit} />
                <span style={{ padding: '0 1em' }}></span>
                <Input placeholder="请输入" value={range.maxValue} onChange={this.handlemaxValueChange} style={{ width: 'calc(50% - 1em)' }} addonBefore="上限" addonAfter={unit} />
              </Fragment>
            )}
          </FormItem>
        </Form>
      </Modal>
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
      parameterDetail: { desc, unit } = {},
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
            <Col span={7}>
              <FormItem>
                <span className={styles.labelText}>报警等级：</span>
                预警
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem style={{ display: 'inline-block' }} label="预警阈值"></FormItem>
              <FormItem style={{ width: '180px', display: 'inline-block' }}>
                {getFieldDecorator('normalLower', {
                  rules: [{ validator: this.validateNormalLower }],
                  getValueFromEvent: e => e.target.value.trim() || null,
                })(
                  <Input addonBefore="下限" addonAfter={unit} style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('normalUpper', {
                  rules: [{ validator: this.validateNormalUpper }],
                  getValueFromEvent: e => e.target.value.trim() || null,
                })(
                  <Input addonBefore="上限" addonAfter={unit} style={{ width: '180px' }} />
                )}
              </FormItem>
            </Col>
          </Form>
        </Card>
        <Card className={styles.alarmStrategyModalCard} style={{ marginTop: '15px' }}>
          <Form>
            <Col span={7}>
              <FormItem>
                <span className={styles.labelText}>报警等级：</span>
                告警
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem style={{ display: 'inline-block' }} label="告警阈值"></FormItem>
              <FormItem style={{ width: '180px', display: 'inline-block' }}>
                {getFieldDecorator('smallLower', {
                  rules: [{ validator: this.validateSmallLower }],
                  getValueFromEvent: e => e.target.value.trim() || null,
                })(
                  <Input addonBefore="下限" addonAfter={unit} style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('largeUpper', {
                  rules: [{ validator: this.validateLargeUpper }],
                  getValueFromEvent: e => e.target.value.trim() || null,
                })(
                  <Input addonBefore="上限" addonAfter={unit} style={{ width: '180px' }} />
                )}
              </FormItem>
            </Col>
          </Form>
        </Card>
      </Modal>
    )
  }

  render() {
    const {
      user: { currentUser: { permissionCodes } },
    } = this.props
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '传感器型号管理', name: '传感器型号管理', href: '/device-management/sensor-model/list' },
      { title, name: title },
    ]
    const addAuth = hasAuthority(addCode, permissionCodes)
    const deleteAuth = hasAuthority(deleteCode, permissionCodes)
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderFilter({ addAuth })}
        {this.renderTable({ deleteAuth })}
        {this.renderAddModal()}
        {this.renderAlarmStrategyModal()}
      </PageHeaderLayout>
    )
  }
}
