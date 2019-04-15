import React, { Component } from 'react';
import { Icon, notification } from 'antd';
import { connect } from 'dva';
import { Player } from 'video-react';
import HLSSource from '../components/HLSSource.js';
import 'video-react/dist/video-react.css';
import classNames from 'classnames';
import styles from './VideoPlay.less';
import animate from '../../Safety/Animate.less';
import Draggable from 'react-draggable';

const LOADING_STYLE = {
  color: '#FFF',
  fontSize: 60,
  fontWeight: 'bold',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};
const LOADING_COMPONENT = (
  <div className={styles.loadingContainer}>
    <Icon type="loading" style={LOADING_STYLE} />
  </div>
);

@connect(({ videoPlay, loading }) => ({
  videoPlay,
  loading: loading.effects['videoPlay/fetchStartToPlay'],
}))
class VideoPlay extends Component {
  state = {
    videoSrc: '',
    activeIndex: 0,
  };

  // VideoList的值发生改变或者keyId发生改变时，重新获取对应视频
  getSnapshotBeforeUpdate(prevProps, prevState) {
    return (
      this.props.videoList.toString() !== prevProps.videoList.toString() ||
      this.props.keyId !== prevProps.keyId
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(snapshot);

    if (snapshot) {
      this.handleInit();
    }
  }

  handleInit = () => {
    const { dispatch, videoList, keyId, showList } = this.props;
    let videoId = '';
    // 如果现实列表
    if (showList) {
      // 列表为空直接return
      if (!(videoList && videoList.length)) return;
      // 如果keyId为空 默认获取video列表第一个
      videoId = keyId || videoList[0].key_id;
    } else {
      videoId = keyId;
    }

    // 清空视频链接
    this.setState({ videoSrc: '' });
    let index = videoList.findIndex(item => {
      return item.key_id === videoId;
    });
    if (index > -1) {
      this.setState({
        activeIndex: index,
      });
    }
    dispatch({
      type: 'videoPlay/fetchStartToPlay',
      payload: {
        key_id: videoId,
      },
      success: response => {
        // console.log('response', response);
        if (videoId) {
          let index = videoList.findIndex(item => {
            return item.key_id === videoId;
          });
          if (index > -1) {
            this.setState({
              activeIndex: index,
            });
          }
          this.setState({
            videoSrc: response.data.url,
          });
        }
      },
      // error: response => {
      //   notification['error']({
      //     message: '视频请求失败',
      //     description: response.msg,
      //     duration: null,
      //   });
      // },
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
            const keyId = item.key_id || item.keyId;
            return (
              <li
                className={itemStyles}
                onClick={() => {
                  this.handleItemClick(index, keyId);
                }}
                key={item.id}
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
    const { dispatch, actionType } = this.props;
    this.setState(
      {
        // videoSrc: response.data.url,
        activeIndex: index,
      },
      () => {
        dispatch({
          type: 'videoPlay/fetchStartToPlay',
          payload: {
            key_id: keyId,
          },
          success: response => {
            this.setState({
              videoSrc: response.data.url,
            });
          },
          error: response => {
            notification['error']({
              message: '失败',
              description: '视频请求失败',
              duration: 3,
            });
          },
        });
      }
    );
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'videoPlay/clearVideo',
      callback: () => {
        this.props.handleVideoClose();
        this.refs.source && this.refs.source.handelDestroy();
      },
    });
  };

  renderPan = () => {
    const { loading, style = {}, videoList = [], draggable = true, showList = true } = this.props;
    const { videoSrc, activeIndex } = this.state;
    const wrapperStyles = classNames(styles.videoPlay, animate.pop, animate.in);

    return (
      <div className={wrapperStyles} style={{ ...style, zIndex: 1070 }}>
        <div
          id="dragBar"
          className={styles.titleBar}
          style={{ cursor: draggable ? 'move' : 'default' }}
        >
          <span style={{ cursor: 'default' }}>
            视频监控
            {/*videoList.length > 0 ? videoList[activeIndex].name : ''*/}
          </span>
          <Icon type="close" className={styles.iconClose} onClick={this.handleClose} />
        </div>
        <div className={styles.videoMain}>
          <div className={styles.videoContent} style={{ paddingRight: showList ? 0 : '5px' }}>
            {loading ? (
              LOADING_COMPONENT
            ) : (
              <Player>
                <HLSSource isVideoChild src={videoSrc} ref="source" />
              </Player>
            )}
          </div>
          {showList && (
            <div className={styles.videoList}>
              <div style={{ height: '36px', lineHeight: '36px', paddingLeft: '10px' }}>
                设备列表
              </div>
              {this.renderVideoList()}
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { visible, draggable = true } = this.props;
    if (!visible) return null;
    return draggable ? (
      <Draggable handle="#dragBar" bounds="parent">
        {this.renderPan()}
      </Draggable>
    ) : (
      this.renderPan()
    );
  }
}

export default VideoPlay;
