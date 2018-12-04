import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import VideoPlay from '../../FireControl/section/VideoPlay.js';

import newPointNormal from '@/assets/new-point-normal.png';
import newPointAbnormal from '@/assets/new-point-abnormal.png';
import newVideo from '@/assets/new-video.png';

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
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;
    // 晒选当前四色图上的点位
    const points = point.filter(({ fixImgId }) => fixImgId === id);
    // 筛选当前四色图上的视频
    const videos = videoList.filter(({ fix_img_id }) => fix_img_id && fix_img_id === id);
    console.log(riskPointInfo);

    return (
      <div className={styles.container} style={{ backgroundImage: `url(${webUrl})` }}>
        {points.map(({ itemId, xNum, yNum }) => (
          <div key={itemId} /* className={styles.animated} */ style={{
            position: 'absolute',
            left: `calc(${xNum * 100}% - 16px)`,
            bottom: `${(1 - yNum) * 100}%`,
            width: 33,
            height: 43,
            background: `url(${newPointNormal}) no-repeat center center / 100% 100%`,
            cursor: 'pointer',
          }} />
        ))}
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
