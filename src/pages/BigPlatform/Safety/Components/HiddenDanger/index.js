import React, { PureComponent } from 'react';
import Ellipsis from 'components/Ellipsis';

import styles from './index.less';
import noPhotoIcon from '../../img/noPhoto.png';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片地址 */
const descriptionBlueIcon = `${iconPrefix}description_blue.png`;
const descriptionRedIcon = `${iconPrefix}description_red.png`;
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
  status: 'status',
  background: 'background',
  source: 'source',
};
// 获取图章
const getSeal = status => {
  switch (+status) {
    case 1:
    case 2:
      return wcqIcon;
    case 3:
      return dfcIcon;
    case 7:
      return ycqIcon;
    default:
      return wcqIcon;
  }
};

/**
 * 隐患详情单元
 */
export default class App extends PureComponent {
  render() {
    const {
      data,
      fieldNames,
      isSourceShow,
    } = this.props;

    const { description, sbr, sbsj, zgr, plan_zgsj, real_zgsj, fcr, status, background, source } = { ...defaultFieldNames, ...fieldNames };
    const isYCQ = +data[status] === 7;
    const isDFC = +data[status] === 3;

    return (
      <div className={styles.riskDetailItem} style={{ backgroundImage: `url(${getSeal(data[status])})` }}>
        <div className={styles.riskDetailItemTitleWrapper}><div className={styles.riskDetailItemTitleAvatar} style={{ backgroundImage: `url(${isYCQ ? descriptionRedIcon : descriptionBlueIcon})` }} /><Ellipsis lines={1} tooltip className={styles.riskDetailItemTitle} style={{ color: isYCQ ? '#ff4848' : '#fff' }} >{data[description] || '暂无隐患描述'}</Ellipsis></div>
        <div className={styles.riskDetailItemContentWrapper}>
          <div className={styles.riskDetailItemImageWrapper} style={{ backgroundImage: `url(${noPhotoIcon})` }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <img src={data[background]} alt="" style={{ display: 'block', width: '100%' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 168, 255, 0.3)' }} />
            </div>
          </div>
          <div style={{ flex: 1  }}>
            <div className={styles.riskDetailItemTextWrapper}><span style={{ color: '#00A8FF' }}>上<span style={{ opacity: 0 }}>隐藏</span>报：</span><Ellipsis lines={1} style={{ flex: 1, color: '#fff' }} ><span className={styles.riskDetailItemTextFirstChild}>{data[sbr]}</span>{data[sbsj]}</Ellipsis></div>
            <div className={styles.riskDetailItemTextWrapper}><span style={{ color: '#00A8FF' }}>{isDFC?'实际整改：':'计划整改：'}</span><Ellipsis lines={1} style={{ flex: 1, color: '#fff', lineHeight: 1 }} ><span className={styles.riskDetailItemTextFirstChild}>{data[zgr]}</span>{isDFC?data[real_zgsj]:data[plan_zgsj]}</Ellipsis></div>
            {isDFC && <div className={styles.riskDetailItemTextWrapper}><span style={{ color: '#00A8FF' }}>复<span style={{ opacity: 0 }}>隐藏</span>查：</span><Ellipsis lines={1} style={{ flex: 1, color: '#fff' }} ><span className={styles.riskDetailItemTextFirstChild}>{data[fcr]}</span></Ellipsis></div>}
            {isSourceShow && <div className={styles.riskDetailItemTextWrapper}><span style={{ color: '#00A8FF' }}>来<span style={{ opacity: 0 }}>隐藏</span>源：</span><Ellipsis lines={1} style={{ flex: 1, color: '#fff' }} ><span className={styles.riskDetailItemTextFirstChild}>{data[source]}</span></Ellipsis></div>}
          </div>
        </div>
      </div>
    );
  }
}
