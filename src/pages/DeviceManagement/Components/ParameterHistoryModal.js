import { Modal, Table } from 'antd';
import moment from 'moment';
import { connect } from 'dva';

// 参数--配置历史
const HistoryModal = (props) => {
  const {
    visible,
    detail,
    onCancel,
    width = 700,
    title = '参数配置历史',
    device: {
      historyList: list, // 参数配置历史数组
      operationTypeEnum, // 参数配置类型枚举
      alarmTypes,  // 配置参数---报警策略类型选项
    },
  } = props
  const paramUnit = detail.paramUnit || ''
  const columns = [
    {
      title: '用户',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'doTime',
      align: 'center',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作类型',
      dataIndex: 'doType',
      align: 'center',
      render: (val) => operationTypeEnum[val],
    },
    {
      title: '操作',
      dataIndex: '操作',
      align: 'center',
      render: (val, row) => {
        // doType 1 新增 2 修改 3  删除
        const { doType, oldCondition, oldLimitValue, oldWarnLevel, limitValue, condition, warnLevel } = row
        const type = operationTypeEnum[doType]
        const oldItem = alarmTypes.find(item => item.key === `${oldCondition} ${oldWarnLevel}`) || {}
        const item = alarmTypes.find(item => item.key === `${condition} ${warnLevel}`) || {}
        // 操作类型+报警策类类型+单位
        const oldLabel = `${oldItem.label}${oldLimitValue}${paramUnit}`
        const newLabel = `${item.label}${limitValue}${paramUnit}`
        // 如果新增
        if (doType === 1) {
          return `${type} ${newLabel}`
        } else if (doType === 3) {
          // 如果删除
          return `${type} ${oldLabel}`
        } else if (doType === 2) {
          // 如果编辑
          return `${oldLabel} ${type}为 ${newLabel}`
        } else return null
      },
    },
  ]
  return (
    <Modal
      width={width}
      title={title}
      visible={visible}
      footer={null}
      onCancel={onCancel}
      destroyOnClose
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        pagination={false}
      />
    </Modal>
  )
}

export default connect(({ device }) => ({
  device,
}))(
  HistoryModal
)
