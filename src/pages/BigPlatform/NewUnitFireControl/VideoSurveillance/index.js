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
    const { handlePlay, handleShowVideo, data=[] } = this.props;
    const video = data[0]; //获取第一个视频

    return (
      <Section title="重点部位监控">
        <div className={styles.videoSurveillance}>
          <div
            className={styles.videoItem}
            onClick={() => {
              handlePlay(data, () => {
                handleShowVideo(video.key_id);
              });
            }}
            style={{
              backgroundImage:
                video && video.photo && video.photo !== '该设备ID不存在' ? `url(${video.photo})` : '',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
            }}
          >
            <span className={styles.playIcon} style={{ backgroundImage: `url(${playIcon})` }} />
          </div>
        </div>
      </Section>
    );
  }
}
