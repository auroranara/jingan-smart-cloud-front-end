import React, { Component } from 'react';
import { message, Row, Col, Table, Empty } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import Company from '../../Company';
import { connect } from 'dva';
import moment from 'moment';
import { LICENCE_PLATE_TYPES } from '../../VehicleManagement/List';
import { DIRECTIONS } from '../../ChannelManagement/List';
import styles from './index.less';

export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '通道状态', name: '通道状态' },
];
const GET_LIFT_RECORD_LIST_API = 'licensePlateRecognitionSystem/getLiftRecordList';
const PAGE_SIZE = 10;
const COLUMNS = [
  {
    title: '序号',
    dataIndex: '序号',
    align: 'center',
    render: (_, data, index) => index + 1,
  },
  {
    title: '类型',
    dataIndex: 'licencePlateType',
    align: 'center',
    render: value => <SelectOrSpan list={LICENCE_PLATE_TYPES} value={`${value}`} type="span" />,
  },
  {
    title: '车牌',
    dataIndex: 'licencePlate',
    align: 'center',
  },
  {
    title: '通道',
    dataIndex: 'channelName',
    align: 'center',
  },
  {
    title: '时间',
    dataIndex: 'time',
    align: 'center',
    render: value => value && moment(value).format(DEFAULT_FORMAT),
  },
  {
    title: '方向',
    dataIndex: 'direction',
    align: 'center',
    render: value => <SelectOrSpan list={DIRECTIONS} value={`${value}`} type="span" />,
  },
];
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

@connect(
  ({ user, licensePlateRecognitionSystem, loading }) => ({
    user,
    licensePlateRecognitionSystem,
    loading: loading.effects[GET_LIFT_RECORD_LIST_API],
  }),
  dispatch => ({
    getLiftRecordList(payload, callback) {
      dispatch({
        type: GET_LIFT_RECORD_LIST_API,
        payload,
        callback: (success, data) => {
          if (!success) {
            message.error('获取记录失败，请稍候重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class ChannelMonitor extends Component {
  componentDidMount() {
    const {
      user: {
        currentUser: { unitType, unitId: unitId1 },
      },
      match: {
        params: { unitId: unitId2 },
      },
      licensePlateRecognitionSystem: {
        liftRecordList: { pagination: { pageSize = PAGE_SIZE } = {} } = {},
      },
    } = this.props;
    const unitId = +unitType === 4 ? unitId1 : unitId2;
    if (unitId) {
      const { getLiftRecordList } = this.props;
      getLiftRecordList({
        // unitId,
        pageNum: 1,
        pageSize,
      });
    }
  }

  componentDidUpdate({
    match: {
      params: { unitId: prevUnitId },
    },
  }) {
    const {
      match: {
        params: { unitId },
      },
    } = this.props;
    if (unitId !== prevUnitId && unitId) {
      const {
        licensePlateRecognitionSystem: {
          liftRecordList: { pagination: { pageSize = PAGE_SIZE } = {} } = {},
        },
        getLiftRecordList,
      } = this.props;
      getLiftRecordList({
        // unitId,
        pageNum: 1,
        pageSize,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.licensePlateRecognitionSystem !== this.props.licensePlateRecognitionSystem ||
      nextProps.loading !== this.props.loading ||
      nextProps.match.params.unitId !== this.props.match.params.unitId
    );
  }

  handleTableChange = ({ current, pageSize }) => {
    const {
      user: {
        currentUser: { unitType, unitId: unitId1 },
      },
      match: {
        params: { unitId: unitId2 },
      },
      licensePlateRecognitionSystem: {
        liftRecordList: { pagination: { pageSize: prevPageSize = PAGE_SIZE } = {} } = {},
      },
      getLiftRecordList,
    } = this.props;
    const unitId = +unitType === 4 ? unitId1 : unitId2;
    getLiftRecordList({
      // unitId,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
  };

  renderPage() {
    const {
      route: { path },
      user: { currentUser: { unitType } = {} },
      licensePlateRecognitionSystem: {
        liftRecordList: { list = [], pagination: { total, pageNum, pageSize } = {} } = {},
      },
      loading = false,
    } = this.props;
    const breadcrumbList = BREADCRUMB_LIST.concat(
      [
        +unitType !== 4 && {
          title: '单位信息',
          name: '单位信息',
          href: path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '通道监控', name: '通道监控' },
      ].filter(v => v)
    );
    const channelList = [
      { channelName: '1', manned: 0, deviceList: [] },
      {
        channelName: '2',
        manned: 1,
        deviceList: [{ deviceName: '设备1', status: 0 }, { deviceName: '设备2', status: 0 }],
      },
      { channelName: '3', manned: 1, deviceList: [{ deviceName: '设备3', status: 0 }] },
      { channelName: '4', manned: 0, deviceList: [{ deviceName: '设备4', status: 1 }] },
    ];

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
      >
        {channelList && channelList.length ? (
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} xxl={8}>
              <Table
                dataSource={list}
                columns={COLUMNS}
                rowKey="id"
                bordered
                loading={loading}
                onChange={this.handleTableChange}
                rowClassName={(item, index) => (index % 2 === 1 ? styles.colorRow : undefined)}
                pagination={{
                  current: pageNum,
                  pageSize,
                  total,
                  // pageSizeOptions: ['5', '10', '15', '20'],
                  showTotal: total => `共 ${total} 条`,
                  showQuickJumper: true,
                  showSizeChanger: true,
                }}
              />
              {list &&
                list.length > 0 && (
                  <div className={styles.item}>
                    <div className={styles.itemTitle}>过车图片</div>
                    <div
                      className={styles.itemContent}
                      style={{ textAlign: 'center', lineHeight: '240px' }}
                    >
                      暂无图片
                    </div>
                  </div>
                )}
            </Col>
            <Col xs={24} sm={24} md={12} xxl={16}>
              <Row>
                {channelList.map(({ channelName, manned, deviceList }) => (
                  <Col xs={24} sm={24} xxl={12}>
                    <div className={styles.item}>
                      <div className={styles.itemTitle}>
                        <span className={styles.channelName}>{channelName}</span>
                        &nbsp;
                        <span className={+manned ? styles.manned : styles.unmanned}>
                          [{+manned ? '有人值守' : '无人值守'}]
                        </span>
                        &nbsp;
                        {deviceList &&
                          deviceList.length > 0 &&
                          deviceList.map(({ deviceName, status }) => (
                            <span className={styles.deviceStatus}>
                              [{deviceName}
                              &nbsp;
                              {+status ? '已连接' : '断开连接'}]
                            </span>
                          ))}
                      </div>
                      <div
                        className={styles.itemContent}
                        style={{ textAlign: 'center', lineHeight: '240px' }}
                      >
                        暂无图片
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        ) : (
          <Empty />
        )}
      </PageHeaderLayout>
    );
  }

  renderCompany() {
    const { route, location, match } = this.props;
    const props = {
      route,
      location,
      match,
    };

    return (
      <Company
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位信息',
          name: '单位信息',
        })}
        {...props}
      />
    );
  }

  render() {
    const {
      user: { currentUser: { unitType } = {} },
      match: {
        params: { unitId },
      },
    } = this.props;

    return unitType === 4 || unitId ? this.renderPage() : this.renderCompany();
  }
}
