import React, { Component } from 'react';
import { Row, Timeline, Col, Icon } from 'antd';
import moment from 'moment';

import FcSection from './FcSection';
import Slider from '../components/Slider';
import styles from './AlarmHandle.less';

import arrowLeft from '../img/arrowLeft.png';
import arrowRight from '../img/arrowRight.png';
import imgBg from '../img/imgBg.png';

const IMG_WIDTH = 118;
const MAG_IMG_WIDTH = 300;

const ICON_STYLE = {
  position: 'absolute',
  fontSize: 25,
  cursor: 'pointer',
  color: 'rgb(9,103,211)',
};

function getTime(t) {
  return moment(t).format('HH:MM:SS');
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
    this.setState(state => ({ [indexProp]: state[indexProp] + 1 }));
  };

  handleRight = indexProp => {
    this.setState(state => ({ [indexProp]: state[indexProp] - 1 }));
  };

  handleClickImg = index => {
    this.setState({ showImg: true, magIndex: index });
  };

  handleCloseImg = () => {
    this.setState({ showImg: false });
  };

  render() {
    const {
      data: {
        startMap: { unitType, createTime },
        handleMap: { createTime: handleTime, safetyMan, safetyPhone },
        finshMap: { safetyMan: safetyMans, endTime, safetyPhone: safetyPhones },
        picture,
      },
    } = this.props;

    const { index, magIndex, showImg } = this.state;
    const imgLength = 6;
    const maxIndex = imgLength - 3;
    const isEnd = index === maxIndex;

    // const imgs = [...Array(6).keys()].map(i => (
    //   <div className={styles.imgContainer}>
    //     <div
    //       className={styles.fireImg}
    //       key={i}
    //       style={{ backgroundImage: `url(${imgBg})` }}
    //       onClick={() => this.handleClickImg(i)}
    //     />
    //   </div>
    // ));

    const defaultImg = [imgBg, imgBg, imgBg];
    defaultImg.splice(0, picture.length, ...picture);

    const imgs = defaultImg.map(src => (
      <div className={styles.imgContainer}>
        <div
          className={styles.fireImg}
          key={src}
          style={{ backgroundImage: `url(${src})` }}
          onClick={() => this.handleClickImg(src)}
        />
      </div>
    ));

    const magImgs = picture.map(src => (
      <div className={styles.magImg} key={src}>{`img${src}`}</div>
    ));

    return (
      <FcSection title="警情处理" style={{ position: 'relative' }} isBack>
        <section className={styles.main}>
          <Row style={{ height: '60%' }}>
            <div className={styles.top}>
              <Timeline
                pending=""
                reverse={this.state.reverse}
                style={{ marginLeft: 65, marginTop: 10 }}
              >
                {!createTime && (
                  <Timeline.Item style={{ paddingBottom: 22 }}>
                    <span className={styles.time} style={{ color: '#fff' }}>
                      {getTime(createTime)}
                    </span>
                    <div>
                      <span className={styles.bestatus} style={{ color: '#4f6793' }}>
                        暂未报警
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#fff' }}>
                        {unitType}
                      </p>
                    </div>
                  </Timeline.Item>
                )}

                {createTime && (
                  <Timeline.Item style={{ paddingBottom: 22 }}>
                    <span className={styles.time} style={{ color: '#fff' }}>
                      {getTime(createTime)}
                    </span>
                    <div>
                      <span className={styles.status} style={{ color: '#fff' }}>
                        报警
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#fff' }}>
                        {unitType}
                      </p>
                    </div>
                  </Timeline.Item>
                )}

                {!handleTime && (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <div>
                      <span className={styles.bestatus} style={{ color: '#fff' }}>
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

                {handleTime && (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <span className={styles.time} style={{ color: '#fff' }}>
                      {getTime(handleTime)}
                    </span>
                    <div>
                      <span className={styles.status} style={{ color: '#fff' }}>
                        上报
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#fff' }}>
                        上报该火警为真实火警
                      </p>
                      <p className={styles.contact} style={{ color: '#4f6793' }}>
                        <span>
                          安全员：
                          {safetyMan}
                        </span>
                        <span className={styles.phone}>{safetyPhone}</span>
                      </p>
                    </div>
                  </Timeline.Item>
                )}

                {!endTime && (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <div>
                      <span className={styles.bestatus} style={{ color: '#fff' }}>
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

                {endTime && (
                  <Timeline.Item style={{ paddingBottom: 10 }}>
                    <span className={styles.time} style={{ color: '#fff' }}>
                      {getTime(endTime)}
                    </span>
                    <div>
                      <span className={styles.status} style={{ color: '#fff' }}>
                        处理
                      </span>
                    </div>
                    <div>
                      <p className={styles.content} style={{ color: '#fff' }}>
                        确认火警已处理完毕
                      </p>
                      <p className={styles.contact} style={{ color: '#4f6793' }}>
                        <span>
                          安全员：
                          {safetyMans}
                        </span>
                        <span className={styles.phone}>{safetyPhones}</span>
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
                  className={styles.arrowLeft}
                  style={{
                    backgroundImage: isEnd ? 'none' : `url(${arrowLeft})`,
                    cursor: isEnd ? 'auto' : 'pointer',
                  }}
                  onClick={isEnd ? null : () => this.handleLeft('index')}
                />
              </Col>
              <Col span={20} style={{ height: '100%', overflow: 'hidden' }}>
                <Slider index={index} length={imgLength} childWidth={IMG_WIDTH}>
                  {imgs}
                </Slider>
              </Col>
              <Col span={2} style={{ height: '100%' }}>
                <div
                  className={styles.arrowRight}
                  style={{
                    backgroundImage: index ? `url(${arrowRight})` : 'none',
                    cursor: index ? 'pointer' : 'auto',
                  }}
                  onClick={index ? () => this.handleRight('index') : null}
                />
              </Col>
            </div>
          </Row>
        </section>
        <div className={styles.magnify} style={{ display: showImg ? 'block' : 'none' }}>
          <div className={styles.center}>
            <Slider index={magIndex} length={imgLength} childWidth={MAG_IMG_WIDTH}>
              {magImgs}
            </Slider>
          </div>
          <Icon
            type="left"
            style={{ left: 10, top: '50%', ...ICON_STYLE }}
            onClick={() => this.handleLeft('magIndex')}
          />
          <Icon
            type="right"
            style={{ right: 10, top: '50%', ...ICON_STYLE }}
            onClick={() => this.handleRight('magIndex')}
          />
          <Icon
            type="close"
            onClick={this.handleCloseImg}
            style={{ right: 10, top: 10, ...ICON_STYLE }}
          />
        </div>
      </FcSection>
    );
  }
}
