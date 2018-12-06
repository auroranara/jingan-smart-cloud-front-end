import React, { PureComponent, Fragment } from 'react';

import styles from './AlarmDynamicDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import TimelineCard from '../components/TimelineCard';

export default class AlarmDynamicDrawer extends PureComponent {
  state = { index: 0 };

  handleLeftClick = () => {
    this.setState(({ index }) => ({ index: index - 1 }));
  };

  handleRightClick = () => {
    this.setState(({ index }) => ({ index: index + 1 }));
  };

  render() {
    const {
      data: list,
      // data,
      ...restProps
    } = this.props;
    const { index } = this.state;
    // const list = [...Array(10).keys()].map(i => ({ ...data[0], id: i }));
    const length = list.length;

    let left = null;
    if (length)
      left = length === 1 ? (
          <TimelineCard {...list[0]} />
        ) : (
          <Fragment>
            <SwitchHead
              index={index}
              lastIndex={length - 1}
              handleLeftClick={this.handleLeftClick}
              handleRightClick={this.handleRightClick}
            />
            <div className={styles.sliderContainer}>
              <Slider index={index} length={length} size={1}>
                {list.map(item => <TimelineCard key={item.id} style={{ width: `calc(100% / ${length})` }} {...item} />)}
              </Slider>
            </div>
          </Fragment>
      );

    return (
      <DrawerContainer
        title="火警动态"
        width={535}
        left={left}
        {...restProps}
      />
    );
  }
}
