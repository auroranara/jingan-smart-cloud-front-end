import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';

import styles from './AlarmDrawer.less';
import {
  ChartBar,
  ChartLine,
  DrawerCard,
  DrawerContainer,
  DrawerSection,
  GraphSwitch,
  OvProgress,
  OvSelect,
  SearchBar,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import { DotItem } from '../components/Components';
import { sortList, getFirstDeviceId } from '../utils';
import unitRedIcon from '../imgs/unitRed.png';
import unitBlueIcon from '../imgs/unitBlue.png';
// import unitYellowIcon from '../imgs/unitYellow.png';

const ICON_WIDTH = 42;
const ICON_HEIGHT = 40;
const ICON_BOTTOM = 5;
const TYPE = 'alarm';
const NO_DATA = '暂无信息';
// const LABELS = ['正常', '告警', '预警', '失联'];
const LABELS = ['正常', '报警', '预警', '失联'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];
// const OPTIONS = ['全部', '正常', '告警', '预警', '失联'].map((d, i) => ({ value: i, desc: d }));
const OPTIONS = ['全部', '正常', '报警', '预警', '失联'].map((d, i) => ({ value: i, desc: d })).filter(op => op.desc !== '预警');
const SELECTED_PROPS = ['equipment', 'common', 'alarm', 'warn', 'noAccess'];

export default class AlarmDrawer extends PureComponent {
  state={ graph: 0, selected: 0, searchValue: '' };

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

  render() {
    const {
      visible,
      // handleSearch,
      showUnitDetail,
      data: {
        list=[],
        graphList=[],
        alarmUnit: alarmNum=0,
        earlyWarningUnit: warnNum=0,
        normalUnit: commonNum=0,
      }={},
    } = this.props;
    const { graph, selected, searchValue } = this.state;

    const filteredList = list.filter(({ equipment }) => equipment).filter(({ name }) => name.includes(searchValue)).filter(item => {
      switch(selected) {
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

    sortList(filteredList, SELECTED_PROPS[selected])

    const total = alarmNum + commonNum + warnNum;
    const [alarmPercent, warnPercent, commonPercent] = [alarmNum, warnNum, commonNum].map(n => total ? n / total * 100 : 0);

    const extra = <GraphSwitch handleSwitch={this.handleSwitch} />;
    const select = (
      <OvSelect cssType={1} options={OPTIONS} value={selected} handleChange={this.handleSelectChange} />
    );

    const handledGraphList = graphList.map(({ timeFlag, count }) => ({ name: moment(timeFlag).format('MM'), value: count }));

    const left = (
      <Fragment>
        <DrawerSection title="单位状态统计">
          <OvProgress
            // title="告警单位"
            title="报警单位"
            percent={alarmPercent}
            quantity={alarmNum}
            strokeColor="rgb(255,72,72)"
            style={{
              marginTop: 40,
              // cursor: 'pointer',
            }}
            iconStyle={{ backgroundImage: `url(${unitRedIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
            // onClick={this.genProgressClick(2)}
          />
          {/* <OvProgress
            title="预警单位"
            percent={warnPercent}
            quantity={warnNum}
            strokeColor="rgb(246,181,78)"
            // style={{ cursor: 'pointer' }}
            iconStyle={{ backgroundImage: `url(${unitYellowIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
            // onClick={this.genProgressClick(3)}
          /> */}
          <OvProgress
            title="正常单位"
            percent={commonPercent}
            quantity={commonNum}
            strokeColor="rgb(0,251,252)"
            // style={{ cursor: 'pointer' }}
            iconStyle={{ backgroundImage: `url(${unitBlueIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
            // onClick={this.genProgressClick(1)}
          />
        </DrawerSection>
        <DrawerSection
          // title="告警趋势图"
          title="报警趋势图"
          titleInfo="最近12个月"
          extra={extra}
        >
          {graph ? <ChartBar data={handledGraphList} labelRotate={0} sameColor /> : <ChartLine data={handledGraphList} labelRotate={0} />}
        </DrawerSection>
      </Fragment>
    );

    let cards = <p className={styles.empty}>暂无数据</p>;
    if (filteredList.length)
      cards = filteredList.map(({ companyId, name, address, safetyMan, safetyPhone, common, alarm, warn, noAccess, deviceList }) => (
        <DrawerCard
          key={companyId}
          name={name || NO_DATA}
          location={address || NO_DATA}
          person={safetyMan || NO_DATA}
          phone={safetyPhone || NO_DATA}
          style={{ cursor: 'auto' }}
          more={
            <p className={styles.more}>
              {[common, alarm, warn, noAccess].map((n, i) => (
                <DotItem
                  key={i}
                  showLink
                  title={LABELS[i]}
                  color={`rgb(${COLORS[i]})`} quantity={n}
                  onClick={e => showUnitDetail(companyId, getFirstDeviceId(deviceList, i), i === 0 || i === 3 ? 0 : 1)}
                />
              )).filter((c, i) => i !== 2)}
            </p>
          }
        />
      ));
    const right = (
      <SearchBar
        // value={value}
        onSearch={this.handleSearch}
        // onChange={this.handleChange}
        extra={select}
      >
        {cards}
      </SearchBar>
    );

    return (
      <DrawerContainer
        title="实时报警统计"
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
