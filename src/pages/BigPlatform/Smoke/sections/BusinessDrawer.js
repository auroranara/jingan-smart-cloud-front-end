import React, { PureComponent, Fragment } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import styles from './AlarmDrawer.less';
import {
  DrawerContainer,
  DrawerSection,
  ChartBar,
  ChartRing,
} from '@/pages/BigPlatform/NewFireControl/components/Components';

const TYPE = 'business';
const { RangePicker } = DatePicker;

export default class BusinessDrawer extends PureComponent {
  state = { selected: 0, searchValue: '' };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    this.setState({ searchValue: '', grahp: 0, selected: 0 });
  };

  render() {
    const { visible, data: { graphList = [] } = {} } = this.props;

    const left = (
      <Fragment>
        <RangePicker
          format="YYYY-MM-DD HH:mm:ss"
          placeholder={['开始时间', '结束时间']}
          showTime={{
            defaultValue: [moment('0:0:0', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }}
        />
        <DrawerSection title="处理单位统计" style={{ marginBottom: 50 }}>
          <ChartRing data={graphList} />
        </DrawerSection>
        <DrawerSection title="火警单位排行" titleInfo="共n家">
          <ChartBar data={graphList} labelRotate={-60} />
        </DrawerSection>
      </Fragment>
    );

    return (
      <DrawerContainer
        title="火警统计"
        width={535}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
