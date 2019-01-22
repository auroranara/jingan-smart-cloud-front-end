import React, { Fragment, PureComponent } from 'react';

import styles from './IndexDrawer.less';
import {
  ChartBar,
  DangerCard,
  DrawerContainer,
  DrawerSection,
  MonitorCard,
  Rect,
  RiskCard,
  SafeCard,
  Solar,
} from '../components/Components';

const TYPE = 'index';
const CARD_COMPONENTS = [RiskCard, DangerCard, MonitorCard, SafeCard];
const LABELS = ['安全巡查', '隐患排查', '动态监测', '安全档案'];
const BAR_COLORS = ['85,134,244', '233,102,108', '244,185,85', '2,252,250'];

// const BAR_LIST = LABELS.map(label => ({ name: label, value: Math.floor(Math.random() * 100) }));
const DEFAULT_LIST = [...Array(10).keys()].map(i => ({ id: i }));

function getDesc(selected, list) {
  switch(selected) {
    case 0:
      const out = list.filter(item => item.status === 4);
      return `共有${out.length}个点位超时未查`;
    case 1:
      const out1 = list.filter(item => item.status === '7');
      return `共有${list.length}个隐患，其中已超期${out1.length}个`;
    case 2:
      return `共有${list.length}个报警设备`;
    case 3:
      return `共有${list.length}条过期信息`;
    default:
      return '暂无信息';
  }
}

export default class IndexDrawer extends PureComponent {
  state={ selected: 0 };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
  };

  handleLabelChange = i => {
    this.setState({ selected: i });
  };

  render() {
    const { visible, data: { safetyIndex, safetyIndexes, riskList, dangerList, monitorList, safeList=DEFAULT_LIST } } = this.props;
    const { selected } = this.state;

    const titleIcon = <Rect color='#0967d3' />;
    // const barLists = [riskList, dangerList, monitorList, safeList];
    // const barListData = LABELS.map((label, i) => ({ name: label, value: Array.isArray(barLists[i]) ? barLists[i].length : 0 }));
    const barListData = LABELS.map((label, i) => ({ name: label, value: safetyIndexes[i] })).filter(item => item.value !== null);
    const left = (
      <Fragment>
        <DrawerSection title="构成">
          <Solar index={safetyIndex} />
        </DrawerSection>
        <DrawerSection title="分值">
          <ChartBar barWidth={30} barColors={BAR_COLORS} labelRotate={0} data={barListData} yAxisRange={[0, 100]} />
        </DrawerSection>
      </Fragment>
    );

    const list = [riskList, dangerList, monitorList, safeList][selected];
    const CardComponent = CARD_COMPONENTS[selected];
    let cards = <p className={styles.empty}>暂无信息</p>;
    if (list.length)
      cards = list.map((item, i) => <CardComponent key={item.id || item.item_id || i} data={item} />);

    const desc = getDesc(selected, list);
    const right = (
      <div className={styles.right}>
        <div className={styles.labels}>
          {LABELS.map((label, i) => (
            <span
              key={label}
              className={i === selected ? styles.labelSelected : styles.label}
              onClick={e => this.handleLabelChange(i)}
            >
              {label}
            </span>
          ))}
        </div>
        <p className={styles.desc}>{desc}</p>
        <div className={styles.cards}>
          {cards}
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title="安全指数"
        titleIcon={titleIcon}
        visible={visible}
        left={left}
        right={right}
        onClose={this.handleClose}
      />
    );
  }
}
