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

@connect(({ videoPlay }) => ({ videoPlay }))
class VideoPlay extends Component {
  state = {
    videoSrc: '',
    activeIndex: 0,
  };
  // componentDidMount() {}

  // componentWillUnmount() {
  //   console.log('video unmount');
  // }

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
    const { dispatch, actionType, videoList, keyId } = this.props;
    const firstKeyId = videoList[0] && videoList[0].key_id;

    // 清空视频链接
    this.setState({ videoSrc: '' });

    dispatch({
      type: 'videoPlay/fetchStartToPlay',
      // type: actionType,
      payload: {
        key_id: keyId || firstKeyId,
      },
      success: response => {
        this.setState({
          videoSrc: response.data.url,
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
    const { dispatch, actionType } = this.props;
    dispatch({
      type: 'videoPlay/fetchStartToPlay',
      // type: actionType,
      payload: {
        key_id: keyId,
      },
      success: response => {
        this.setState({
          videoSrc: response.data.url,
          activeIndex: index,
        });
      },
    });
  };

  handleClose = () => {
    this.refs.source.handelDestroy();
    //销毁hls
    this.props.handleVideoClose();
    // console.log('source', this.refs.source);
  };

  renderPan = () => {
    const { style = {}, videoList = [], draggable = true, showList = true } = this.props;
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
            视频监控 // {videoList.length > 0 ? videoList[activeIndex].name : ''}
          </span>
          <Icon type="close" className={styles.iconClose} onClick={this.handleClose} />
        </div>
        <div className={styles.videoMain}>
          <div className={styles.videoContent} style={{ paddingRight: showList ? 0 : '5px' }}>
            <Player>
              <HLSSource isVideoChild src={videoSrc} ref="source" />
            </Player>
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
