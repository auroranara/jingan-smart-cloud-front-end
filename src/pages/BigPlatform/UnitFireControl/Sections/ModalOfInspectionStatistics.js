import React, { PureComponent, Fragment } from 'react';
import { Table, Pagination, Col, Button, Icon } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Switcher from '@/components/Switcher'
import NewModal from '../components/NewModal';
import HiddenDanger from '../../Safety/Components/HiddenDanger';
import Ellipsis from '@/components/Ellipsis';
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

@connect(({ unitFireControl }) => ({
  unitFireControl,
}))
export default class ModalOfInspectionStatistics extends PureComponent {

  // 点击查看隐患卡片
  handleViewDanger = (check_id = null) => {
    const { dispatch } = this.props
    const { handleChangeDangerCardVisible } = this.props
    dispatch({
      type: 'unitFireControl/fetchPatrolDangers',
      payload: { checkId: check_id },
      callback: () => {
        handleChangeDangerCardVisible(true)
      },
    })
  }

  // 点击关闭隐患卡片
  handleCloseCard = () => {
    const { handleChangeDangerCardVisible } = this.props
    handleChangeDangerCardVisible()
  }

  render() {
    const {
      visible,
      onCancel,
      type,   // 显示正常还是异常巡查统计(normal、abnormal)
      handlePageChange,
      cardVisible,
      moreLoading,  // 加载更多的loading
      unitFireControl: {
        inspectionStatistics: {
          list,
          dangers,
          isLast,
        },
      },
    } = this.props
    /* const item = {
      title: '隐患状态',
      key: 'dangerStatus',
      dataIndex: 'dangerStatus',
      align: 'center',
      width: 200,
      render: (val, record) => {
        if (val === '已关闭') {
          return (<span style={{ color: '#999999', cursor: 'pointer' }} onClick={() => this.handleViewDanger(record)}>{val}</span>)
        } else if (val === '已超期') {
          return (<span style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.handleViewDanger(record)}>{val}</span>)
        } else return (<span style={{ cursor: 'pointer' }} onClick={() => this.handleViewDanger(record)}>{val}</span>)
      },
    } */
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
          {/* <Table
            rowKey={(record, i) => i}
            dataSource={list}
            // loading={loading}
            columns={type === 'normal' ? columns : [...columns, item]}
            pagination={false}
            bordered
          /> */}
          {/* {total > 0 && (
            <div className={styles.footer}>
              <Pagination current={pageNum} pageSize={pageSize} total={total} onChange={handlePageChange} />
            </div>)} */}
          <div className={styles.contentContainer}>
            {list.map(({ check_id, object_title = null, check_user_name = null, check_date = null, dangerStatus = null }, i) => (
              <Col span={12} key={i} className={styles.cardContainer}>
                <div className={styles.cardItem}
                  style={{ cursor: type === 'abnormal' ? 'pointer' : 'inherit' }}
                  onClick={type === 'abnormal' ? () => this.handleViewDanger(check_id) : null}>
                  <div className={styles.line}>
                    <span className={styles.label}>巡查点位</span>
                    <span className={styles.text}>
                      <Ellipsis tooltip lines={1}>{object_title}</Ellipsis>
                    </span>
                  </div>
                  <div className={styles.line}>
                    <span className={styles.label}>巡查人</span>
                    <span className={styles.text}>
                      <Ellipsis tooltip lines={1}>{check_user_name}</Ellipsis>
                    </span>
                  </div>
                  <div className={styles.line}>
                    <span className={styles.label}>巡查时间</span>
                    <span className={styles.text}>
                      <Ellipsis tooltip lines={1}>{moment(+check_date).format('YYYY-MM-DD')}</Ellipsis>
                    </span>
                  </div>
                  {type === 'abnormal' && dangerStatus && (
                    <div className={styles.line}>
                      <span className={styles.label}>隐患状态</span>
                      <span className={styles.text}>
                        <Ellipsis tooltip lines={1}>
                          {dangerStatus.split('/').map((item, i) => (
                            <Fragment key={i}>
                              {i !== 0 && <span>/</span>}
                              <span style={{ color: item.includes('已超期') ? 'red' : 'inherit' }}>{item}</span>
                            </Fragment>
                          ))}
                        </Ellipsis>
                      </span>
                    </div>
                  )}
                </div>
              </Col>
            ))}
            {list.length > 0 && !isLast ? (
              <Col span={24} >
                <div className={styles.moreButton} onClick={handlePageChange}>
                  {moreLoading ? (<Fragment><Icon style={{ marginRight: '0.5em' }} type="loading" /><span>加载中...</span></Fragment>) : (
                    <span>加载更多</span>
                  )}
                </div>
              </Col>
            ) : null}
          </div>
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
              {dangers.map(({
                _desc = null,
                _report_user_name = null,
                _report_time = null,
                _rectify_user_name = null,
                _plan_rectify_time = null,
                _real_rectify_time = null,
                _review_user_name = null,
                _review_time = null,
                hiddenStatus = null,
                business_type = null,
                path = null,
                real_reviewer_name = null,
              }, i) => (
                  <HiddenDanger
                    key={i}
                    style={{ marginBottom: 0, background: '#033069' }}
                    data={{
                      description: _desc,
                      sbr: _report_user_name,
                      sbsj: moment(+_report_time).format('YYYY-MM-DD'),
                      zgr: _rectify_user_name,
                      plan_zgsj: moment(+_plan_rectify_time).format('YYYY-MM-DD'),
                      real_zgsj: moment(+_real_rectify_time).format('YYYY-MM-DD'),
                      fcr: real_reviewer_name || _review_user_name,
                      fcsj: _review_time && moment(+_review_time).format('YYYY-MM-DD'),
                      status: +hiddenStatus,
                      background: path,
                      businessType: business_type,
                    }}
                  />
                ))}
            </Switcher>
          )}
        </div>
      </NewModal >
    )
  }
}
