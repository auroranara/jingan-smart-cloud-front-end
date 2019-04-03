import React from 'react';

import FcSection from './FcSection';
import LookingUp from '../components/LookingUp';
import OffGuardWarning from '../components/OffGuardWarning';
import VideoLookUp from '../components/VideoLookUp';
import styles from './UnitLookUpBack.less';

import back from '../img/back.png';

const LOOKING_UP = 'lookingUp';
const OFF_GUARD = 'offGuardWarning';
const VIDEO_LOOK_UP = 'videoLookUp';

const titleMap = {
  [LOOKING_UP]: '单位查岗',
  [OFF_GUARD]: '脱岗警告',
  [VIDEO_LOOK_UP]: '视频查岗',
};

export default function(props) {
  const {
    gridId,
    dispatch,
    videoVisible,
    lookUpShow,
    startLookUp,
    offGuardWarnLoading,
    data: { createTime, countdown, offGuard, videoLookUp },
    fetchLookUpVideo,
    handleRotateBack,
    handleLookingUpRotateBack, // 正在查岗时，点击右上角返回按钮时的返回
    handleVideoLookUpRotate,
    handleVideoShow,
  } = props;

  const clickMap = {
    [LOOKING_UP]: handleLookingUpRotateBack,
    [OFF_GUARD]: () => handleRotateBack(),
    [VIDEO_LOOK_UP]: handleVideoLookUpRotate,
  };

  return (
    <FcSection title={titleMap[lookUpShow]} style={{ position: 'relative' }} isBack>
      <LookingUp
        // dispatch={dispatch}
        createTime={createTime}
        data={countdown}
        showed={lookUpShow === LOOKING_UP}
        startLookUp={startLookUp}
        handleCounterStop={() => handleRotateBack(true)}
      />
      <OffGuardWarning
        gridId={gridId}
        dispatch={dispatch}
        data={offGuard}
        loading={offGuardWarnLoading}
        showed={lookUpShow === OFF_GUARD}
      />
      <VideoLookUp
        dispatch={dispatch}
        data={videoLookUp}
        videoVisible={videoVisible}
        showed={lookUpShow === VIDEO_LOOK_UP}
        handleVideoShow={handleVideoShow}
        fetchLookUpVideo={fetchLookUpVideo}
      />
      {/* {lookUpShow === OFF_GUARD || lookUpShow === VIDEO_LOOK_UP ? (
        <span
          onClick={lookUpShow === OFF_GUARD ? () => handleRotateBack() : handleVideoLookUpRotate}
          className={styles.offGuardBackIcon}
          style={{ backgroundImage: `url(${back})` }} />
      ) : null} */}
      <span
        onClick={clickMap[lookUpShow]}
        className={styles.offGuardBackIcon}
        style={{ backgroundImage: `url(${back})` }}
      />
    </FcSection>
  );
}
