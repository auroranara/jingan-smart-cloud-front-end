import React, { PureComponent } from 'react';

import styles from './AlarmDynamicDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import TimelineCard from '../components/TimelineCard';

export default class AlarmDynamicDrawer extends PureComponent {
  render() {
    const { data: list, ...restProps } = this.props;
    const item = list.length ? list[0] : {};


    const left = (
      <TimelineCard {...item} />
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
