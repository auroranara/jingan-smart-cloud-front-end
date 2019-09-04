import React, { PureComponent } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import CameraCard from '@/jingan-components/CameraCard';
import LoadMore from '@/jingan-components/LoadMore';
import { connect } from 'dva';
import styles from './index.less';

const FIELDNAMES = {
  name: 'name',
  location: ({ videoCameraArea, location }) => `${videoCameraArea || ''}${location || ''}`,
  number: 'number',
  status: 'state',
  count: ({ faceHistory }) => faceHistory ? faceHistory.length : 0,
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

  getCameraList = (pageNum=1) => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCameraList',
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
        cameraList: {
          pageNum,
        }={},
      },
    } = this.props;
    this.getCameraList(pageNum + 1);
  }

  render() {
    const {
      newUnitFireControl: {
        cameraList: {
          list=[],
          pageSize=0,
          pageNum=0,
          total=0,
        }={},
      },
      visible,
      onClick,
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
              onClick={onClick}
            />
          ))}
          {pageSize * pageNum < total && <LoadMore onClick={this.loadMore} />}
        </div>
      </CustomDrawer>
    );
  }
}
