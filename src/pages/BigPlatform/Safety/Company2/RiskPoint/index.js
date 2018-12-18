import React, { PureComponent, Fragment } from 'react';
import Section from '@/components/Section';
import Ellipsis from '@/components/Ellipsis';

import styles from './index.less';

// 获取颜色和status
const switchCheckStatus = value => {
  switch (value) {
    case 1:
      return {
        color: '#00A181',
        content: '正常',
      };
    case 2:
      return {
        color: '#FF4848',
        content: '异常',
      };
    case 3:
      return {
        color: '#5EBEFF',
        content: '待检查',
      };
    case 4:
      return {
        color: '#FF4848',
        content: '已超时',
      };
    default:
      return {
        color: '#fff',
        content: '暂无状态',
      };
  }
};
// 获取标题和颜色
const switchColorAndTitle = (value, isStatus) => {
  if (isStatus) {
    switch (value) {
      case '正常':
        return {
          color: '#00A181',
          title: '正常',
        };
      case '异常':
        return {
          color: '#FF4848',
          title: '异常',
        };
      case '待检查':
        return {
          color: '#5EBEFF',
          title: '待检查',
        };
      case '已超时':
        return {
          color: '#FF4848',
          title: '已超时',
        };
      default:
        return {
          color: '#fff',
        };
    }
  }
  else {
    switch (value) {
      case '红':
        return {
          color: '#FF4848',
          title: '红',
        };
      case '橙':
        return {
          color: '#F17A0A',
          title: '橙',
        };
      case '黄':
        return {
          color: '#FBF719',
          title: '黄',
        };
      case '蓝':
        return {
          color: '#1E60FF',
          title: '蓝',
        };
      default:
        return {
          color: '#4F6793',
          title: '未评级',
        };
    }
  }
};
// 根据风险等级获取风险点卡片上标签的颜色和背景
const switchColorAndBgColor = color => {
  switch (color) {
    case '红':
      return {
        color: '#fff',
        backgroundColor: '#FF4848',
      };
    case '橙':
      return {
        color: '#fff',
        backgroundColor: '#F17A0A',
      };
    case '黄':
      return {
        color: '#000',
        backgroundColor: '#FBF719',
      };
    case '蓝':
      return {
        color: '#fff',
        backgroundColor: '#1E60FF',
      };
    default:
      return {
        color: '#fff',
        backgroundColor: '#4F6793',
      };
  }
};


/**
 * description: 风险点弹出框
 * author: sunkai
 * date: 2018年12月12日
 */
export default class RiskPoint extends PureComponent {
  render() {
    const {
      model: {
        countDangerLocation: {
          redDangerResult: {
            normal: redNormal = [],
            checking: redChecking = [],
            abnormal: redAbnormal = [],
            over: redOver = [],
          } = {},
          orangeDangerResult: {
            normal: orangeNormal = [],
            checking: orangeChecking = [],
            abnormal: orangeAbnormal = [],
            over: orangeOver = [],
          } = {},
          yellowDangerResult: {
            normal: yellowNormal = [],
            checking: yellowChecking = [],
            abnormal: yellowAbnormal = [],
            over: yellowOver = [],
          } = {},
          blueDangerResult: {
            normal: blueNormal = [],
            checking: blueChecking = [],
            abnormal: blueAbnormal = [],
            over: blueOver = [],
          } = {},
          notRatedDangerResult: {
            normal: notRatedNormal = [],
            checking: notRatedChecking = [],
            abnormal: notRatedAbnormal = [],
            over: notRatedOver = [],
          } = {},
        },
      },
      // 要展示的内容的类型
      riskPointType={},
      // 关闭事件
      onClose,
    } = this.props;
    const { key, value } = riskPointType;
    // 1.如果key为undefined，则显示所有的风险点
    // 2.如果key为status，则根据value值显示对应检查状态的风险点
    // 3.如果key为level，则根据value值显示对应风险等级的风险点
    let redDangerResult=[], orangeDangerResult=[], yellowDangerResult=[], blueDangerResult=[], notRatedDangerResult=[];
    switch(key) {
      case 'level':
        switch(value) {
          case '红':
          redDangerResult = [...redAbnormal, ...redOver, ...redChecking, ...redNormal];
          break;
          case '橙':
          orangeDangerResult = [...orangeAbnormal, ...orangeOver, ...orangeChecking, ...orangeNormal];
          break;
          case '黄':
          yellowDangerResult = [...yellowAbnormal, ...yellowOver, ...yellowChecking, ...yellowNormal];
          break;
          case '蓝':
          blueDangerResult = [...blueAbnormal, ...blueOver, ...blueChecking, ...blueNormal];
          break;
          case '未评级':
          default:
          notRatedDangerResult = [
            ...notRatedAbnormal,
            ...notRatedOver,
            ...notRatedChecking,
            ...notRatedNormal,
          ];
          break;
        }
      break;
      case 'status':
      default:
        switch(value) {
          case '正常':
          redDangerResult = redNormal;
          orangeDangerResult = orangeNormal;
          yellowDangerResult = yellowNormal;
          blueDangerResult = blueNormal;
          notRatedDangerResult = notRatedNormal;
          break;
          case '异常':
          redDangerResult = redAbnormal;
          orangeDangerResult = orangeAbnormal;
          yellowDangerResult = yellowAbnormal;
          blueDangerResult = blueAbnormal;
          notRatedDangerResult = notRatedAbnormal;
          break;
          case '待检查':
          redDangerResult = redChecking;
          orangeDangerResult = orangeChecking;
          yellowDangerResult = yellowChecking;
          blueDangerResult = blueChecking;
          notRatedDangerResult = notRatedChecking;
          break;
          case '已超时':
          redDangerResult = redOver;
          orangeDangerResult = orangeOver;
          yellowDangerResult = yellowOver;
          blueDangerResult = blueOver;
          notRatedDangerResult = notRatedOver;
          break;
          default:
          redDangerResult = [...redAbnormal, ...redOver, ...redChecking, ...redNormal];
          orangeDangerResult = [...orangeAbnormal, ...orangeOver, ...orangeChecking, ...orangeNormal];
          yellowDangerResult = [...yellowAbnormal, ...yellowOver, ...yellowChecking, ...yellowNormal];
          blueDangerResult = [...blueAbnormal, ...blueOver, ...blueChecking, ...blueNormal];
          notRatedDangerResult = [
            ...notRatedAbnormal,
            ...notRatedOver,
            ...notRatedChecking,
            ...notRatedNormal,
          ];
          break;
        }
      break;
    }
    // 获取各种颜色数量
    const red = redDangerResult.length;
    const orange = orangeDangerResult.length;
    const yellow = yellowDangerResult.length;
    const blue = blueDangerResult.length;
    const notRated = notRatedDangerResult.length;
    // 是否全部未评级
    const isAllNotRated = red + orange + yellow + blue === 0;
    // 是否为显示检查状态
    const isStatus = key === 'status';
    // 获取
    const { color, title } = switchColorAndTitle(value, isStatus);

    return (
      <Section
        title={(
          <Fragment>
            风险点
            {title && (
              <span>
                <span style={{ position: 'relative', top: '-2px' }}>—</span>
                <span style={{ color }}>{title}</span>
              </span>
            )}
          </Fragment>
        )}
        titleStyle={{ marginBottom: 0 }}
        fixedContent={isStatus && !isAllNotRated ? (
          <div className={styles.riskLevelList}>
            <div className={styles.riskLevelItem}>
              <div className={styles.riskLevelItemValue}>{red}</div>
              <div className={styles.riskLevelItemName} style={{ color: '#FF4848' }}>
                红
              </div>
            </div>

            <div className={styles.riskLevelItem}>
              <div className={styles.riskLevelItemValue}>{orange}</div>
              <div className={styles.riskLevelItemName} style={{ color: '#F17A0A' }}>
                橙
              </div>
            </div>

            <div className={styles.riskLevelItem}>
              <div className={styles.riskLevelItemValue}>{yellow}</div>
              <div className={styles.riskLevelItemName} style={{ color: '#FBF719' }}>
                黄
              </div>
            </div>

            <div className={styles.riskLevelItem}>
              <div className={styles.riskLevelItemValue}>{blue}</div>
              <div className={styles.riskLevelItemName} style={{ color: '#1E60FF' }}>
                蓝
              </div>
            </div>

            {notRated !== 0 && (
              <div className={styles.riskLevelItem}>
                <div className={styles.riskLevelItemValue}>{notRated}</div>
                <div className={styles.riskLevelItemName} style={{ color: '#4F6793' }}>
                  未评级
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.riskLevelList}>
            <div className={`${styles.notRatedItem} ${styles.riskLevelItem}`}>
              <div className={styles.riskLevelItemValue}>{red + orange + yellow + blue + notRated}</div>
              <div className={styles.riskLevelItemName} style={{ color: '#00A8FF' }}>
                总计
              </div>
            </div>
          </div>
        )}
        isScroll
        closable
        onClose={onClose}
      >
        {redDangerResult.map(
          ({
            item_id: id,
            object_title: name,
            status,
            user_name: checkPerson,
            check_date: checkTime,
          }) => {
            const { content, color } = switchCheckStatus(+status);
            return (
              <div className={styles.riskPointItem} key={id}>
                {isStatus && (
                  <div
                    className={styles.riskPointItemLabel}
                    style={switchColorAndBgColor('红')}
                  >
                    红
                  </div>
                )}
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>风险点</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{name}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查人</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkPerson}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查时间</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkTime}</Ellipsis></div>
                </div>
                {(!title || !isStatus) && (
                  <div className={styles.riskPointItemNameWrapper}>
                    <div className={styles.riskPointItemName}>状态</div>
                    <div className={styles.riskPointItemValue} style={{ color }}>
                    <Ellipsis tooltip lines={1} style={{ height: 36 }}>{content}</Ellipsis>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
        {orangeDangerResult.map(
          ({
            item_id: id,
            object_title: name,
            status,
            user_name: checkPerson,
            check_date: checkTime,
          }) => {
            const { content, color } = switchCheckStatus(+status);
            return (
              <div className={styles.riskPointItem} key={id}>
                {isStatus && (
                  <div
                    className={styles.riskPointItemLabel}
                    style={switchColorAndBgColor('橙')}
                  >
                    橙
                  </div>
                )}
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>风险点</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{name}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查人</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkPerson}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查时间</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkTime}</Ellipsis></div>
                </div>
                {(!title || !isStatus) && (
                  <div className={styles.riskPointItemNameWrapper}>
                    <div className={styles.riskPointItemName}>状态</div>
                    <div className={styles.riskPointItemValue} style={{ color }}>
                    <Ellipsis tooltip lines={1} style={{ height: 36 }}>{content}</Ellipsis>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
        {yellowDangerResult.map(
          ({
            item_id: id,
            object_title: name,
            status,
            user_name: checkPerson,
            check_date: checkTime,
          }) => {
            const { content, color } = switchCheckStatus(+status);
            return (
              <div className={styles.riskPointItem} key={id}>
                {isStatus && (
                  <div
                    className={styles.riskPointItemLabel}
                    style={switchColorAndBgColor('黄')}
                  >
                    黄
                  </div>
                )}
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>风险点</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{name}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查人</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkPerson}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查时间</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkTime}</Ellipsis></div>
                </div>
                {(!title || !isStatus) && (
                  <div className={styles.riskPointItemNameWrapper}>
                    <div className={styles.riskPointItemName}>状态</div>
                    <div className={styles.riskPointItemValue} style={{ color }}>
                    <Ellipsis tooltip lines={1} style={{ height: 36 }}>{content}</Ellipsis>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
        {blueDangerResult.map(
          ({
            item_id: id,
            object_title: name,
            status,
            user_name: checkPerson,
            check_date: checkTime,
          }) => {
            const { content, color } = switchCheckStatus(+status);
            return (
              <div className={styles.riskPointItem} key={id}>
                {isStatus && (
                  <div
                    className={styles.riskPointItemLabel}
                    style={switchColorAndBgColor('蓝')}
                  >
                    蓝
                  </div>
                )}
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>风险点</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{name}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查人</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkPerson}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查时间</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkTime}</Ellipsis></div>
                </div>
                {(!title || !isStatus) && (
                  <div className={styles.riskPointItemNameWrapper}>
                    <div className={styles.riskPointItemName}>状态</div>
                    <div className={styles.riskPointItemValue} style={{ color }}>
                    <Ellipsis tooltip lines={1} style={{ height: 36 }}>{content}</Ellipsis>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
        {notRatedDangerResult.map(
          ({
            item_id: id,
            object_title: name,
            status,
            user_name: checkPerson,
            check_date: checkTime,
          }) => {
            const { content, color } = switchCheckStatus(+status);
            return (
              <div className={styles.riskPointItem} key={id}>
                {isStatus && !isAllNotRated && (
                  <div
                    className={styles.riskPointItemLabel}
                    style={switchColorAndBgColor('未评级')}
                  >
                    未评级
                  </div>
                )}
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>风险点</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{name}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查人</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkPerson}</Ellipsis></div>
                </div>
                <div className={styles.riskPointItemNameWrapper}>
                  <div className={styles.riskPointItemName}>检查时间</div>
                  <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{checkTime}</Ellipsis></div>
                </div>
                {(!title || !isStatus) && (
                  <div className={styles.riskPointItemNameWrapper}>
                    <div className={styles.riskPointItemName}>状态</div>
                    <div className={styles.riskPointItemValue} style={{ color }}>
                    <Ellipsis tooltip lines={1} style={{ height: 36 }}>{content}</Ellipsis>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </Section>
    );
  }
}
