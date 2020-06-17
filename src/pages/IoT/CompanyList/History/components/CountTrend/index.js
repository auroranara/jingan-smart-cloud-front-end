import React, { useState, useEffect } from 'react';
import { Skeleton, Empty } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { stringify } from 'qs';
import moment from 'moment';
import { isEqual } from 'lodash';
import styles from './index.less';

const API = 'gasMonitor/getCountTrend';

export default connect(
  ({
    gasMonitor: { countTrend },
    loading: {
      effects: { [API]: loading },
    },
  }) => ({
    countTrend,
    loading,
  }),
  (dispatch, { params }) => ({
    getCountTrend(payload, callback) {
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
        props.countTrend === nextProps.countTrend &&
        props.loading === nextProps.loading &&
        isEqual(props.params, nextProps.params)
      );
    },
  }
)(({ className, countTrend, loading, getCountTrend, params }) => {
  const [prevParams, setPrevParams] = useState(undefined);
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        getCountTrend();
      }
    },
    [params]
  );
  const isSmoke = params && params.equipmentTypes === '413';
  const { warning, alarm, fire } = (countTrend || []).reduce(
    (result, { happenTime, redCount, yellowCount }) => {
      result.warning.push({
        name: happenTime,
        value: [happenTime, yellowCount],
      });
      result.alarm.push({
        name: happenTime,
        value: [happenTime, redCount],
      });
      result.fire.push({
        name: happenTime,
        value: [happenTime, yellowCount + redCount],
      });
      return result;
    },
    {
      warning: [],
      alarm: [],
      fire: [],
    }
  );
  const option = countTrend &&
    countTrend.length && {
      color: isSmoke ? ['#f5222d'] : ['#faad14', '#f5222d'],
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
      series: isSmoke
        ? [
            {
              name: '火警次数',
              type: 'line',
              data: fire,
            },
          ]
        : [
            {
              name: '预警次数',
              type: 'line',
              data: warning,
            },
            {
              name: '告警次数',
              type: 'line',
              data: alarm,
            },
          ],
    };
  return (
    <div className={className}>
      <div className={styles.title}>{isSmoke ? '火警次数趋势' : '预警/告警次数趋势'}</div>
      {!loading ? (
        option ? (
          <ReactEcharts
            style={{ height: 214 }}
            option={option}
            onChartReady={chart => {
              chart.on('click', 'series', ({ value: [time] }) => {
                const startDate = +moment(time).startOf('day');
                const endDate = +moment(time).endOf('day');
                window.open(
                  `${window.publicPath}#/company-iot/IOT-abnormal-data/${params.companyId}/${
                    params.equipmentTypes
                  }?${stringify({
                    startDate,
                    endDate,
                    type: '1',
                  })}`
                );
              });
            }}
          />
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
