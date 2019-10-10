import React, { PureComponent } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import MonitoringPointCard from '@/jingan-components/MonitoringPointCard';
import { connect } from 'dva';
import LoadMore from '@/jingan-components/LoadMore';
import styles from './index.less';

const FIELDNAMES = {
  name: 'monitorDotName',
  location: 'monitorDotPlace',
  cameraNumber: ({ videoCameras }) => videoCameras && videoCameras.map(({ number }) => number).join('、'),
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

  getMonitoringPointList = (pageNum=1) => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMonitoringPointList',
      payload: {
        companyId,
        pageSize: 10,
        pageNum,
      },
    });
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom;
  }

  loadMore = () => {
    const {
      newUnitFireControl: {
        monitoringPointList: {
          pageNum,
        }={},
      },
    } = this.props;
    this.getMonitoringPointList(pageNum + 1);
  }

  render() {
    const {
      newUnitFireControl: {
        monitoringPointList: {
          list=[],
          pageSize=0,
          pageNum=0,
          total=0,
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
          {pageSize * pageNum < total && <LoadMore onClick={this.loadMore} />}
        </div>
      </CustomDrawer>
    );
  }
}
