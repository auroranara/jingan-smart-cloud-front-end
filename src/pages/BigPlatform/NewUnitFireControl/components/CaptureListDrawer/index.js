import React, { PureComponent } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import CaptureCard from '@/jingan-components/CaptureCard';
import LoadMore from '@/jingan-components/LoadMore';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';

const FIELDNAMES = {
  name: ({ faceId, faceInfo }) => faceId && faceInfo.faceName, // 姓名
  location: ({ monitorDots: [item] }) => item && item.monitorDotPlace, // 位置
  time: 'time', // 时间
  similarity: 'similarity', // 相似度
  image: ({ picDetails }) => picDetails ? picDetails.map(({ webUrl }) => webUrl) : [], // 图片
};

@connect(({ newUnitFireControl, loading }) => ({
  newUnitFireControl,
  loading: loading.effects['newUnitFireControl/fetchCaptureList'],
}))
export default class CaptureListDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.getCaptureList();
      this.scroll && this.scroll.scrollTop();
    }
  }

  getCaptureList = (pageNum=1) => {
    const { dispatch, companyId, value } = this.props;
    const { id } = value || {};
    dispatch({
      type: 'newUnitFireControl/fetchCaptureList',
      payload: {
        companyId,
        startDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        pageSize: 10,
        pageNum,
        deviceId: id,
      },
    });
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom;
  }

  loadMore = () => {
    const {
      newUnitFireControl: {
        captureList: {
          pageNum,
        }={},
      },
    } = this.props;
    this.getCaptureList(pageNum + 1);
  }

  render() {
    const {
      newUnitFireControl: {
        captureList: {
          list=[],
          pageSize=0,
          pageNum=0,
          total=0,
        }={},
      },
      visible,
      onClose,
      onClick,
      onClickImage,
      loading,
    } = this.props;

    return (
      <CustomDrawer
        title="今日抓拍报警"
        width="33.5em"
        visible={visible}
        onClose={onClose}
        zIndex={1001}
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
            <CaptureCard
              key={item.id}
              className={styles.item}
              data={item}
              fieldNames={FIELDNAMES}
              onClick={onClick}
              onClickImage={onClickImage}
            />
          ))}
          {pageSize * pageNum < total && <LoadMore onClick={this.loadMore} />}
        </div>
      </CustomDrawer>
    );
  }
}
