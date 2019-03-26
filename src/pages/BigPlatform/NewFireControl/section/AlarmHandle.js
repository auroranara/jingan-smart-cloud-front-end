import React, { Component } from 'react';
import { Row, Timeline, Col, Icon } from 'antd';
import moment from 'moment';

import FcSection from './FcSection';
import Slider from '../components/Slider';
import styles from './AlarmHandle.less';

import arrowLeft from '../img/arrowLeft.png';
import arrowRight from '../img/arrowRight.png';
import cameraIcon from '../img/camera.png';
// import b1 from '../img/b1.jpg';
// import b2 from '../img/b2.jpg';
// import b3 from '../img/b3.jpg';
// import b4 from '../img/b4.jpg';
// import b5 from '../img/b5.jpg';
// import b6 from '../img/b6.jpg';

// const IMG_WIDTH = 118;
// const MAG_IMG_WIDTH = 300;

const ICON_STYLE = {
  position: 'absolute',
  fontSize: 25,
  // cursor: 'pointer',
  // color: 'rgb(9,103,211)',
  color: 'rgb(4, 253, 255)',
};

function getYearTime(t) {
  return moment(t).format('YYYY-MM-DD');
}

function getTime(t) {
  return moment(t).format('HH:mm:ss');
}

export default class AlarmHandle extends Component {
  state = {
    // 用于控制节点为正序排列
    reverse: false,
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
      data: { startMap, handleMap, finshMap, picture },
    } = this.props;

    const { unitType, createTime } = startMap || {};
    const { createTime: handleTime, safetyMan, safetyPhone, type } = handleMap || {};
    const { safetyMan: safetyMans, endTime, safetyPhone: safetyPhones, type: endType } = finshMap;

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
      <FcSection title="警情处理" style={{ position: 'relative' }} isBack>
        <section className={styles.main}>
          <Row style={{ height: '60%' }}>
            <div className={styles.top}>
              <Timeline
                pending=""
                reverse={this.state.reverse}
                style={{ marginLeft: 86, marginTop: 10 }}
              >
                {/* {!createTime && (
                  <Timeline.Item style={{ paddingBottom: 22 }}>
                    <div>
                      <span className={styles.bestatus}>
                        报警
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#4f6793' }}>
                        暂未报警
                      </p>
                    </div>
                  </Timeline.Item>
                )} */}

                {createTime ? (
                  <Timeline.Item style={{ paddingBottom: 22 }}>
                    <span className={styles.yearTime} style={{ color: '#fff' }}>
                      {getYearTime(createTime)}
                    </span>
                    <span className={styles.time} style={{ color: '#fff' }}>
                      {getTime(createTime)}
                    </span>
                    <div>
                      <span className={styles.status}>
                        报警
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#fff' }}>
                        {unitType}
                      </p>
                    </div>
                  </Timeline.Item>
                ) : (
                  <Timeline.Item style={{ paddingBottom: 22 }}>
                    <div>
                      <span className={styles.bestatus}>
                        报警
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#4f6793' }}>
                        暂未报警
                      </p>
                    </div>
                  </Timeline.Item>
                )}

                {/* {!handleTime && (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <div>
                      <span className={styles.bestatus}>
                        上报
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#4f6793' }}>
                        暂未上报完毕
                      </p>
                    </div>
                  </Timeline.Item>
                )} */}

                {handleTime ? (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <span className={styles.yearTime} style={{ color: '#fff' }}>
                      {getYearTime(handleTime)}
                    </span>
                    <span className={styles.time} style={{ color: '#fff' }}>
                      {getTime(handleTime)}
                    </span>
                    <div>
                      <span className={styles.status}>
                        上报
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#fff' }}>
                        上报该火警为真实火警
                      </p>
                      <p className={styles.contact} style={{ color: '#4f6793' }}>
                        <span>
                          {type}：{safetyMan}
                        </span>
                        <span className={styles.phone}>{safetyPhone}</span>
                      </p>
                    </div>
                  </Timeline.Item>
                ) : (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <div>
                      <span className={styles.bestatus}>
                        上报
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#4f6793' }}>
                        暂未上报完毕
                      </p>
                    </div>
                  </Timeline.Item>
                )}

                {/* {!endTime && (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <div>
                      <span className={styles.bestatus}>
                        处理
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#4f6793' }}>
                        暂未处理完毕
                      </p>
                    </div>
                  </Timeline.Item>
                )} */}

                {endTime ? (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <span className={styles.yearTime} style={{ color: '#fff' }}>
                      {getYearTime(endTime)}
                    </span>
                    <span className={styles.time} style={{ color: '#fff' }}>
                      {getTime(endTime)}
                    </span>
                    <div>
                      <span className={styles.status}>
                        处理
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#fff' }}>
                        确认火警已处理完毕
                      </p>
                      <p className={styles.contact} style={{ color: '#4f6793' }}>
                        <span>
                          {endType}：{safetyMans}
                        </span>
                        <span className={styles.phone}>{safetyPhones}</span>
                      </p>
                    </div>
                  </Timeline.Item>
                ) : (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <div>
                      <span className={styles.bestatus}>
                        处理
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#4f6793' }}>
                        暂未处理完毕
                      </p>
                    </div>
                  </Timeline.Item>
                )}
              </Timeline>
            </div>
          </Row>

          <Row style={{ height: '40%' }}>
            <div className={styles.bottom}>
              <Col span={2} style={{ height: '100%' }}>
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
              <Col span={20} style={{ height: '100%', overflow: 'hidden' }}>
                <Slider index={index} length={imgLength}>
                  {imgs}
                </Slider>
              </Col>
              <Col span={2} style={{ height: '100%' }}>
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
        </section>
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
            style={{ right: 10, top: 10, cursor: 'pointer', ...ICON_STYLE }}
          />
        </div>
      </FcSection>
    );
  }
}
