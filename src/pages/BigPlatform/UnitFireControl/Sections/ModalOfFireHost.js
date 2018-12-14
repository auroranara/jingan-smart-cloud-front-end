import React, { PureComponent } from 'react';
import { Table, Pagination, Radio } from 'antd';
import NewModal from '../components/NewModal';
import styles from './ModalOfFireHost.less';

const columns = [
  {
    title: '名称',
    key: 'typeName',
    dataIndex: 'typeName',
    align: 'center',
    width: 200,
  },
  {
    title: '详细',
    key: 'detail',
    align: 'center',
    render: (val, { component_region, component_no, label }) => {
      return component_region && component_no ? `${component_region}回路${component_no}号 ${label}` : label || '暂无数据'
    },
  },
  {
    title: '位置',
    key: 'install_address',
    dataIndex: 'install_address',
    align: 'center',
    width: 200,
  },
  {
    title: '时间',
    key: 't',
    dataIndex: 't',
    align: 'center',
    width: 200,
  },
]

const options = ['火警', '故障', '联动', '监管', '屏蔽', '反馈']

export default class ModalOfFireHost extends PureComponent {

  render() {
    const {
      visible,
      onCancel,
      handlePageChange,
      onFilterChange,
      loading,
      list,
      currentFireHostType,
      pagination: {
        pageNum = 1,
        pageSize = 10,
        total = 0,
      },
    } = this.props
    return (
      <NewModal
        title="消防主机监测"
        width={900}
        visible={visible}
        onCancel={onCancel}
      >
        <div className={styles.modalOfFireHost}>
          <Radio.Group value={currentFireHostType} buttonStyle="solid" style={{ marginBottom: '10px' }} onChange={onFilterChange}>
            {options.map((item, i) => {
              return (<Radio.Button key={i} value={item}>{item}</Radio.Button>)
            })}
          </Radio.Group>
          <Table
            rowKey="id"
            showHeader={false}
            dataSource={list}
            loading={loading}
            columns={columns}
            pagination={false}
            bordered
          />
          <div className={styles.footer}>
            <Pagination current={pageNum} pageSize={pageSize} total={total} onChange={handlePageChange} />
          </div>
        </div>
      </NewModal>
    )
  }
}
