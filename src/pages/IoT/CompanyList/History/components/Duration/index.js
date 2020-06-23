import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import ReactEcharts from 'echarts-for-react';
import Link from '@/jingan-components/View/Link';
import { connect } from 'dva';
import { stringify } from 'qs';
import moment from 'moment';
import { GET_TRANSFORMED_TIME } from '@/pages/IoT/AlarmWorkOrder/config';
import { isEqual } from 'lodash';
import styles from './index.less';

const API = 'gasMonitor/getDuration';
const API2 = 'gasMonitor/getHistoryDetail';

export default connect(
  ({
    gasMonitor: { duration, historyDetail },
    loading: {
      effects: { [API]: loading, [API2]: loading2 },
    },
  }) => ({
    duration,
    historyDetail,
    loading: loading || loading2,
  }),
  (dispatch, { params }) => ({
    getDuration(payload, callback) {
      dispatch({
        type: API,
        payload: {
          ...params,
          ...payload,
        },
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
        props.duration === nextProps.duration &&
        props.historyDetail === nextProps.historyDetail &&
        props.loading === nextProps.loading &&
        isEqual(props.params, nextProps.params) &&
        props.companyName === nextProps.companyName
      );
    },
  }
)(
  ({
    className,
    duration: { '≤6min': d1, '6~12min': d2, '12~18min': d3, '18~1d': d4, '>1d': d5, avgTime } = {},
    historyDetail: { endProcessCount } = {},
    loading,
    getDuration,
    params,
    companyName,
  }) => {
    const [prevParams, setPrevParams] = useState(undefined);
    useEffect(
      () => {
        if (!isEqual(params, prevParams)) {
          setPrevParams(params);
          getDuration();
        }
      },
      [params]
    );
    let time = GET_TRANSFORMED_TIME((avgTime || 0) * 1000);
    const numbers = time.match(/\d+/g);
    time = time.split(/\d+/g).reduce((result, item, index) => {
      if (item) {
        result.push(<span key={item}>{item}</span>);
      }
      if (numbers[index]) {
        result.push(
          <span key={index} className={styles.number}>
            {numbers[index]}
          </span>
        );
      }
      return result;
    }, []);
    const option = {
      grid: {
        top: 24,
        right: 0,
        bottom: 0,
        left: 0,
        containLabel: true,
      },
      color: ['#1890ff'],
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      },
      xAxis: {
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          interval: 0,
          color: 'rgba(0, 0, 0, 0.65)',
        },
        splitLine: {
          show: false,
        },
        data: ['≤6min', '6~12min', '12~18min', '18~1d', '>1d'],
      },
      yAxis: {
        minInterval: 1,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '报警工单处理数量',
          type: 'bar',
          barWidth: '50%',
          data: [d1 || 0, d2 || 0, d3 || 0, d4 || 0, d5 || 0],
        },
      ],
    };
    return (
      <div className={className}>
        <div className={styles.title}>报警工单处理时效</div>
        {!loading ? (
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>
              <span>{time}</span>
              <span>（工单平均处理时长）</span>
              <span>
                <span>
                  <Link
                    to={`/company-iot/alarm-work-order/list?${stringify({
                      reportType: params && params.equipmentTypes,
                      companyName: companyName && encodeURIComponent(companyName),
                      queryCreateStartDate: params && +moment(params.startTime),
                      queryCreateEndDate: params && +moment(params.endTime),
                      status: '1',
                    })}`}
                    target="_blank"
                    disabled={!endProcessCount}
                  >
                    {endProcessCount || 0}
                  </Link>
                </span>
                <span>张</span>
              </span>
              <span>（已处理工单）</span>
            </div>
            <ReactEcharts style={{ height: 214 }} option={option} />
          </div>
        ) : (
          <Skeleton active paragraph={{ rows: 5 }} />
        )}
      </div>
    );
  }
);
