import React, { PureComponent, Fragment } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import defaultRiskCard from '@/assets/defaultRiskCard.png';

import styles from './index.less';

// 颜色
const color = {
  '红': '#E86767',
  '橙': '#FFB650',
  '黄': '#F7E68A',
  '蓝': '#5EBEFF',
};
// 状态文本
const statusLabel = [undefined, '正常', '异常', '待检查', '已超时'];

/**
 * description: 风险卡
 * author: sunkai
 * date: 2018年11月29日
 */
export default class App extends PureComponent {
  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // 数据源
      data: {
        status = 0,
        webUrl,
        user_name,
        last_check_date,
        location_code,
        accidentTypeName,
        area_name,
        name,
        riskName,
      } = {},
    } = this.props;
    // 容器类名
    const contianerClassName = classnames(className, styles.container);
    // 是否为异常或已超期
    const isAlert = +status === 2 || +status === 4;
    // 图片是否可用
    const isValid = /(.png|.jpg)$/.test(webUrl);

    return (
      <div
        className={contianerClassName}
        style={style}
      >
        <div className={styles.titleContainer}>
          {/* 标题 */}
          <div className={styles.title}>
            <div className={styles.titleLabel}>风险点名称：</div>
            <div className={styles.titleValue}>{name || '暂无风险点名称'}</div>
          </div>
          {/* 风险等级：当未评级时，不显示风险等级 */}
          {riskName && <div className={styles.level}>等级：<span style={{ color: color[riskName] }}>{riskName}</span></div>}
        </div>
        <div className={styles.content}>
          {/* 图片 */}
          <div className={styles.avatarContainer}>
            {isValid ? (
              <div className={styles.avatar} style={{ backgroundImage: `url(${webUrl})` }} />
            ) : (
              <div className={styles.avatar} style={{ overflow: 'hidden', backgroundColor: 'transparent', backgroundImage: ` url(${defaultRiskCard})`, backgroundSize: '50%' }} />
            )}
          </div>
          <div className={styles.infoContainer}>
            {riskName ? (
              <Fragment>
                <div className={styles.info}>
                  <div className={styles.infoName}>场所/环节/部位</div>
                  <div className={styles.infoValue}>{area_name}</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.infoName}>易导致（风险）</div>
                  <div className={styles.infoValue}>{accidentTypeName}</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.infoName}>检查状态</div>
                  <div className={styles.infoValue} style={{ color: isAlert ? '#ff4848' : undefined }}>{statusLabel[status]}</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.infoName}>最近检查人</div>
                  <div className={styles.infoValue}>{user_name} {moment && moment(last_check_date).format('YYYY-MM-DD ')}</div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className={styles.info}>
                  <div className={styles.infoName}>点位编号</div>
                  <div className={styles.infoValue}>{location_code}</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.infoName}>检查状态</div>
                  <div className={styles.infoValue} style={{ color: isAlert ? '#ff4848' : undefined }}>{statusLabel[status]}</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.infoName}>最近检查人</div>
                  <div className={styles.infoValue}>{user_name}</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.infoName}>最近检查时间</div>
                  <div className={styles.infoValue}>{moment && moment(last_check_date).format('YYYY-MM-DD ')}</div>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}
