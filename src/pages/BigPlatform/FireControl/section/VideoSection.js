import React from 'react';
import { Col, Icon, Row } from 'antd';

import FcSection from './FcSection';
import styles from './VideoSection.less';

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

export default function VideoSection(props) {
  const { showVideo, data: list } = props;

  const srcs = list.map(({ photo, key_id: keyId }) => ({ photo, keyId }));
  // const srcs = ['http://58.215.171.233:10080/hls/tonghe_zhiyao/zhutongdao/zhutongdao.png', 'http://58.215.171.233:10080/hls/tonghe_zhiyao/erdaomenchukou/erdaomenchukou.png'];
  const videos = [...Array(4).keys()].map(i => {
    const hasVideo = i < srcs.length;
    const url = hasVideo ? srcs[i].photo : null;
    return (
      <div
        className={styles.cover}
        onClick={hasVideo ? () => showVideo(srcs[i].keyId) : null}
        style={{
          backgroundImage: url ? `url(${url})` : 'none',
          cursor: hasVideo ? 'pointer' : 'auto',
        }}
      >
        <Icon type="play-circle" style={PLAY_STYLE} />
      </div>
    );
  });

  return (
    <FcSection title="视频监控" isBack>
      <div className={styles.container} style={{ height: 'calc(100% - 58px)' }}>
        <Row gutter={GUTTER} style={ROW_STYLE}>
          <Col span={12} style={COL_STYLE}>{videos[0]}</Col>
          <Col span={12} style={COL_STYLE}>{videos[1]}</Col>
        </Row>
        <Row gutter={GUTTER} style={ROW_STYLE}>
          <Col span={12} style={COL_STYLE}>{videos[2]}</Col>
          <Col span={12} style={COL_STYLE}>{videos[3]}</Col>
        </Row>
      </div>
    </FcSection>
  );
}
