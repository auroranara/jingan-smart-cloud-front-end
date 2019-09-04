import React, { PureComponent } from 'react';
import Lightbox from 'react-images';


export default class ImagePreview extends PureComponent {
  state = {
    images: null,
    currentImage: 0,
  }

  componentDidMount() {
    const { images } = this.props;
    if (images) {
      this.handleShow(images);
    }
  }

  componentDidUpdate({ images: prevImages }) {
    const { images } = this.props;
    if (prevImages !== images) {
      this.handleShow(images);
    }
  }

  /**
   * 显示图片详情
   */
  handleShow = (images) => {
    this.setState({
      images: images ? images.map(src => ({ src })) : null,
      currentImage: 0,
    });
  }

  /**
   * 关闭图片详情
   */
  handleClose = () => {
    const { onClose } = this.props;
    this.setState({
      images: null,
    });
    onClose && onClose();
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

  render() {
    const { images, currentImage } = this.state;
    return images && images.length > 0 && (
      <Lightbox
        images={images}
        isOpen={true}
        closeButtonTitle="关闭"
        currentImage={currentImage}
        onClickPrev={this.handlePrevImage}
        onClickNext={this.handleNextImage}
        onClose={this.handleClose}
        onClickThumbnail={this.handleSwitchImage}
        showThumbnails
      />
    );
  }
}
