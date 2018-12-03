import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';

import FcSection from './FcSection';
import styles from './VideoSection.less';
import playIcon from '../img/play.png';
// import emptyIcon from '../../Monitor/imgs/waterBg.png';

const GUTTER = 12;
const ROW_STYLE = { height: '50%', paddingBottom: 6 };
const COL_STYLE = { height: '100%', paddingTop: 6 };

const emptyIcon = 'http://data.jingan-china.cn/v2/big-platform/monitor/com/waterBg1.png';

// const PLAY_STYLE = {
//   left: '50%',
//   top: '50%',
//   color: 'rgba(0, 49, 96, 0.9)',
//   fontSize: 50,
//   position: 'absolute',
//   transform: 'translate(-50%, -50%)',
// };

export default class VideoSection extends PureComponent {
  state = { chosen: -1 };

  setIndex = index => {
    this.setState({ chosen: index });
  };

  render() {
    const { showVideo, data: list, ...restProps } = this.props;
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

    const srcList = [...Array(4).keys()].map(i => srcs[i % srcs.length]).filter(item => item);
    const videos = srcList.map(({ name, photo, keyId }, i) => (
      <div
        key={keyId}
        className={i === chosen ? styles.coverChosen : styles.cover}
        onClick={() => {
          showVideo(keyId);
          this.setIndex(i);
        }}
        style={{ backgroundImage: photo && photo !== '该设备ID不存在' ? `url(${photo})` : '' }}
      >
        <span className={styles.playIcon} style={{ backgroundImage: `url(${playIcon})` }} />
        <div className={styles.name}>{name}</div>
      </div>
    ));

    let videoItems = (
      <img src={emptyIcon} alt="空图片" width="170" height="170" className={styles.emptyIcon} />
    );
    if (srcList.length)
      videoItems = [...Array(2).keys()].map(i => (
        <Row key={i} gutter={GUTTER} style={ROW_STYLE}>
          <Col span={12} style={COL_STYLE}>
            {videos[2 * i]}
          </Col>
          <Col span={12} style={COL_STYLE}>
            {videos[2 * i + 1]}
          </Col>
        </Row>
      ));

    return (
      <FcSection title="视频监控" isBack {...restProps}>
        <div className={styles.container} style={{ height: 'calc(100% - 58px)' }}>
          {videoItems}
        </div>
      </FcSection>
    );
  }
}
