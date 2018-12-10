import React, { PureComponent, Fragment } from 'react';

import styles from './UnitDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import DrawerSection from '../components/DrawerSection';
import OvProgress from '../components/OvProgress';
import GraphSwitch from '../components/GraphSwitch';
import SearchBar from '../components/SearchBar';
import DrawerCard from '../components/DrawerCard';
import unitRedIcon from '../img/unitRed.png';
import unitBlueIcon from '../img/unitBlue.png';
import unitGreyIcon from '../img/unitGrey.png';
import dangerIcon from '../img/cardDanger.png';

const ICON_WIDTH = 42;
const ICON_HEIGHT = 40;
const ICON_BOTTOM = 5;
const TYPE = 'unit';

const CARDS = [...Array(10).keys()].map(i => ({
  id: i,
  name: '无锡市新吴区机械制造有限公司',
  location: '无锡市新吴区汉江路与龙江路交叉口5号',
  person: '王长江',
  phone: '13288888888',
  quantity: Math.floor(Math.random() * 10),
  status: Math.random() > 0.5 ? 0 : 1,
  statusLabels: ['正常', '报警'],
}));

export default class UnitDrawer extends PureComponent {
  render() {
    const { visible, isUnit, handleDrawerVisibleChange } = this.props;

    const left = (
      <Fragment>
        <DrawerSection>
          <OvProgress
            title="报警单位"
            percent={50}
            strokeColor="rgb(255,72,72)"
            iconStyle={{ backgroundImage: `url(${unitRedIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}

          />
          <OvProgress
            title="正常单位"
            percent={50}
            strokeColor="rgb(0,251,252)"
            iconStyle={{ backgroundImage: `url(${unitBlueIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
          />
          <OvProgress
            title="未接入单位"
            percent={50}
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
        <SearchBar>
          {CARDS.map(item => (
            <DrawerCard
              key={item.id}
              info={
                <Fragment>
                  <span className={styles.cardIcon} style={{ backgroundImage: `url(${dangerIcon})` }} />
                  {`隐患数量：${item.quantity}`}
                </Fragment>
              }
              {...item}
            />)
          )}
        </SearchBar>
    );

    return (
      <DrawerContainer
        title="管辖单位"
        visible={visible}
        left={left}
        right={right}
        onClose={() => handleDrawerVisibleChange(TYPE)}
      />
    );
  }
}
