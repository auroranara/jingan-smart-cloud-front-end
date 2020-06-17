import React, { useEffect, useState, useMemo, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Skeleton, Row, Col, Card } from 'antd';
import { RangePicker, Radio } from '@/jingan-components/Form';
import FireList from './components/FireList';
import FireHistory from './components/FireHistory';
import CountBar from './components/CountBar';
import Duration from './components/Duration';
import AlarmTrend from './components/AlarmTrend';
import CountTrend from './components/CountTrend';
import Ranking from './components/Ranking';
import History from './components/History';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import classNames from 'classnames';
import styles from './index.less';

const API = 'iotStatistics/getCompanyMonitorTypeList';
const API2 = 'common/getCompanyDetail';
const TYPES = [{ key: '0', value: '图表' }, { key: '1', value: '列表' }];
const RANGES = ['最近一周', '最近一个月', '最近三个月', '最近一年'];
const TYPES2 = [{ key: '0', value: '列表' }, { key: '1', value: '历史' }];

export default connect(
  ({
    user: { currentUser },
    common: { companyDetail },
    iotStatistics: { companyMonitorTypeList },
    loading: {
      effects: { [API]: loading, [API2]: loading2 },
    },
  }) => ({
    currentUser,
    companyMonitorTypeList,
    companyDetail,
    loading,
    loading2,
  }),
  dispatch => ({
    getCompanyMonitorTypeList(payload, callback) {
      dispatch({
        type: API,
        payload,
        callback,
      });
    },
    getCompanyDetail(payload, callback) {
      dispatch({
        type: API2,
        payload,
        callback,
      });
    },
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  }),
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.companyMonitorTypeList === nextProps.companyMonitorTypeList &&
        props.companyDetail === nextProps.companyDetail &&
        props.loading === nextProps.loading &&
        props.loading2 === nextProps.loading2 &&
        props.match.params.companyId === nextProps.match.params.companyId &&
        props.match.params.equipmentType === nextProps.match.params.equipmentType
      );
    },
  }
)(
  ({
    match: {
      params: { companyId, equipmentType },
    },
    location: {
      query: { startDate, endDate, type: queryType },
    },
    currentUser: { unitType },
    companyDetail,
    companyMonitorTypeList,
    loading,
    loading2,
    getCompanyMonitorTypeList,
    getCompanyDetail,
  }) => {
    const [range, setRange] = useState(
      startDate && endDate
        ? [moment(+startDate), moment(+endDate)]
        : [
            moment()
              .startOf('day')
              .subtract(1, 'weeks')
              .add(1, 'days'),
            moment().endOf('day'),
          ]
    );
    const [type, setType] = useState(queryType || TYPES[0].key);
    const [type2, setType2] = useState(TYPES2[0].key);
    const tabList = useMemo(
      () => {
        return (companyMonitorTypeList || []).map(({ id, name }) => ({ key: id, tab: name }));
      },
      [companyMonitorTypeList]
    );
    const { key: tabActiveKey, tab: monitorTypeName } = useMemo(
      () => {
        return tabList.find(({ key }) => key === equipmentType) || tabList[0] || {};
      },
      [tabList, equipmentType]
    );
    useEffect(
      () => {
        getCompanyMonitorTypeList({
          id: companyId,
        });
        getCompanyDetail({
          id: companyId,
        });
      },
      [companyId]
    );
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '物联网监测', name: '物联网监测' },
      {
        title: 'IOT异常数据及趋势统计',
        name: 'IOT异常数据及趋势统计',
        href: unitType !== 4 ? '/company-iot/IOT-abnormal-data/list' : undefined,
      },
      { title: '监测详情', name: '监测详情' },
    ];
    let [startTime, endTime] = range || [];
    startTime = startTime && startTime.format('YYYY-MM-DD 00:00:00');
    endTime = endTime && endTime.format('YYYY-MM-DD 23:59:59');
    const params = companyId &&
      tabActiveKey &&
      startTime &&
      endTime && {
        companyId,
        equipmentTypes: tabActiveKey,
        startTime,
        endTime,
      };
    const companyName = (unitType !== 4 && companyDetail && companyDetail.name) || undefined;
    return (
      <PageHeaderLayout
        className={styles.layout}
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
        content={loading || loading2 ? <Skeleton active paragraph={{ rows: 1 }} /> : companyName}
        tabList={tabList}
        tabActiveKey={tabActiveKey}
        onTabChange={tabActiveKey => {
          router.push(`/company-iot/IOT-abnormal-data/${companyId}/${tabActiveKey}`);
        }}
      >
        {companyId &&
          tabActiveKey &&
          (tabActiveKey === '1' ? (
            <Card className={styles.card}>
              <div className={styles.toolbar1}>
                <div>
                  <Radio
                    list={TYPES2}
                    value={type2}
                    onChange={type => setType2(type)}
                    buttonStyle="solid"
                  />
                </div>
              </div>
              {type2 === TYPES2[0].key ? (
                <FireList params={{ companyId }} />
              ) : (
                <FireHistory params={{ companyId }} />
              )}
            </Card>
          ) : (
            <Card className={styles.card}>
              <div className={styles.toolbar2}>
                <div className={styles.rangeContainer}>
                  <div className={styles.quickRangeContainer}>
                    <div>
                      <div
                        className={classNames(
                          styles.quickRange,
                          +range[0] ===
                            +moment()
                              .startOf('day')
                              .subtract(1, 'weeks')
                              .add(1, 'days') &&
                            +range[1] === +moment().endOf('day') &&
                            styles.active
                        )}
                        onClick={() =>
                          setRange([
                            moment()
                              .startOf('day')
                              .subtract(1, 'weeks')
                              .add(1, 'days'),
                            moment().endOf('day'),
                          ])
                        }
                      >
                        最近一周
                      </div>
                    </div>
                    <div>
                      <div
                        className={classNames(
                          styles.quickRange,
                          +range[0] ===
                            +moment()
                              .startOf('day')
                              .subtract(1, 'months')
                              .add(1, 'days') &&
                            +range[1] === +moment().endOf('day') &&
                            styles.active
                        )}
                        onClick={() =>
                          setRange([
                            moment()
                              .startOf('day')
                              .subtract(1, 'months')
                              .add(1, 'days'),
                            moment().endOf('day'),
                          ])
                        }
                      >
                        最近一个月
                      </div>
                    </div>
                    <div>
                      <div
                        className={classNames(
                          styles.quickRange,
                          +range[0] ===
                            +moment()
                              .startOf('day')
                              .subtract(3, 'months')
                              .add(1, 'days') &&
                            +range[1] === +moment().endOf('day') &&
                            styles.active
                        )}
                        onClick={() =>
                          setRange([
                            moment()
                              .startOf('day')
                              .subtract(3, 'months')
                              .add(1, 'days'),
                            moment().endOf('day'),
                          ])
                        }
                      >
                        最近三个月
                      </div>
                    </div>
                    <div>
                      <div
                        className={classNames(
                          styles.quickRange,
                          +range[0] ===
                            +moment()
                              .startOf('day')
                              .subtract(1, 'years')
                              .add(1, 'days') &&
                            +range[1] === +moment().endOf('day') &&
                            styles.active
                        )}
                        onClick={() =>
                          setRange([
                            moment()
                              .startOf('day')
                              .subtract(1, 'years')
                              .add(1, 'days'),
                            moment().endOf('day'),
                          ])
                        }
                      >
                        最近一年
                      </div>
                    </div>
                  </div>
                  <div className={styles.rangePickerWrapper}>
                    <RangePicker
                      value={range}
                      onChange={range => setRange(range)}
                      ranges={RANGES}
                    />
                  </div>
                </div>
                <div>
                  <Radio
                    list={TYPES}
                    value={type}
                    onChange={type => setType(type)}
                    buttonStyle="solid"
                  />
                </div>
              </div>
              {type === TYPES[0].key ? (
                <Fragment>
                  <CountBar className={styles.countBar} params={params} companyName={companyName} />
                  <Row className={styles.row} gutter={24}>
                    <Col className={styles.col} xxl={10} lg={12} sm={24} xs={24}>
                      <Duration params={params} companyName={companyName} />
                    </Col>
                    <Col className={styles.col} xxl={14} lg={12} sm={24} xs={24}>
                      <AlarmTrend params={params} />
                    </Col>
                    <Col className={styles.col} xxl={14} lg={12} sm={24} xs={24}>
                      <CountTrend params={params} />
                    </Col>
                    <Col className={styles.col} xxl={10} lg={12} sm={24} xs={24}>
                      <Ranking params={params} companyName={companyName} />
                    </Col>
                  </Row>
                </Fragment>
              ) : (
                <History
                  params={{
                    companyId,
                    monitorEquipmentTypes: tabActiveKey,
                    startTime,
                    endTime,
                  }}
                  monitorTypeName={monitorTypeName}
                />
              )}
            </Card>
          ))}
      </PageHeaderLayout>
    );
  }
);
