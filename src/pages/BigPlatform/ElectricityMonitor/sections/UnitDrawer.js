import React, { PureComponent, Fragment } from 'react';

import styles from './UnitDrawer.less';
import {
  ChartBar,
  ChartLine,
  DrawerCard,
  DrawerContainer,
  DrawerSection,
  GraphSwitch,
  OvProgress,
  SearchBar,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import unitRedIcon from '../imgs/unitRed.png';
import unitBlueIcon from '../imgs/unitBlue.png';
import unitYellowIcon from '../imgs/unitYellow.png';

const ICON_WIDTH = 42;
const ICON_HEIGHT = 40;
const ICON_BOTTOM = 5;
const TYPE = 'unit';
const NO_DATA = '暂无信息';
const LABELS = ['正常', '告警', '预警', '失联'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];

const CARDS = [...Array(10).keys()].map(i => ({
  companyId: i,
  name: '无锡市新吴区机械制造有限公司',
  address: '无锡市新吴区汉江路与龙江路交叉口5号',
  safetyMan: '王长江',
  safetyPhone: '13288888888',
  common: Math.floor(Math.random() * 10),
  alarm: Math.floor(Math.random() * 10),
  warn: Math.floor(Math.random() * 10),
  noAccess: Math.floor(Math.random() * 10),
}));

const GRAPH_LIST = [...Array(12).keys()].map(i => ({ id: i, name: i + 1, value: Math.floor(Math.random() * 100) }));

function DotItem(props) {
  const { title, color, quantity } = props;
  return (
    <Fragment>
      <span style={{ backgroundColor: color }} className={styles.dot} />
      {title}
      <span className={styles.quantity}>{quantity}</span>
    </Fragment>
  );
}

export default class UnitDrawer extends PureComponent {
  state={ graph: 0, searchValue: '' };

  handleSwitch = i => {
    this.setState({ graph: i });
  };

  handleSearch = v => {
    this.setState({ searchValue: v });
  };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    this.setState({ searchValue: '' });
  };

  render() {
    const {
      visible,
      labelIndex=0,
      // handleSearch,
      data: { list=CARDS, graphList=GRAPH_LIST, alarmNum=0, warnNum=0, commonNum=0 }={},
    } = this.props;
    const { graph, searchValue } = this.state;

    const filteredList = list.filter(({ name }) => name.includes(searchValue));

    const total = alarmNum + commonNum + warnNum;
    const [alarmPercent, warnPercent, commonPercent] = [alarmNum, warnNum, commonNum].map(n => total ? n / total * 100 : 0);

    const extra = <GraphSwitch handleSwitch={this.handleSwitch} />;

    const left = (
      <Fragment>
        <DrawerSection title="单位状态统计">
          <OvProgress
            title="告警单位"
            percent={alarmPercent}
            quantity={alarmNum}
            strokeColor="rgb(255,72,72)"
            style={{ marginTop: 40 }}
            iconStyle={{ backgroundImage: `url(${unitRedIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
          />
          <OvProgress
            title="预警单位"
            percent={warnPercent}
            quantity={warnNum}
            strokeColor="rgb(246,181,78)"
            iconStyle={{ backgroundImage: `url(${unitYellowIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
          />
          <OvProgress
            title="正常单位"
            percent={commonPercent}
            quantity={commonNum}
            strokeColor="rgb(0,251,252)"
            iconStyle={{ backgroundImage: `url(${unitBlueIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
          />
        </DrawerSection>
        <DrawerSection title="火警趋势图" titleInfo="最近12个月" extra={extra}>
          {graph ? <ChartBar data={graphList} /> : <ChartLine data={graphList} />}
        </DrawerSection>
      </Fragment>
    );

    const right = (
      <SearchBar
        // value={value}
        key={labelIndex}
        onSearch={this.handleSearch}
        // onChange={this.handleChange}
      >
        {filteredList.map(({ companyId, name, address, safetyMan, safetyPhone, common, alarm, warn, noAccess }) => (
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
                  <DotItem key={i} title={LABELS[i]} color={`rgb(${COLORS[i]})`} quantity={n} />
                ))}
              </p>
            }
          />
        ))}
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
