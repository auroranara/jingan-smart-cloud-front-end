import React, { PureComponent, Fragment } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';

import styles from './FireStatisticsDrawer.less';
import {
  DrawerContainer,
  DrawerSection,
  ChartRing,
} from '@/pages/BigPlatform/NewFireControl/components/Components';

import { ChartBar } from '../components/Components';
import { createUnparsedSourceFile } from 'typescript';
const TYPE = 'fire';
const { RangePicker } = DatePicker;
const RING_LABELS = ['处理中', '已处理', '超时结束'];
const RING_COLORS = ['0,255,255', '0,186,255', '188,188,189'];

@connect(({ smoke }) => ({
  smoke,
}))
export default class FireStatisticsDrawer extends PureComponent {
  state = { selected: 0, searchValue: '' };

  // componentDidMount() {
  //   const { dispatch, type } = this.props;
  //   // 获取火警统计
  //   dispatch({
  //     type: 'smoke/fetchFireHistory',
  //     payload: {
  //       type,
  //     },
  //   });
  // }

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    this.setState({ searchValue: '', grahp: 0, selected: 0 });
  };

  handleOk = type => {
    const { dispatch } = this.props;
    console.log('this.propsthis.props', this.props);
    // 获取火警统计
    dispatch({
      type: 'smoke/fetchFireHistory',
      payload: {
        type,
      },
    });
  };

  render() {
    const {
      visible,
      smoke: {
        fireHistoryData: {
          fireCompanyList: { startDate, endDate, list = [] },
        },
      },
      type,
    } = this.props;
    console.log('12331', this.props);
    const rings = [2, 11, 22].map((n, i) => ({
      name: RING_LABELS[i],
      value: n,
      itemStyle: { color: `rgb(${RING_COLORS[i]})` },
    }));

    const left = (
      <Fragment>
        <div>
          <RangePicker
            format="YYYY-MM-DD"
            className={styles.rangePicker}
            dropdownClassName={styles.rangePicker}
            placeholder={['开始时间', '结束时间']}
            showTime={{
              defaultValue: [moment('0:0:0', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }}
            onOk={() => this.handleOk(type)}
          />
        </div>
        <DrawerSection title="处理单位统计" style={{ marginBottom: 50 }}>
          <ChartRing data={rings} />
        </DrawerSection>

        <DrawerSection title="火警单位排行" titleInfo={`共${list.length}家`}>
          <ChartBar data={list} labelRotate={-60} />
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
