import React, { PureComponent } from 'react';

import FcModule from './FcModule';
import FcSection from './section/FcSection';

const DURATION = 0.25;

const OPACITY_FRONT = 1;
const OPACITY_BACK = 0;
// easeOutExpo 指数缓出，刚开始运动飞快，结束时运动缓慢，即从背面转到正面时，透明度一开始就飞快往1变化
const TRANS_FRONT = `${DURATION}s ${DURATION}s opacity cubic-bezier(0.19, 1, 0.22, 1)`;
// easeInExpo 指数缓入，刚开始运动缓慢，结束时运动飞快，即从正面转向背面时，透明度一开始不怎么变化，快结束时飞快往0变化
const TRANS_BACK = `${DURATION}s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035)`;

// 在多层滚动时，会有一像素偏差的问题，会覆盖里面的上面或下面的border，所以在此，将默认样式overflow：hidden覆盖掉
const CONTAINER_BASE_STYLE = { border: 'none', overflow: 'visible', boxShadow: 'none' };
const CONTAINER_FRONT = { opacity: OPACITY_FRONT, transition: TRANS_FRONT, ...CONTAINER_BASE_STYLE };
const CONTAINER_BACK = { opacity: OPACITY_BACK, transition: TRANS_BACK, ...CONTAINER_BASE_STYLE };

export default class FcNewMultiRotateModule extends PureComponent {
  lastReverseStatus = false;

  render() {
    const { front, back, reverse, isRotated, showReverse, ...restProps } = this.props;
    const lastReverseStatus = this.lastReverseStatus;

    let containerStyle = CONTAINER_FRONT;

    // 由于render会在未点击翻转时多次调用，所以要判断是否时点击翻转的那次
    // 点击后转到true(反面)，即当前为false(正面)，属性都设置为要转到的反面的属性，否则默认是正面的
    if (lastReverseStatus !== showReverse && showReverse)
      containerStyle = CONTAINER_BACK;

    this.lastReverseStatus = showReverse;

    // 父组件可以翻转，子组件也可以翻转，给翻转的子组件套一个container，让其在翻到反面时整个透明度变为0，翻回来时透明度变为1
    // container组件就是为了控制变换透明度的时机，因为过度有个过程，所以不能一点击时就让其透明度消失，要让其在翻转到90°左右时，变透明
    // 而翻回来时，也不能突然出现，要在90°左右时，透明度变回可见，所以container用了缓入缓出，且变回来时用了延时
    return (
      <FcModule isRotated={showReverse} { ...restProps }>
        {/* <FcSection style={{ ...containerStyle, padding: 0, boxShadow: 'none', background: 'transparent' }}> */}
        <FcSection style={{ ...containerStyle, padding: 0, background: 'transparent' }}>
          <FcModule isRotated={isRotated} style={{ height: '100%' }}>
            {front}
            {back}
          </FcModule>
        </FcSection>
        {reverse}
      </FcModule>
    );
  }
}
