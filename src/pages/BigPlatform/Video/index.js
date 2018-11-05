import React, { Component } from 'react';
import { Icon, notification } from 'antd';
import { connect } from 'dva';
import { Player } from 'video-react';
import HLSSource from './HLSSource.js';
import 'video-react/dist/video-react.css';
import styles from './index.less';

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

  componentDidMount() {
    this.handleInit();
  }

  componentWillUnmount() {
    this.handleClose();
  }

  handleInit = () => {
    const {
      dispatch,
      location: {
        query: { keyId },
      },
    } = this.props;
    // 清空视频链接
    this.setState({ videoSrc: '' });
    dispatch({
      type: 'videoPlay/fetchStartToPlay',
      payload: {
        key_id: keyId,
      },
      success: response => {
        console.log('response', response);
        this.setState({
          videoSrc: response.data.url,
        });
      },
      error: response => {
        notification['error']({
          message: '视频请求失败',
          description: response.msg,
          duration: null,
        });
      },
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'videoPlay/clearVideo',
      callback: () => {
        this.refs.source && this.refs.source.handelDestroy();
      },
    });
  };

  render() {
    const { loading } = this.props;
    const { videoSrc } = this.state;

    return (
      <div className={styles.videoContent}>
        {loading ? (
          LOADING_COMPONENT
        ) : (
          <Player>
            <HLSSource isVideoChild src={videoSrc} ref="source" />
          </Player>
        )}
      </div>
    );
  }
}

export default VideoPlay;
