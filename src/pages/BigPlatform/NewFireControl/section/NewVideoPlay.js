import React, { Component, Fragment } from 'react';
import { Icon, notification, Tree, Input } from 'antd';
import { connect } from 'dva';
import { Player } from 'video-react';
import HLSSource from '../components/HLSSource.js';
import 'video-react/dist/video-react.css';
import classNames from 'classnames';
import styles from './NewVideoPlay.less';
import animate from '../../Safety/Animate.less';
// import Draggable from 'react-draggable';
import RenderInPopup from './RenderInPopup';

const { TreeNode } = Tree
const { Search } = Input
const videoList = [
  {
    building_name: '建筑A',
    building_id: 'build01',
    type: 1,
    list: [
      {
        floor_name: 'A01',
        floor_id: 'build01-f001',
        type: 2,
        list: [
          { name: '视频1视频1视频1视频1视频1', keyId: 'v001' },
          { name: 'asdasd', keyId: 'v002' },
        ],
      },
    ],
  },
  {
    building_name: '建筑B',
    building_id: 'build02',
    type: 1,
    list: [
      {
        floor_name: 'B01',
        floor_id: 'build02-f001',
        type: 2,
        list: [
          { name: '视频12', keyId: 'v222' },
          { name: 'asdasd13', keyId: 'v3333' },
        ],
      },
    ],
  },
  { name: '视频4', keyId: 'v004' },
  { name: '视频5', keyId: 'v005' },
  { name: '视频6', keyId: 'v006' },
  { name: '视频7', keyId: 'v007' },
  { name: '视频8', keyId: 'v008' },
  { name: '视频9', keyId: 'v009' },
  { name: '视频10', keyId: 'v0010' },
  { name: '视频11', keyId: 'v0011' },
]
const LOADING_STYLE = {
  color: '#FFF',
  fontSize: 60,
  fontWeight: 'bold',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};
const dataList = [];
const LOADING_COMPONENT = (
  <div className={styles.loadingContainer}>
    <Icon type="loading" style={LOADING_STYLE} />
  </div>
);

const circle = (
  <span style={{ display: 'inline-block', width: '5px', height: '5px', marginBottom: '1px', borderRadius: '50%', backgroundColor: 'rgba(253, 253, 253, 0.5)' }}></span>
)

@connect(({ videoPlay, loading }) => ({
  videoPlay,
  loading: loading.effects['videoPlay/fetchStartToPlay'],
}))
class VideoPlay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoSrc: '',
      activeIndex: 0,
      selectedKeys: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    }
  }
  // VideoList的值发生改变或者keyId发生改变时，重新获取对应视频
  getSnapshotBeforeUpdate(prevProps, prevState) {
    return (
      this.props.videoList.toString() !== prevProps.videoList.toString() ||
      this.props.keyId !== prevProps.keyId
    );
  }
  componentDidMount() {
    // const { videoList } = this.props
    this.generateList(videoList)
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
        console.log('response', response);
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

  handleSearch = e => {
    const value = e.target.value.trim()
    const expandedKeys = value.length > 0 ? dataList.map(({
      type = null,
      keyId = null,
      key_id = null,
      building_id = null,
      floor_id = null,
      building_name = null,
      floor_name = null,
      name = null,
    }) => {
      const newKeyId = key_id || keyId;
      const title = (+type === 1 && building_name) || (+type === 2 && floor_name) || name
      const key = (+type === 1 && building_id) || (+type === 2 && floor_id) || newKeyId
      if (title.indexOf(value) > -1) {
        return this.getParentKey(key, videoList)
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i) : []
    console.log('expandedKeys', expandedKeys);

    this.setState({ searchValue: value, autoExpandParent: true, expandedKeys })
  }

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      const {
        type = null,
        keyId = null,
        key_id = null,
        building_id = null,
        floor_id = null,
        list = [],
      } = node
      const childParent = this.getParentKey(key, list)
      const nodeKey = (+type === 1 && building_id) || (+type === 2 && floor_id) || (key_id || keyId)
      if (list.length > 0) {
        if (list.some(({ type = null, keyId = null, key_id = null, building_id = null, floor_id = null }) => ((!type && (key_id || keyId)) || (+type === 1 && building_id) || (+type === 2 && floor_id)) === key)) {
          parentKey = nodeKey;
        } else if (childParent) {
          parentKey = childParent;
        }
      }
    }
    return parentKey;
  };

  generateList = (tree) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      dataList.push(node);
      if (node.list && node.list.length > 0) {
        this.generateList(node.list);
      }
    }
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  renderVideoTree = () => {
    // const { videoList } = this.props;
    const { activeIndex, selectedKeys, searchValue, autoExpandParent, expandedKeys } = this.state;

    // if (videoList && videoList.length === 0) return <span>暂无视频</span>
    return (
      <div className={styles.listScroll}>
        <Search value={searchValue} placeholder="请输入名称" onChange={this.handleSearch} style={{ padding: '0 5px' }} />
        <Tree
          showIcon
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={this.handleSelectTree}
          onExpand={this.onExpand}
          switcherIcon={<Icon type="caret-down" style={{ color: 'rgb(39, 135, 255)' }} />}
        >
          {this.renderTreeNode(videoList)}
        </Tree>
      </div>
    )
  }
  renderTreeNode = arr => {
    const { searchValue } = this.state
    return arr.map(item => {
      const {
        type = null,
        keyId = null,
        key_id = null,
        name = null,
        building_name = null,
        building_id = null,
        floor_name = null,
        floor_id = null,
        list = [],
      } = item
      const newKeyId = key_id || keyId;
      const tempTitle = (+type === 1 && building_name) || (+type === 2 && floor_name) || name
      const key = (+type === 1 && building_id) || (+type === 2 && floor_id) || newKeyId
      const index = tempTitle.indexOf(searchValue);
      const beforeStr = tempTitle.substr(0, index);
      const afterStr = tempTitle.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{tempTitle}</span>;
      if (list.length > 0) {
        return (
          <TreeNode icon={!type ? circle : null} selectable={!type} title={title} key={key}>
            {this.renderTreeNode(list)}
          </TreeNode>
        )
      }
      return (<TreeNode icon={!type ? circle : null} selectable={!type} title={title} key={key}></TreeNode>)
    })
  }

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

  handleSelectTree = (keys) => {
    if (keys.length === 0) return
    const [key] = keys
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
  }

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
    const { loading, style = {}, videoList = [], draggable = true, showList = true, isTree = false } = this.props;
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
              {isTree ? this.renderVideoTree() : this.renderVideoList()}
            </div>
          )}
        </div>
      </Fragment>
    );
  };

  render() {
    const { visible, draggable = true, style } = this.props;
    if (!visible) return null;
    // return draggable ? (
    //   <Draggable handle="#dragBar" bounds="parent">
    //     {this.renderPan()}
    //   </Draggable>
    // ) : (
    const wrapperStyles = classNames(styles.videoPlay, animate.pop, animate.in);
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
