import React, { PureComponent } from 'react';
import { Modal, Table, Empty } from 'antd';
import moment from 'moment';
import styles from './TruckModal.less';

const DefaultFormat = 'YYYY-MM-DD HH:mm';
const NoData = '暂无数据';
const PresenceRecordColumns = [
  {
    title: '车牌号',
    dataIndex: 'carNumber',
    key: 'carNumber',
  },
  {
    title: '所在车场',
    dataIndex: 'parkName',
    key: 'parkName',
  },
  {
    title: '所在通道',
    dataIndex: 'gate',
    key: 'gate',
    render: (val, row) => {
      const { recordType, gateInName, gateOutName } = row;
      const gate = recordType === 1 ? gateInName : gateOutName;
      return gate || NoData;
    },
  },
  {
    title: '方向',
    dataIndex: 'recordType',
    key: 'recordType',
    render: val => (+val === 1 ? '入口' : '出口'),
  },
  {
    title: '出入场时间',
    dataIndex: 'time',
    key: 'time',
    align: 'center',
    render: (val, row) => {
      const { recordType, inTime, outTime } = row;
      const time = recordType === 1 ? inTime : outTime;
      return time ? moment(time).format(DefaultFormat) : NoData;
    },
  },
];
const AbnormalRecordColumns = [
  {
    title: '所在车场',
    dataIndex: 'parkName',
    key: 'parkName',
  },
  {
    title: '所在通道',
    dataIndex: 'gateName',
    key: 'gateName',
  },
  {
    title: '方向',
    dataIndex: 'ioState',
    key: 'ioState',
    render: val => (+val === 1 ? '入口' : '出口'),
  },
  {
    title: '放行时间',
    dataIndex: 'openTime',
    key: 'openTime',
    align: 'center',
    render: val => (val ? moment(val).format(DefaultFormat) : NoData),
  },
];
export default class TruckModal extends PureComponent {
  componentDidMount() {}

  render() {
    const {
      visible,
      onCancel,
      data: { top = [], left = [], right = [] } = {},
      ...restProps
    } = this.props;

    return (
      <Modal
        className={styles.truckModallContainer}
        width={1100}
        title={
          <div className={styles.modalTitle}>
            <span className={styles.line} />
            今日车辆统计数据
            <span className={styles.line} />
          </div>
        }
        visible={visible}
        onCancel={onCancel}
        footer={null}
        zIndex={1522}
        destroyOnClose
        {...restProps}
      >
        <div className={styles.body} style={{ height: document.body.clientHeight * 0.4 }}>
          <div className={styles.top}>
            <div className={styles.title}>
              进出场记录
              <span className={styles.extra}>（近50条数据）</span>
            </div>
            <div className={styles.scroll}>
              <Table
                rowKey="index"
                columns={PresenceRecordColumns}
                dataSource={top.map((item, index) => ({ ...item, index }))}
                pagination={false}
              />
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.left}>
              <div className={styles.title}>车辆统计</div>
              <div className={styles.scroll}>
                {left.length > 0 ? (
                  left.map((item, index) => {
                    const { parkName, inCar, outCar, presentCar } = item;
                    return (
                      <div className={styles.parkWrapper} key={index}>
                        <div className={styles.parkName}>{parkName}</div>
                        <div className={styles.countWrapper}>
                          <div className={styles.count}>
                            <div>进</div>
                            <div className={styles.value}>{inCar}</div>
                          </div>
                          <div className={styles.count}>
                            <div>出</div>
                            <div className={styles.value}>{outCar}</div>
                          </div>
                          <div className={styles.count}>
                            <div>在场车辆</div>
                            <div className={styles.value}>
                              {inCar - outCar > 0 ? inCar - outCar : 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </div>
            {/* <div className={styles.right}>
              <div className={styles.title}>
                手工开闸记录
                <span className={styles.extra}>（近50条数据）</span>
              </div>
              <div className={styles.scroll}>
                <Table
                  rowKey="id"
                  columns={AbnormalRecordColumns}
                  dataSource={right}
                  pagination={false}
                />
              </div>
            </div> */}
          </div>
        </div>
      </Modal>
    );
  }
}
