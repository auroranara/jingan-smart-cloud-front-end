import React, { PureComponent } from 'react';
import Section from '../Section';
import playIcon from '../img/play.png';
import styles from './VideoSurveillance.less';
import {findFirstVideo} from '@/utils/utils';
import defaultMonitorCover from './assets/default-monitor-cover.png';
// const emptyIcon = 'http://data.jingan-china.cn/v2/big-platform/monitor/com/waterBg1.png';/
/**
 * description: 视频监控
 */
export default class VideoSurveillance extends PureComponent {

  render() {
    const { handlePlay, handleShowVideo, data = [] } = this.props;
    // const video = data[0]; //获取第一个视频
    const video = findFirstVideo(data)
    return (
      <Section title="重点部位监控">
        <div className={styles.videoSurveillance}>
          <div
            className={styles.videoItem}
            onClick={() => {
              handlePlay(data, () => {
                handleShowVideo(video.id);
              });
            }}
            style={{
              backgroundImage:
                `url(${video && video.photo && video.photo !== '该设备ID不存在' ? video.photo : defaultMonitorCover})`,
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
