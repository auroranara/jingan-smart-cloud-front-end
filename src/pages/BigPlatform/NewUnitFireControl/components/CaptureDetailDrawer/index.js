import React, { PureComponent } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import alarmIcon from '@/assets/alarm-icon.png';
import unknownPersonIcon from '@/assets/unknown-person.png';
import locationIcon from '../../imgs/icon-location.png';
import compareIcon from '../../imgs/icon-compare.png';
import captureImage2 from '../../imgs/captureImage.png';
import recognizeImage2 from '../../imgs/recognizeImage.png';
import styles from './index.less';

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
    const { dispatch, value } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCaptureDetail',
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
        captureDetail: {
          name,
          location,
          scene,
          captureImage=captureImage2,
          recognizeImage=recognizeImage2,
          time,
          sex,
          phone,
          number,
          birthPlace,
          birthday,
          type,
          card,
          similarity,
        }={},
      },
      visible,
      onClose,
      onClickImage,
      loading,
    } = this.props;

    return (
      <CustomDrawer
        title="抓拍报警详情"
        visible={visible}
        onClose={onClose}
        width="46em"
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
        <div className={styles.container}>
          <div className={styles.infoWrapper}>
            <div className={styles.infoIcon} style={{ backgroundImage: `url(${alarmIcon})` }} />
            <div className={styles.info}>{`发现可疑人员【${name || '未知人员'}】进入【${location || scene || '未知位置'}】监控区域`}</div>
          </div>
          <div className={styles.locationWrapper}>
            <div className={styles.locationIcon} style={{ backgroundImage: `url(${locationIcon})` }} />
            <div className={styles.locationLabel}>位置：</div>
            <div className={styles.location}>{scene || location || '未知位置'}</div>
          </div>
          <div className={styles.imageWrapper}>
            <div
              className={classNames(styles.leftImage, captureImage && styles.enableClick)}
              style={{ backgroundImage: `url(${captureImage})` }}
              onClick={captureImage ? () => onClickImage && onClickImage([captureImage]) : undefined}
            />
            <div className={styles.centerImage} style={{ backgroundImage: `url(${compareIcon})` }} />
            <div
              className={classNames(styles.rightImage, recognizeImage && styles.enableClick)}
              style={recognizeImage ? { backgroundImage: `url(${recognizeImage})` } : { backgroundImage: `url(${unknownPersonIcon})`, backgroundSize: '64%' }}
              onClick={recognizeImage ? () => onClickImage && onClickImage([recognizeImage]) : undefined}
            />
          </div>
          {name && (
            <div className={styles.table}>
              {[{
                label: '抓拍时间',
                value: moment(time).format('YYYY-MM-DD HH:mm:ss'),
              }, {
                label: '姓名',
                value: name,
                labelClassName: styles.space,
              }, {
                label: '性别',
                value: sex,
                labelClassName: styles.space,
              }, {
                label: '手机',
                value: phone,
                labelClassName: styles.space,
              }, {
                label: '工号',
                value: number,
                labelClassName: styles.space,
              }, {
                label: '籍贯',
                value: birthPlace,
                labelClassName: styles.space,
              }, {
                label: '生日',
                value: birthday,
                labelClassName: styles.space,
              }, {
                label: '证件类型',
                value: type,
              }, {
                label: '证件号',
                value: card,
                labelClassName: styles.space2,
              }, {
                label: '相似度',
                value: `${similarity}%`,
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
