import React, { PureComponent } from 'react';
import { connect } from 'dva';
import coordtransform from 'coordtransform';
import { Card, Spin, Badge, Button, Modal } from 'antd';
// import { Map as BaiduMap, Marker } from 'react-bmap';
import { Map as GDMap, Marker, InfoWindow } from 'react-amap';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './Map.less';

const statusMap = ['default', 'success', 'error', 'processing'];
const status = ['关闭', '正常', '异常', '缓慢'];

const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '视频监控',
    name: '视频监控',
  },
  {
    title: '地图',
    name: '地图',
  },
];

@connect(({ map }) => ({
  map,
}))
export default class Map extends PureComponent {
  state = {
    center: {
      longitude: 120.366011,
      latitude: 31.544389,
    },
    isUsersShow: false,
    isVideosShow: false,
    label: {
      longitude: 120.366011,
      latitude: 31.544389,
      userName: '',
    },
    isLabelShow: false,
    loading: false,
  }

  timer = null

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/fetch',
      payload: {},
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/deleteVideoUrl',
    });
  }

  /* 播放视频点击事件 */
  handlePlayButtonClick = (id) => {
    if (this.timer !== null) {
      return;
    }
    const url = 'http://p92lxg7ga.bkt.clouddn.com/VideoClientSetup.exe.zip';
    this.props.dispatch({
      type: 'map/fetchVideoUrl',
      payload: {
        id,
      },
      success: () => {
        this.timer = setTimeout(() => {
          Modal.warning({
            title: '请安装播放器！',
            content: (<a href={url} style={{ textDecoration: 'none' }}>点击下载</a>),
            okText: '关闭',
          });
        }, 1000);
      },
    });
  }

  /* 播放按钮失焦事件 */
  handlePlayButtonBlur = () => {
    clearTimeout(this.timer);
    this.timer = null;
    this.props.dispatch({
      type: 'map/deleteVideoUrl',
    });
  }

  /* 显示其他在线用户复选框点击事件 */
  handleShowUsers = () => {
    const { center, isUsersShow } = this.state;
    if (isUsersShow) {
      this.setState({
        isUsersShow: false,
      });
      return;
    }
    this.setState({
      loading: true,
    });
    this.props.dispatch({
      type: 'map/fetchUsers',
      payload: {
        ...center,
        range: 5,
      },
      success: () => {
        this.setState({
          isUsersShow: true,
          loading: false,
        });
      },
    });
  }

  /* 显示视频复选框点击事件 */
  handleShowVideos = () => {
    const { center, isVideosShow } = this.state;
    if (isVideosShow) {
      this.setState({
        isVideosShow: false,
      });
      return;
    }
    this.setState({
      loading: true,
    });
    this.props.dispatch({
      type: 'map/fetchVideos',
      payload: {
        ...center,
      },
      success: () => {
        this.setState({
          isVideosShow: true,
          loading: false,
        });
      },
    });
  }

  /* 显示用户标注 */
  handleShowUserLabel(user) {
    this.setState({
      isLabelShow: false,
    });
    this.setState({
      label: user,
      isLabelShow: true,
    });
  }

  /* 显示视频标注 */
  handleShowVideoLabel(video) {
    this.setState({
      isLabelShow: false,
    });
    this.setState({
      label: video,
      isLabelShow: true,
    });
  }

  /* 隐藏标注 */
  handleHideLabel = () => {
    this.setState({
      isLabelShow: false,
    });
  }

  /* 左上角信息面板渲染 */
  renderInfoPanel() {
    const { currentCount, todayCount, faultVideoCount } = this.props.map;
    const { isUsersShow, isVideosShow } = this.state;
    return (
      <div className={styles.customComponent}>
        <div><span>当前在线总数：</span><span>{currentCount}</span></div>
        <div><span>今日在线总数：</span><span>{todayCount}</span></div>
        <div><span>故障视频：</span><span style={{ color: '#ED7D31' }}>{faultVideoCount}</span></div>
        {/* <div><span>在线用户：</span><input type="checkbox" checked={isUsersShow} onChange={this.handleShowUsers} /><span>显示</span></div> */}
        <div><span>视频资源：</span><input type="checkbox" checked={isVideosShow} onChange={this.handleShowVideos} /><span>显示</span></div>
      </div>
    );
  }

  /* 用户组渲染 */
  /* 用户坐标不需要转换坐标系 */
  renderUserList() {
    const { userList } = this.props.map;
    return userList.map((user) => {
      return (
        <Marker
          position={{ longitude: user.longitude, latitude: user.latitude }}
          key={user.userId}
          events={{
            click: this.handleShowUserLabel.bind(this, user),
          }}
        >
          <img src="http://p92lxg7ga.bkt.clouddn.com/icon-user.png" alt="" style={{ display: 'block', width: '19px', height: '33px' }} />
        </Marker>
      );
    });
  }

  /* 视频组渲染 */
  renderVideoList() {
    const { videoList } = this.props.map;
    return videoList.map((video) => {
      const position = coordtransform.wgs84togcj02(video.longitude, video.latitude);
      return (
        <Marker
          position={{ longitude: position[0], latitude: position[1] }}
          key={video.id}
          events={{
            click: this.handleShowVideoLabel.bind(this, video),
          }}
        >
          <img src="http://p92lxg7ga.bkt.clouddn.com/icon-video.png" alt="" style={{ display: 'block', width: '19px', height: '33px' }} />
        </Marker>
      );
    });
  }

  /* 标注内容渲染 */
  renderLabel(label, flag) {
    return flag ? (
      <div className={styles.videoLabel}>
        <div><span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>视频名称：</span>{label.name}</div>
        <div><span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>经度：</span>{parseFloat(label.longitude).toFixed(3)}</div>
        <div><span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>纬度：</span>{parseFloat(label.latitude).toFixed(3)}</div>
        <div><span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>视频状态：</span><Badge status={statusMap[label.status]} text={status[label.status]} /></div>
        <div><span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>操作：</span><Button type="primary" size="small" onClick={() => { this.handlePlayButtonClick(label.id); }} onBlur={this.handlePlayButtonBlur}>播放</Button></div>
      </div>
    ) : (
      <div className={styles.userLabel}>{label.userName}正在使用天翼云眼</div>
    );
  }

  /* 标注渲染 */
  renderInfoWindow() {
    const { label, isLabelShow } = this.state;
    let position = null;
    let flag = true;
    if ('userName' in label) {
      position = {
        longitude: label.longitude,
        latitude: label.latitude,
      };
      flag = false;
    } else {
      const coord = coordtransform.wgs84togcj02(label.longitude, label.latitude);
      position = {
        longitude: coord[0],
        latitude: coord[1],
      };
    }
    return (
      <InfoWindow
        position={position}
        isCustom={false}
        autoMove={false}
        visible={isLabelShow}
        events={{ close: this.handleHideLabel }}
      >
        {this.renderLabel(label, flag)}
      </InfoWindow>
    );
  }

  /* 渲染函数 */
  render() {
    const { loading, isUsersShow, isVideosShow } = this.state;
    const { videoUrl } = this.props.map;
    return (
      <PageHeaderLayout title="地图" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Spin spinning={loading}>
            <div style={{ width: '100%', height: '590px' }}>
              <GDMap
                amapkey="08390761c9e9bcedbdb2f18a2a815541"
                plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
                status={{
                  keyboardEnable: false,
                }}
                useAMapUI
              >
                {this.renderInfoPanel()}
                {isUsersShow && this.renderUserList()}
                {isVideosShow && this.renderVideoList()}
                {this.renderInfoWindow()}
              </GDMap>
              <iframe src={videoUrl} title="视频播放" style={{ display: 'none' }} frameBorder="0" width="0" height="0" />
            </div>
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
