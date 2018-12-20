import React, { PureComponent, Fragment } from 'react';

import styles from './HostDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import DrawerSection from '../components/DrawerSection';
import OvProgress from '../components/OvProgress';
import GraphSwitch from '../components/GraphSwitch';
import SearchBar from '../components/SearchBar';
import DrawerCard from '../components/DrawerCard';
import ChartBar from '../components/ChartBar';
import ChartLine from '../components/ChartLine';
import hostRedIcon from '../img/hostRed.png';
import hostBlueIcon from '../img/hostBlue.png';
import hostIcon from '../img/cardHost.png';

const ICON_WIDTH = 37;
const ICON_HEIGHT = 60;
const ICON_BOTTOM = -5;
const TYPE = 'host';
const FIRE = '2';
const STATUS_LABELS = ['正常', '报警'];

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

export default class HostDrawer extends PureComponent {
  state = { graph: 0, searchValue: '' };

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
      data: { sys, hostAlarmTrend },
      handleCardClick,
      handleDrawerVisibleChange,
    } = this.props;
    const { graph, searchValue } = this.state;

    let list = Array.isArray(sys.companyList) ? sys.companyList : [];
    const filteredList = list.filter(({ name }) => name.includes(searchValue))
    const total = list.length;
    const normal = list.filter(({ isFire }) => isFire === '0').length;
    const fire = total - normal;
    let normalPercent = 0;
    let firePercent = 0;
    if (total) {
      normalPercent = normal / total * 100;
      firePercent = 100 - normalPercent;
    }

    const hostList = Array.isArray(hostAlarmTrend.list) ?
      hostAlarmTrend.list.map(({ year, month, fireNum }) => ({ name: `${year}/${month}`, value: fireNum })) : [];

    const extra = <GraphSwitch handleSwitch={this.handleSwitch} />;

    const left = (
      <Fragment>
        <DrawerSection>
          <OvProgress
            title="报警主机"
            percent={firePercent}
            quantity={fire}
            strokeColor="rgb(255,72,72)"
            iconStyle={{ backgroundImage: `url(${hostRedIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}

          />
          <OvProgress
            title="正常主机"
            percent={normalPercent}
            quantity={normal}
            strokeColor="rgb(0,251,252)"
            iconStyle={{ backgroundImage: `url(${hostBlueIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
          />
        </DrawerSection>
        <DrawerSection title="报警趋势图" extra={extra}>
          {graph ? <ChartBar data={hostList} /> : <ChartLine data={hostList} />}
        </DrawerSection>
      </Fragment>
    );

    const right = (
        <SearchBar onSearch={this.handleSearch}>
          {filteredList.map(({ companyId, name, address, safetyMan, safetyPhone, count, isFire }) => {
            const alarmed = isFire === FIRE;

            return (
              <DrawerCard
                key={companyId}
                hover={alarmed ? true : false }
                info={
                  <Fragment>
                    <span className={styles.cardIcon} style={{ backgroundImage: `url(${hostIcon})` }} />
                    {`主机数量：${count}`}
                  </Fragment>
                }
                name={name}
                location={address}
                person={safetyMan}
                phone={safetyPhone}
                status={alarmed ? 1 : 0}
                statusLabels={STATUS_LABELS}
                onClick={alarmed ? e => handleCardClick(companyId, TYPE) : null}
              />
            );
          })}
        </SearchBar>
    );

    return (
      <DrawerContainer
        title="消防主机单位"
        visible={visible}
        left={left}
        right={right}
        onClose={this.handleClose}
      />
    );
  }
}
