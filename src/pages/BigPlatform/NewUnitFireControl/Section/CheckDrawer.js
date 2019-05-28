import React, { PureComponent } from 'react';
import moment from 'moment';
import TotalInfo from '../components/TotalInfo';

import styles from './CheckDrawer.less';

import PointCard from '@/components/PointCard';
import DrawerContainer from '../components/DrawerContainer';

// 获取偏移天数
const getOffsetDays = ({ nextCheckDate }) => {
  return nextCheckDate
    ? Math.abs(
        moment()
          .startOf('day')
          .diff(moment(+nextCheckDate), 'days')
      )
    : '';
};

export default class CheckDrawer extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const {
      visible,
      filterIndex,
      coItemList: { status1 = 0, status2 = 0, status3 = 0, status4 = 0 },
      onClick,
      data: {
        redNormalPointList = [],
        redAbnormalPointList = [],
        redPendingPointList = [],
        redOvertimePointList = [],
        orangeNormalPointList = [],
        orangeAbnormalPointList = [],
        orangePendingPointList = [],
        orangeOvertimePointList = [],
        yellowNormalPointList = [],
        yellowAbnormalPointList = [],
        yellowPendingPointList = [],
        yellowOvertimePointList = [],
        blueNormalPointList = [],
        blueAbnormalPointList = [],
        bluePendingPointList = [],
        blueOvertimePointList = [],
        grayNormalPointList = [],
        grayAbnormalPointList = [],
        grayPendingPointList = [],
        grayOvertimePointList = [],
      },
    } = this.props;
    const topData = [
      {
        value: status4,
        name: '已超期',
        color: '#f83329',
        list: [
          ...redOvertimePointList,
          ...orangeOvertimePointList,
          ...yellowOvertimePointList,
          ...blueOvertimePointList,
          ...grayOvertimePointList,
        ],
      },
      {
        value: status3,
        name: '待检查',
        color: '#ffb400',
        list: [
          ...redPendingPointList,
          ...orangePendingPointList,
          ...yellowPendingPointList,
          ...bluePendingPointList,
          ...grayPendingPointList,
        ],
      },
      {
        value: status1 + status2,
        name: '已检查',
        color: '#fff',
        list: [
          ...redNormalPointList,
          ...redAbnormalPointList,
          ...orangeNormalPointList,
          ...orangeAbnormalPointList,
          ...yellowNormalPointList,
          ...yellowAbnormalPointList,
          ...blueNormalPointList,
          ...blueAbnormalPointList,
          ...grayNormalPointList,
          ...grayAbnormalPointList,
        ],
      },
    ].map((item, index) => {
      return {
        ...item,
        onClick: () => {
          onClick(index);
        },
      };
    });
    const newList = topData[filterIndex] ? topData[filterIndex].list : [];

    const left = (
      <div className={styles.container}>
        <TotalInfo data={topData} active={filterIndex} />
        <div className={styles.cards}>
          {newList.length ? (
            newList.map(item => {
              return (
                <PointCard
                  key={item.item_id}
                  className={styles.card}
                  data={item}
                  fieldNames={{
                    level: 'risk_level', // 风险等级
                    name: 'object_title', // 点位名称
                    lastCheckPerson: 'last_check_user_name', // 上次巡查人员
                    lastCheckTime: 'last_check_date', // 上次巡查时间
                    nextCheckTime: 'nextCheckDate', // 下次巡查时间
                    extendedDays: getOffsetDays, // 超期天数
                    expiryDays: getOffsetDays, // 距到期天数
                    status: 'status', // 检查状态
                    cycle: ({ checkCycleCode, check_cycle, cycle_type }) =>
                      +cycle_type === 1 ? checkCycleCode : check_cycle, // 检查周期
                    type: 'item_type', // 点位类型
                  }}
                />
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: '#fff', height: '200px', lineHeight: '200px' }}>{'暂无数据'}</div>
          )}
        </div>
      </div>
    );

    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        destroyOnClose={true}
        title="安全巡查"
        width={535}
        visible={visible}
        left={left}
        placement="right"
        onClose={() => {
          this.props.onClose();
        }}
      />
    );
  }
}
