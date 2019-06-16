import React, { PureComponent, Fragment } from 'react';

import styles from './AlarmDynamicDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import TimelineCard from '../components/TimelineCard';

export default class AlarmDynamicDrawer extends PureComponent {
  state = { index: 0 };

  handleLeftClick = () => {
    const { handleParentChange, data: list } = this.props;
    const { index } = this.state;
    const videoList = list[index - 1].cameraMessage || [];
    this.setState(({ index }) => ({ index: index - 1 }));
    handleParentChange({ videoList });
  };

  handleRightClick = () => {
    const { handleParentChange, data: list } = this.props;
    const { index } = this.state;
    const videoList = list[index + 1].cameraMessage || [];
    this.setState(({ index }) => ({ index: index + 1 }));
    handleParentChange({ videoList });
  };

  render() {
    const {
      data: list,
      phoneVisible,
      // data,
      ...restProps
    } = this.props;
    const { index } = this.state;
    // const list = [...Array(10).keys()].map(i => ({ ...data[0], id: i }));
    const length = list.length;

    let left = null;
    if (length)
      left =
        length === 1 ? (
          <TimelineCard phoneVisible={phoneVisible} {...list[0]} />
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
                  <TimelineCard
                    key={i}
                    phoneVisible={phoneVisible}
                    style={{ width: `calc(100% / ${length})` }}
                    {...item}
                  />
                ))}
              </Slider>
            </div>
          </Fragment>
        );

    return <DrawerContainer title="火警动态" width={535} left={left} {...restProps} />;
  }
}
