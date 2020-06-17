import React, { useState, useEffect } from 'react';
import { Skeleton, Empty } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import moment from 'moment';
import { isEqual } from 'lodash';
import styles from './index.less';

const API = 'gasMonitor/getAlarmTrend';

export default connect(
  ({
    gasMonitor: { alarmTrend },
    loading: {
      effects: { [API]: loading },
    },
  }) => ({
    alarmTrend,
    loading,
  }),
  (dispatch, { params }) => ({
    getAlarmTrend(payload, callback) {
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
        props.alarmTrend === nextProps.alarmTrend &&
        props.loading === nextProps.loading &&
        isEqual(props.params, nextProps.params)
      );
    },
  }
)(({ className, alarmTrend, loading, getAlarmTrend, params }) => {
  const [prevParams, setPrevParams] = useState(undefined);
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        getAlarmTrend();
      }
    },
    [params]
  );
  const option = alarmTrend &&
    alarmTrend.length > 0 && {
      color: ['#f5222d'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        formatter: params => {
          const date = params[0].name;
          return `${date}<br />${params
            .map(
              ({ marker, seriesName, value: [date, value] }) => `${marker}${seriesName}：${value}`
            )
            .join('<br />')}`;
        },
      },
      legend: {
        itemWidth: 8,
        itemHeight: 8,
        top: 0,
        right: 0,
        icon: 'circle',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.45)',
          lineHeight: 20,
        },
      },
      grid: {
        top: 24,
        left: 2,
        right: 18,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
          formatter: time => moment(time).format('MM-DD'),
        },
        splitLine: {
          show: false,
        },
        minInterval: 24 * 60 * 60 * 1000,
        splitNumber: 7,
      },
      yAxis: {
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
        minInterval: 1,
      },
      series: [
        {
          name: '报警数量',
          type: 'line',
          data: alarmTrend.map(({ happenTime, equipmentCount }) => ({
            name: happenTime,
            value: [happenTime, equipmentCount],
          })),
          smooth: true,
          areaStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
  return (
    <div className={className}>
      <div className={styles.title}>监测设备报警趋势</div>
      {!loading ? (
        option ? (
          <ReactEcharts style={{ height: 214 }} option={option} />
        ) : (
          <div style={{ height: 214, overflow: 'hidden' }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )
      ) : (
        <Skeleton active paragraph={{ rows: 5 }} />
      )}
    </div>
  );
});
