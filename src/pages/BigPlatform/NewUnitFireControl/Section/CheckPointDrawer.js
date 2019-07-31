import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import DrawerContainer from '../components/DrawerContainer';
import NoData from '../components/NoData';
import CheckPointCard from '../components/CheckPointCard';
import { filterChartValue } from '../utils.js';
import {
  DrawerSection,
  OvSelect,
  SearchBar,
} from '@/pages/BigPlatform/NewFireControl/components/Components';

import styles from './CheckPointDrawer.less';

const NO_DATA = '暂无信息';
const STATUS_OPTIONS = ['检查状态', '已超期', '待检查', '已检查'].map((d, i) => ({
  value: i,
  desc: d,
}));
const HD_OPTIONS = ['有无隐患', '有隐患', '无隐患'].map((d, i) => ({ value: i, desc: d }));
// 获取偏移天数
const getOffsetDays = ({ nextCheckDate }) => {
  return nextCheckDate
    ? Math.abs(
        moment()
          .startOf('day')
          .diff(moment(+nextCheckDate), 'days')
      )
    : '';
};

@connect(({ smoke }) => ({
  smoke,
}))
export default class CheckPointDrawer extends PureComponent {
  state = { checkStatus: 0, hiddenDanger: 0, searchValue: '' };

  handleStatusChange = i => {
    this.setState({ checkStatus: i });
  };

  handleHdChange = i => {
    this.setState({ hiddenDanger: i });
  };

  handleSearch = v => {
    this.setState({ searchValue: v });
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
    setTimeout(() => {
      this.setState({ searchValue: '', checkStatus: 0, hiddenDanger: 0 });
    }, 200);
  };

  renderCheckStatusPie = () => {
    const { data: { pointList = [] } = {} } = this.props;
    const data = [
      {
        value: pointList.filter(({ status }) => +status === 4).length,
        name: '已超期',
        itemStyle: { color: '#F83329' },
      },
      {
        value: pointList.filter(({ status }) => +status === 3).length,
        name: '待检查',
        itemStyle: { color: '#0980D3' },
      },
      {
        value: pointList.filter(({ status }) => +status < 3).length,
        name: '已检查',
        itemStyle: { color: '#BCBCBD' },
      },
    ];
    const option = {
      title: {
        text: pointList.length,
        textStyle: {
          color: '#fff',
          fontSize: 25,
          fontWeight: 400,
        },
        left: 'center',
        top: '40%',
      },
      legend: {
        show: true,
        data: data.map(item => item.name),
        icon: 'rect',
        itemWidth: 5,
        formatter: name => {
          return `${name}`;
        },
        bottom: 0,
        left: 'center',
        textStyle: { color: '#fff' },
        itemGap: 40,
      },
      color: ['#F83329', '#0980D3', '#BCBCBD'],
      series: [
        {
          type: 'pie',
          center: ['50%', '45%'],
          radius: ['35%', '52%'],
          avoidLabelOverlap: true,
          label: {
            normal: {
              show: false,
              lineHeight: 25,
              formatter: '{b}\n{c} ({d}%)',
              textStyle: {
                color: '#fff',
                fontSize: 14,
              },
            },
            emphasis: {
              show: true,
            },
          },
          labelLine: {
            normal: {
              show: false,
              length: 18,
              length2: 18,
            },
            emphasis: {
              show: true,
            },
          },
          hoverAnimation: !!pointList.length,
          legendHoverLink: !!pointList.length,
          data: filterChartValue(data),
        },
      ],
    };
    return (
      <ReactEcharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        className="echarts-for-echarts"
        notMerge={true}
        onChartReady={this.onChartReadyCallback}
      />
    );
  };

  onChartReadyCallback = chart => {
    if (!chart) return;
    let currentIndex = -1;
    const chartAnimate = () => {
      const dataLen = chart.getOption().series[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
      currentIndex = (currentIndex + 1) % dataLen;
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
    };
    // chartAnimate();
    setInterval(() => {
      chartAnimate();
    }, 5000);
  };

  renderRatioPie = (chartData, styles) => {
    const { data, label, color, legend, value } = chartData;

    const option = {
      color: [color || '#F83329', '#04234A'],
      tooltip: {
        formatter: label,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: [5, 12],
      },
      legend: {
        show: !!legend,
        selectedMode: false,
        data: [legend],
        icon: 'rect',
        itemWidth: 5,
        formatter: legend,
        bottom: 0,
        left: 'center',
        textStyle: { color: '#fff' },
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '62%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: !!label,
              position: 'center',
              lineHeight: 25,
              textStyle: {
                fontSize: 20,
                color: '#fff',
              },
              formatter: `${value}`,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: data,
              name: legend,
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 5,
              },
            },
            {
              value: 100 - data,
              itemStyle: { opacity: 0.9 },
              label: { show: false },
            },
          ],
        },
      ],
    };
    return (
      <ReactEcharts
        option={option}
        style={{ height: '100%', width: '100%', flex: 1, ...styles }}
        className="echarts-for-echarts"
        notMerge={true}
      />
    );
  };

  render() {
    const {
      visible,
      data: { pointList = [] } = {},
      currentHiddenDanger: { list: currentDangerList = [] },
      handlePointDrawer,
    } = this.props;
    const { checkStatus, hiddenDanger, searchValue } = this.state;
    const pointListNew = pointList.map(item => {
      return {
        ...item,
        currentDangerList: currentDangerList.filter(danger => danger.item_id === item.item_id),
      };
    });

    const filteredList = pointListNew
      .filter(({ object_title }) => object_title.includes(searchValue))
      .filter(({ status }) => {
        switch (checkStatus) {
          case 0:
            return true;
          case 1:
            return +status === 4;
          case 2:
            return +status === 3;
          case 3:
            return +status === 1 || +status === 2;
          default:
            return false;
        }
      })
      .filter(({ currentDangerList }) => {
        switch (hiddenDanger) {
          case 0:
            return true;
          case 1:
            return !!currentDangerList.length;
          case 2:
            return !currentDangerList.length;
          default:
            return false;
        }
      });
    const select = (
      <div style={{ display: 'flex', textAlign: 'center' }}>
        <OvSelect
          cssType={1}
          options={STATUS_OPTIONS}
          value={checkStatus}
          handleChange={this.handleStatusChange}
          style={{ flex: 1, position: 'relative' }}
        />
        <OvSelect
          cssType={1}
          options={HD_OPTIONS}
          value={hiddenDanger}
          handleChange={this.handleHdChange}
          style={{ flex: 1, position: 'relative' }}
        />
      </div>
    );

    const hasDanger = pointListNew.filter(item => !!item.currentDangerList.length).length;
    const noDanger = pointList.length - hasDanger;
    const [hasDangerRatio, noDangerRatio] = [hasDanger, noDanger].map(
      n => (pointList.length ? Math.round((n / pointList.length) * 1000) / 10 : 0)
    );
    const left = (
      <Fragment>
        <DrawerSection title="点位检查状态统计" style={{ marginBottom: 50 }}>
          {this.renderCheckStatusPie()}
        </DrawerSection>
        <DrawerSection title="点位有无隐患统计">
          <div style={{ width: '100%', height: '200px', display: 'flex' }}>
            {this.renderRatioPie({
              data: hasDangerRatio,
              color: '#F83329',
              legend: '有隐患点位',
              label: `有隐患点位<br/>数量：${hasDanger} (${hasDangerRatio}%)`,
              value: hasDanger,
            })}
            {this.renderRatioPie({
              data: noDangerRatio,
              color: '#00FFFF',
              legend: '无隐患点位',
              label: `无隐患点位<br/>数量：${noDanger} (${noDangerRatio}%)`,
              value: noDanger,
            })}
          </div>
        </DrawerSection>
      </Fragment>
    );

    const right = (
      <SearchBar
        placeholder={'请输入点位名称'}
        onSearch={this.handleSearch}
        cols={[12, 12]}
        extra={select}
      >
        {filteredList.length > 0 ? (
          filteredList.map(item => (
            <CheckPointCard
              key={item.item_id}
              className={styles.card}
              data={item}
              fieldNames={{
                riskLevel: 'risk_level', // 风险等级
                name: 'object_title', // 点位名称
                lastCheckPerson: 'last_check_user_name', // 上次巡查人员
                lastCheckTime: 'last_check_date', // 最近一次巡查
                nextCheckTime: 'nextCheckDate', // 计划下次巡查
                extendedDays: getOffsetDays, // 超期天数
                expiryDays: getOffsetDays, // 距到期天数
                status: 'status', // 检查状态
                cycle: ({ checkCycleCode, check_cycle, cycle_type }) =>
                  +cycle_type === 1 ? checkCycleCode : check_cycle, // 检查周期
                type: 'item_type', // 点位类型
                lastReportSource: 'lastReportSource', // 上次巡查人员所属单位类型
                currentDanger: ({ currentDangerList }) => currentDangerList.length,
              }}
              onClick={() => {
                handlePointDrawer(item);
              }}
            />
          ))
        ) : (
          <NoData />
        )}
      </SearchBar>
    );

    return (
      <DrawerContainer
        title="检查点"
        visible={visible}
        left={left}
        right={right}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
