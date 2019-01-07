import React, { PureComponent, Fragment } from 'react';

import styles from './AlarmDynamicDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import TimelineCard from '../components/TimelineCard';

export default class AlarmDynamicMsgDrawer extends PureComponent {
  state = { index: 0 };

  handleLeftClick = () => {
    const { processIds, handleFetchDataId, handleFetchAlarmHandle } = this.props;
    const { index } = this.state;
    handleFetchDataId(processIds[index - 1], res => {
      if (!res.data) return;
      const {
        data: { dataId },
      } = res;
      handleFetchAlarmHandle(dataId);
    });
    this.setState(({ index }) => ({ index: index - 1 }));
  };

  handleRightClick = () => {
    const { processIds, handleFetchDataId, handleFetchAlarmHandle } = this.props;
    const { index } = this.state;
    handleFetchDataId(processIds[index + 1], res => {
      if (!res.data) return;
      const {
        data: { dataId },
      } = res;
      handleFetchAlarmHandle(dataId);
    });
    this.setState(({ index }) => ({ index: index + 1 }));
  };

  render() {
    const { data, processIds, onClose, ...restProps } = this.props;
    const { index } = this.state;
    const dataList = Array.isArray(data) ? data : [];
    const length = processIds.length;
    const list = Array(length).fill({});
    list[index] = dataList[0] || {};

    let left = null;
    if (length)
      left =
        length === 1 ? (
          <TimelineCard {...list[0]} />
        ) : (
          <Fragment>
            <SwitchHead
              index={index}
              title="火警"
              lastIndex={length - 1}
              handleLeftClick={this.handleLeftClick}
              handleRightClick={this.handleRightClick}
            />
            <div className={styles.sliderContainer}>
              <Slider index={index} length={length} size={1}>
                {list.map((item, i) => (
                  <TimelineCard key={i} style={{ width: `calc(100% / ${length})` }} {...item} />
                ))}
              </Slider>
            </div>
          </Fragment>
        );

    return (
      <DrawerContainer
        title="火警动态"
        width={535}
        left={left}
        onClose={() => {
          onClose();
          setTimeout(() => {
            this.setState({ index: 0 });
          }, 200);
        }}
        {...restProps}
      />
    );
  }
}
