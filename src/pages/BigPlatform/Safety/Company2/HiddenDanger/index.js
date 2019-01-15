import React, { PureComponent } from 'react';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';

import styles from './index.less';
// 默认图片
import noPhotoIcon from '../../img/noPhoto.png';
// 已关闭
import ygbIcon from '@/assets/closed.png';
// 安全
import safety from '@/assets/safety.png';
// 消防
import fireControl from '@/assets/fire-control.png';
// 环境
import environment from '@/assets/environment.png';
// 卫生
import hygiene from '@/assets/hygiene.png';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片地址 */
// 已超期
const ycqIcon = `${iconPrefix}ycq.png`;
// 未超期
const wcqIcon = `${iconPrefix}wcq.png`;
// 待复查
const dfcIcon = `${iconPrefix}dfc.png`;

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
// 根据风险等级获取文本
const getLabelByLevel = function(level) {
  switch (+level) {
    case 1:
      return '红色';
    case 2:
      return '橙色';
    case 3:
      return '黄色';
    case 4:
      return '蓝色';
    default:
      return '';
  }
};

/**
 * description: 隐患
 * author: sunkai
 * date: 2018年12月12日
 */
export default class HiddenDanger extends PureComponent {
  render() {
    const {
      style,
      data: {
        // id,
        // item_id,
        report_user_name,
        report_time,
        rectify_user_name,
        real_rectify_time,
        plan_rectify_time,
        review_user_name,
        review_time,
        // source_type_name,
        report_source_name,
        item_name,
        desc,
        business_type,
        status,
        hiddenDangerRecordDto: [{ fileWebUrl }={}]=[],
        // companyBuildingItem,
      }={},
      isSourceShow,
    } = this.props;
    // 根据逗号分割多张图片取第一张显示
    const background = fileWebUrl && fileWebUrl.split(',')[0];
    // // 获取风险等级和点位名称
    // const { object_title, risk_level } = companyBuildingItem || {};
    // // 来源
    // const source = source_type_name === '风险点上报' ? `${getLabelByLevel(risk_level)}风险点${object_title ? `（${object_title}）` : ''}` : source_type_name;

    // 是否是已超期
    const isYCQ = +status === 7;
    // 是否是待复查
    const isDFC = +status === 3;
    // 是否是已关闭
    const isYGB = +status === 4;

    return (
      <div className={styles.riskDetailItem} style={style}>
        <div className={styles.riskDetailItemTitleWrapper}><div className={styles.riskDetailItemTitleAvatar} style={{ backgroundImage: `url(${getIconByBusinessType(business_type)})` }} /><Ellipsis lines={1} tooltip className={styles.riskDetailItemTitle} style={{ color: isYCQ ? '#ff4848' : '#fff', height: 24 }} >{desc || '暂无隐患描述'}</Ellipsis></div>
        <div className={styles.riskDetailItemContentWrapper}>
          <div className={styles.riskDetailItemImageWrapper} style={{ backgroundImage: `url(${noPhotoIcon})` }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <img src={background} alt="" style={{ display: 'block', width: '100%' }} />
              <div className={styles.cover} />
            </div>
          </div>
          <div className={styles.riskDetailItemInfoWrapper}>
            <div className={styles.riskDetailItemTextWrapper}><span style={{ flex: 'none', color: '#00A8FF' }}>上<span style={{ opacity: 0 }}>隐藏</span>报：</span><Ellipsis tooltip lines={1} style={{ flex: 1, color: '#fff', height: 24 }} ><span className={styles.riskDetailItemTextFirstChild}>{report_user_name}</span>{moment(report_time).format('YYYY-MM-DD')}</Ellipsis></div>
            <div className={styles.riskDetailItemTextWrapper}><span style={{ flex: 'none', color: '#00A8FF' }}>{(isDFC || isYGB)?'实际整改：':'计划整改：'}</span><Ellipsis tooltip lines={1} style={{ flex: 1, color: '#fff', height: 24 }} ><span className={styles.riskDetailItemTextFirstChild}>{rectify_user_name}</span><span style={{ color: isYCQ?'#ff4848':undefined }}>{(isDFC || isYGB)?moment(real_rectify_time).format('YYYY-MM-DD'):moment(plan_rectify_time).format('YYYY-MM-DD')}</span></Ellipsis></div>
            {(isDFC || isYGB) && <div className={styles.riskDetailItemTextWrapper}><span style={{ flex: 'none', color: '#00A8FF' }}>复<span style={{ opacity: 0 }}>隐藏</span>查：</span><Ellipsis tooltip lines={1} style={{ flex: 1, color: '#fff', height: 24 }} ><span className={styles.riskDetailItemTextFirstChild}>{review_user_name}</span>{isYGB ? moment(review_time).format('YYYY-MM-DD') : undefined}</Ellipsis></div>}
            <div className={styles.riskDetailItemTextWrapper}><span style={{ flex: 'none', color: '#00A8FF' }}>来<span style={{ opacity: 0 }}>隐藏</span>源：</span><Ellipsis tooltip lines={1} style={{ flex: 1, color: '#fff', height: 24 }} ><span className={styles.riskDetailItemTextFirstChild}>{report_source_name}</span></Ellipsis></div>
            {isSourceShow && <div className={styles.riskDetailItemTextWrapper}><span style={{ flex: 'none', color: '#00A8FF' }}>检查点位：</span><Ellipsis tooltip lines={1} style={{ flex: 1, color: '#fff', height: 24 }} ><span className={styles.riskDetailItemTextFirstChild}>{item_name}</span></Ellipsis></div>}
          </div>
        </div>
        <div className={styles.riskDetailItemSealWrapper} style={{ backgroundImage: `url(${getSeal(status)})` }} />
      </div>
    );
  }
}
