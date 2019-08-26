import React, { PureComponent } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import CaptureCard from '@/jingan-components/CaptureCard';
import { connect } from 'dva';
import styles from './index.less';

const FIELDNAMES = {
  name: 'name', // 姓名
  location: 'location', // 位置
  time: 'time', // 时间
  similarity: 'similarity', // 相似度
  image: 'image', // 图片
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

  getCaptureList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCaptureList',
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
        captureList: {
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
      onClick,
      onClickImage,
      loading,
    } = this.props;

    return (
      <CustomDrawer
        title="今日抓拍报警——出入口监测"
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
            <CaptureCard
              key={item.id}
              className={styles.item}
              data={item}
              fieldNames={FIELDNAMES}
              onClick={onClick}
              onClickImage={onClickImage}
            />
          ))}
        </div>
      </CustomDrawer>
    );
  }
}
