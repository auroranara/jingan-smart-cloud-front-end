import React, { PureComponent } from 'react';
import { Col, Icon, Row } from 'antd';

import FcSection from './FcSection';
import styles from './VideoSection.less';
import playIcon from '../img/play.png';

const GUTTER = 12;
const ROW_STYLE = { height: '50%', paddingBottom: 6 };
const COL_STYLE = { height: '100%', paddingTop: 6 };

const PLAY_STYLE = {
  left: '50%',
  top: '50%',
  color: 'rgba(0, 49, 96, 0.9)',
  fontSize: 50,
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
};

export default class VideoSection extends PureComponent {
  state = { chosen: -1 };

  setIndex = (index) => {
    this.setState({ chosen: index });
  };

  render(props) {
    const { showVideo, data: list } = this.props;
    const { chosen } = this.state;

    const srcs = list.map(({ name, photo, key_id: keyId }) => ({ name, photo, keyId }));

    // const srcs = ['http://58.215.171.233:10080/hls/tonghe_zhiyao/zhutongdao/zhutongdao.png', 'http://58.215.171.233:10080/hls/tonghe_zhiyao/erdaomenchukou/erdaomenchukou.png'];
    // const videos = srcs.map(i => {
    //   const hasVideo = i < srcs.length;
    //   const url = hasVideo ? srcs[i].photo : null;
    //   return (
    //     <div
    //       className={styles.cover}
    //       onClick={hasVideo ? () => showVideo(srcs[i].keyId) : null}
    //       style={{
    //         cursor: hasVideo ? 'pointer' : 'auto',
    //         backgroundImage: url ? `url(${url})` : 'none',
    //       }}
    //     >
    //       {/* <Icon type="play-circle" style={PLAY_STYLE} /> */}
    //       <span className={styles.playIcon} style={{ backgroundImage: `url(${playIcon})` }} />
    //       <div className={styles.cameraName}></div>
    //     </div>
    //   );
    // });

    const srcList = [...Array(4).keys()].map(i => srcs[i % srcs.length]);

    const videos = srcList.map(({ name, photo, keyId }, i) => (
      <div
        className={i === chosen ? styles.coverChosen : styles.cover}
        onClick={() => showVideo(keyId)}
        onMouseEnter={this.setIndex(i)}
        style={{ backgroundImage: `url(${photo})` }}
      >
        <span className={styles.playIcon} style={{ backgroundImage: `url(${playIcon})` }} />
        <div className={styles.name}>{name}</div>
      </div>
    ));

    return (
      <FcSection title="视频监控" isBack>
        <div className={styles.container} style={{ height: 'calc(100% - 58px)' }}>
          {[...Array(2).keys()].map(i => (
            <Row key={i} gutter={GUTTER} style={ROW_STYLE}>
              <Col span={12} style={COL_STYLE}>{videos[2 * i]}</Col>
              <Col span={12} style={COL_STYLE}>{videos[2 * i + 1]}</Col>
            </Row>
          ))}
        </div>
      </FcSection>
    );
  }
}
