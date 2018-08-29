import React, { PureComponent } from 'react';
import { Icon, Tree, Spin } from 'antd';
import { connect } from 'dva';
import { Player } from 'video-react';
import HLSSource from '../components/HLSSource.js';
import 'video-react/dist/video-react.css';
import classNames from 'classnames';
import styles from './VideoPlay.less';

@connect(({ bigFireControl }) => ({
  bigFireControl,
}))
class VideoPlay extends PureComponent {
  state = {
    videoSrc: '',
    activeIndex: 0,
  };
  componentDidMount() {
    const { videoList, keyId } = this.props;

    if (keyId) {
      videoList.forEach((item, index) => {
        if (item.key_id === keyId) {
          this.setState({
            activeIndex: index,
            // videoSrc: item.src,
          });
        }
      });
    } else {
      this.setState({
        // videoSrc: videoList[0].src,
      });
    }
    this.setState({});
  }
  renderVideoList = () => {
    const { videoList, keyId } = this.props;
    let { activeIndex } = this.state;
    // if (keyId) {
    //   videoList.forEach((item, index) => {
    //     if (item.key_id === keyId) {
    //       this.setState({
    //         activeIndex: index,
    //       });
    //       activeIndex = index;
    //     }
    //   });
    // }
    return (
      <div className={styles.listScroll}>
        <ul className={styles.videoUl}>
          {videoList.map((item, index) => {
            const itemStyles = classNames(styles.videoLi, {
              [styles.itemActive]: activeIndex === index,
            });
            return (
              <li
                className={itemStyles}
                onClick={() => {
                  this.handleItemClick(index);
                }}
                key={item.key_id}
              >
                {activeIndex === index && (
                  <Icon type="caret-right" style={{ color: '#f6b54e', margin: '0 8px' }} />
                )}
                {activeIndex !== index && <span className={styles.iconNone} />}
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  handleItemClick = index => {
    const { videoList } = this.props;
    const src = [
      'http://anbao.wxjy.com.cn/hls/xsfx_jiefanglu.m3u8',
      'http://218.90.184.178:23389/hls/dangkou/test.m3u8',
    ];
    this.setState({
      videoSrc: src[index], // videoList[index].src
      activeIndex: index,
    });
  };
  handleClose = () => {
    this.props.handleVideoClose();
  };
  render() {
    const { videoList, style = {}, visible, ...restProps } = this.props;
    const { videoSrc } = this.state;

    if (!visible) return null;
    return (
      <div className={styles.videoPlay} style={{ ...style }} {...restProps}>
        <div className={styles.titleBar}>
          监控地点：
          {`1号楼3#`}
          <Icon
            type="close"
            className={styles.iconClose}
            onClick={() => {
              this.handleClose();
            }}
          />
        </div>
        <div className={styles.videoMain}>
          <div className={styles.videoContent}>
            <Player>
              <HLSSource isVideoChild src={videoSrc} />
            </Player>
          </div>
          <div className={styles.videoList}>
            <div style={{ height: '36px', lineHeight: '36px', paddingLeft: '10px' }}>设备列表</div>
            {this.renderVideoList()}
          </div>
        </div>
      </div>
    );
  }
}

export default VideoPlay;
