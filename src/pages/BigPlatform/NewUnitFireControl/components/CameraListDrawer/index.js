import React, { PureComponent } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import CameraCard from '@/jingan-components/CameraCard';
import { connect } from 'dva';
import styles from './index.less';

const FIELDNAMES = {
  name: 'name',
  location: 'location',
  number: 'number',
  status: 'status',
  count: 'count',
};

@connect(({ newUnitFireControl, loading }) => ({
  newUnitFireControl,
  loading: loading.effects['newUnitFireControl/fetchCameraList'],
}))
export default class CameraListDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.getCameraList();
      this.scroll && this.scroll.scrollTop();
    }
  }

  getCameraList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCameraList',
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
        cameraList: {
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
        title="摄像机列表"
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
            <CameraCard
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
