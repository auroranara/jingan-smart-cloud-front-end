import React, { PureComponent, Fragment } from 'react';

import styles from './AlarmDrawer.less';
import {
  ChartBar,
  ChartRing,
  DrawerCard,
  DrawerContainer,
  DrawerSection,
  OvSelect,
  SearchBar,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import { DotItem } from '../components/Components';

const TYPE = 'unit';
const NO_DATA = '暂无信息';
const LABELS = ['正常', '告警', '预警', '失联'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];
const OPTIONS = ['全部', '未接入', '已接入'].map((d, i) => ({ value: i, desc: d }));
const RING_COLORS = ['159,159,159', '0,255,255'];
const RING_LABELS = ['未接入', '已接入'];

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
  equipment: Math.random() > 0.5 ? 0 : 14,
}));

export default class UnitDrawer extends PureComponent {
  state={ selected: 0, searchValue: '' };

  handleSelectChange = i => {
    this.setState({ selected: i });
  };

  handleSearch = v => {
    this.setState({ searchValue: v });
  };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    this.setState({ searchValue: '', selected: 0 });
  };

  render() {
    const {
      visible,
      // handleSearch,
      data: { list=CARDS }={},
    } = this.props;
    const { selected, searchValue } = this.state;

    const rings = [20, 200].map((n, i) => ({ name: RING_LABELS[i], value: n, itemStyle: { color: `rgb(${RING_COLORS[i]})` } }));
    const barList = list.slice(0, 10).map(({ companyId, name, common }, i) => {
      let newName = name;
      if (i === 9 && name.length > 10)
        newName = `${name.slice(0, 10)}...`;
      return { id: companyId, name: newName, value: common };
    });
    const filteredList = list.filter(({ name }) => name.includes(searchValue)).filter(({ equipment }) => {
      switch(selected) {
        case 0:
          return true;
        case 1:
          return !equipment;
        case 2:
          return equipment;
        default:
          return false;
      }
    });

    const select = (
      <OvSelect cssType={1} options={OPTIONS} value={selected} handleChange={this.handleSelectChange} />
    );

    const left = (
      <Fragment>
        <DrawerSection title="接入单位统计图" style={{ marginBottom: 50 }}>
          <ChartRing data={rings} />
        </DrawerSection>
        <DrawerSection title="接入设备数量的单位排名">
          <ChartBar data={barList} labelRotate={-60} />
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
          {filteredList.map(({ companyId, name, address, safetyMan, safetyPhone, common, alarm, warn, noAccess, equipment }) => (
            <DrawerCard
              key={companyId}
              name={name || NO_DATA}
              location={address || NO_DATA}
              person={safetyMan || NO_DATA}
              phone={safetyPhone || NO_DATA}
              style={{ cursor: 'auto' }}
              infoStyle={{ width: 70, textAlign: 'center', color: '#FFF', bottom: '50%', right: 25, transform: 'translateY(50%)' }}
              info={
                <Fragment>
                  <div className={styles.equipment}>{equipment || '--'}</div>
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
          ))}
        </SearchBar>
    );

    return (
      <DrawerContainer
        title="接入单位统计"
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
