import React, { PureComponent } from 'react';
import { Button } from 'antd';

import { VideoPlay } from '../components/Components';
import styles from './CardSelected.less';
import { getUserName } from '../utils';
import { findFirstVideo } from '@/utils/utils';

const VIDEO_STYLE = { position: 'relative', margin: 0, width: '100%', height: '100%', top: 0, right: 0 };
const rect = <span className={styles.rect} />;
function emptyFn() { }

export default class CardSelected extends PureComponent {
  handleToHistory = e => {
    const { cardId, userId, setHistoryRecord, handleLabelClick } = this.props;
    // setHistoryRecord({ id: userId || cardId, isCardId: !userId });
    setHistoryRecord(cardId, userId);
    handleLabelClick(2);
  };

  handleQuitTrack = e => {
    const { setSelectedCard } = this.props;
    setSelectedCard();
    // this.clearHistoryModel();
  };

  // clearHistoryModel = () => {
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'position/save', payload: { data: {}, tree: {} } });
  // };

  render() {
    const { areaInfo, cardId, userId, positions } = this.props;
    // userId存在时优先userId，不存在时用cardId
    const card = positions.find(({ cardId: cId, userId: uId }) => userId ? uId === userId : cId === cardId) || {};
    const { areaId, cardType, phoneNumber, visitorPhone, cardCode, departmentName, videoListTree = [] } = card;
    const isVisitor = !!+cardType;
    const name = getUserName(card, true);
    const phone = isVisitor ? visitorPhone : phoneNumber;
    const showVideo = videoListTree && videoListTree.length;
    const videoKeyId = showVideo ? findFirstVideo(videoListTree).id : '';
    const showList = videoListTree && videoListTree.length > 1 ? true : false;
    const sectionName = areaInfo && areaInfo[areaId] ? areaInfo[areaId].fullName : '外围区域';

    // console.log(videoKeyId);

    return (
      <div className={styles.container}>
        <div className={styles.up}>
          <h3 className={styles.title}>
            {rect}
            人员信息
          </h3>
          <div className={styles.info}>
            <div className={styles[isVisitor ? 'visitorAvatar' : 'avatar']} />
            <p className={styles.name}>{name}</p>
            <p>电话：{phone}</p>
            <p>编号：{cardCode}</p>
            {departmentName && <p>部门：{departmentName}</p>}
            <p>区域：{sectionName}</p>
          </div>
          <div className={styles.btns}>
            <Button ghost className={styles.btn} onClick={this.handleToHistory}>历史轨迹</Button>
            <Button ghost className={styles.btn} onClick={this.handleQuitTrack}>取消追踪</Button>
          </div>
        </div>
        <div className={styles.down}>
          <h3 className={styles.title}>
            {rect}
            视频监控
          </h3>
          <div className={styles.video}>
            <VideoPlay
              hideHead
              visible={true}
              style={VIDEO_STYLE}
              showList={showList}
              videoList={showList ? videoListTree : []}
              keyId={videoKeyId}
              draggable={false}
              handleVideoClose={emptyFn}
              isTree={true}
            />
          </div>
        </div>
      </div>
    )
  }
}
