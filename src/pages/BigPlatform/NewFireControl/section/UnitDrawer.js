import React, { PureComponent, Fragment } from 'react';

import styles from './UnitDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import DrawerSection from '../components/DrawerSection';
import OvProgress from '../components/OvProgress';
// import GraphSwitch from '../components/GraphSwitch';
import SearchBar from '../components/SearchBar';
import DrawerCard from '../components/DrawerCard';
import ChartBar from '../components/ChartBar';
import unitRedIcon from '../img/unitRed.png';
import unitBlueIcon from '../img/unitBlue.png';
import unitGreyIcon from '../img/unitGrey.png';
import pointIcon from '../img/point.png';
import dangerIcon from '../img/cardDanger.png';

const ICON_WIDTH = 42;
const ICON_HEIGHT = 40;
const ICON_BOTTOM = 5;
const TYPE = 'unit';
const NO_DATA = '暂无信息';
// const STATUS_LABELS = ['正常', '异常'];
const STATUS = ['正常', '--', '报警'];
const STATUS_CLASS = ['normal', 'not', 'fire'];
const FIRE = '2';
const SWITCH_LABELS = ['管辖单位', '重点单位'];

// const CARDS = [...Array(10).keys()].map(i => ({
//   id: i,
//   name: '无锡市新吴区机械制造有限公司',
//   location: '无锡市新吴区汉江路与龙江路交叉口5号',
//   person: '王长江',
//   phone: '13288888888',
//   quantity: Math.floor(Math.random() * 10),
//   status: Math.random() > 0.5 ? 0 : 1,
//   statusLabels: ['正常', '报警'],
// }));

export default class UnitDrawer extends PureComponent {
  state = { searchValue: '' };

  handleSwitch = i => {
    const { handleSwitch } = this.props;
    handleSwitch(i);
    this.setState({ searchValue: '' });
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
      labelIndex = 0,
      // handleSearch,
      handleShowUnitDanger,
      handleAlarmClick,
      data: {
        allCompanyList = [],
        importCompanyList = [],
        fireNum = 0,
        commonNum = 0,
        noAccessNum = 0,
        impFireNum = 0,
        impCommonNum = 0,
        impNoAccessNum = 0,
      },
    } = this.props;
    const { searchValue } = this.state;

    const isImpUnit = !!labelIndex;
    const list = [allCompanyList, importCompanyList][labelIndex];
    const newList = list.map(item => ({ ...item }));
    newList.sort((item, item1) => item1.hiddenCount - item.hiddenCount);
    const chartList = newList.slice(0, 10).map(({ companyId, name, hiddenCount }, i) => {
      let newName = name;
      if (i === 9 && name.length > 10) newName = `${name.slice(0, 10)}...`;
      return { id: companyId, name: newName, value: hiddenCount };
    });

    const filteredList = list.filter(({ name }) => name.includes(searchValue));

    const total = fireNum + commonNum + noAccessNum;
    const [firePercent, commonPercent, noAccessPercent] = [fireNum, commonNum, noAccessNum].map(
      n => (total ? (n / total) * 100 : 0)
    );
    const impTotal = impFireNum + impCommonNum + impNoAccessNum;
    const [impFirePercent, impCommonPercent, impNoAccessPercent] = [
      impFireNum,
      impCommonNum,
      impNoAccessNum,
    ].map(n => (impTotal ? (n / impTotal) * 100 : 0));

    const top = (
      <SwitchHead value={labelIndex} labels={SWITCH_LABELS} onSwitch={this.handleSwitch} />
    );

    const left = (
      <Fragment>
        <DrawerSection title="消防主机单位情况">
          <OvProgress
            title="报警单位"
            percent={isImpUnit ? impFirePercent : firePercent}
            quantity={isImpUnit ? impFireNum : fireNum}
            strokeColor="rgb(255,72,72)"
            style={{ marginTop: 40 }}
            iconStyle={{
              backgroundImage: `url(${unitRedIcon})`,
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
              bottom: ICON_BOTTOM,
            }}
          />
          <OvProgress
            title="正常单位"
            percent={isImpUnit ? impCommonPercent : commonPercent}
            quantity={isImpUnit ? impCommonNum : commonNum}
            strokeColor="rgb(0,251,252)"
            iconStyle={{
              backgroundImage: `url(${unitBlueIcon})`,
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
              bottom: ICON_BOTTOM,
            }}
          />
          <OvProgress
            title="未接入单位"
            percent={isImpUnit ? impNoAccessPercent : noAccessPercent}
            quantity={isImpUnit ? impNoAccessNum : noAccessNum}
            strokeColor="rgb(163,163,163)"
            iconStyle={{
              backgroundImage: `url(${unitGreyIcon})`,
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
              bottom: ICON_BOTTOM,
            }}
          />
        </DrawerSection>
        <DrawerSection title="隐患数量排名">
          <ChartBar data={chartList} labelRotate={-60} />
        </DrawerSection>
      </Fragment>
    );

    const right = (
      <SearchBar
        // value={value}
        key={labelIndex}
        onSearch={this.handleSearch}
        // onChange={this.handleChange}
        // style={{ paddingTop: 50 }}
      >
        {filteredList.map(
          ({
            companyId,
            name,
            address,
            safetyMan,
            safetyPhone,
            itemCount,
            hiddenCount,
            isFire,
          }) => (
            <DrawerCard
              key={companyId}
              name={name || NO_DATA}
              location={address || NO_DATA}
              person={safetyMan || NO_DATA}
              phone={safetyPhone || NO_DATA}
              // status={isFire}
              // statusLabels={STATUS_LABELS}
              style={{ cursor: 'auto' }}
              // info={
              //   <Fragment>
              //     <span className={styles.cardIcon} style={{ backgroundImage: `url(${dangerIcon})` }} />
              //     {`隐患数量：${hiddenCount || 0}`}
              //   </Fragment>
              // }
              more={
                <p className={styles.more}>
                  <span className={styles.point} style={{ backgroundImage: `url(${pointIcon})` }} />
                  检查点位：
                  {itemCount || 0}
                  <span
                    className={hiddenCount ? styles.hiddenDanger : styles.hiddenDangerZero}
                    onClick={hiddenCount ? e => handleShowUnitDanger(companyId) : null}
                  >
                    <span
                      className={styles.danger}
                      style={{ backgroundImage: `url(${dangerIcon})` }}
                    />
                    隐患数量：
                    {/* <span className={styles.dangerDesc}>隐患数量：</span> */}
                    {hiddenCount || 0}
                  </span>
                  <span className={styles.status}>
                    主机状态：
                    <span
                      className={styles[STATUS_CLASS[isFire]]}
                      onClick={isFire === FIRE ? e => handleAlarmClick(companyId) : null}
                    >
                      {STATUS[isFire]}
                    </span>
                  </span>
                </p>
              }
            />
          )
        )}
      </SearchBar>
    );

    return (
      <DrawerContainer
        visible={visible}
        top={top}
        left={left}
        right={right}
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
