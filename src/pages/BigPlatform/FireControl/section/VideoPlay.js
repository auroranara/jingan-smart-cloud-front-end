import React, { Component } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import { Player } from 'video-react';
import HLSSource from '../components/HLSSource.js';
import 'video-react/dist/video-react.css';
import classNames from 'classnames';
import styles from './VideoPlay.less';
import animate from '../../Safety/Animate.less';

@connect(({ bigFireControl }) => ({
  bigFireControl,
}))
class VideoPlay extends Component {
  state = {
    videoSrc: '',
    activeIndex: 0,
  };
  componentDidMount() {}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return this.props.videoList.toString() !== prevProps.videoList.toString();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.handleInit();
    }
  }

  handleInit = () => {
    const { dispatch, videoList, keyId } = this.props;
    dispatch({
      type: 'bigFireControl/fetchStartToPlay',
      payload: {
        key_id: keyId || videoList[0].key_id,
      },
      success: response => {
        this.setState({
          videoSrc: response.src,
        });
        if (keyId) {
          videoList.forEach((item, index) => {
            if (item.key_id === keyId) {
              this.setState({
                activeIndex: index,
              });
            }
          });
        }
      },
    });
  };

  renderVideoList = () => {
    const { videoList } = this.props;
    const { activeIndex } = this.state;
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
                  this.handleItemClick(index, item.key_id);
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
  handleItemClick = (index, keyId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bigFireControl/fetchStartToPlay',
      payload: {
        key_id: keyId,
      },
      success: response => {
        this.setState({
          videoSrc: response.src,
          activeIndex: index,
        });
      },
    });
  };
  handleClose = () => {
    this.props.handleVideoClose();
  };
  render() {
    const { style = {}, visible, videoList } = this.props;
    const { videoSrc, activeIndex } = this.state;
    const wrapperStyles = classNames(styles.videoPlay, animate.pop, animate.in);

    if (!visible) return null;
    return (
      <div className={wrapperStyles} style={{ ...style }}>
        <div className={styles.titleBar}>
          监控地点：
          {videoList[activeIndex].name}
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
