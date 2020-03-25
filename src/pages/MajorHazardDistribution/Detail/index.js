import React, { Component, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import {
  message,
  Spin,
  Card,
  Row,
  Col,
  Empty,
  List,
  Skeleton,
  Collapse,
  Badge,
  Table,
  Button,
  Modal,
} from 'antd';
import EmptyText from '@/jingan-components/View/EmptyText';
import TextAreaEllipsis from '@/jingan-components/View/TextAreaEllipsis';
import Link from '@/jingan-components/View/Link';
import AMap from '@/jingan-components/Form/AMap';
import Ellipsis from '@/components/Ellipsis';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import Tank from '../components/Tank';
import Gas from '../components/Gas';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  BREADCRUMB_LIST_PREFIX,
  NAMESPACE,
  DETAIL_API,
  SECURITY_CODE,
  LEVELS,
  LIST_GRID,
  COUNT_API,
  TANK_CODE,
  ALARM_WORK_ORDER_CODE,
  LOCATION_LIST_API,
  ALARM_LIST_API,
  MONITOR_TREND_CODE,
  TANK_AREA_MONITOR_LIST_API,
  TANK_MONITOR_LIST_API,
  SECURITY_LIST_API,
  SURROUNDING_LIST_API,
  SURROUNDING_TYPE_MAPPER,
} from '../config';
import { getPageSize, setPageSize } from '@/utils/utils';
import { RISK_CATEGORIES } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import iconTankAreaCount from '../assets/icon-tank-area-count.png';
import iconTankCount from '../assets/icon-tank-count.png';
import iconVideoCount from '../assets/icon-video-count.png';
import iconCombustibleGasCount from '../assets/icon-combustible-gas-count.png';
import iconToxicGasCount from '../assets/icon-toxic-gas-count.png';
import formula from '../assets/formula.png';
import styles from './index.less';

@connect(
  (
    {
      user: {
        currentUser: { unitType, unitId: unitId1, permissionCodes },
      },
      [NAMESPACE]: {
        detail,
        count,
        locationList,
        alarmList,
        tankAreaMonitorList,
        tankMonitorList,
        securityList,
        surroundingList,
      },
      loading: {
        effects: {
          [DETAIL_API]: loading,
          [COUNT_API]: loadingCount,
          [LOCATION_LIST_API]: loadingLocationList,
          [ALARM_LIST_API]: loadingAlarmList,
          [TANK_AREA_MONITOR_LIST_API]: loadingTankAreaMonitorList,
          [TANK_MONITOR_LIST_API]: loadingTankMonitorList,
          [SECURITY_LIST_API]: loadingSecurityList,
          [SURROUNDING_LIST_API]: loadingSurroundingList,
        },
      },
    },
    {
      match: {
        params: { unitId: unitId2, id },
      },
      route: { path, name },
      location: { pathname },
    }
  ) => {
    const isUnit = unitType === 4;
    const unitId = isUnit ? unitId1 : unitId2;
    const companyUrl = path.replace(new RegExp(':.*'), 'list');
    return {
      isUnit,
      unitId,
      breadcrumbList: BREADCRUMB_LIST_PREFIX.concat(
        [
          !isUnit && {
            title: '单位列表',
            name: '单位列表',
            href: companyUrl,
          },
          {
            title: '重大危险源分布',
            name: '重大危险源分布',
            href: pathname.replace(new RegExp(`${name}.*`), 'list'),
          },
          { title: '重大危险源详情', name: '重大危险源详情' },
        ].filter(v => v)
      ),
      detail,
      count,
      locationList,
      alarmList,
      tankAreaMonitorList,
      tankMonitorList,
      securityList,
      surroundingList,
      loading,
      loadingCount,
      loadingLocationList,
      loadingAlarmList,
      loadingTankAreaMonitorList,
      loadingTankMonitorList,
      loadingSecurityList,
      loadingSurroundingList,
      securityUrl: pathname.replace(new RegExp(`${id}.*`), `${id}/security`),
      hasSecurityAuthority: permissionCodes.includes(SECURITY_CODE),
      hasTankAuthority: permissionCodes.includes(TANK_CODE),
      hasAlarmWorkOrderAuthority: permissionCodes.includes(ALARM_WORK_ORDER_CODE),
      hasMonitorTrendAuthority: permissionCodes.includes(MONITOR_TREND_CODE),
      goToCompany() {
        router.push(companyUrl);
      },
    };
  },
  null,
  (stateProps, { dispatch }, ownProps) => {
    const { unitId } = stateProps;
    const {
      match: {
        params: { id },
      },
    } = ownProps;
    return {
      ...stateProps,
      ...ownProps,
      getDetail(payload, callback) {
        dispatch({
          type: DETAIL_API,
          payload: {
            id,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取重大危险源详情失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getCount(payload, callback) {
        dispatch({
          type: COUNT_API,
          payload: {
            id,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取统计数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getLocationList(payload, callback) {
        dispatch({
          type: LOCATION_LIST_API,
          payload: {
            pageNum: 1,
            pageSize: 0,
            dangerSourceId: id,
            storageUnit: 1,
            type: 302,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取物料生产存储单元失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getAlarmList(payload, callback) {
        dispatch({
          type: ALARM_LIST_API,
          payload: {
            pageNum: 1,
            pageSize: 0,
            dangerSourceId: id,
            type: 301,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取监测报警列表失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getTankAreaMonitorList(payload, callback) {
        dispatch({
          type: TANK_AREA_MONITOR_LIST_API,
          payload: {
            pageNum: 1,
            pageSize: 0,
            equipmentTypes: '405,406',
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取罐区监测列表失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getTankMonitorList(payload, callback) {
        dispatch({
          type: TANK_MONITOR_LIST_API,
          payload: {
            pageNum: 1,
            pageSize: 0,
            type: 302,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取储罐监测列表失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getSecurityList(payload, callback) {
        dispatch({
          type: SECURITY_LIST_API,
          payload: {
            dangerSourceId: id,
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取安防措施列表失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      getSurroundingList(payload, callback) {
        dispatch({
          type: SURROUNDING_LIST_API,
          payload: {
            companyId: unitId,
            pageNum: 1,
            pageSize: getPageSize(),
            ...payload,
          },
          callback(success, data) {
            if (!success) {
              message.error('获取安防措施列表失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
    };
  }
)
export default class MajorHazardDistributionDetail extends Component {
  state = {
    tabActiveKey: undefined,
    videoList: undefined,
    videoVisible: false,
    videoKey: undefined,
    activeKey: undefined,
    mapVisible: false,
    position: undefined,
  };

  componentDidMount() {
    const { unitId, getDetail, getCount, goToCompany } = this.props;
    if (unitId) {
      getDetail();
      getCount();
      this.handleTabChange('1');
    } else {
      goToCompany();
    }
  }

  componentDidUpdate({ unitId: prevUnitId, id: prevId }) {
    const { unitId, id } = this.props;
    if (unitId) {
      if (unitId !== prevUnitId || id !== prevId) {
        const { getDetail, getCount } = this.props;
        getDetail();
        getCount();
        this.handleTabChange('1');
      }
    } else {
      const { goToCompany } = this.props;
      goToCompany();
    }
  }

  handleTabChange = tabActiveKey => {
    this.setState({
      tabActiveKey,
    });
    if (tabActiveKey === '1') {
      const { getLocationList } = this.props;
      getLocationList();
    } else if (tabActiveKey === '2') {
      const { getAlarmList } = this.props;
      getAlarmList(undefined, (success, data) => {
        if (success) {
          this.handleActiveKeyChange((data[0] || {}).id);
        }
      });
    } else if (tabActiveKey === '3') {
      const { getSecurityList } = this.props;
      getSecurityList();
    } else if (tabActiveKey === '4') {
      const { getSurroundingList } = this.props;
      getSurroundingList();
    }
  };

  handleShowVideo = videoList => {
    this.setState({
      videoList: videoList.map(item => ({ key_id: item.keyId, device_id: item.deviceId, ...item })),
      videoVisible: true,
      videoKey: videoList[0].keyId || videoList[0].key_id,
    });
  };

  handleHideVideo = () => {
    this.setState({
      videoVisible: false,
    });
  };

  handleActiveKeyChange = activeKey => {
    this.setState({
      activeKey,
    });
    if (activeKey) {
      const { getTankAreaMonitorList, getTankMonitorList } = this.props;
      getTankAreaMonitorList({ targetId: activeKey });
      getTankMonitorList({ parentIds: activeKey });
    }
  };

  handleTableChange = ({ current, pageSize }) => {
    const {
      surroundingList: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      getSurroundingList,
    } = this.props;
    getSurroundingList({
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  handleHideMap = () => {
    this.setState({
      mapVisible: false,
    });
  };

  render0() {
    const {
      detail,
      locationList = [],
      securityUrl,
      hasSecurityAuthority,
      hasTankAuthority,
      hasAlarmWorkOrderAuthority,
    } = this.props;

    return locationList && locationList.length ? (
      <List
        grid={LIST_GRID}
        dataSource={locationList}
        renderItem={item => (
          <List.Item>
            <Tank
              data={item}
              securityUrl={securityUrl}
              hasSecurityAuthority={hasSecurityAuthority}
              hasTankAuthority={hasTankAuthority}
              hasAlarmWorkOrderAuthority={hasAlarmWorkOrderAuthority}
              onVideoClick={this.handleShowVideo}
              majorHazardName={detail && detail.name}
            />
          </List.Item>
        )}
      />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  }

  render1() {
    const {
      detail,
      alarmList = [],
      tankAreaMonitorList,
      tankMonitorList,
      securityUrl,
      hasSecurityAuthority,
      hasTankAuthority,
      hasMonitorTrendAuthority,
      hasAlarmWorkOrderAuthority,
      loadingTankAreaMonitorList = false,
      loadingTankMonitorList = false,
    } = this.props;
    const { activeKey } = this.state;

    return alarmList && alarmList.length ? (
      <Collapse accordion activeKey={activeKey} onChange={this.handleActiveKeyChange}>
        {alarmList.map(({ id, name, code, storageMaterialNames, videoList }) => (
          <Collapse.Panel
            header={
              <div>
                <div className={styles.fieldContainer}>
                  <Row>
                    {[
                      {
                        key: '储罐区名称',
                        value: name,
                      },
                      { key: '统一编码', value: code },
                      { key: '存储物质', value: storageMaterialNames },
                    ].map(({ key, value }) => (
                      <Col span={8} key={key}>
                        <div className={styles.fieldWrapper} key={key}>
                          <div className={styles.fieldName}>{key}：</div>
                          <div className={styles.fieldValue}>
                            {value ? (
                              <Ellipsis lines={1} tooltip>
                                {value}
                              </Ellipsis>
                            ) : (
                              <EmptyText />
                            )}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <Row>
                    <Col span={8}>
                      <div className={styles.padding}>
                        <Link to={`${securityUrl}/${id}`} disabled={!hasSecurityAuthority}>
                          查看安防措施>>
                        </Link>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styles.padding}>
                        <Link
                          to={`/major-hazard-info/storage-area-management/detail/${id}`}
                          disabled={!hasSecurityAuthority}
                        >
                          更多基础信息>>
                        </Link>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styles.padding}>
                        {videoList &&
                          videoList.length > 0 && (
                            <div
                              className={styles.videoIcon}
                              onClick={e => {
                                e.stopPropagation();
                                this.handleShowVideo(videoList);
                              }}
                            />
                          )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            }
            key={id}
          >
            <Spin spinning={loadingTankAreaMonitorList || loadingTankMonitorList}>
              <div className={styles.subTitle}>罐区监测</div>
              {tankAreaMonitorList && tankAreaMonitorList.length ? (
                <List
                  grid={LIST_GRID}
                  dataSource={tankAreaMonitorList}
                  renderItem={item => (
                    <List.Item>
                      <Gas
                        data={item}
                        hasMonitorTrendAuthority={hasMonitorTrendAuthority}
                        hasAlarmWorkOrderAuthority={hasAlarmWorkOrderAuthority}
                        onVideoClick={this.handleShowVideo}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
              <div className={styles.subTitle}>储罐监测</div>
              {tankMonitorList && tankMonitorList.length ? (
                <List
                  grid={LIST_GRID}
                  dataSource={tankMonitorList}
                  renderItem={item => (
                    <List.Item>
                      <Tank
                        data={item}
                        securityUrl={securityUrl}
                        hasSecurityAuthority={hasSecurityAuthority}
                        hasTankAuthority={hasTankAuthority}
                        hasAlarmWorkOrderAuthority={hasAlarmWorkOrderAuthority}
                        onVideoClick={this.handleShowVideo}
                        majorHazardName={detail && detail.name}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Spin>
          </Collapse.Panel>
        ))}
      </Collapse>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  }

  render2() {
    const { detail: { r, personNum, alpha } = {}, securityList } = this.props;

    return (
      <Card>
        <div className={styles.referenceContainer}>
          <div className={styles.referenceWrapper}>
            <div className={styles.referenceName}>R值：</div>
            <div className={styles.referenceValue}>
              {r ? (
                <Ellipsis lines={1} tooltip>
                  {r}
                </Ellipsis>
              ) : (
                <EmptyText />
              )}
            </div>
          </div>
          <div className={styles.referenceMarkWrapper}>
            <div className={styles.referenceMarkName}>备注：</div>
            <div className={styles.referenceMarkValue}>
              <div>
                1、R值由专家根据公式评估算出，具体参照《GB 18218-2018 危险化学品重大危险源辨识》
              </div>
              <div>
                2、
                <img className={styles.formula} src={formula} alt="" />
              </div>
            </div>
          </div>
          <div className={styles.referenceWrapper}>
            <div className={styles.referenceName}>周围500内常住人口数量：</div>
            <div className={styles.referenceValue}>
              {personNum ? (
                <Ellipsis lines={1} tooltip>
                  {personNum}
                  {alpha && `（α=${alpha}）`}
                </Ellipsis>
              ) : (
                <EmptyText />
              )}
            </div>
          </div>
          <div className={styles.referenceMaterailWrapper}>
            <div className={styles.referenceMaterailName}>重大危险源存储物质</div>
            {securityList && securityList.length ? (
              <List
                grid={LIST_GRID}
                dataSource={securityList}
                renderItem={({ chineName, riskCateg, correctionCoefficient, limitValue }) => (
                  <List.Item>
                    <Card>
                      <div className={styles.fieldContainer}>
                        {[
                          { key: '存储物质', value: chineName },
                          {
                            key: '危险性类别',
                            value:
                              RISK_CATEGORIES[riskCateg] &&
                              `${RISK_CATEGORIES[riskCateg]}${
                                correctionCoefficient ? `（${correctionCoefficient}）` : ''
                              }`,
                          },
                          { key: '累计设计储量', value: undefined },
                          { key: '临界量（Q）', value: limitValue !== null && `${limitValue}t` },
                        ].map(({ key, value }) => (
                          <div className={styles.fieldWrapper} key={key}>
                            <div className={styles.fieldName}>{key}：</div>
                            <div className={styles.fieldValue}>
                              {value ? (
                                <Ellipsis lines={1} tooltip>
                                  {value}
                                </Ellipsis>
                              ) : (
                                <EmptyText />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <div className={styles.referenceMaterailMark}>
              累计设计储量为该物质的各个存储/生产单元设计储量之和，存储/生产单元包括储罐、库房、气柜（设计柜容*该物质的密度）、生产装置、工业管道（设计容积*该物质的密度）
            </div>
          </div>
        </div>
      </Card>
    );
  }

  render3() {
    const {
      surroundingList: {
        list = [],
        pagination: { total = 0, pageNum = 1, pageSize = getPageSize() } = {},
      } = {},
    } = this.props;
    const columns = [
      {
        title: '周边环境类型',
        dataIndex: 'environmentType',
        align: 'center',
        render: value => SURROUNDING_TYPE_MAPPER[value],
      },
      { title: '周边环境名称', dataIndex: 'environmentName', align: 'center' },
      { title: '周边环境方位', dataIndex: 'environmentBear', align: 'center' },
      {
        title: '与企业最小距离',
        dataIndex: 'minSpace',
        align: 'center',
        render: value => value && `${value}m`,
      },
      { title: '人员数量', dataIndex: 'perNumber', align: 'center' },
      {
        title: '联系人',
        dataIndex: '联系人',
        align: 'center',
        render: (_, { contact, areaCode, telNumber, contactPhone, contactMail }) => (
          <div className={styles.contactContainer}>
            <div className={styles.contactWrapper}>
              <div className={styles.contactName}>姓名：</div>
              <div className={styles.contactValue}>{contact}</div>
            </div>
            <div className={styles.contactWrapper}>
              <div className={styles.contactName}>固定电话：</div>
              <div className={styles.contactValue}>
                {[areaCode, telNumber].filter(v => v).join('-')}
              </div>
            </div>
            <div className={styles.contactWrapper}>
              <div className={styles.contactName}>移动电话：</div>
              <div className={styles.contactValue}>{contactPhone}</div>
            </div>
            <div className={styles.contactWrapper}>
              <div className={styles.contactName}>电子邮箱：</div>
              <div className={styles.contactValue}>{contactMail}</div>
            </div>
          </div>
        ),
      },
      {
        title: '经纬度',
        dataIndex: '经纬度',
        align: 'center',
        render: (_, { longitude, latitude }) =>
          longitude !== null &&
          longitude >= -180 &&
          longitude <= 180 &&
          latitude !== null &&
          latitude >= -90 &&
          latitude <= 90 && (
            <Button
              type="link"
              onClick={() =>
                this.setState({
                  mapVisible: true,
                  position: { longitude: +longitude, latitude: +latitude },
                })
              }
            >
              查看
            </Button>
          ),
      },
    ];

    return list && list.length > 0 ? (
      <Card>
        <Table
          className={styles.table}
          dataSource={list}
          columns={columns}
          rowKey="id"
          scroll={{
            x: true,
          }}
          onChange={this.handleTableChange}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            pageSizeOptions: ['5', '10', '15', '20'],
            showTotal: total => `共 ${total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
          }}
        />
      </Card>
    ) : (
      <Empty />
    );
  }

  renderMap() {
    const { mapVisible, position } = this.state;

    return (
      <Modal
        bodyStyle={{ padding: 0, height: 600 }}
        title="位置信息"
        visible={mapVisible}
        onCancel={this.handleHideMap}
        footer={null}
        destroyOnClose
        zIndex={1009}
        width="80%"
      >
        <AMap center={position} markerList={[{ key: '1', position }]} />
      </Modal>
    );
  }

  render() {
    const {
      breadcrumbList,
      loading = false,
      loadingCount = false,
      detail: {
        name,
        code,
        dangerLevel,
        location,
        dutyPerson,
        recordDate,
        useData,
        dangerTechnology,
        minSpace,
        safetyDistance,
        personNum,
      } = {},
      count: {
        tankArea: tankAreaCount,
        tank: tankCount,
        video: videoCount,
        combustibleGas: combustibleGasCount,
        toxicGas: toxicGasCount,
        location: locationCount,
        alarm: alarmCount,
      } = {},
      securityUrl,
      loadingLocationList = false,
      loadingAlarmList = false,
      loadingSecurityList = false,
      loadingSurroundingList = false,
      hasSecurityAuthority,
    } = this.props;
    const { tabActiveKey, videoList, videoVisible, videoKey } = this.state;
    const tabList = [
      {
        key: '1',
        tab: `物料生产存储单元${locationCount !== null ? `（${locationCount || 0}）` : ''}`,
      },
      {
        key: '2',
        tab: (
          <Fragment>
            监测报警
            {alarmCount !== null && <Badge className={styles.badge} count={alarmCount} showZero />}
          </Fragment>
        ),
      },
      { key: '3', tab: `等级评估参考` },
      { key: '4', tab: `周边环境` },
    ];

    return (
      <PageHeaderLayout
        className={styles.layout}
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
        action={
          <Link to={securityUrl} disabled={!hasSecurityAuthority}>
            查看安防措施
          </Link>
        }
        content={
          !loading && !loadingCount ? (
            <Fragment>
              <div className={styles.fieldContainer}>
                <Row>
                  {[
                    {
                      key: '重大危险源名称',
                      value: name,
                    },
                    {
                      key: '统一编码',
                      value: code,
                      span: 16,
                    },
                    {
                      key: '重大危险源等级',
                      value: LEVELS[dangerLevel],
                    },
                    {
                      key: '区域位置',
                      value: location,
                    },
                    {
                      key: '责任人',
                      value: dutyPerson && (
                        <TextAreaEllipsis
                          length={9}
                          value={dutyPerson
                            .split(',')
                            .join(' ')
                            .split(';')
                            .join('\n')}
                        />
                      ),
                      reserved: true,
                    },
                    {
                      key: '备案时间',
                      value: recordDate && moment(recordDate).format('YYYY.MM.DD'),
                    },
                    {
                      key: '投用日期',
                      value: useData && moment(useData).format('YYYY.MM.DD'),
                    },
                    {
                      key: '涉及危险工艺',
                      value: dangerTechnology && <TextAreaEllipsis value={dangerTechnology} />,
                      reserved: true,
                    },
                    {
                      key: '周边防护目标最近距离（m）',
                      value: minSpace,
                    },
                    {
                      key: '重大危险源周边安全间距（m）',
                      value: safetyDistance,
                    },
                    {
                      key: '周边500米内常住人口数量',
                      value: personNum,
                    },
                  ].map(({ key, value, span, reserved }) => (
                    <Col span={span || 8} key={key}>
                      <div className={styles.fieldWrapper}>
                        <div className={styles.fieldName}>{key}：</div>
                        <div className={styles.fieldValue}>
                          {value ? (
                            reserved ? (
                              value
                            ) : (
                              <Ellipsis lines={1} tooltip>
                                {value}
                              </Ellipsis>
                            )
                          ) : (
                            <EmptyText />
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
              <div className={styles.countContainer}>
                {[
                  {
                    key: '罐区（个）',
                    value: tankAreaCount,
                    icon: iconTankAreaCount,
                  },
                  {
                    key: '储罐（个）',
                    value: tankCount,
                    icon: iconTankCount,
                  },
                  {
                    key: '摄像头（台）',
                    value: videoCount,
                    icon: iconVideoCount,
                  },
                  {
                    key: '燃气监测点（个）',
                    value: combustibleGasCount,
                    icon: iconCombustibleGasCount,
                  },
                  {
                    key: '毒气监测点（个）',
                    value: toxicGasCount,
                    icon: iconToxicGasCount,
                  },
                ].map(({ key, value, icon }) => (
                  <div
                    className={styles.countWrapper}
                    style={{ backgroundImage: `url(${icon})` }}
                    key={key}
                  >
                    <div className={styles.countName}>{key}</div>
                    <div className={styles.countValue}>{value || 0}</div>
                  </div>
                ))}
              </div>
            </Fragment>
          ) : (
            <Skeleton active />
          )
        }
        tabList={tabList}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        <Spin
          spinning={
            loadingLocationList || loadingAlarmList || loadingSecurityList || loadingSurroundingList
          }
        >
          {tabActiveKey === tabList[0].key && this.render0()}
          {tabActiveKey === tabList[1].key && this.render1()}
          {tabActiveKey === tabList[2].key && this.render2()}
          {tabActiveKey === tabList[3].key && this.render3()}
          {tabActiveKey === tabList[3].key && this.renderMap()}
        </Spin>
        <NewVideoPlay
          showList={true}
          videoList={videoList}
          visible={videoVisible}
          keyId={videoKey}
          handleVideoClose={this.handleHideVideo}
          isTree={false}
        />
      </PageHeaderLayout>
    );
  }
}
