import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import styles from './AlarmDrawer.less';
import {
  DrawerCard,
  DrawerContainer,
  DrawerSection,
  GraphSwitch,
  OvProgress,
  OvSelect,
  SearchBar,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import { DotItem, ChartLine } from '../components/Components';
import { sortList } from '../utils';
import unitRedIcon from '../imgs/unitRed.png';
import unitBlueIconGrey from '../imgs/unitBlueIconGrey.png';
import unitYellowIcon from '../imgs/unitYellow.png';

const ICON_WIDTH = 42;
const ICON_HEIGHT = 40;
const ICON_BOTTOM = 5;
const TYPE = 'alarm';
const NO_DATA = '暂无信息';
const LABELS = ['正常', '告警', '预警', '失联'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];
const OPTIONS = ['全部', '正常', '告警', '预警', '失联'].map((d, i) => ({ value: i, desc: d }));
const SELECTED_PROPS = ['equipment', 'common', 'alarm', 'warn', 'noAccess'];

export default class AlarmDrawer extends PureComponent {
  state = { graph: 0, selected: 0, searchValue: '' };

  handleSwitch = i => {
    this.setState({ graph: i });
  };

  handleSelectChange = i => {
    this.setState({ selected: i });
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

  getOption = () => {
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
        data: ['报警', '故障', '失联'],
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
          formatter: function(value, index) {
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
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      series: [
        {
          name: '报警',
          color: '#ff4848',
          type: 'bar',
          barWidth: 5,
          data: [20, 12, 12, 34, 55, 66, 34, 44, 22, 11, 22, 34],
        },
        {
          name: '故障',
          type: 'bar',
          color: '#f6b54e',
          barWidth: 5,
          data: [20, 13, 12, 36, 52, 66, 34, 44, 22, 11, 22, 34],
        },
        {
          name: '失联',
          color: '#9f9f9f',
          type: 'bar',
          barWidth: 5,
          data: [20, 13, 12, 36, 52, 66, 34, 44, 22, 11, 22, 34],
        },
      ],
    };
    return option;
  };

  render() {
    const {
      visible,
      // handleSearch,
      data: {
        companyStatus: { unnormal = 0, faultNum = 0, outContact = 0 },
        graphList = [],
        list = [],
      } = {},
    } = this.props;
    const { graph, selected, searchValue } = this.state;

    const filteredList = list
      .filter(({ company_name }) => company_name.includes(searchValue))
      .filter(item => {
        switch (selected) {
          case 0:
            return true;
          case 1:
            return item.common;
          case 2:
            return item.alarm;
          case 3:
            return item.warn;
          case 4:
            return item.noAccess;
          default:
            return false;
        }
      });

    sortList(filteredList, SELECTED_PROPS[selected]);

    const total = unnormal + faultNum + outContact;
    const [alarmPercent, faultPercent, outPercent] = [unnormal, faultNum, outContact].map(
      n => (total ? (n / total) * 100 : 0)
    );

    const extra = <GraphSwitch handleSwitch={this.handleSwitch} />;
    const select = (
      <OvSelect
        cssType={1}
        options={OPTIONS}
        value={selected}
        handleChange={this.handleSelectChange}
      />
    );

    const left = (
      <Fragment>
        <DrawerSection title="单位状态统计">
          <OvProgress
            title="报警单位"
            percent={alarmPercent}
            quantity={unnormal}
            strokeColor="rgb(255,72,72)"
            style={{ marginTop: 40, cursor: 'pointer' }}
            iconStyle={{
              backgroundImage: `url(${unitRedIcon})`,
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
              bottom: ICON_BOTTOM,
            }}
            onClick={this.genProgressClick(2)}
          />
          <OvProgress
            title="故障单位"
            percent={faultPercent}
            quantity={faultNum}
            strokeColor="rgb(246,181,78)"
            style={{ cursor: 'pointer' }}
            iconStyle={{
              backgroundImage: `url(${unitYellowIcon})`,
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
              bottom: ICON_BOTTOM,
            }}
            onClick={this.genProgressClick(3)}
          />
          <OvProgress
            title="失联单位"
            percent={outPercent}
            quantity={outContact}
            strokeColor="rgb(159,159,159)"
            style={{ cursor: 'pointer' }}
            iconStyle={{
              backgroundImage: `url(${unitBlueIconGrey})`,
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
              bottom: ICON_BOTTOM,
            }}
            onClick={this.genProgressClick(1)}
          />
        </DrawerSection>
        <DrawerSection title="异常趋势图" titleInfo="最近12个月" extra={extra}>
          {graph ? (
            <ReactEcharts option={this.getOption(graphList)} className="echarts-for-echarts" />
          ) : (
            <ChartLine data={graphList} labelRotate={0} />
          )}
        </DrawerSection>
      </Fragment>
    );

    const right = (
      <SearchBar
        // value={value}
        onSearch={this.handleSearch}
        // onChange={this.handleChange}
        extra={select}
      >
        {filteredList.map(
          ({ companyId, name, address, safetyMan, safetyPhone, common, alarm, warn, noAccess }) => (
            <DrawerCard
              key={companyId}
              name={name || NO_DATA}
              location={address || NO_DATA}
              person={safetyMan || NO_DATA}
              phone={safetyPhone || NO_DATA}
              style={{ cursor: 'auto' }}
              infoStyle={{
                width: 70,
                textAlign: 'center',
                color: '#FFF',
                bottom: '50%',
                right: 25,
                transform: 'translateY(50%)',
              }}
              info={
                <Fragment>
                  <div className={styles.equipment}>{2 || '--'}</div>
                  设备数
                </Fragment>
              }
              more={
                <p className={styles.more}>
                  {[common, alarm, warn, noAccess].map((n, i) => (
                    <DotItem key={i} title={LABELS[i]} color={`rgb(${COLORS[i]})`} quantity={n} />
                  ))}
                </p>
              }
            />
          )
        )}
      </SearchBar>
    );

    return (
      <DrawerContainer
        title="异常单位统计"
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
