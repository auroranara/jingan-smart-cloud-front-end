import React, { PureComponent } from 'react';
import Section from '../Section';
import playIcon from '../img/play.png';
import styles from './VideoSurveillance.less';
// const emptyIcon = 'http://data.jingan-china.cn/v2/big-platform/monitor/com/waterBg1.png';/
/**
 * description: 视频监控
 */
export default class VideoSurveillance extends PureComponent {
  render() {
    const { showVideo, data: list } = this.props;
    // const srcs = list.map(({ name, photo, key_id: keyId }) => ({ name, photo, keyId }));
    // const video = list[0]; //获取第一个视频
    // const videoItem = (
    //   <div
    //     key={video.keyId}
    //     onClick={() => {
    //       showVideo(video.keyId);
    //     }}
    //     style={{
    //       backgroundImage:
    //         video.photo && video.photo !== '该设备ID不存在' ? `url(${video.photo})` : '',
    //     }}
    //   >
    //     <span className={styles.playIcon} style={{ backgroundImage: `url(${playIcon})` }} />
    //     <div className={styles.name}>{name}</div>
    //   </div>
    // );

    return (
      <Section title="重点部位监控">
        <div style={{ height: 500 }}>视频监控</div>
      </Section>
    );
  }
}
