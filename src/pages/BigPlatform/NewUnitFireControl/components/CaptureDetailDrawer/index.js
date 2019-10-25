import React, { PureComponent } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import alarmIcon from '@/assets/alarm-icon.png';
import unknownPersonIcon from '@/assets/unknown-person.png';
import locationIcon from '../../imgs/icon-location.png';
import compareIcon from '../../imgs/icon-compare.png';
import styles from './index.less';

const sexDict = {
  1: '男',
  2: '女',
};
const typeDict = {
  1: '军官证',
  2: '身份证',
};

@connect(({ newUnitFireControl, loading }) => ({
  newUnitFireControl,
  loading: loading.effects['newUnitFireControl/fetchCaptureDetail'],
}))
export default class CaptureDetailDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.getCaptureDetail();
      this.scroll && this.scroll.scrollTop();
    }
  }

  getCaptureDetail = () => {
    const { dispatch, companyId, value } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCaptureDetail',
      payload: {
        companyId,
        startDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        pageSize: 1,
        pageNum: 1,
        id: value,
      },
    });
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom || scroll;
  }

  render() {
    const {
      newUnitFireControl: {
        captureDetail: {
          faceId,
          faceInfo,
          videoCamera,
          monitorDots,
          picDetails,
          time,
          similarity,
        }={},
      },
      loading,
      visible,
      onClose,
      onClickImage,
    } = this.props;
    const {
      faceName,
      facePhotoUrl,
      faceType,
      faceTel,
      jobNumber,
      provinceDetail,
      cityDetail,
      faceBirthday,
      identityCardType,
      identityCardNo,
    } = faceInfo || {};
    const {
      videoCameraArea,
      location,
    } = videoCamera || {};
    const [{
      monitorDotPlace,
    }={}] = monitorDots || [];
    const captureImage = (picDetails || []).map(({ webUrl }) => webUrl);
    const recognizeImage = (JSON.parse(facePhotoUrl || null) || []).map(({ webUrl }) => webUrl);
    const recognized = !!(faceId && faceName);

    return (
      <CustomDrawer
        title="抓拍报警详情"
        visible={visible}
        onClose={onClose}
        width="46em"
        zIndex={1002}
        sectionProps={{
          scrollProps: {
            ref: this.setScrollReference,
          },
          spinProps: {
            loading,
          },
        }}
      >
        <div className={styles.container}>
          <div className={styles.infoWrapper}>
            <div className={styles.infoIcon} style={{ backgroundImage: `url(${alarmIcon})` }} />
            <div className={styles.info}>{`发现可疑人员【${recognized ? faceName : '未知人员'}】进入【${`${videoCameraArea || ''}${location || ''}` || '未知位置'}】监控区域`}</div>
          </div>
          <div className={styles.locationWrapper}>
            <div className={styles.locationIcon} style={{ backgroundImage: `url(${locationIcon})` }} />
            <div className={styles.locationLabel}>位置：</div>
            <div className={styles.location}>{monitorDotPlace || '未知位置'}</div>
          </div>
          <div className={styles.imageWrapper}>
            <div
              className={classNames(styles.leftImage, captureImage.length > 0 && styles.enableClick)}
              style={{ backgroundImage: `url(${captureImage[0]})` }}
              onClick={captureImage.length > 0 ? () => onClickImage && onClickImage(Array.from(captureImage)) : undefined}
            />
            <div className={styles.centerImage} style={{ backgroundImage: `url(${compareIcon})` }} />
            <div
              className={classNames(styles.rightImage, recognized && recognizeImage.length > 0 && styles.enableClick)}
              style={recognized && recognizeImage.length > 0 ? { backgroundImage: `url(${recognizeImage[0]})` } : { backgroundImage: `url(${unknownPersonIcon})`, backgroundSize: '64%' }}
              onClick={recognized && recognizeImage.length > 0 ? () => onClickImage && onClickImage(Array.from(recognizeImage)) : undefined}
            />
          </div>
          {recognized && (
            <div className={styles.table}>
              {[{
                label: '抓拍时间',
                value: moment(time).format('YYYY-MM-DD HH:mm:ss'),
              }, {
                label: '姓名',
                value: faceName,
                labelClassName: styles.space,
              }, {
                label: '性别',
                value: sexDict[faceType],
                labelClassName: styles.space,
              }, {
                label: '手机',
                value: faceTel,
                labelClassName: styles.space,
              }, {
                label: '工号',
                value: jobNumber,
                labelClassName: styles.space,
              }, {
                label: '籍贯',
                value: `${provinceDetail || ''}${cityDetail || ''}`,
                labelClassName: styles.space,
              }, {
                label: '生日',
                value: faceBirthday && faceBirthday.slice(0, 10),
                labelClassName: styles.space,
              }, {
                label: '证件类型',
                value: typeDict[identityCardType],
              }, {
                label: '证件号',
                value: identityCardNo,
                labelClassName: styles.space2,
              }, {
                label: '相似度',
                value: `${Math.round(similarity * 100)}%`,
                labelClassName: styles.space2,
                className: styles.similarityRow,
              }].map(({ label, value, labelClassName, className }) => (
                <div className={classNames(styles.row, className)} key={label}>
                  <div className={styles.rowLabel}><span className={labelClassName}>{label}</span></div>
                  <div className={styles.rowValue}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CustomDrawer>
    );
  }
}
