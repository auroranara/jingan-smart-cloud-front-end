import React, { PureComponent, Fragment } from 'react';

import Slider from '@/pages/BigPlatform/NewUnitFireControl/components/Slider';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import SwitchHead from '@/pages/BigPlatform/NewUnitFireControl/components/SwitchHead';
import TimelineCard from '@/pages/BigPlatform/NewUnitFireControl/components/TimelineCard';
import DynamicDrawerTop from '@/pages/BigPlatform/Operation/components/DynamicDrawerTop';
import styles from './AlarmDynamicDrawer.less';

export default class AlarmDynamicDrawer extends PureComponent {

  state = {
    index: 0,
    showRepeatDesc: false,
  };

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
      // data,
      ...restProps
    } = this.props;
    const { index, showRepeatDesc } = this.state;
    // const list = [...Array(10).keys()].map(i => ({ ...data[0], id: i }));
    const length = list.length;

    let left = null;
    if (length)
      left =
        length === 1 ? (
          <Fragment>
            <DynamicDrawerTop />
            <TimelineCard {...list[0]} showHead={false} />
          </Fragment>
        ) : (
            <Fragment>
              <DynamicDrawerTop />
              <SwitchHead
                index={index}
                title="火警"
                lastIndex={length - 1}
                handleLeftClick={this.handleLeftClick}
                handleRightClick={this.handleRightClick}
              />
              <div style={{ height: 'calc(100$ - 40px)', overflow: 'hidden' }}>
                <Slider index={index} length={length} size={1}>
                  {list.map((item, i) => (
                    <TimelineCard key={i} style={{ width: `calc(100% / ${length})` }} showHead={false} {...item} />
                  ))}
                </Slider>
              </div>
            </Fragment>
          );


    return <DrawerContainer title="报警处理动态" width={535} left={left} {...restProps} />;
  }
}
