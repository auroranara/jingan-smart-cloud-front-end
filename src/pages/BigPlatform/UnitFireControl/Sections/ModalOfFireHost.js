import React, { PureComponent } from 'react';
import { Table, Pagination, Radio, Row, Col, Icon } from 'antd';
import NewModal from '../components/NewModal';
import Ellipsis from '@/components/Ellipsis';
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
      // handlePageChange,
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
          <Row className={styles.sectionFilter}>
            {options && options.map((item, i) => (
              <Col span={4} className={styles.filter} key={i}>
                <div className={currentFireHostType === item ? styles.activeFilter : styles.inActiveFilter}
                  onClick={() => onFilterChange(item)}>
                  {item}
                </div>
              </Col>
            ))}
          </Row>
          {/* <Table
            rowKey="id"
            showHeader={false}
            dataSource={list}
            loading={loading}
            columns={columns}
            pagination={false}
            bordered
          /> */}
          {/* <div className={styles.footer}>
            <Pagination current={pageNum} pageSize={pageSize} total={total} onChange={handlePageChange} />
          </div> */}
          {list && list.length > 0 ? (
            <div className={styles.listContainer}>
              {list.map(({ typeName, component_region, component_no, label, install_address, t, icon = null }, i) => (
                <Col key={i} span={12} className={styles.cardContainer}>
                  <div className={styles.cardItem}>
                    <div className={styles.innerItem}>
                      <div className={styles.titleContainer}>
                        <div className={styles.title}>
                          <div className={styles.icon} style={{
                            backgroundImage: `url(${icon})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center',
                            backgroundSize: '65% 65%',
                          }}></div>
                          <div className={styles.remarks}>{typeName}</div>
                        </div>
                      </div>
                      <div className={styles.line}>{`${component_region}回路${component_no}号`}</div>
                      <div className={styles.line}>
                        <Ellipsis lines={1} tooltip>
                          <span>{label}</span>
                        </Ellipsis>
                      </div>
                      <div className={styles.lastLine}>
                        <div className={styles.location}>
                          <span><Icon type="environment" theme="outlined" />{install_address}</span>
                        </div>
                        <div className={styles.time}><span>{t}</span></div>
                      </div>
                    </div>
                    {/* <div className={styles.topRightGreenTag}>处理中</div> */}
                  </div>
                </Col>
              ))}
            </div>) : (<div className={styles.noContent}><span>暂无数据</span></div>)}
        </div>
      </NewModal>
    )
  }
}
