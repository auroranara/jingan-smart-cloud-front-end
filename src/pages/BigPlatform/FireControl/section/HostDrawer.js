import React, { PureComponent, Fragment } from 'react';

import styles from './HostDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import DrawerSection from '../components/DrawerSection';
import OvProgress from '../components/OvProgress';
import GraphSwitch from '../components/GraphSwitch';
import SearchBar from '../components/SearchBar';
import DrawerCard from '../components/DrawerCard';
import hostRedIcon from '../img/hostRed.png';
import hostBlueIcon from '../img/hostBlue.png';
import hostIcon from '../img/cardHost.png';

const ICON_WIDTH = 37;
const ICON_HEIGHT = 60;
const ICON_BOTTOM = -5;
const TYPE = 'host';

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

export default class HostDrawer extends PureComponent {
  render() {
    const { visible, isUnit, handleDrawerVisibleChange } = this.props;

    const left = (
      <Fragment>
        <DrawerSection>
          <OvProgress
            title="报警主机"
            percent={50}
            strokeColor="rgb(255,72,72)"
            iconStyle={{ backgroundImage: `url(${hostRedIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}

          />
          <OvProgress
            title="正常主机"
            percent={50}
            strokeColor="rgb(0,251,252)"
            iconStyle={{ backgroundImage: `url(${hostBlueIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
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
                  <span className={styles.cardIcon} style={{ backgroundImage: `url(${hostIcon})` }} />
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
        title="消防主机单位"
        visible={visible}
        left={left}
        right={right}
        onClose={() => handleDrawerVisibleChange(TYPE)}
      />
    );
  }
}
