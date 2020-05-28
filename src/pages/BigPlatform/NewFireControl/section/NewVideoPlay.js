import React, { Component, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { notification, Tree, Input } from 'antd';
import { connect } from 'dva';
import { Player } from 'video-react';
import HLSSource from '../components/HLSSource.js';
import 'video-react/dist/video-react.css';
import classNames from 'classnames';
import styles from './NewVideoPlay.less';
import animate from '../../Safety/Animate.less';
// import Draggable from 'react-draggable';
import RenderInPopup from './RenderInPopup';
import { findFirstVideo } from '@/utils/utils';

const { TreeNode } = Tree;
const { Search } = Input;
const LOADING_STYLE = {
  color: '#FFF',
  fontSize: 60,
  fontWeight: 'bold',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};
let dataList = [];
const LOADING_COMPONENT = (
  <div className={styles.loadingContainer}>
    <LegacyIcon type="loading" style={LOADING_STYLE} />
  </div>
);

const circle = (
  <span
    style={{
      display: 'inline-block',
      width: '5px',
      height: '5px',
      marginBottom: '1px',
      borderRadius: '50%',
      backgroundColor: 'rgba(253, 253, 253, 0.5)',
    }}
  />
);

@connect(({ videoPlay, loading }) => ({
  videoPlay,
  loading: loading.effects['videoPlay/fetchStartToPlay'],
}))
class VideoPlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoSrc: '',
      activeIndex: 0,
      selectedKeys: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    };
  }
  // VideoList的值发生改变或者keyId发生改变时，重新获取对应视频
  getSnapshotBeforeUpdate(prevProps, prevState) {
    return (
      JSON.stringify(this.props.videoList) !== JSON.stringify(prevProps.videoList) ||
      this.props.keyId !== prevProps.keyId
    );
  }
  // componentDidMount() {
  //   const { videoList } = this.props
  //  this.generateList(videoList)
  //   this.generateList(videoList)
  // }
  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(snapshot);
    const { isTree = false } = this.props;
    if (snapshot) {
      isTree ? this.handleTreeInit() : this.handleInit();
    }
  }

  handleTreeInit = () => {
    const { dispatch, videoList, keyId, showList } = this.props;
    dataList.length = 0;
    this.generateList(videoList);
    if (showList && !(videoList && videoList.length)) return;
    const item = keyId ? dataList.find(item => item.id === keyId) : findFirstVideo(videoList);
    const videoId = item.id,
      videoKey = item.key_id || item.keyId,
      deviceId = item.device_id || item.deviceId;
    const expandedKeys = [this.getParentKey(videoId, videoList)];

    // 清空视频链接
    this.setState({
      videoSrc: '',
      selectedKeys: [videoId],
      expandedKeys,
      autoExpandParent: true,
      searchValue: '',
    });
    videoKey &&
      dispatch({
        type: 'videoPlay/fetchStartToPlay',
        payload: {
          key_id: videoKey,
          device_id: deviceId,
        },
        success: response => {
          if (videoKey) {
            this.setState({
              videoSrc: response.data.url,
            });
          }
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

  handleInit = () => {
    const { dispatch, videoList, keyId, showList, visible } = this.props;
    if (!visible) return;
    let videoId = '';
    let deviceId = null;
    // 如果现实列表
    if (showList) {
      // 列表为空直接return
      if (!(videoList && videoList.length)) return;
      // 如果keyId为空 默认获取video列表第一个
      videoId = keyId || videoList[0].key_id || videoList[0].keyId;
    } else {
      videoId = keyId;
    }

    // 清空视频链接
    this.setState({ videoSrc: '' });
    let index = videoList.findIndex(item => {
      return item.key_id === videoId || item.keyId === videoId;
    });
    // console.log(videoId, index, videoList);
    if (index > -1) {
      this.setState({
        activeIndex: index,
      });
      const item = videoList[index];
      deviceId = item.device_id || item.deviceId;
    }
    dispatch({
      type: 'videoPlay/fetchStartToPlay',
      payload: {
        key_id: videoId,
        device_id: deviceId,
      },
      success: response => {
        if (videoId) {
          let index = videoList.findIndex(item => {
            return item.key_id === videoId || item.keyId === videoId;
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
      error: response => {
        notification['error']({
          message: '视频请求失败',
          description: response.msg,
          duration: null,
        });
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
            const id = item.id || keyId;
            const deviceId = item.device_id || item.deviceId;
            return (
              <li
                className={itemStyles}
                onClick={() => {
                  this.handleItemClick(index, keyId, deviceId);
                }}
                key={id}
              >
                {activeIndex === index && (
                  <LegacyIcon type="caret-right" style={{ color: '#f6b54e', margin: '0 8px' }} />
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

  handleSearch = e => {
    const { videoList } = this.props;
    const value = e.target.value.trim();
    const expandedKeys =
      value.length > 0
        ? dataList
            .map(
              ({
                type = null,
                keyId = null,
                key_id = null,
                building_id = null,
                floor_id = null,
                building_name = null,
                floor_name = null,
                name = null,
                id,
              }) => {
                // const newKeyId = key_id || keyId;
                const title = (+type === 1 && building_name) || (+type === 2 && floor_name) || name;
                // const key = (+type === 1 && building_id) || (+type === 2 && floor_id) || newKeyId
                if (title && title.indexOf(value) > -1) {
                  return this.getParentKey(id, videoList);
                }
                return null;
              }
            )
            .filter((item, i, self) => item && self.indexOf(item) === i)
        : [];

    this.setState({ searchValue: value, autoExpandParent: true, expandedKeys });
  };

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      const { list = [], id: parentId } = node;
      const childParent = this.getParentKey(key, list);
      // const nodeKey = (+type === 1 && building_id) || (+type === 2 && floor_id) || (key_id || keyId)
      if (list.length > 0) {
        if (
          list.some(
            ({
              type = null,
              keyId = null,
              key_id = null,
              building_id = null,
              floor_id = null,
              id,
            }) => ((+type === 1 && building_id) || (+type === 2 && floor_id) || id) === key
          )
        ) {
          parentKey = parentId;
        } else if (childParent) {
          parentKey = childParent;
        }
      }
    }
    return parentKey;
  };

  /**
   * 将数组内的树降维
   */
  generateList = tree => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      dataList.push(node);
      if (node.list && node.list.length > 0) {
        this.generateList(node.list);
      }
    }
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  renderVideoTree = () => {
    const { videoList } = this.props;
    const { activeIndex, selectedKeys, searchValue, autoExpandParent, expandedKeys } = this.state;

    // if (videoList && videoList.length === 0) return <span>暂无视频</span>
    return (
      <div className={styles.listScroll}>
        <Search
          value={searchValue}
          placeholder="请输入名称"
          onChange={this.handleSearch}
          style={{ padding: '0 5px' }}
        />
        <Tree
          showIcon
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={this.handleSelectTree}
          onExpand={this.onExpand}
          switcherIcon={<LegacyIcon type="caret-down" style={{ color: 'rgb(39, 135, 255)' }} />}
        >
          {this.renderTreeNode(videoList)}
        </Tree>
      </div>
    );
  };

  renderTreeNode = arr => {
    const { searchValue, selectedKeys } = this.state;
    return arr.map(item => {
      // type=1（建筑物） ；type=2（楼层）；type不存在（视频）
      const {
        type = null,
        name = null,
        building_name = null,
        floor_name = null,
        list = [],
        key_id = null,
        keyId = null,
        id,
        deviceId = null,
        device_id = null,
      } = item;
      const newKeyId = key_id || keyId;
      const tempTitle = (+type === 1 && building_name) || (+type === 2 && floor_name) || name;
      // const key = (+type === 1 && building_id) || (+type === 2 && floor_id) || newKeyId
      const index = tempTitle ? tempTitle.indexOf(searchValue) : -1;
      const beforeStr = index > -1 ? tempTitle.substr(0, index) : null;
      const afterStr = index > -1 ? tempTitle.substr(index + searchValue.length) : null;
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{tempTitle}</span>
        );
      const icon = selectedKeys.includes(id) ? (
        <LegacyIcon type="caret-right" style={{ color: '#f6b54e' }} />
      ) : (
        circle
      );
      const dataProps = {
        icon: type ? null : icon,
        selectable: !type,
        title: title,
        key: id,
        keyId: newKeyId,
        deviceId: device_id || deviceId,
      };
      if (list.length > 0) {
        return <TreeNode {...dataProps}>{this.renderTreeNode(list)}</TreeNode>;
      }
      return <TreeNode {...dataProps} />;
    });
  };

  handleItemClick = (index, keyId, deviceId) => {
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
            device_id: deviceId,
          },
          success: response => {
            this.setState({
              videoSrc: response.data.url,
            });
          },
          error: response => {
            this.setState({
              videoSrc: '',
            });
            notification['error']({
              message: '失败',
              description: response.msg,
              duration: 3,
            });
          },
        });
      }
    );
  };

  handleSelectTree = (keys, e) => {
    // 由于keys由id组成
    if (keys.length === 0) return;
    const key = e.selectedNodes[0].props.keyId;
    const deviceId = e.selectedNodes[0].props.deviceId;
    const { dispatch, actionType } = this.props;
    this.setState(
      {
        // videoSrc: response.data.url,
        activeIndex: key,
        selectedKeys: keys,
      },
      () => {
        dispatch({
          type: 'videoPlay/fetchStartToPlay',
          payload: {
            key_id: key,
            device_id: deviceId,
          },
          success: response => {
            this.setState({
              videoSrc: response.data.url,
            });
          },
          error: response => {
            notification['error']({
              message: '失败',
              description: response.msg,
              duration: 3,
            });
            // 失败之后不继续播放
            this.setState({
              videoSrc: '',
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
    const {
      loading,
      style = {},
      videoList = [],
      draggable = true,
      showList = true,
      isTree = false,
    } = this.props;
    const { videoSrc, activeIndex } = this.state;
    const wrapperStyles = classNames(styles.videoPlay, animate.pop, animate.in);

    return (
      // <div className={wrapperStyles} style={{ ...style }}>
      <Fragment>
        <div
          id="dragBar"
          className={styles.titleBar}
          style={{ cursor: draggable ? 'move' : 'default' }}
        >
          <span style={{ cursor: 'default' }}>
            视频监控
            {/*videoList.length > 0 ? videoList[activeIndex].name : ''*/}
          </span>
          <LegacyIcon type="close" className={styles.iconClose} onClick={this.handleClose} />
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
              {isTree ? this.renderVideoTree() : this.renderVideoList()}
            </div>
          )}
        </div>
      </Fragment>
    );
  };

  render() {
    const { className, visible, draggable = true, style } = this.props;
    if (!visible) return null;
    // return draggable ? (
    //   <Draggable handle="#dragBar" bounds="parent">
    //     {this.renderPan()}
    //   </Draggable>
    // ) : (
    const wrapperStyles = classNames(styles.videoPlay, animate.pop, animate.in, className);
    return (
      <RenderInPopup
        className={wrapperStyles}
        style={{ ...style }}
        dragHandle={'#dragBar'}
        draggable={draggable}
      >
        {this.renderPan()}
      </RenderInPopup>
    );
    // );
  }
}

export default VideoPlay;
