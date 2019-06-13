import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import styles from './FireStatisticsDrawer.less';
import {
  ChartRing,
  DrawerCard,
  DrawerContainer,
  DrawerSection,
  GraphSwitch,
  OvSelect,
  SearchBar,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import moment from 'moment';
import { ChartLine } from '@/pages/BigPlatform/Smoke/components/Components';

const TYPE = 'fireStatistics';
const NO_DATA = '暂无信息';
const [DATE_OPTIONS, DEVICE_OPTIONS, TYPE_OPTIONS] = [
  ['本日', '本周', '本月'],
  ['全部设备', '消防主机', '独立烟感'],
  ['全部火警', '未确认', '真实火警', '误报火警'],
].map(arr => arr.map((d, i) => ({ value: i, desc: d })));
const RING_LABELS = ['未确认', '真实', '误报'];
const RING_COLORS = ['188, 188, 189', '248, 51, 41', '255, 180, 0'];
const INFO_STYLE = {
  bottom: 15,
  padding: '2px 10px',
  border: '1px solid',
  borderRadius: 15,
};

export default class AlarmDrawer extends PureComponent {
  state = { graph: 0, typeSelected: 0, deviceSelected: 0, searchValue: '' };

  handleSwitch = i => {
    this.setState({ graph: i });
  };

  handleTypeSelectChange = i => {
    this.setState({ typeSelected: i });
  };

  handleDeviceSelectChange = i => {
    this.setState({ deviceSelected: i });
  };

  genProgressClick = v => {
    return e => {
      this.handleSelectChange(v);
    };
  };

  handleSearch = v => {
    this.setState({ searchValue: v });
  };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    this.setState({ searchValue: '', grahp: 0, selected: 0 });
  };

  getOption = graphList => {
    const newGraphList = graphList.map(item => {
      let obj = {};
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const element = item[key];
          obj = { ...element, month: key };
        }
      }
      return obj;
    });

    const option = {
      textStyle: {
        color: '#fff',
      },
      grid: { left: 0, right: '12%', top: 40, containLabel: true },
      color: ['#e86767', '#5ebeff'],
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(46,78,111,0.5)',
            opacity: 0.6,
          },
        },
        backgroundColor: 'rgba(46,78,111,0.5)',
        padding: [5, 15, 5, 15],
      },
      legend: {
        data: ['火警', '故障', '失联'],
        textStyle: {
          color: '#fff',
        },
        orient: 'horizontal',
        bottom: 20,
        left: 'center',
        icon: 'rect',
      },
      yAxis: {
        type: 'value',
        axisTick: { show: true, inside: true },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLabel: {
          formatter: function (value, index) {
            if (parseInt(value, 10) !== value) return '';
            return parseInt(value, 10);
          },
        },
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 14,
        },
        data: newGraphList.map(item => {
          const newMonth = item.month;
          return moment(newMonth).format('MM');
        }),
      },
      series: [
        {
          name: '火警',
          color: '#ff4848',
          type: 'bar',
          barWidth: 5,
          data: newGraphList.map(item => item.unnormal),
        },
        {
          name: '故障',
          type: 'bar',
          color: '#f6b54e',
          barWidth: 5,
          data: newGraphList.map(item => item.faultNum),
        },
      ],
    };
    return option;
  };

  render() {
    const {
      visible,
      dateType,
      data: { list = [], graphList = [] } = {},
      handleDateTypeChange,
    } = this.props;

    const { graph, typeSelected, deviceSelected, searchValue } = this.state;

    // const filteredList = list
    //   .filter(({ company_name }) => company_name.includes(searchValue))
    //   .filter(item => {
    //     switch (selected) {
    //       case 0:
    //         return true;
    //       case 1:
    //         return item.unnormal;
    //       case 2:
    //         return item.faultNum;
    //       case 3:
    //         return item.outContact;
    //       default:
    //         return false;
    //     }
    //   });
    const filteredList = [{
      companyId: 1,
      companyName: '晶安',
      address: '城管大队',
      person: '陈圆圆',
      phone: '13288888888',
      status: Math.floor(Math.random()*3),
    }];

    const rings = [2, 6, 12].map((n, i) => ({ name: RING_LABELS[i], value: n, itemStyle: { color: `rgb(${RING_COLORS[i]})` } }));

    const extra = <GraphSwitch handleSwitch={this.handleSwitch} />;
    const dateSelect = (
      <OvSelect options={DATE_OPTIONS} value={dateType} handleChange={handleDateTypeChange} />
    );
    const selects = (
      <div className={styles.selects}>
        <OvSelect
          cssType={2}
          options={TYPE_OPTIONS}
          style={{ marginRight: 10 }}
          value={typeSelected}
          dropdownMatchSelectWidth={false}
          handleChange={this.handleTypeSelectChange}
        />
        <OvSelect
          cssType={2}
          options={DEVICE_OPTIONS}
          value={deviceSelected}
          dropdownMatchSelectWidth={false}
          handleChange={this.handleDeviceSelectChange}
        />
      </div>
    );

    const left = (
      <Fragment>
        <DrawerSection title="处理状态统计" extra={dateSelect}>
          <ChartRing data={rings} />
        </DrawerSection>
        <DrawerSection title="火警趋势图" titleInfo="最近12个月" extra={extra}>
          {graph ? (
            graphList.length > 0 ? (
              <ReactEcharts option={this.getOption(graphList)} className="echarts-for-echarts" />
            ) : (
                <span style={{ textAlign: 'center' }}>暂无数据</span>
              )
          ) : graphList.length > 0 ? (
            <ChartLine data={graphList} labelRotate={0} />
          ) : (
                <span style={{ textAlign: 'center' }}>暂无数据</span>
              )}
        </DrawerSection>
      </Fragment>
    );

    const right = (
      <SearchBar onSearch={this.handleSearch} cols={[12, 12]} extra={selects}>
        {filteredList.map(
          ({
            companyId,
            companyName,
            address,
            person,
            phone,
            status,
          }) => (
              <DrawerCard
                key={companyId}
                name={companyName || NO_DATA}
                location={address || NO_DATA}
                person={person || NO_DATA}
                phone={phone || NO_DATA}
                style={{ cursor: 'auto' }}
                clickName={() => {}}
                info="真实火警"
                infoStyle={{ ...INFO_STYLE, color: `rgb(${RING_COLORS[status]})`, borderColor: `rgb(${RING_COLORS[status]})`}}
                cornerLabel="主机"
                more={
                  <p className={styles.more}>
                    <span className={styles.clockIcon} />
                    <span className={styles.moreTime}>{moment().format('YYYY-MM-DD HH:mm:ss')}</span>
                  </p>
                }
              />
            )
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
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
