import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon } from 'antd';

import Slider from '../components/Slider';
import styles from './ImgSlider.less';

import arrowLeft from '../imgs/arrowLeft.png';
import arrowRight from '../imgs/arrowRight.png';
import cameraIcon from '../imgs/camera.png';
import b1 from '../imgs/b1.jpg';
import b2 from '../imgs/b2.jpg';
import b3 from '../imgs/b3.jpg';
import b4 from '../imgs/b4.jpg';
import b5 from '../imgs/b5.jpg';
import b6 from '../imgs/b6.jpg';

// const IMG_WIDTH = 118;
// const MAG_IMG_WIDTH = 300;

const ICON_STYLE = {
  position: 'absolute',
  fontSize: 25,
  // cursor: 'pointer',
  // color: 'rgb(9,103,211)',
  color: 'rgb(4, 253, 255)',
};

export default class ImgSlider extends PureComponent {
  state = {
    index: 0,
    magIndex: 0,
    showImg: false,
  };

  handleLeft = indexProp => {
    this.setState(state => ({ [indexProp]: state[indexProp] - 1 }));
  };

  handleRight = indexProp => {
    this.setState(state => ({ [indexProp]: state[indexProp] + 1 }));
  };

  handleClickImg = index => {
    this.setState({ showImg: true, magIndex: index });
  };

  handleCloseImg = () => {
    this.setState({ showImg: false });
  };

  render() {
    const {
      picture=[],
      height,
      // ...restProps
    } = this.props;

    // const picture = [b1, b2, b3, b4, b5, b6];
    // const picture = [b1, b2, b3, b4];

    const { index, magIndex, showImg } = this.state;
    const picLength = picture.length;
    const imgLength = Math.max(3, picLength);
    const maxIndex = imgLength - 3;
    const isEnd = index === maxIndex;
    const isMagEnd = magIndex === picLength - 1;

    // const imgs = [...Array(6).keys()].map(i => (
    //   <div key={i} className={styles.imgContainer} style={{ width: `calc(100% / ${imgLength})` }}>
    //     <div
    //       className={styles.fireImg}
    //       style={{ backgroundImage: `url(${imgBg})` }}
    //       onClick={() => this.handleClickImg(i)}
    //     />
    //   </div>
    // ));

    const defaultImg = [cameraIcon, cameraIcon, cameraIcon];
    defaultImg.splice(0, picLength, ...picture);
    // console.log(defaultImg, picture);

    const imgs = defaultImg.map((src, i) => {
      const isCamera = src === cameraIcon;

      return (
        <div key={i} className={styles.imgContainer} style={{ width: `calc(100% / ${imgLength})` }}>
          <div
            className={isCamera ? styles.emptyImg : styles.fireImg}
            style={{
              backgroundImage: `url(${src})`,
              cursor: isCamera ? 'auto' : 'pointer',
            }}
            onClick={i > picLength - 1 && i < 3 ? null : () => this.handleClickImg(i)}
          />
        </div>
      );
    });

    const magImgs = picture.map(src => (
      <div className={styles.magImg} key={src} style={{ backgroundImage: `url(${src})` }} />
    ));

    return (
      <Fragment>
      {/*<div className={styles.container} {...restProps}>*/}
        <div className={styles.main} style={height ? { height } : {}}>
          <Row style={{ height: '100%' }}>
            <div className={styles.bottom}>
              <Col span={1} style={{ height: '100%' }}>
                <div
                  className={styles.arrow}
                  style={{
                    // opacity: 1,
                    opacity: index ? 1 : 0.2,
                    cursor: index ? 'pointer' : 'auto',
                    backgroundImage: `url(${arrowLeft})`,
                  }}
                  onClick={index ? () => this.handleLeft('index') : null}
                />
              </Col>
              <Col span={22} style={{ height: '100%', overflow: 'hidden' }}>
                <Slider index={index} length={imgLength}>
                  {imgs}
                </Slider>
              </Col>
              <Col span={1} style={{ height: '100%' }}>
                <div
                  className={styles.arrow}
                  style={{
                    opacity: isEnd ? 0.2 : 1,
                    cursor: isEnd ? 'auto' : 'pointer',
                    backgroundImage: `url(${arrowRight})`,
                  }}
                  onClick={isEnd ? null : () => this.handleRight('index')}
                />
              </Col>
            </div>
          </Row>
        </div>
        <div className={styles.magnify} style={{ display: showImg ? 'block' : 'none' }}>
          <div className={styles.center}>
            <Slider index={magIndex} length={picLength} size={1}>
              {magImgs}
            </Slider>
          </div>
          <Icon
            type="left"
            style={{
              left: 10,
              top: '50%',
              display: magIndex ? 'block' : 'none',
              cursor: magIndex ? 'pointer' : 'auto',

              ...ICON_STYLE,
            }}
            onClick={magIndex ? () => this.handleLeft('magIndex') : null}
          />
          <Icon
            type="right"
            style={{
              right: 10,
              top: '50%',
              display: isMagEnd ? 'none' : 'block',
              cursor: isMagEnd ? 'auto' : 'pointer',
              ...ICON_STYLE,
            }}
            onClick={isMagEnd ? null : () => this.handleRight('magIndex')}
          />
          <Icon
            type="close"
            onClick={this.handleCloseImg}
            style={{ right: 10, top: 10, cursor: 'pointer', ...ICON_STYLE, fontSize: 18 }}
          />
        </div>
      {/*</div>*/}
      </Fragment>
    );
  }
}
