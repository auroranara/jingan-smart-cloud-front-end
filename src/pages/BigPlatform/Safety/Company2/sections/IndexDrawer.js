import React, { Fragment, PureComponent } from 'react';

import styles from './IndexDrawer.less';
import {
  ChartBar,
  DrawerContainer,
  DrawerSection,
  Rect,
  Solar,
} from '../components/Components';

const TYPE = 'index';
const LABELS = ['安全巡查', '隐患排查', '动态监测', '安全档案'];
const BAR_COLORS = ['85,134,244', '233,102,108', '244,185,85', '2,252,250'];
const BAR_LIST = LABELS.map(label => ({ name: label, value: Math.floor(Math.random() * 100) }));

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
    const { visible } = this.props;
    const { selected } = this.state;

    const titleIcon = <Rect color='#0967d3' />;

    const left = (
      <Fragment>
        <DrawerSection title="构成">
          <Solar />
        </DrawerSection>
        <DrawerSection title="分值">
          <ChartBar barWidth={30} barColors={BAR_COLORS} labelRotate={0} data={BAR_LIST} />
        </DrawerSection>
      </Fragment>
    );

    const right = (
      <div className={styles.right}>
        <div className={styles.labels}>
          {LABELS.map((label, i) => (
            <span
              className={i === selected ? styles.labelSelected : styles.label}
              onClick={e => this.handleLabelChange(i)}
            >
              {label}
            </span>
          ))}
        </div>
        <p className={styles.desc}>共有两个点位超时未查</p>
        <div className={styles.cards}>
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
