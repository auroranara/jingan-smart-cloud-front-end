import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Divider,
  Popconfirm,
  Button,
  Modal,
  Input,
  message,
  Select,
  Row,
  Col,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import { AuthLink, AuthA } from '@/utils/customAuth';
// import codes from '@/utils/codes';

const FormItem = Form.Item;

const title = "配置参数"

const numberReg = /^(0|[1-9][0-9]*)(\.[0-9]{1,3})?$/;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
/*
报警策略类型选项
key: condition 和 warnLevel 中间有空格拼接而成
*/
const alarmTypes = [
  { key: '>= 1', condition: '>=', warnLevel: 1, label: '预警上限' },
  { key: '<= 1', condition: '<=', warnLevel: 1, label: '预警下限' },
  { key: '>= 2', condition: '>=', warnLevel: 2, label: '告警上限' },
  { key: '<= 2', condition: '<=', warnLevel: 2, label: '告警上限' },
]

// 渲染新增/删除弹窗
const RenderAddModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields },
    visible,
    detail,
    onOk,
    onCancel,
    tagList, // 标签列表
    parameterGroupTypes, // 分组类型数组
  } = props
  const isEdit = detail && detail.id
  const handleConfirm = () => {
    validateFields((err, values) => {
      if (err) return
      onOk(values)
    })
  }
  const validateNum = (rule, value, callback) => {
    if (value) {
      if (numberReg.test(value)) {
        callback()
      } else callback('请输入数字')
    } else callback()
  }
  return (
    <Modal
      title={isEdit ? '编辑参数' : '添加参数'}
      visible={visible}
      destroyOnClose
      width={700}
      onCancel={onCancel}
      onOk={handleConfirm}
    >
      <Form>
        <FormItem label="编码" {...formItemLayout}>
          {getFieldDecorator('paramCode', {
            initialValue: isEdit ? detail.paramCode : undefined,
            rules: [{ required: true, message: '请输入编码' }],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('paramDesc', {
            initialValue: isEdit ? detail.paramDesc : undefined,
            rules: [{ required: true, message: '请输入描述' }],
            getValueFromEvent: e => e.target.value.trim(),
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="单位" {...formItemLayout}>
          {getFieldDecorator('paramUnit', {
            initialValue: isEdit ? detail.paramUnit : undefined,
            getValueFromEvent: e => e.target.value.trim(),
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <Row>
          <Col span={12}>
            <FormItem label="量程" labelCol={{ span: 10, offset: 2 }} wrapperCol={{ span: 12 }}>
              {getFieldDecorator('rangeMin', {
                initialValue: isEdit ? detail.rangeMin : undefined,
                getValueFromEvent: e => e.target.value.trim(),
                rules: [{ validator: validateNum }],
              })(
                <Input placeholder="请输入" addonBefore="下限" addonAfter={detail.paramUnit} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 12, offset: 2 }}>
              {getFieldDecorator('rangeMax', {
                initialValue: isEdit ? detail.rangeMax : undefined,
                getValueFromEvent: e => e.target.value.trim(),
                rules: [{ validator: validateNum }],
              })(
                <Input placeholder="请输入" addonBefore="上限" addonAfter={detail.paramUnit} />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem {...formItemLayout} label="图标选择：">
          {getFieldDecorator('logoId', {
            initialValue: isEdit ? detail.logoId : undefined,
          })(
            <Select placeholder="请选择">
              {tagList.map(({ id, name, webUrl }) => (
                <Select.Option
                  key={id}
                  value={id}
                >
                  <img width="27" height="27" src={webUrl} alt="图标"></img>
                  <span style={{ paddingLeft: '1em' }}>{name}</span>
                </Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="分组类型：">
          {getFieldDecorator('fixType', {
            initialValue: isEdit ? detail.fixType : undefined,
          })(
            <Select placeholder="请选择">
              {parameterGroupTypes.map(item => (
                <Select.Option
                  key={item.value}
                  value={item.value}
                >
                  {item.desc}
                </Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})

// 渲染配置报警策略弹窗
const RenderAlarmStrategyModal = Form.create()(props => {
  const {
    detail: { paramDesc },
    visible,
    onCancel,
    onOk,
    alarmStrategy = [], // 报警策略数组
    saveAlarmStrategy,
    historyVisible,
    handleViewHistory,
  } = props
  // 添加报警项
  const handleAddItem = () => {
    let newList = [...alarmStrategy]
    newList.push({ warnLevel: undefined, condition: undefined, limitValue: undefined })
    saveAlarmStrategy(newList)
  }
  // 删除报警项
  const handleDel = (i) => {
    let newList = [...alarmStrategy]
    newList.splice(i, 1)
    saveAlarmStrategy(newList)
  }
  const onInputChange = (limitValue, item, i) => {
    let newList = [...alarmStrategy]
    const { condition, warnLevel } = item
    newList.splice(i, 1, { condition, warnLevel, limitValue })
    saveAlarmStrategy(newList)
  }
  const onSelectChange = (value, item, i) => {
    if (!value) return
    const [condition, warnLevel] = value.split(' ')
    let newList = [...alarmStrategy]
    // 筛选掉对象中不需要的key ； condition为数字
    const target = alarmTypes.find(item => item.condition === condition && item.warnLevel === +warnLevel)
    newList.splice(i, 1, { ...item, condition: target.condition, warnLevel: +target.warnLevel })
    saveAlarmStrategy(newList)
  }
  return (
    <Modal
      title={paramDesc ? `配置报警策略--${paramDesc}` : '配置报警策略'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      width={700}
    >
      <Button type="primary" onClick={handleAddItem} style={{ marginRight: '10px' }}>添加</Button>
      <Button onClick={handleViewHistory}>配置历史纪录</Button>
      {alarmStrategy.length > 0 && alarmStrategy.map((row, i) => (
        <div key={i} style={{
          marginTop: '10px',
          width: '100%',
          overflow: 'hidden',
          border: '1px solid #e8e8e8',
          borderRadius: '5px',
          padding: '20px 20px 0 20px',
        }}>
          <Form>
            <Col span={9}>
              <FormItem>
                <Select placeholder="请选择"
                  style={{ width: '100%' }}
                  value={row.warnLevel && row.condition ? `${row.condition} ${row.warnLevel}` : undefined}
                  onChange={(value) => onSelectChange(value, row, i)}
                  allowClear
                >
                  {alarmTypes.map(({ label, key, condition, warnLevel }) => (
                    <Select.Option
                      value={key}
                      key={key}
                      disabled={alarmStrategy.some(item => item.warnLevel === warnLevel && item.condition === condition)}
                    >
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span={9} offset={1}>
              <FormItem>
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入"
                  value={row.limitValue}
                  onChange={(e) => onInputChange(isNaN(e.target.value) ? row.limitValue : +e.target.value, row, i)}
                />
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                <a onClick={() => handleDel(i)}>删除</a>
              </FormItem>
            </Col>
          </Form>
        </div>
      ))}
    </Modal>
  )
})

@connect(({ user, device, loading }) => ({
  user,
  device,
  tableLoading: loading.effects['device/fetchParameterForPage'],
}))
export default class DeployParameter extends PureComponent {

  state = {
    addModalVisible: false, // 添加/编辑弹窗可见
    detail: {}, // 编辑时保存参数信息
    alarmModalVisible: false, // 配置报警策略弹窗可见
    historyVisible: false, // 配置报警策略弹窗
  }

  componentDidMount() {
    this.handleQuery()
    this.fetchAllTags()
    this.fetchParameterGroupTypes()
  }

  /**
   * 获取参数列表（分页）
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const {
      dispatch,
      match: { params: { modelId: sensorModel } },
    } = this.props
    dispatch({
      type: 'device/fetchParameterForPage',
      payload: { sensorModel, pageNum, pageSize, strategyDefaultFlag: '0' },
    })
  }

  /**
   * 获取全部图标
   */
  fetchAllTags = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/fetchAllTags', payload: {} })
  }


  /**
   * 获取参数分组类型数组
   */
  fetchParameterGroupTypes = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/fetchParameterGroupTypes' })
  }

  /**
   * 打开编辑参数弹窗
   */
  handleToEdit = (detail) => {
    this.setState({ detail, addModalVisible: true })
  }

  /**
   * 打开新增参数弹窗
   */
  handleViewAdd = () => {
    this.setState({ addModalVisible: true, detail: {} })
  }

  /**
   * 打开配置报警策略弹窗
   */
  handleViewAlarmModal = detail => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/fetchAlarmStrategy',
      payload: { paramId: detail.id, defaultFlag: '0' },
      callback: () => {
        this.setState({ detail, alarmModalVisible: true })
      },
    })

  }

  /**
   * 确认报警策略
   */
  handleDeployAlarm = () => {
    const {
      dispatch,
      device: {
        alarmStrategy = [],
      },
    } = this.props
    const { detail } = this.state
    // 筛选掉报警策略中 类型和值只有一项的以及都没有的
    const paramWarnStrategyList = alarmStrategy.reduce((arr, { condition, warnLevel, limitValue }) => {
      if (condition && !isNaN(limitValue)) {
        return [...arr, { condition, warnLevel, limitValue }]
      } else return arr
    }, [])
    dispatch({
      type: 'device/submitAlarmStrategy',
      payload: {
        paramId: detail.id,
        paramWarnStrategyList,
      },
      success: () => {
        message.success('配置报警策略成功')
        this.setState({ alarmModalVisible: false, detail: {} })
        this.handleQuery()
      },
      error: (res) => { message.error(res ? res.msg : '配置报警策略失败') },
    })
  }


  /**
   * 关闭配置报警策略弹窗
   */
  closeAlarmModal = () => {
    this.setState({ alarmModalVisible: false, detail: {} })
  }

  /**
   * 新增/编辑操作
   */
  handleAdd = (values) => {
    const {
      dispatch,
      match: { params: { modelId: sensorModel } },
    } = this.props
    const { detail } = this.state
    const tag = detail && detail.id ? '编辑' : '新增'
    const success = () => {
      message.success(`参数${tag}成功`)
      this.setState({ addModalVisible: false, detail: {} })
      this.handleQuery()
    }
    const error = (res) => { message.error(res ? res.msg : `参数${tag}失败`) }
    // 如果编辑
    if (detail && detail.id) {
      dispatch({
        type: 'device/editParameter',
        payload: { ...values, sensorModel, id: detail.id },
        success,
        error,
      })
    } else {
      // 新增
      dispatch({
        type: 'device/addParameter',
        payload: { ...values, sensorModel },
        success,
        error,
      })
    }
  }


  /**
   * 关闭新增/编辑参数弹窗
   */
  closeAddModal = () => {
    this.setState({ addModalVisible: false, detail: {} })
  }


  /**
   * 保存报警策略（redux保存）
   */
  saveAlarmStrategy = (list = []) => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/saveAlarmStrategy',
      payload: list,
    })
  }


  /**
   * 删除参数
   */
  handleDelete = (id) => {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'device/deleteParameter',
      payload: { id },
      success: () => {
        message.success('删除成功')
        this.handleQuery()
      },
      error: (res) => { message.error(res ? res.msg : '删除失败') },
    })
  }


  /**
   * 打开配置报警策略历史纪录弹窗
   */
  handleViewHistory = () => {
    const { dispatch } = this.props
    const { detail } = this.state
    // 获取历史纪录
    dispatch({
      type: 'device/fetchParameterStrategyHistory',
      payload: { paramId: detail.id, defaultFlag: '0' },
    })
    this.setState({ historyVisible: true })
  }

  /**
  * 渲染表格
  */
  renderTable = () => {
    const {
      tableLoading,
      device: {
        parameters: { list = [] },
      },
    } = this.props
    const columns = [
      {
        title: '参数编码',
        dataIndex: 'paramCode',
        align: 'center',
        width: 200,
        render: (val, row) => (
          <Fragment>
            <span style={{ paddingRight: '1em' }}>{val}</span>
            {row.logoWebUrl && (<img src={row.logoWebUrl} width="30" height="30" alt="图标" />)}
          </Fragment>
        ),
      },
      {
        title: '描述',
        dataIndex: 'paramDesc',
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'paramUnit',
        align: 'center',
        width: 130,
      },
      {
        title: '量程',
        key: '量程',
        align: 'center',
        width: 220,
        render: (val, { rangeMin, rangeMax }) => (<span>{rangeMin && rangeMax ? `${rangeMin}~${rangeMax}` : '——'}</span>),
      },
      {
        title: '报警策略数量',
        dataIndex: 'strategyCount',
        align: 'center',
        width: 130,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 250,
        render: (val, row) => (
          <Fragment>
            <a onClick={() => this.handleViewAlarmModal(row)}>配置报警策略</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleToEdit(row)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该型号参数吗？" onConfirm={() => this.handleDelete(row.id)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={tableLoading}
          columns={columns}
          dataSource={list}
          bordered
        />
      </Card>
    )
  }
  render() {
    const {
      match: { params: { brandId } },
      device: {
        parameters: { pagination: { total = 0 } },
        tagLibrary: { list: tagList },
        alarmStrategy,
        parameterGroupTypes, // 分组类型数组
      },
    } = this.props
    const { addModalVisible, alarmModalVisible, historyVisible } = this.state
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '品牌管理', name: '品牌管理', href: '/device-management/brand/list' },
      { title: '型号管理', name: '型号管理', href: `/device-management/brand/${brandId}/model` },
      { title, name: title },
    ]
    const addModalProps = {
      ...this.state,
      visible: addModalVisible,
      onOk: this.handleAdd,
      onCancel: this.closeAddModal,
      tagList,
      parameterGroupTypes,
    }
    const alarmProps = {
      ...this.state,
      visible: alarmModalVisible,
      onOk: this.handleDeployAlarm,
      onCancel: this.closeAlarmModal,
      saveAlarmStrategy: this.saveAlarmStrategy,
      alarmStrategy,
      historyVisible,
      handleViewHistory: this.handleViewHistory,
    }
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`参数总数：${total}`}
        extraContent={
          (<Button type="primary" onClick={this.handleViewAdd}>添加</Button>)
        }
      >
        {this.renderTable()}
        <RenderAddModal {...addModalProps} />
        <RenderAlarmStrategyModal {...alarmProps} />
      </PageHeaderLayout>
    )
  }
}
