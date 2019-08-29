import React, { PureComponent } from 'react';
import { Card } from 'antd';
import DescriptionList from 'components/DescriptionList';
import { getImportantTypes, PhotoStyles } from '../utils';
import Lightbox from 'react-images';

import styles from './FireControl.less';

const { Description } = DescriptionList;

const IMPORTANT_TYPES = ['否', '是'];
/* 表单标签 */
const fieldLabels = {
  companyIchnography: '单位平面图',
  fireIchnography: '消防平面图',
  importantHost: '消防重点单位',
  unitPhoto: '单位图片',
  photoStyle: '若未上传消防平面图，企业消防运营驾驶舱底图所选现有风格',
};
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

export default class FireControlDetail extends PureComponent {
  state = {
    images: [],
    currentImage: 0,
    lightBoxVisible: false,
  };
  /**
   * 显示图片详情
   */
  handleShow = images => {
    this.setState({ images, currentImage: 0, lightBoxVisible: true });
  };

  /**
   * 切换图片
   */
  handleSwitchImage = currentImage => {
    this.setState({
      currentImage,
    });
  };

  /**
   * 切换上一张图片
   */
  handlePrevImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage - 1,
    }));
  };

  /**
   * 切换下一张图片
   */
  handleNextImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage + 1,
    }));
  };

  /**
   * 关闭图片详情
   */
  handleClose = () => {
    this.setState({
      images: [],
      lightBoxVisible: false,
    });
  };

  render() {
    const {
      detail: { companyType, fireIchnographyDetails, companyPhotoDetails, photoStyle },
    } = this.props;
    const { images, currentImage, lightBoxVisible } = this.state;

    const [importantHost] = getImportantTypes(companyType);
    const fireIchnographyList = fireIchnographyDetails ? fireIchnographyDetails : [];
    const unitPhotoList = Array.isArray(companyPhotoDetails) ? companyPhotoDetails : [];
    const defaultPhoto = PhotoStyles.find(item => +item.value === +photoStyle) || {};

    return (
      <Card title="消防信息">
        <DescriptionList col={1} style={{ marginBottom: 20 }}>
          <Description term={fieldLabels.importantHost}>
            {IMPORTANT_TYPES[importantHost]}
          </Description>
          <Description term={fieldLabels.fireIchnography}>
            {fireIchnographyList.length !== 0
              ? fireIchnographyList.map(({ fileName, webUrl }) => (
                  <div key={webUrl}>
                    <a href={webUrl} target="_blank" rel="noopener noreferrer">
                      {fileName || '预览'}
                    </a>
                  </div>
                ))
              : getEmptyData()}
          </Description>
          <Description term={fieldLabels.photoStyle}>
            {defaultPhoto.name ? (
              <span
                style={{ color: '#1890ff', cursor: 'pointer' }}
                onClick={() => {
                  this.handleShow([defaultPhoto.urls[1]]);
                }}
              >
                {defaultPhoto.name}
              </span>
            ) : (
              getEmptyData()
            )}
            {/* {defaultPhoto.name && (
              <div
                className={styles.stylesImg}
                style={{maxWidth: '240px'}}
                onClick={() => {
                  this.handleShow([defaultPhoto.urls[1]]);
                }}
              >
                <img src={defaultPhoto.urls[1]} alt="" />
              </div>
            )} */}
          </Description>
          {/* <p style={{ padding: '0 16px' }}>
            消防运营驾驶舱中间图片显示逻辑：上传图>底图>无图（默认空）
          </p> */}
          <Description term={fieldLabels.unitPhoto}>
            {unitPhotoList.length
              ? unitPhotoList.map(({ fileName, webUrl }) => (
                  <div key={webUrl}>
                    <a href={webUrl} target="_blank" rel="noopener noreferrer">
                      {fileName || '预览'}
                    </a>
                  </div>
                ))
              : getEmptyData()}
          </Description>
        </DescriptionList>
        <Lightbox
          images={images.map(src => ({ src }))}
          isOpen={lightBoxVisible}
          closeButtonTitle="关闭"
          currentImage={currentImage}
          onClickPrev={this.handlePrevImage}
          onClickNext={this.handleNextImage}
          onClose={this.handleClose}
          onClickThumbnail={this.handleSwitchImage}
          showThumbnails
        />
      </Card>
    );
  }
}
