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
import moment from 'moment';
import { DotItem, ChartLine } from '../components/Components';
import unitRedIcon from '../imgs/unitRed.png';
import unitYellowIcon from '../imgs/unitYellow.png';
import unitLossIcon from '../imgs/unitBlueIconGrey.png';

const ICON_WIDTH = 42;
const ICON_HEIGHT = 40;
const ICON_BOTTOM = 5;
const TYPE = 'alarm';
const NO_DATA = '暂无信息';
const OPTIONS = ['全部', '火警', '故障', '失联'].map((d, i) => ({ value: i, desc: d }));

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

  getOption = graphList => {
    // const newGraphList = graphList.map(item => {
    //   let obj = {};
    //   for (const key in item) {
    //     if (item.hasOwnProperty(key)) {
    //       const element = item[key];
    //       obj = { ...element, month: key };
    //     }
    //   }
    //   return obj;
    // });

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
        data: graphList.map(item => {
          const newMonth = item.datePoint;
          return moment(newMonth).format('MM');
        }),
      },
      series: [
        {
          name: '火警',
          color: '#ff4848',
          type: 'bar',
          barWidth: 5,
          data: graphList.map(item => item.unnormal),
        },
        {
          name: '故障',
          type: 'bar',
          color: '#f6b54e',
          barWidth: 5,
          data: graphList.map(item => item.fault),
        },
        {
          name: '失联',
          type: 'bar',
          color: '#9f9f9f',
          barWidth: 5,
          data: graphList.map(item => item.outContact),
        },
      ],
    };
    return option;
  };

  render() {
    const {
      handleAlarmClick,
      handleFaultClick,
      handleClickDeviceNumber,
      visible,
      allUnitList: { list: unitList = [] },
      // data: {
      //   // list = [],
      //   // companyStatus: { unnormal = 0, faultNum = 0 },
      //   graphList = [],
      // } = {},
      unitsCount,
      deviceCountChartData: { list: graphList = [] },
    } = this.props;

    const { graph, selected, searchValue } = this.state;

    const unnormalCompanyNum = unitsCount.reduce(function(prev, cur) {
      if (+cur.unnormal > 0) {
        prev++;
      }
      return prev;
    }, 0);

    const faultCompanyNum = unitsCount.reduce((prev, cur) => {
      if (+cur.fault > 0) {
        prev++;
      }
      return prev;
    }, 0);

    const outContactCompanyNum = unitsCount.reduce((prev, cur) => {
      if (+cur.outContact > 0) {
        prev++;
      }
      return prev;
    }, 0);

    const filteredList = unitList
      .filter(item => item.count)
      .filter(({ company_name }) => company_name.includes(searchValue))
      .filter(item => {
        switch (selected) {
          case 0:
            return true;
          case 1:
            return item.unnormal;
          case 2:
            return item.faultNum;
          case 3:
            return item.outContact;
          default:
            return false;
        }
      });

    const total = unnormalCompanyNum + faultCompanyNum + outContactCompanyNum;
    const [alarmPercent, faultPercent, outContactPercent] = [
      unnormalCompanyNum,
      faultCompanyNum,
      outContactCompanyNum,
    ].map(n => (total ? (n / total) * 100 : 0));

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
            title="火警单位"
            percent={alarmPercent}
            quantity={unnormalCompanyNum}
            strokeColor="rgb(255,72,72)"
            style={{ marginTop: 40 }}
            iconStyle={{
              backgroundImage: `url(${unitRedIcon})`,
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
              bottom: ICON_BOTTOM,
            }}
            // onClick={this.genProgressClick(1)}
          />
          <OvProgress
            title="故障单位"
            percent={faultPercent}
            quantity={faultCompanyNum}
            strokeColor="rgb(246,181,78)"
            // style={{ cursor: 'pointer' }}
            iconStyle={{
              backgroundImage: `url(${unitYellowIcon})`,
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
              bottom: ICON_BOTTOM,
            }}
            // onClick={this.genProgressClick(2)}
          />
          <OvProgress
            title="失联单位"
            percent={outContactPercent}
            quantity={outContactCompanyNum}
            strokeColor="rgb(159,159,159)"
            // style={{ cursor: 'pointer' }}
            iconStyle={{
              backgroundImage: `url(${unitLossIcon})`,
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
              bottom: ICON_BOTTOM,
            }}
            // onClick={this.genProgressClick(2)}
          />
        </DrawerSection>
        <DrawerSection title="异常趋势图" titleInfo="最近12个月" extra={extra}>
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
      <SearchBar onSearch={this.handleSearch} extra={select}>
        {filteredList.map(
          ({
            company_id,
            company_name,
            address,
            principal_name,
            principal_phone,
            normal: listNormal,
            unnormal: listUnnormal = 0,
            faultNum: listFaultNum,
            outContact,
            count,
          }) => (
            <DrawerCard
              key={company_id}
              name={company_name || NO_DATA}
              location={address || NO_DATA}
              person={principal_name || NO_DATA}
              phone={principal_phone || NO_DATA}
              style={{ cursor: 'auto' }}
              clickName={() =>
                handleClickDeviceNumber({
                   company_id,
                  company_name,
                  address,
                  principal_name,
                  principal_phone,
                  normal: listNormal,
                  unnormal: (listUnnormal = 0),
                  faultNum: listFaultNum,
                })
              }
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
                  <div
                    className={styles.equipment}
                    onClick={() =>
                      handleClickDeviceNumber({
                        company_id,
                        company_name,
                        address,
                        principal_name,
                        principal_phone,
                        normal: listNormal,
                        unnormal: (listUnnormal = 0),
                        faultNum: listFaultNum,
                      })
                    }
                  >
                    {count || '--'}
                  </div>
                  设备数
                </Fragment>
              }
              more={
                <p className={styles.more}>
                  <DotItem
                    title="火警"
                    color={`rgb(248,51,41)`}
                    quantity={listUnnormal}
                    className={listUnnormal > 0 ? styles.itemActive : ''}
                    onClick={() =>
                      listUnnormal > 0 &&
                      handleAlarmClick(undefined, company_id, company_name, 1, listUnnormal)
                    }
                  />
                  <DotItem
                    title="故障"
                    color={`rgb(255,180,0)`}
                    className={listFaultNum > 0 ? styles.itemActive : ''}
                    quantity={listFaultNum}
                    onClick={() =>
                      listFaultNum > 0 &&
                      handleFaultClick(undefined, company_id, company_name, 2, listFaultNum)
                    }
                  />
                  <DotItem
                    title="失联"
                    color={`rgb(159,159,159)`}
                    className={outContact > 0 ? styles.itemActive : ''}
                    quantity={outContact}
                    onClick={() =>
                      outContact > 0 &&
                      handleFaultClick(undefined, company_id, company_name, 3, outContact)
                    }
                  />
                  <DotItem title="正常" color={`rgb(55,164,96)`} quantity={listNormal} />
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
