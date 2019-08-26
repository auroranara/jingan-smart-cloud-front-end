import React, { Component } from 'react';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
import { connect } from 'dva';
import classNames from 'classnames';
import cyanFace from '../../imgs/cyan-face.png';
import redFace from '../../imgs/red-face.png';
import styles from './index.less';

/* 人脸识别 */
@connect(({ newUnitFireControl }) => ({
  newUnitFireControl,
}))
export default class FaceRecognition extends Component {
  componentDidMount() {
    this.getFaceRecognitionCount();
  }

  getFaceRecognitionCount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchFaceRecognitionCount',
      payload: {

      },
    });
  }

  handleClick = (e) => {
    const { onClick } = this.props;
    const index = e.currentTarget.dataset.index;
    onClick && onClick(+index);
  }

  handleHistoryClick = () => {
    window.open('/');
  }

  render() {
    const {
      newUnitFireControl: {
        faceRecognitionCount: {
          monitoringPoint=0,
          camera=0,
          capture=0,
        }={},
      },
    } = this.props;

    return (
      <CustomSection
        className={styles.container}
        title="人脸识别"
        action={<span className={styles.history} onClick={this.handleHistoryClick}>历史>></span>}
      >
        <div className={styles.list}>
          {[{
            key: '监测点',
            value: monitoringPoint,
            color: '#0ff',
            image: cyanFace,
          }, {
            key: '摄像机',
            value: camera,
            color: '#0ff',
            image: cyanFace,
          }, {
            key: '今日抓拍报警',
            value: capture,
            color: '#f83329',
            image: redFace,
          }].map(({ key, value, color, image }, index) => (
            <div className={classNames(styles.item, value > 0 && styles.enableClick)} key={key} onClick={value > 0 ? this.handleClick : undefined} data-index={index}>
              <div className={styles.itemValueWrapper}>
                <div className={styles.itemValue} style={{ backgroundImage: `url(${image})`, borderColor: color }}>
                  <div style={{ borderColor: color }} />
                  <div style={{ borderColor: color }} />
                  <div style={{ borderColor: color }} />
                  <div style={{ borderColor: color }} />
                  <span>{value}</span>
                </div>
              </div>
              <div className={styles.itemLabel}>{key}</div>
            </div>
          ))}
        </div>
      </CustomSection>
    );
  }
}
