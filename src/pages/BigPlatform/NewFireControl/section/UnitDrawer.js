import React, { PureComponent, Fragment } from 'react';

import styles from './UnitDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import DrawerSection from '../components/DrawerSection';
import OvProgress from '../components/OvProgress';
import GraphSwitch from '../components/GraphSwitch';
import SearchBar from '../components/SearchBar';
import DrawerCard from '../components/DrawerCard';
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
const STATUS_LABELS = ['正常', '异常'];
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

export default function UnitDrawer(props) {
  const {
    visible,
    labelIndex=0,
    handleSearch,
    handleSwitch,
    handleDrawerVisibleChange,
    data: { allCompanyList: list=[], fireNum=0, commonNum=0, noAccessNum=0 },
  } = props;

  const total = fireNum + commonNum + noAccessNum;
  const [firePercent, commonPercent, noAccessPercent] = [fireNum, commonNum, noAccessNum].map(n => total ? Math.round(n / total * 100) : 0);

  const top = (
    <SwitchHead value={labelIndex} labels={SWITCH_LABELS} onSwitch={handleSwitch} />
  );

  const left = (
    <Fragment>
      <DrawerSection title="消防主机单位情况">
        <OvProgress
          title="报警单位"
          percent={firePercent}
          strokeColor="rgb(255,72,72)"
          style={{ marginTop: 40 }}
          iconStyle={{ backgroundImage: `url(${unitRedIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
        />
        <OvProgress
          title="正常单位"
          percent={commonPercent}
          strokeColor="rgb(0,251,252)"
          iconStyle={{ backgroundImage: `url(${unitBlueIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
        />
        <OvProgress
          title="未接入单位"
          percent={noAccessPercent}
          strokeColor="rgb(163,163,163)"
          iconStyle={{ backgroundImage: `url(${unitGreyIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
        />
      </DrawerSection>
      <DrawerSection title="隐患数量排名" extra={<GraphSwitch />}>
        content
      </DrawerSection>
    </Fragment>
  );

  const right = (
      <SearchBar
        onSearch={handleSearch}
        // style={{ paddingTop: 50 }}
      >
        {list.map(({ companyId, name, address, safetyMan, safetyPhone, hiddenCount, isFire }) => (
          <DrawerCard
            key={companyId}
            name={name || NO_DATA}
            location={address || NO_DATA}
            person={safetyMan || NO_DATA}
            phone={safetyPhone || NO_DATA}
            // status={isFire}
            statusLabels={STATUS_LABELS}
            // info={
            //   <Fragment>
            //     <span className={styles.cardIcon} style={{ backgroundImage: `url(${dangerIcon})` }} />
            //     {`隐患数量：${hiddenCount || 0}`}
            //   </Fragment>
            // }
            more={
              <p className={styles.more}>
                <span className={styles.point} style={{ backgroundImage: `url(${pointIcon})` }} />检查点位：{6}
                <span className={styles.danger} style={{ backgroundImage: `url(${dangerIcon})` }} />隐患数量：{hiddenCount}
                <span className={styles.status}>主机状态：<span className={isFire ? styles.fire : styles.normal}>{isFire ? '报警' : '正常'}</span></span>
              </p>
            }
          />)
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
      onClose={() => handleDrawerVisibleChange(TYPE)}
    />
  );
}
