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
const NO_DATA = '暂无信息';
const STATUS_LABELS = ['已处理', '处理中'];
const OPTIONS = ['今日', '本周', '本月'].map((d, i) => ({ value: i, desc: d }));
const HANDLING = '处理中';

// const CARDS = [...Array(10).keys()].map(i => ({
//   id: i,
//   name: '无锡市新吴区机械制造有限公司',
//   location: '无锡市新吴区汉江路与龙江路交叉口5号',
//   person: '王长江',
//   phone: '13288888888',
//   quantity: Math.floor(Math.random() * 10),
//   status: Math.random() > 0.5 ? 0 : 1,
//   statusLabels: ['已处理', '处理中'],
// }));

export default class AlarmDrawer extends PureComponent {
  render() {
    const {
      visible,
      isUnit,
      leftType=0,
      rightType=0,
      data: { todayList=[], thisWeekList=[], thisMonthList=[] },
      handleSelectChange,
      handleDrawerVisibleChange,
    } = this.props;
    const lists = [todayList, thisWeekList, thisMonthList];
    const leftList = lists[leftType];
    const rightList = lists[rightType];
    const handledQuantity = leftList.filter(({ status }) => status === HANDLING).length;
    let handledPercent = 0;
    let handlingPercent = 0;
    if (leftList.length){
      handledPercent = Math.round(handledQuantity / leftList.length * 100);
      handlingPercent = 100 - handledPercent;
    }

    const select = (
      <OvSelect options={OPTIONS} value={leftType} handleChange={v => handleSelectChange('Left', v)} />
    );

    const searchSelect = (
      <OvSelect cssType={1} options={OPTIONS} value={rightType} handleChange={v => handleSelectChange('Right', v)} />
    );

    const left = (
      <Fragment>
        <DrawerSection title="火警状态统计" extra={select}>
          <OvProgress
            title="处理中"
            percent={handledPercent}
            strokeColor="rgb(255,72,72)"
            style={{ marginTop: 40 }}
            iconStyle={{ backgroundImage: `url(${alarmRedIcon})`, width: ICON_WIDTH, height: ICON_HEIGHT, bottom: ICON_BOTTOM }}

          />
          <OvProgress
            title="已处理"
            percent={handlingPercent}
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
          {rightList.map(({ id, companyId, companyName, searchArea, safetyName, safetyPhone, status, saveTime }) => (
            <DrawerCard
              key={id}
              hover
              name={companyName || NO_DATA}
              location={searchArea || NO_DATA}
              person={safetyName || NO_DATA}
              phone={safetyPhone || NO_DATA}
              status={status === HANDLING ? 1 : 0 }
              statusLabels={STATUS_LABELS}
              info={
                <Fragment>
                  <span className={styles.cardIcon} style={{ backgroundImage: `url(${clockIcon})` }} />
                  {moment(saveTime).format('YYYY-MM-DD HH:MM')}
                </Fragment>
              }
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
