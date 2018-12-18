import React, { PureComponent } from 'react';
import { Table, Pagination } from 'antd';
import moment from 'moment';
import Switcher from '@/components/Switcher'
import NewModal from '../components/NewModal';
import HiddenDanger from '../../Safety/Components/HiddenDanger';
import styles from './ModalOfInspectionStatistics.less';

const columns = [
  {
    title: '巡查时间',
    key: 'check_date',
    dataIndex: 'check_date',
    align: 'center',
    width: 200,
    render: val => moment(+val).format('YYYY-MM-DD'),
  },
  {
    title: '巡查人',
    key: 'check_user_name',
    dataIndex: 'check_user_name',
    align: 'center',
  },
  {
    title: '巡查点位',
    key: 'object_title',
    dataIndex: 'object_title',
    align: 'center',
    width: 200,
  },
]

export default class ModalOfInspectionStatistics extends PureComponent {

  state = {
    detail: {},  // 隐患详情
  }

  // 点击查看隐患卡片
  handleViewDanger = (record) => {
    const { handleChangeDangerCardVisible } = this.props
    this.setState({
      detail: record.card,
    })
    handleChangeDangerCardVisible(true)
  }

  // 点击关闭隐患卡片
  handleCloseCard = () => {
    const { handleChangeDangerCardVisible } = this.props
    this.setState({
      detail: {},
    })
    handleChangeDangerCardVisible()
  }

  render() {
    const {
      visible,
      onCancel,
      type,   // 显示正常还是异常巡查统计(normal、abnormal)
      list,
      pagination: {
        pageNum,
        total,
        pageSize,
      },
      handlePageChange,
      cardVisible,
    } = this.props
    const {
      detail,
    } = this.state
    const item = {
      title: '隐患状态',
      key: 'danger_status',
      dataIndex: 'danger_status',
      align: 'center',
      width: 200,
      render: (val, record) => {
        if (val === '已关闭') {
          return (<span style={{ color: '#999999', cursor: 'pointer' }} onClick={() => this.handleViewDanger(record)}>{val}</span>)
        } else if (val === '已超期') {
          return (<span style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.handleViewDanger(record)}>{val}</span>)
        } else return (<span style={{ cursor: 'pointer' }} onClick={() => this.handleViewDanger(record)}>{val}</span>)
      },
    }
    const background = detail.hiddenDangerRecordDto ? detail.hiddenDangerRecordDto[0].files[0].web_url : null
    return (
      <NewModal
        title={type === 'normal' ? '巡查统计-正常' : '巡查统计-异常'}
        width={900}
        height={450}
        visible={visible}
        onCancel={onCancel}
        destroyOnClose
      >
        <div className={styles.modalOfInspection}>
          <Table
            rowKey={(record, i) => i}
            dataSource={list}
            // loading={loading}
            columns={type === 'normal' ? columns : [...columns, item]}
            pagination={false}
            bordered
          />
          {total > 0 && (
            <div className={styles.footer}>
              <Pagination current={pageNum} pageSize={pageSize} total={total} onChange={handlePageChange} />
            </div>)}
          {cardVisible && (
            <Switcher
              visible={true}
              style={{
                position: 'fixed',
                width: '430px',
                left: 'calc(50% - 215px)',
                top: 'calc(35% - 106px)',
                border: '1px solid #0967D3',
                boxShadow: '0 0 3px 1px #041220',
              }}
              onClose={this.handleCloseCard}
            >
              <HiddenDanger
                style={{ marginBottom: 0 }}
                data={{
                  description: detail.desc,
                  sbr: detail.report_user_name,
                  sbsj: moment(+detail.report_time).format('YYYY-MM-DD'),
                  zgr: detail.rectify_user_name,
                  plan_zgsj: moment(+detail.plan_rectify_time).format('YYYY-MM-DD'),
                  real_zgsj: moment(+detail.real_rectify_time).format('YYYY-MM-DD'),
                  fcr: detail.review_user_name,
                  fcsj: detail.review_time && moment(+detail.review_time).format('YYYY-MM-DD'),
                  status: +detail.status,
                  background: background,
                  businessType: detail.business_type,
                }}
              />
            </Switcher>
          )}
        </div>
      </NewModal>
    )
  }
}
