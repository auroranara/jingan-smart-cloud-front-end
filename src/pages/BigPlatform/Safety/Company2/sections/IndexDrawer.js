import React, { Fragment, PureComponent } from 'react';
import { Spin } from 'antd';
import LoadMoreButton from '../../Company3/components/LoadMoreButton';
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
const LOSS_STATUS = 3;
const CARD_COMPONENTS = [RiskCard, DangerCard, MonitorCard, SafeCard];
const LABELS = ['安全巡查', '隐患排查', '动态监测', '安全档案'];
const BAR_COLORS = ['85,134,244', '233,102,108', '244,185,85', '2,252,250'];

// const BAR_LIST = LABELS.map(label => ({ name: label, value: Math.floor(Math.random() * 100) }));
// const DEFAULT_LIST = [...Array(10).keys()].map(i => ({ id: i }));

function getDesc(selected, list, hiddenDangerCount) {
  const { total, ycq } = hiddenDangerCount;
  switch (selected) {
    case 0:
      const out = list.filter(item => item.status === 4);
      return `共${out.length}个点位超时未查`;
    case 1:
      return `共${total}个隐患，其中已超期${ycq}个`;
    case 2:
      const loss = list.filter(item => item.status === LOSS_STATUS);
      return `共${list.length - loss.length}个报警设备，${loss.length}个失联设备`;
    case 3:
      return `共${list.length}条过期信息`;
    default:
      return '暂无信息';
  }
}

export default class IndexDrawer extends PureComponent {
  state = { selected: 0 };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
  };

  handleLabelChange = i => {
    this.setState({ selected: i });
    // 如果点击隐患列表，则进行初始化操作
    if (i === 1) {
      const { getDangerList } = this.props;
      getDangerList();
    }
  };

  handleLoadMore = () => {
    const { getDangerList, data: { dangerList: { pagination: { pageNum=1 }={} }={} } } = this.props;
    getDangerList({ pageNum: pageNum + 1 });
  }

  render() {
    const {
      visible,
      data: {
        safetyIndex,
        safetyIndexes,
        riskList,
        dangerList: {
          list: hiddenDangerList=[],
          pagination: {
            total=0,
            pageNum=0,
            pageSize=0,
          }={},
        }={},
        monitorList,
        safeList,
        hiddenDangerCount,
      },
      loading,
    } = this.props;
    const { selected } = this.state;

    const titleIcon = <Rect color="#0967d3" />;
    // const barLists = [riskList, dangerList, monitorList, safeList];
    // const barListData = LABELS.map((label, i) => ({ name: label, value: Array.isArray(barLists[i]) ? barLists[i].length : 0 }));
    const barListData = LABELS.map((label, i) => ({ name: label, value: safetyIndexes[i] })).filter(
      item => item.value !== null
    );
    const left = (
      <Fragment>
        <DrawerSection title="构成">
          <Solar index={safetyIndex} />
        </DrawerSection>
        <DrawerSection title="分值">
          <ChartBar
            barWidth={30}
            barColors={BAR_COLORS}
            labelRotate={0}
            data={barListData}
            yAxisRange={[0, 100]}
          />
        </DrawerSection>
      </Fragment>
    );

    const list = [riskList, hiddenDangerList, monitorList, safeList][selected];
    const CardComponent = CARD_COMPONENTS[selected];
    let cards = <p className={styles.empty}>暂无信息</p>;
    if (list.length)
      cards = list.map((item, i) => (
        <CardComponent key={item.id || item.item_id || i} data={item} />
      ));

    const desc = getDesc(selected, list, hiddenDangerCount);
    const right = (
      <div className={styles.right}>
        <Spin wrapperClassName={styles.spin} spinning={!!loading}>
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
              {selected === 1 && pageNum * pageSize < total && (
                <div style={{ textAlign: 'center' }}><LoadMoreButton onClick={this.handleLoadMore} /></div>
              )}
          </div>
        </Spin>
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
