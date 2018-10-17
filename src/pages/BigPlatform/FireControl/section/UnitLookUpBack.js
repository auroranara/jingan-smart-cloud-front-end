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
    dispatch,
    videoVisible,
    lookUpShow,
    startLookUp,
    data: { lookUp: { createTime }, countdown, offGuard, videoLookUp },
    fetchLookUpVideo,
    handleRotateBack,
    handleVideoLookUpRotate,
    handleVideoShow,
  } = props;

  return (
    <FcSection title={titleMap[lookUpShow]} style={{ position: 'relative' }} isBack>
      <LookingUp
        dispatch={dispatch}
        createTime={createTime}
        data={countdown}
        showed={lookUpShow === LOOKING_UP}
        startLookUp={startLookUp}
        handleCounterStop={() => handleRotateBack(true)}
      />
      <OffGuardWarning
        dispatch={dispatch}
        data={offGuard}
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
      {lookUpShow === OFF_GUARD || VIDEO_LOOK_UP ? (
        <span
          onClick={lookUpShow === OFF_GUARD ? () => handleRotateBack() : handleVideoLookUpRotate}
          className={styles.offGuardBackIcon}
          style={{ backgroundImage: `url(${back})` }} />
      ) : null}
    </FcSection>
  );
}
