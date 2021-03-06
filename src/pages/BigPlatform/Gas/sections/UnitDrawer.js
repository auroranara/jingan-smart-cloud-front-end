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
import { connect } from 'dva';
import { DotItem } from '../components/Components';
// import { sortCardList } from '../utils';

const TYPE = 'unit';
const NO_DATA = '暂无信息';
const LABELS = ['报警', '故障', '失联', '正常'];
const COLORS = ['248,51,41', '255,180,0', '159,159,159', '55,164,96'];
const OPTIONS = ['全部', '未接入', '已接入'].map((d, i) => ({ value: i, desc: d }));
const RING_COLORS = ['159,159,159', '0,255,255'];
const RING_LABELS = ['未接入', '已接入'];

@connect(({ gas }) => ({
  gas,
}))
export default class UnitDrawer extends PureComponent {
  state = { selected: 0, searchValue: '' };

  handleSelectChange = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gas/fetchImportingTotal',
      payload: {
        status: i,
      },
    });
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
      data: {
        list = [],
        AccessCount = [],
        AccessStatistics: { Importing = 0, unImporting = 0 },
      } = {},
      handleClickUnitStatistics,
      handleAlarmClick,
    } = this.props;
    const { selected, searchValue } = this.state;

    const rings = [unImporting, Importing].map((n, i) => ({
      name: RING_LABELS[i],
      value: n,
      itemStyle: { color: `rgb(${RING_COLORS[i]})` },
    }));

    const barList = AccessCount.slice(0, 10).map(({ company_id, company_name, count }, i) => {
      let newName = company_name;
      if (i === 9 && name.length > 10) newName = `${name.slice(0, 10)}...`;
      return { id: company_id, name: newName, value: count };
    });

    const filteredList = list
      .filter(({ company_name }) => company_name.includes(searchValue))
      .filter(({ count }) => {
        switch (selected) {
          case 0:
            return true;
          case 1:
            return !count;
          case 2:
            return count;
          default:
            return false;
        }
      });
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
        <DrawerSection title="接入单位统计图" style={{ marginBottom: 50 }}>
          <ChartRing data={rings} />
        </DrawerSection>
        <DrawerSection title="单位接入的设备数排名">
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
        {filteredList.map(
          ({
            company_id,
            company_name,
            address,
            principal_name,
            principal_phone,
            unnormal,
            faultNum,
            outContact,
            normal,
            count,
          }) => (
            <DrawerCard
              key={company_id}
              name={company_name || NO_DATA}
              location={address || NO_DATA}
              person={principal_name || NO_DATA}
              phone={principal_phone || NO_DATA}
              style={{ cursor: 'auto' }}
              clickName={
                count &&
                (() =>
                  handleClickUnitStatistics({
                    companyId: company_id,
                    companyName: company_name,
                    address,
                    principalName: principal_name,
                    principalPhone: principal_phone,
                    normal,
                    unnormal,
                    faultNum,
                    outContact,
                  }))
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
                    onClick={() =>
                      count &&
                      handleClickUnitStatistics({
                        companyId: company_id,
                        companyName: company_name,
                        address,
                        principalName: principal_name,
                        principalPhone: principal_phone,
                        normal,
                        unnormal,
                        faultNum,
                        outContact,
                      })
                    }
                    className={styles.equipment}
                    style={{ cursor: count ? 'pointer' : 'default' }}
                  >
                    {count || '--'}
                  </div>
                  设备数
                </Fragment>
              }
              more={
                count > 0 ? (
                  <p className={styles.more}>
                    {/* {count
                      ? [unnormal, faultNum, outContact, normal].map((n, i) => (
                        <DotItem
                          key={i}
                          title={LABELS[i]}
                          color={`rgb(${COLORS[i]})`}
                          quantity={n}
                        />
                      ))
                      : ' '} */}
                    <DotItem
                      title="报警"
                      color={`rgb(248,51,41)`}
                      quantity={unnormal}
                      className={unnormal > 0 ? styles.itemActive : ''}
                      onClick={() =>
                        unnormal > 0
                          ? handleAlarmClick(undefined, company_id, company_name, unnormal)
                          : ''
                      }
                    />
                    <DotItem title="故障" color={`rgb(255,180,0)`} quantity={faultNum} />
                    <DotItem title="失联" color={`rgb(159,159,159)`} quantity={outContact} />
                    <DotItem title="正常" color={`rgb(55,164,96)`} quantity={normal} />
                  </p>
                ) : null
              }
            />
          )
        )}
      </SearchBar>
    );

    return (
      <DrawerContainer
        title="接入单位统计"
        visible={visible}
        zIndex={1000}
        left={left}
        right={right}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
