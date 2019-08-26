import React, { PureComponent } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import MonitoringPointCard from '@/jingan-components/MonitoringPointCard';
import { connect } from 'dva';
import styles from './index.less';

const FIELDNAMES = {
  name: 'name',
  location: 'location',
  cameraNumber: 'cameraNumber',
};

@connect(({ newUnitFireControl, loading }) => ({
  newUnitFireControl,
  loading: loading.effects['newUnitFireControl/fetchMonitoringPointList'],
}))
export default class MonitoringPointListDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.getMonitoringPointList();
      this.scroll && this.scroll.scrollTop();
    }
  }

  getMonitoringPointList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMonitoringPointList',
      payload: {

      },
    });
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom;
  }

  render() {
    const {
      newUnitFireControl: {
        monitoringPointList: {
          list=[],
          // pagination: {
          //   pageSize=0,
          //   pageNum=0,
          //   total=0,
          // }={},
        }={},
      },
      visible,
      onClose,
      loading,
    } = this.props;

    return (
      <CustomDrawer
        title="监测点列表"
        width="33.5em"
        visible={visible}
        onClose={onClose}
        sectionProps={{
          scrollProps: {
            ref: this.setScrollReference,
          },
          spinProps: {
            loading,
          },
        }}
      >
        <div className={styles.list}>
          {list && list.length > 0 && list.map((item) => (
            <MonitoringPointCard
              key={item.id}
              className={styles.item}
              data={item}
              fieldNames={FIELDNAMES}
            />
          ))}
        </div>
      </CustomDrawer>
    );
  }
}
