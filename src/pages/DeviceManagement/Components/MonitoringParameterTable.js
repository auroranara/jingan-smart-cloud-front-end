import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Button,
  Modal,
  Input,
  message,
  Select,
  Row,
  Col,
} from 'antd';
import moment from 'moment';
import HistoryModal from '@/pages/DeviceManagement/Components/ParameterHistoryModal';

const FormItem = Form.Item;

// 渲染配置报警策略弹窗
const RenderAlarmStrategyModal = Form.create()(props => {
  const {
    detail: { paramDesc, id, paramUnit },
    visible,
    onCancel,
    onOk,
    alarmStrategy = [], // 报警策略数组
    defaultAlarmStrategy = [], // 默认报警策略
    saveAlarmStrategy,
    handleViewHistory, // 查看历史
    alarmTypes,
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
    newList.splice(i, 1, { ...item, condition, warnLevel, limitValue })
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
  const columns = [
    {
      title: '策略',
      key: '策略',
      align: 'center',
      render: (val, row) => {
        const target = alarmTypes.find(item => item.key === `${row.condition} ${row.warnLevel}`)
        return <span>{target.label}</span>
      },
    },
    {
      title: '参数',
      dataIndex: 'limitValue',
      align: 'center',
    },
  ]
  return (
    <Modal
      title={paramDesc ? `配置报警策略--${paramDesc}` : '配置报警策略'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      width={700}
    >
      <Card title="默认配置">
        <Table
          rowKey={(record) => `${record.condition} ${record.warnLevel}`}
          dataSource={defaultAlarmStrategy}
          columns={columns}
          pagination={false}
        />
      </Card>
      <Card title={(
        <Fragment>
          <span>自定义配置</span>
          <span style={{ float: 'right', color: '#1890ff', cursor: 'pointer' }} onClick={() => handleViewHistory(id)}>配置历史 >></span>
        </Fragment>
      )}
        style={{ marginTop: '15px' }}
      >
        <Button type="primary" disabled={alarmStrategy.length >= 4} onClick={handleAddItem}>添加</Button>
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
                    addonAfter={paramUnit || null}
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
      </Card>
    </Modal>
  )
})

@connect(({ user, device, loading }) => ({
  user,
  device,
  tableLoading: loading.effects['device/fetchAllParameters'],
}))
export default class DeployParameterTable extends PureComponent {

  state = {
    detail: {}, // 编辑时保存参数信息
    alarmModalVisible: false, // 配置报警策略弹窗可见
    // defaultAlarmStrategy: [], // 自定义报警策略
    alarmStrategy: [], // 自定义报警策略
    historyModalVisible: false, // 历史配置弹窗
  }

  /**
   * 获取参数列表（分页）
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const {
      dispatch,
      modelId,
    } = this.props
    dispatch({
      type: 'device/fetchAllParameters',
      payload: { sensorModel: modelId, pageNum, pageSize, strategyDefaultFlag: '0' },
    })
  }


  /**
   * 打开配置报警策略弹窗
   */
  handleViewAlarmModal = detail => {
    const {
      dispatch,
      sensorId, // 传感器id
      paramWarnStrategyDtos, // 已保存的全部已配置策略的参数 [ {paramId,paramWarnStrategyList} ]
    } = this.props
    const paramId = detail.id
    const callback = (list) => {
      // 判断是否已经有参数修改过报警策略
      const index = paramWarnStrategyDtos.findIndex(item => item.paramId === paramId)
      let alarmStrategy = []
      if (index > -1) {
        const { paramWarnStrategyList = [] } = paramWarnStrategyDtos[index]
        alarmStrategy = paramWarnStrategyList
      } else if (sensorId) {
        alarmStrategy = list
      }
      this.setState({ detail, alarmModalVisible: true, alarmStrategy })
    }
    // 获取默认报警策略
    dispatch({
      type: 'device/fetchAlarmStrategy',
      payload: { paramId, defaultFlag: '0' },
      callback,
    })

    // 如果编辑
    if (sensorId) {
      // 获取自定义报警策略
      dispatch({
        type: 'device/fetchCusAlarmStrategy',
        payload: { paramId, sensorId },
        callback,
      })
    }
  }

  /**
   * 确认报警策略
   */
  handleDeployAlarm = () => {
    const {
      onConfirm,
    } = this.props
    const { detail, alarmStrategy } = this.state
    // 筛选掉报警策略中 类型和值只有一项的以及都没有的
    const paramWarnStrategyList = alarmStrategy.reduce((arr, { condition, warnLevel, limitValue, ...res }) => {
      if (condition && !isNaN(limitValue)) {
        return [...arr, { ...res, condition, warnLevel, limitValue }]
      } else return arr
    }, [])
    this.setState({ alarmModalVisible: false })
    onConfirm(detail.id, paramWarnStrategyList)
  }


  /**
   * 关闭配置报警策略弹窗
   */
  closeAlarmModal = () => {
    this.setState({ alarmModalVisible: false, detail: {}, historyModalVisible: false })
  }

  /**
  * 保存报警策略（redux保存）
  */
  saveAlarmStrategy = (list = []) => {
    this.setState({ alarmStrategy: list })
  }


  /**
   * 打开历史配置弹窗
   */
  handleViewHistory = (paramId) => {
    const {
      dispatch,
      sensorId,
    } = this.props
    dispatch({
      type: 'device/fetchParameterStrategyHistory',
      payload: { paramId, sensorId },
    })
    this.setState({ historyModalVisible: true })
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
        width: 100,
      },
      {
        title: '量程',
        key: '量程',
        align: 'center',
        width: 100,
        render: (val, { rangeMin, rangeMax }) => (<span>{rangeMin && rangeMax ? `${rangeMin}~${rangeMax}` : '——'}</span>),
      },
      {
        title: '报警策略数量',
        dataIndex: 'customStrategyCount',
        align: 'center',
        width: 100,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 150,
        render: (val, row) => (
          <Fragment>
            <a onClick={() => this.handleViewAlarmModal(row)}>配置报警策略</a>
          </Fragment>
        ),
      },
    ]
    return (
      <Table
        rowKey="id"
        loading={tableLoading}
        columns={columns}
        dataSource={list}
        bordered
        pagination={false}
      />
    )
  }

  render() {
    const {
      device: {
        alarmStrategy: defaultAlarmStrategy,
        alarmTypes,
      },
    } = this.props
    const { alarmModalVisible, alarmStrategy, detail, historyModalVisible } = this.state
    const alarmProps = {
      ...this.state,
      visible: alarmModalVisible,
      onOk: this.handleDeployAlarm,
      onCancel: this.closeAlarmModal,
      saveAlarmStrategy: this.saveAlarmStrategy,
      alarmStrategy,
      defaultAlarmStrategy,
      handleViewHistory: this.handleViewHistory,
      alarmTypes,
    }
    const historyProps = {
      visible: historyModalVisible,
      onCancel: () => { this.setState({ historyModalVisible: false }) },
      detail,
    }
    return (
      <Fragment>
        {this.renderTable()}
        <RenderAlarmStrategyModal {...alarmProps} />
        <HistoryModal {...historyProps} />
      </Fragment>
    )
  }
}
