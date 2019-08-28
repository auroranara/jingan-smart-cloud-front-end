import React, { PureComponent, Fragment } from 'react';
// import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { Icon } from 'antd';

import styles from './FireStatisticsDrawer.less';
import {
  ChartBar,
  ChartLine,
  ChartRing,
  DrawerCard,
  DrawerContainer,
  DrawerSection,
  EmptyChart,
  GraphSwitch,
  OvSelect,
  SearchBar,
} from '../components/Components';
// import { ChartLine } from '@/pages/BigPlatform/Smoke/components/Components';
import { hidePhone } from '../utils';

// function Empty(props) {
//   return <div className={styles.empty}>暂无信息</div>;
// }

const empty = <EmptyChart style={{ height: 300 }} title="暂无信息" />;

const TYPE = 'fireStatistics';
const NO_DATA = '暂无信息';
const [DATE_OPTIONS, DEVICE_OPTIONS, TYPE_OPTIONS, FIRE_OPTIONS] = [
  ['本日', '本周', '本月'],
  ['全部设备', '消防主机', '独立烟感'],
  ['全部火警', '误报火警', '真实火警', '未确认'],
  ['', '误报火警', '真实火警', '', '', '未确认'],
].map(arr => arr.map((d, i) => ({ value: i, desc: d })));
const RING_LABELS = ['误报', '真实', '未确认'];
const RING_COLORS = ['255, 180, 0', '248, 51, 41', '188, 188, 189'];
const INFO_STYLE = {
  bottom: 15,
  padding: '2px 10px',
  border: '1px solid',
  borderRadius: 15,
};

function fireTypeFix(i) {
  return i === 3 ? 5 : i;
}

export default class FireStatisticsDrawer extends PureComponent {
  state = { graph: 0, typeSelected: 0, deviceSelected: 0, searchValue: '' };

  handleSwitch = i => {
    this.setState({ graph: i });
  };

  onDateTypeChange = i => {
    const { handleDateTypeChange, getFirePie, getFireList } = this.props;
    const { deviceSelected, typeSelected, searchValue } = this.state;
    handleDateTypeChange(i);
    getFirePie(i);
    getFireList({ deviceType: deviceSelected, fireType: fireTypeFix(typeSelected), searchValue, dateType: i });
  };

  handleDeviceSelectChange = i => {
    const { dateType } = this.props;
    const { typeSelected, searchValue } = this.state;
    this.setState({ deviceSelected: i });
    this.getFireList({ deviceType: i, fireType: fireTypeFix(typeSelected), searchValue, dateType });
  };

  handleTypeSelectChange = i => {
    // 由于吕旻傻吊改动 原先未确认火警为3 现在为5
    const { dateType } = this.props;
    const { deviceSelected, searchValue } = this.state;
    this.setState({ typeSelected: i });
    this.getFireList({ deviceType: deviceSelected, fireType: fireTypeFix(i), searchValue, dateType });
  };

  genProgressClick = v => e => {
    this.handleSelectChange(v);
  };

  handleSearch = v => {
    const { dateType } = this.props;
    const { deviceSelected, typeSelected } = this.state;
    this.setState({ searchValue: v });
    this.getFireList({ deviceType: deviceSelected, fireType: fireTypeFix(typeSelected), searchValue: v, dateType });
  };

  getFireList = (options, initial = true) => {
    const { getFireList } = this.props;
    getFireList(options, initial);
  };

  getMoreFireList = e => {
    const { dateType } = this.props;
    const { deviceSelected, typeSelected, searchValue } = this.state;
    this.getFireList({ deviceType: deviceSelected, fireType: fireTypeFix(typeSelected), searchValue, dateType }, false);
  };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    this.setState({ searchValue: '', grahp: 0, typeSelected: 0, deviceSelected: 0 });
  };

  // getOption = graphList => {
  //   const newGraphList = graphList.map(item => {
  //     let obj = {};
  //     for (const key in item) {
  //       if (item.hasOwnProperty(key)) {
  //         const element = item[key];
  //         obj = { ...element, month: key };
  //       }
  //     }
  //     return obj;
  //   });

  //   const option = {
  //     textStyle: {
  //       color: '#fff',
  //     },
  //     grid: { left: 0, right: '12%', top: 40, containLabel: true },
  //     color: ['#e86767', '#5ebeff'],
  //     tooltip: {
  //       show: true,
  //       trigger: 'axis',
  //       axisPointer: {
  //         // 坐标轴指示器，坐标轴触发有效
  //         type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
  //         shadowStyle: {
  //           color: 'rgba(46,78,111,0.5)',
  //           opacity: 0.6,
  //         },
  //       },
  //       backgroundColor: 'rgba(46,78,111,0.5)',
  //       padding: [5, 15, 5, 15],
  //     },
  //     legend: {
  //       data: ['火警', '故障', '失联'],
  //       textStyle: {
  //         color: '#fff',
  //       },
  //       orient: 'horizontal',
  //       bottom: 20,
  //       left: 'center',
  //       icon: 'rect',
  //     },
  //     yAxis: {
  //       type: 'value',
  //       axisTick: { show: true, inside: true },
  //       splitLine: {
  //         show: false,
  //         lineStyle: {
  //           color: '#394456',
  //           width: 2,
  //         },
  //       },
  //       axisLine: {
  //         show: true,
  //         lineStyle: {
  //           color: '#394456',
  //           width: 2,
  //         },
  //       },
  //       axisLabel: {
  //         formatter: function (value, index) {
  //           if (parseInt(value, 10) !== value) return '';
  //           return parseInt(value, 10);
  //         },
  //       },
  //     },
  //     xAxis: {
  //       type: 'category',
  //       axisTick: { show: false },
  //       axisLine: {
  //         show: true,
  //         lineStyle: {
  //           color: '#394456',
  //           width: 2,
  //         },
  //       },
  //       axisLabel: {
  //         color: '#fff',
  //         fontSize: 14,
  //       },
  //       data: newGraphList.map(item => {
  //         const newMonth = item.month;
  //         return moment(newMonth).format('MM');
  //       }),
  //     },
  //     series: [
  //       {
  //         name: '火警',
  //         color: '#ff4848',
  //         type: 'bar',
  //         barWidth: 5,
  //         data: newGraphList.map(item => item.unnormal),
  //       },
  //       {
  //         name: '故障',
  //         type: 'bar',
  //         color: '#f6b54e',
  //         barWidth: 5,
  //         data: newGraphList.map(item => item.faultNum),
  //       },
  //     ],
  //   };
  //   return option;
  // };

  render() {
    const {
      visible,
      loading,
      hasMore,
      dateType,
      data: {
        firePie: { trueFire = 0, falseFire = 0, unConfirm = 0 },
        fireTrend,
        fireList,
      },
    } = this.props;
    const { graph, typeSelected, deviceSelected } = this.state;

    const rings = [falseFire, trueFire, unConfirm].map((n, i) => ({
      name: RING_LABELS[i],
      value: n,
      itemStyle: { color: `rgb(${RING_COLORS[i]})` },
    }));
    const trendList = fireTrend.map(({ month, count }) => ({ name: month, value: count }));
    // console.log(rings);

    const extra = <GraphSwitch handleSwitch={this.handleSwitch} />;
    const dateSelect = (
      <OvSelect options={DATE_OPTIONS} value={dateType} handleChange={this.onDateTypeChange} style={{ top: 2 }}/>
    );
    const selects = (
      <div className={styles.selects}>
        <OvSelect
          cssType={2}
          options={DEVICE_OPTIONS}
          style={{ marginRight: 10 }}
          value={deviceSelected}
          dropdownMatchSelectWidth={false}
          handleChange={this.handleDeviceSelectChange}
        />
        <OvSelect
          cssType={2}
          options={TYPE_OPTIONS}
          value={typeSelected}
          dropdownMatchSelectWidth={false}
          handleChange={this.handleTypeSelectChange}
        />
      </div>
    );

    const left = (
      <Fragment>
        <DrawerSection title="处理状态统计" extra={dateSelect}>
          {rings.every(item => !item.value) ? empty : <ChartRing data={rings} />}
        </DrawerSection>
        <DrawerSection
          title="火警趋势图"
          titleInfo="最近12个月"
          style={{ marginTop: 10 }}
          extra={extra}
        >
          {/* {graph ? (
            graphList.length > 0 ? (
              <ReactEcharts option={this.getOption(graphList)} className="echarts-for-echarts" />
            ) : (
                <div style={{ textAlign: 'center' }}>暂无数据</div>
              )
          ) : graphList.length > 0 ? (
            <ChartLine data={graphList} labelRotate={0} />
          ) : (
                <div style={{ textAlign: 'center' }}>暂无数据</div>
              )} */}
          {trendList.length ? (
            graph ? (
              <ChartBar data={trendList} />
            ) : (
              <ChartLine data={trendList} />
            )
          ) : (
            empty
          )}
        </DrawerSection>
      </Fragment>
    );

    let cards = null;
    if (fireList.length)
      cards = fireList.map(
        ({
          company_id,
          proce_id,
          relation_id,
          time,
          name,
          location,
          safety_name,
          safety_phone,
          fireType,
          deviceType,
        }) => {
          const info = FIRE_OPTIONS[fireType] ? FIRE_OPTIONS[fireType].desc : '';

          const corner = DEVICE_OPTIONS[deviceType]
            ? DEVICE_OPTIONS[deviceType].desc.slice(-2)
            : '';
          const color = RING_COLORS[+fireType - 1];
          const phone = safety_phone ? hidePhone(safety_phone) : NO_DATA;
          return (
            <DrawerCard
              key={proce_id || relation_id || Math.random()}
              name={name || NO_DATA}
              location={location || NO_DATA}
              person={safety_name || NO_DATA}
              phone={phone}
              style={{ cursor: 'auto' }}
              // clickName={() => {}}
              info={info}
              infoStyle={{ ...INFO_STYLE, color: `rgb(${color})`, borderColor: `rgb(${color})` }}
              cornerLabel={corner}
              more={
                <p className={styles.more}>
                  <span className={styles.clockIcon} />
                  <span className={styles.moreTime}>
                    {moment(time).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </p>
              }
            />
          );
        }
      );

    const right = (
      <SearchBar onSearch={this.handleSearch} cols={[12, 12]} extra={selects}>
        {fireList.length
          ? cards
          : loading
            ? null
            : // <p className={styles.none}>暂无信息</p>
              empty}
        {hasMore && (
          <p
            className={
              !fireList.length && loading ? styles.none : loading ? styles.hasMore : styles.hasMore1
            }
            onClick={loading ? null : this.getMoreFireList}
          >
            {loading ? (
              <Icon type="sync" spin className={styles.sync} />
            ) : (
              <Icon type="double-right" className={styles.doubleRight} />
            )}
          </p>
        )}
      </SearchBar>
    );

    return (
      <DrawerContainer
        title="火警状态统计"
        visible={visible}
        left={left}
        right={right}
        placement="right"
        // rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
