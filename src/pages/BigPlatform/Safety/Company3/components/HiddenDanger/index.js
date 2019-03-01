import React from 'react';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
// 引入样式文件
import styles from './index.less';
// 默认图片
import noPhotoIcon from '../../../img/noPhoto.png';
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

/**
 * description: 隐患
 */
export default function HiddenDanger({
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
  showSource,
}) {
  // 根据逗号分割多张图片取第一张显示
  const background = fileWebUrl && fileWebUrl.split(',')[0];
  // 是否是已超期
  const isYCQ = +status === 7;
  // 是否是待复查
  const isDFC = +status === 3;
  // 是否是已关闭
  const isYGB = +status === 4;

  return (
    <div className={styles.riskDetailItem} style={{ backgroundImage: `url(${getSeal(status)})`, ...style }}>
      {/* 标题 */}
      <div className={styles.riskDetailItemTitleWrapper}>
        <div className={styles.riskDetailItemTitleAvatar} style={{ backgroundImage: `url(${getIconByBusinessType(business_type)})` }} />
        <div className={styles.riskDetailItemTitle} style={{ color: isYCQ ? '#ff4848' : '#fff' }} >
          <Ellipsis className={styles.ellipsis} lines={1} tooltip>{desc || '暂无隐患描述'}</Ellipsis>
        </div>
      </div>
      <div className={styles.riskDetailItemContentWrapper}>
        {/* 图片 */}
        <div className={styles.riskDetailItemImageWrapper} style={{ backgroundImage: `url(${noPhotoIcon})` }}>
          <div className={styles.riskDetailItemImage} style={{ backgroundImage: `url(${background})` }} />
        </div>
        {/* 字段 */}
        <div className={styles.riskDetailItemInfoWrapper}>
          <div className={styles.riskDetailItemTextWrapper}>
            <span>上<span style={{ opacity: 0 }}>隐藏</span>报：</span>
            <div>
              <Ellipsis className={styles.ellipsis} lines={1} tooltip>
                <span className={styles.riskDetailItemTextFirstChild}>
                  {report_user_name}
                </span>
                {report_time && moment(report_time).format('YYYY-MM-DD')}
              </Ellipsis>
            </div>
          </div>
          <div className={styles.riskDetailItemTextWrapper}>
            <span>
              {(isDFC || isYGB)?'实际整改：':'计划整改：'}
            </span>
            <div>
              <Ellipsis className={styles.ellipsis} lines={1} tooltip>
                <span className={styles.riskDetailItemTextFirstChild}>
                  {rectify_user_name}
                </span>
                <span style={{ color: isYCQ?'#ff4848':undefined }}>
                  {(isDFC || isYGB)?(real_rectify_time && moment(real_rectify_time).format('YYYY-MM-DD')):(plan_rectify_time&&moment(plan_rectify_time).format('YYYY-MM-DD'))}
                </span>
              </Ellipsis>
            </div>
          </div>
          {(isDFC || isYGB) && (
            <div className={styles.riskDetailItemTextWrapper}>
              <span>复<span style={{ opacity: 0 }}>隐藏</span>查：</span>
              <div>
                <Ellipsis className={styles.ellipsis} lines={1} tooltip>
                  <span className={styles.riskDetailItemTextFirstChild}>
                    {review_user_name}
                  </span>
                  {isYGB ? (review_time && moment(review_time).format('YYYY-MM-DD')) : undefined}
                </Ellipsis>
              </div>
            </div>
          )}
          <div className={styles.riskDetailItemTextWrapper}>
            <span>来<span style={{ opacity: 0 }}>隐藏</span>源：</span>
            <div className={styles.paddingRight}>
              <Ellipsis className={styles.ellipsis} lines={1} tooltip>
                {report_source_name}
              </Ellipsis>
            </div>
          </div>
          {showSource && (
            <div className={styles.riskDetailItemTextWrapper}>
              <span>检查点位：</span>
              <div className={styles.paddingRight}>
                <Ellipsis className={styles.ellipsis} lines={1} tooltip>
                  {item_name}
                </Ellipsis>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div className={styles.riskDetailItemSealWrapper} style={{ backgroundImage: `url(${getSeal(status)})` }} /> */}
    </div>
  );
}
