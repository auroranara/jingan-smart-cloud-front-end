import React, { Component } from 'react';
import { Icon } from 'antd';
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
    const { dispatch, videoList, keyId } = this.props;
    if (!keyId) return;
    // 清空视频链接
    this.setState({ videoSrc: '' });
    let index = videoList.findIndex(item => {
      return item.key_id === keyId;
    });
    if (index > -1) {
      this.setState({
        activeIndex: index,
      });
    }
    dispatch({
      type: 'videoPlay/fetchStartToPlay',
      payload: {
        key_id: keyId,
      },
      success: response => {
        console.log('response', response);
        if (keyId) {
          let index = videoList.findIndex(item => {
            return item.key_id === keyId;
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
                key={keyId}
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
          // type: actionType,
          payload: {
            key_id: keyId,
          },
          success: response => {
            this.setState({
              videoSrc: response.data.url,
            });
          },
        });
      }
    );
    // dispatch({
    //   type: 'videoPlay/fetchStartToPlay',
    //   // type: actionType,
    //   payload: {
    //     key_id: keyId,
    //   },
    //   success: response => {
    //   },
    // });
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
      <div className={wrapperStyles} style={{ ...style }}>
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
