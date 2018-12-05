import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import VideoPlay from '../../FireControl/section/VideoPlay.js';

import newPointNormal from '@/assets/new-point-normal.png';
import newPointAbnormal from '@/assets/new-point-abnormal.png';
import newVideo from '@/assets/new-video.png';
import newLegendVideo from '@/assets/new-legend-video.png';
import newLegendPoint from '@/assets/new-legend-point.png';

import styles from './index.less';

// const defaultBackground = 'http://data.jingan-china.cn/v2/big-platform/safety/comdefaultRectBackground.png';

/**
 * description: 点位巡查统计
 * author: sunkai
 * date: 2018年12月03日
 */
export default class App extends PureComponent {
  state = {
    videoVisible: false,
    videoKeyId: '',
  }

  // componentDidUpdate({ model: { companyMessage: prevCompanyMessage } }) {
  //   const { model: { companyMessage } } = this.props;
  //   // 如果企业信息发生变化，即dispatch以后则初始化当前选中的
  //   if (companyMessage !== prevCompanyMessage) {
  //     const {} = companyMessage;
  //     this.setState({ fourColorImg: companyMessage. });
  //   }
  //   success: ({ point, fourColorImg: [{ id, webUrl } = {}] }) => {
  //     // model中已对point和fourColorImg进行处理，确保point必有坐标值，fourColorImg必为数组
  //     // 如果id不存在，则意味着没有四色图
  //     if (id) {
  //       this.filterPointsByFourColorImgId(point, id, webUrl);
  //     } else {
  //       this.setState({
  //         isCurrentHiddenDangerShow: true,
  //       });
  //     }
  //   }
  // }

  handleShowVideo = (videoKeyId) => {
    this.setState({ videoVisible: true, videoKeyId });
  }

  handleHideVideo = () => {
    this.setState({ videoVisible: false });
  }

  render() {
    const {
      model: {
        companyMessage: {
          point=[],
          // 取出第一张四色图
          fourColorImg: [{ id, webUrl }={}]=[],
        },
        // 视频列表
        videoList,
        // 点位信息
        riskPointInfo,
      },
      // 显示点位信息
      handleShowPointDetail=(itemId)=>this.setState({ [itemId]: true }),
      // 显示点位隐患
      handleShowHiddenDanger=(itemId)=>this.setState({ [itemId]: false }),
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;
    // 晒选当前四色图上的点位
    const points = point.filter(({ fixImgId }) => fixImgId === id);
    // 筛选当前四色图上的视频
    const videos = videoList.filter(({ fix_img_id }) => fix_img_id && fix_img_id === id);

    return (
      <div className={styles.container}>
        <div className={styles.wrapper} style={{ backgroundImage: `url(${webUrl})` }}>
          {points.map(({ itemId, xNum, yNum }) => {
            const isAbnormal = Math.random() < 0.5;
            return (
              <Tooltip overlayClassName={styles.alarmTooltip} placement="top" title={(
                <div>有一条新的隐患！<span className={styles.alarm} onClick={() => {handleShowHiddenDanger(itemId);}}>详情>></span></div>
              )} key={itemId} visible={!!this.state[itemId]}>
                <Tooltip placement="rightTop" title={(
                  <div>
                    <div>点位名称：{'点位1'}</div>
                    <div>状<span style={{ opacity: '0' }}>隐藏</span>态：{isAbnormal?<span style={{ color: '#ff4848'}}>异常</span>:'正常'}</div>
                    <div>最近检查：{'检查人'} {'检查时间'}</div>
                    {isAbnormal && <div>隐患数量：{2}</div>}
                  </div>
                )} key={itemId}>
                  <div key={itemId} className={isAbnormal?styles.animated:undefined} style={{
                    position: 'absolute',
                    left: `calc(${xNum * 100}% - 16px)`,
                    bottom: `${(1 - yNum) * 100}%`,
                    width: 33,
                    height: 43,
                    background: `url(${isAbnormal?newPointAbnormal:newPointNormal}) no-repeat center center / 100% 100%`,
                    cursor: 'pointer',
                    zIndex: isAbnormal ? 2 : 1,
                  }} onClick={() => { handleShowPointDetail(itemId); }} />
                </Tooltip>
              </Tooltip>
            );
          })}
          {videos.map(({ id, key_id, x_num, y_num, name }) => (
            <Tooltip placement="top" title={name} key={id}>
              <div key={id} style={{
                position: 'absolute',
                left: `calc(${x_num * 100}% - 16px)`,
                bottom: `${(1 - y_num) * 100}%`,
                width: 33,
                height: 43,
                background: `url(${newVideo}) no-repeat center center / 100% 100%`,
                cursor: 'pointer',
              }} onClick={() => {this.handleShowVideo(key_id);}} />
            </Tooltip>
          ))}
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
              <div className={styles.legendItemIcon} style={{ backgroundImage: `url(${newLegendVideo})` }}></div>
              <div>视频监控点</div>
          </div>
          <div className={styles.legendItem}>
              <div className={styles.legendItemIcon} style={{ backgroundImage: `url(${newLegendPoint})` }}></div>
              <div>检查点</div>
          </div>
        </div>
        <VideoPlay
          style={{ position: 'fixed' }}
          showList={false}
          videoList={videoList}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleHideVideo}
        />
      </div>
    );
  }
}
