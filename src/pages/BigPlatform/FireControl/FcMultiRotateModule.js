import React, { PureComponent } from 'react';

import FcModule from './FcModule';

export default class FcMultiRotateModule extends PureComponent {
  constructor(props) {
    super(props);
    const { front, isRotated } = props;
    this.temp = front;
    this.lastRotatedStatus = isRotated;
  }

  lastRotatedStatus = false;

  render(props) {
    // isRotated表示当前多翻转的组件的翻转状态，这个才是面的真正正反面的状态
    // showReverse表示点击火警时候翻到另一面要显示火警，其实是个假的正反面状态
    const { isRotated, showReverse, front, back, backIndex, reverse, ...restProps } = this.props;
    const backComponent = Array.isArray(back) ? back[backIndex] :  back;

    const temp = this.temp;
    const lastRotatedStatus = this.lastRotatedStatus;

    let frt = !isRotated && showReverse ? reverse : front;
    let bak = isRotated && showReverse ? reverse : backComponent;

    // 因为同一个rotate状态，render可能会执行好几遍，会影响temp的值，所以在这要进行判断是否是状态改变的那一次
    if (lastRotatedStatus !== isRotated) {
    // isRotated当前为true(反面),则是从false(正面)转过来的，则保持正面不变，且缓存反面，否则保持反面不变，缓存正面
      if (isRotated) {
        frt = temp;
        this.temp = bak;
      }
      else {
        bak = temp;
        this.temp = frt;
      }
    }

    this.lastRotatedStatus = isRotated;

    return (
      <FcModule isRotated={isRotated} {...restProps}>
        { frt }
        { bak }
      </FcModule>
    );
  }
}
