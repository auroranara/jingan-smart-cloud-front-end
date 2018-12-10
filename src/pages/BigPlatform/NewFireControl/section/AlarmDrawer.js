import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';

import styles from './AlarmDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import DrawerSection from '../components/DrawerSection';
import OvProgress from '../components/OvProgress';
import GraphSwitch from '../components/GraphSwitch';
import SearchBar from '../components/SearchBar';
import DrawerCard from '../components/DrawerCard';
import OvSelect from '../components/OvSelect';
import alarmRedIcon from '../img/alarmRed.png';
import alarmBlueIcon from '../img/alarmBlue.png';
import clockIcon from '../img/cardClock1.png';

const ICON_WIDTH = 48;
const ICON_HEIGHT = 48;
const ICON_BOTTOM = 2;
const TYPE = 'alarm';
const OPTIONS = ['今日', '本周', '本月'].map((d, i) => ({ value: i, desc: d }));

const CARDS = [...Array(10).keys()].map(i => ({
  id: i,
  name: '无锡市新吴区机械制造有限公司',
  location: '无锡市新吴区汉江路与龙江路交叉口5号',
  person: '王长江',
  phone: '13288888888',
  quantity: Math.floor(Math.random() * 10),
  status: Math.random() > 0.5 ? 0 : 1,
  statusLabels: ['已处理', '处理中'],
}));

export default class AlarmDrawer extends PureComponent {
  render() {
    const { visible, isUnit, ovType, handleDrawerVisibleChange } = this.props;

    const select = (
      <OvSelect options={OPTIONS} />
    );

    const searchSelect = (
      <OvSelect cssType={1} options={OPTIONS} />
    );

    const left = (
      <Fragment>
        <DrawerSection title="火警状态统计" extra={select}>
          <OvProgress
            title="报警主机"
            percent={50}
            strokeColor="rgb(255,72,72)"
            style={{ marginTop: 40 }}
            iconStyle={{ backgroundImage: `url(${alarmRedIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}

          />
          <OvProgress
            title="正常主机"
            percent={50}
            strokeColor="rgb(0,251,252)"
            iconStyle={{ backgroundImage: `url(${alarmBlueIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}
          />
        </DrawerSection>
        <DrawerSection title="火警趋势图" titleInfo="最近12个月" extra={<GraphSwitch />}>
          content
        </DrawerSection>
      </Fragment>
    );

    const right = (
        <SearchBar extra={searchSelect}>
          {CARDS.map(item => (
            <DrawerCard
              key={item.id}
              info={
                <Fragment>
                  <span className={styles.cardIcon} style={{ backgroundImage: `url(${clockIcon})` }} />
                  {moment().format('YYYY-MM-DD HH:MM')}
                </Fragment>
              }
              {...item}
            />)
          )}
        </SearchBar>
    );

    return (
      <DrawerContainer
        title="火警列表"
        visible={visible}
        left={left}
        right={right}
        onClose={() => handleDrawerVisibleChange(TYPE)}
      />
    );
  }
}
