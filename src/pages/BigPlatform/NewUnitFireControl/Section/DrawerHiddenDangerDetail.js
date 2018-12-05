import React, { PureComponent } from 'react';
import { Timeline } from 'antd';
import TimelineItem from '../components/TimelineItem';
import DrawerContainer from '../components/DrawerContainer';
import styles from './drawerHiddenDangerDetail.less';

export default class DrawerHiddenDangerDetail extends PureComponent {

  render() {
    const SPANS = [6, 18];
    const {
      visible,
      onClose,
    } = this.props
    return (
      <DrawerContainer
        title="隐患详情"
        visible={visible}
        onClose={onClose}
        width={470}
        destroyOnClose={true}
        left={(
          <div className={styles.drawerHiddenDangerDetail}>
            <Timeline>
              <TimelineItem
                label="创建隐患"
                spans={SPANS}
                day={'2018-12-29'}
                hour={'10:12:00'}
              >
                <div className={styles.contentContainer}></div>
              </TimelineItem>
              <TimelineItem
                label="整改隐患"
                spans={SPANS}
                day={'2018-12-29'}
                hour={'10:12:00'}
              >
                <div className={styles.contentContainer}></div>
              </TimelineItem>
              <TimelineItem
                spans={SPANS}
                label="重新整改"
              ></TimelineItem>
            </Timeline>
          </div>
        )}
      />
    )
  }
}
