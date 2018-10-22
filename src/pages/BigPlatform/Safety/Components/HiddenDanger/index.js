import React, { PureComponent } from 'react';
import Ellipsis from 'components/Ellipsis';

import styles from './index.less';
import noPhotoIcon from '../../img/noPhoto.png';
import ygbIcon from '@/assets/closed.png';
import safety from '@/assets/safety.png';
import fireControl from '@/assets/fire-control.png';
import environment from '@/assets/environment.png';
import hygiene from '@/assets/hygiene.png';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片地址 */
// const descriptionBlueIcon = `${iconPrefix}description_blue.png`;
// const descriptionRedIcon = `${iconPrefix}description_red.png`;
const ycqIcon = `${iconPrefix}ycq.png`;
const wcqIcon = `${iconPrefix}wcq.png`;
const dfcIcon = `${iconPrefix}dfc.png`;

// 字段名
const defaultFieldNames = {
  id: 'id',
  description: 'description',
  sbr: 'sbr',
  sbsj: 'sbsj',
  zgr: 'zgr',
  plan_zgsj: 'plan_zgsj',
  real_zgsj: 'real_zgsj',
  fcr: 'fcr',
  fcsj: 'fcsj',
  status: 'status',
  background: 'background',
  source: 'source',
  businessType: 'businessType',
};
// 获取图章
const getSeal = status => {
  switch (+status) {
    case 1:
    case 2:
      return wcqIcon;
    case 3:
      return dfcIcon;
    case 4:
      return ygbIcon;
    case 7:
      return ycqIcon;
    default:
      return wcqIcon;
  }
};
// 根据业务分类获取对应图标
const getIconByBusinessType = function(businessType) {
  switch (+businessType) {
    case 1:
      return safety;
    case 2:
      return fireControl;
    case 3:
      return environment;
    case 4:
      return hygiene;
    default:
      return safety;
  }
};

/**
 * 隐患详情单元
 */
export default class App extends PureComponent {
  render() {
    const {
      style,
      data,
      fieldNames,
      isSourceShow,
    } = this.props;

    const { description, sbr, sbsj, zgr, plan_zgsj, real_zgsj, fcr, fcsj, status, background, source, businessType } = { ...defaultFieldNames, ...fieldNames };
    const isYCQ = +data[status] === 7;
    const isDFC = +data[status] === 3;
    const isYGB = +data[status] === 4;

    return (
      <div className={styles.riskDetailItem} style={style}>
        <div className={styles.riskDetailItemTitleWrapper}><div className={styles.riskDetailItemTitleAvatar} style={{ backgroundImage: `url(${getIconByBusinessType(data[businessType])})` }} /><Ellipsis lines={1} tooltip className={styles.riskDetailItemTitle} style={{ color: isYCQ ? '#ff4848' : '#fff' }} >{data[description] || '暂无隐患描述'}</Ellipsis></div>
        <div className={styles.riskDetailItemSealWrapper}><img alt="" src={getSeal(data[status])} /></div>
        <div className={styles.riskDetailItemContentWrapper}>
          <div className={styles.riskDetailItemImageWrapper} style={{ backgroundImage: `url(${noPhotoIcon})` }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <img src={data[background]} alt="" style={{ display: 'block', width: '100%' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 168, 255, 0.3)' }} />
            </div>
          </div>
          <div style={{ flex: 1  }}>
            <div className={styles.riskDetailItemTextWrapper}><span style={{ color: '#00A8FF' }}>上<span style={{ opacity: 0 }}>隐藏</span>报：</span><Ellipsis tooltip lines={1} style={{ flex: 1, color: '#fff' }} ><span className={styles.riskDetailItemTextFirstChild}>{data[sbr]}</span>{data[sbsj]}</Ellipsis></div>
            <div className={styles.riskDetailItemTextWrapper}><span style={{ color: '#00A8FF' }}>{(isDFC || isYGB)?'实际整改：':'计划整改：'}</span><Ellipsis tooltip lines={1} style={{ flex: 1, color: '#fff', lineHeight: 1 }} ><span className={styles.riskDetailItemTextFirstChild}>{data[zgr]}</span><span style={{ color: isYCQ?'#ff4848':undefined }}>{(isDFC || isYGB)?data[real_zgsj]:data[plan_zgsj]}</span></Ellipsis></div>
            {(isDFC || isYGB) && <div className={styles.riskDetailItemTextWrapper}><span style={{ color: '#00A8FF' }}>复<span style={{ opacity: 0 }}>隐藏</span>查：</span><Ellipsis tooltip lines={1} style={{ flex: 1, color: '#fff' }} ><span className={styles.riskDetailItemTextFirstChild}>{data[fcr]}</span>{data[fcsj]}</Ellipsis></div>}
            {isSourceShow && <div className={styles.riskDetailItemTextWrapper}><span style={{ color: '#00A8FF' }}>来<span style={{ opacity: 0 }}>隐藏</span>源：</span><Ellipsis tooltip lines={1} style={{ flex: 1, color: '#fff' }} ><span className={styles.riskDetailItemTextFirstChild}>{data[source]}</span></Ellipsis></div>}
          </div>
        </div>
      </div>
    );
  }
}
