import React, { PureComponent, Fragment } from 'react';

import styles from '@/pages/BigPlatform/Smoke/sections/AlarmDrawer.less';
import {
  DrawerCard,
  DrawerContainer,
  SearchBar,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import { DotItem } from '@/pages/BigPlatform/Smoke/components/Components';
import { COUNT_BASE_KEY as COUNT_BASE, COUNT_KEYS, TYPE_COUNTS, TYPE_DESCES, TYPE_KEYS, getAllDevicesCount } from '../utils';

const TYPE = 'unitList';
const NO_DATA = '暂无信息';
const STATUS_PROPS = [
  { name: '正常', index: 0, color: '55,164,96' },
  { name: '报警', index: 1, color: '248,51,41' },
  { name: '故障', index: 2, color: '255,180,0' },
  { name: '失联', index: 3, color: '159,159,159' },
];
const INFO_STYLE = {
  width: 70,
  textAlign: 'center',
  color: '#FFF',
  bottom: '50%',
  right: 25,
  transform: 'translateY(50%)',
};

export default class UnitListDrawer extends PureComponent {
  state = { searchValue: '' };

  handleSearch = v => {
    this.setState({ searchValue: v });
  };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    this.setState({ searchValue: '' });
  };

  genCardClick = item => e => {
    const { showUnitDetail } = this.props;
    showUnitDetail(item);
    this.handleClose();
  };

  render() {
    const {
      visible,
      list=[],
      deviceType,
      // showUnitDetail,
      handleCompanyClick,
      // handleAlarmClick,
      // handleFaultClick,
      // handleClickUnitStatistics,
    } = this.props;
    const { searchValue } = this.state;

    const filteredList = list.filter(({ companyName }) => companyName.includes(searchValue));

    const left = (
      <SearchBar
        onSearch={this.handleSearch}
      >
        {filteredList.map(item => {
          const { companyId, companyName, address, saferName, saferPhone } = item;
          // let [count, stsCounts] = getAllDevicesCount(item);
          // let dotItems = stsCounts.map((n, i) => ({ ...STATUS_PROPS[i], value: n }));
          // if (deviceType) {
            const selected = TYPE_KEYS[deviceType];
            const typeCount = TYPE_COUNTS[deviceType];
            const count = item[`${selected}${COUNT_BASE}`];
            const dotItems = STATUS_PROPS
              .filter(({ index }) => typeCount[index])
              .map(itm => ({ ...itm, value: item[`${selected}${COUNT_BASE}For${COUNT_KEYS[itm.index]}`] }));
          // }
          // const clickUnitStatistics = e =>  handleClickUnitStatistics({ company_id, company_name, address, principal_name, principal_phone, normal, unnormal, faultNum });
          const dots = (
            <p className={styles.more}>
              {dotItems.map(({ name, color, value }) => (
                <DotItem
                  key={name}
                  title={name}
                  color={`rgb(${color})`}
                  quantity={value}
                />
              ))}
            </p>
          );
          return (
            <DrawerCard
              key={companyId}
              name={companyName || NO_DATA}
              location={address || NO_DATA}
              person={saferName || NO_DATA}
              phone={saferPhone || NO_DATA}
              style={{ cursor: 'pointer' }}
              clickName={ count ? e => handleCompanyClick(companyId) : null }
              onClick={this.genCardClick(item)}
              infoStyle={INFO_STYLE}
              info={
                <Fragment>
                  <span
                    // onClick={ count && clickUnitStatistics }
                    className={styles.equipment}
                    // style={{ display: 'block', cursor: count ? 'pointer' : 'default' }}
                    style={{ display: 'block', cursor: 'default' }}
                  >
                    {count || '--'}
                  </span>
                  设备数
                </Fragment>
              }
              more={dots}
            />
          );
        })}
      </SearchBar>
    );

    return (
      <DrawerContainer
        title={`单位列表-${TYPE_DESCES[deviceType]}`}
        width={500}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
