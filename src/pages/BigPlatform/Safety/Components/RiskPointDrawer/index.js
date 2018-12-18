import React, { PureComponent } from 'react';
import { Drawer } from 'antd';
import Section from '@/components/Section';

import styles from './index.less';

/**
 * description: 风险点抽屉
 * author: sunkai
 * date: 2018年11月29日
 */
export default class App extends PureComponent {
  /**
   * 根据status字段获取对应的中文和颜色
   */
  getLabelAndColorByStatus = status => {
    switch (+status) {
      case 1:
        return {
          color: '#fff',
          label: '正常',
        };
      case 2:
        return {
          color: '#FF4848',
          label: '异常',
        };
      case 3:
        return {
          color: '#fff',
          label: '待检查',
        };
      case 4:
        return {
          color: '#FF4848',
          label: '已超时',
        };
      default:
        return {
          color: '#fff',
          label: '暂无状态',
        };
    }
  };

  render() {
    const {
      // 抽屉组件可以设置的属性对象
      drawerProps,
      // 抽屉显示的风险等级名称
      levelName,
      // 数据源
      data: {
        // // 各风险等级数量统计
        // countDangerLocation: [{ red = 0, orange = 0, yellow = 0, blue = 0, not_rated: unvalued = 0 } = {}] = [
        //   {},
        // ],
        // 红色
        redDangerResult: {
          normal: redNormal = [],
          checking: redChecking = [],
          abnormal: redAbnormal = [],
          over: redOver = [],
        } = {},
        // 橙色
        orangeDangerResult: {
          normal: orangeNormal = [],
          checking: orangeChecking = [],
          abnormal: orangeAbnormal = [],
          over: orangeOver = [],
        } = {},
        // 黄色
        yellowDangerResult: {
          normal: yellowNormal = [],
          checking: yellowChecking = [],
          abnormal: yellowAbnormal = [],
          over: yellowOver = [],
        } = {},
        // 蓝色
        blueDangerResult: {
          normal: blueNormal = [],
          checking: blueChecking = [],
          abnormal: blueAbnormal = [],
          over: blueOver = [],
        } = {},
        // 未评级
        unvaluedDangerResult: {
          normal: unvaluedNormal = [],
          checking: unvaluedChecking = [],
          abnormal: unvaluedAbnormal = [],
          over: unvaluedOver = [],
        } = {},
      }={},
    } = this.props;

    const { onClose } = drawerProps;

    // 获取要显示的数据列表，标题颜色及是否标题是否显示风险等级
    let result, color, showLevelName = true;
    switch(levelName) {
      case '红':
      result = redAbnormal.concat(redOver, redChecking, redNormal);
      color = '#E86767';
      break;
      case '橙':
      result = orangeAbnormal.concat(orangeOver, orangeChecking, orangeNormal);
      color = '#FFB650';
      break;
      case '黄':
      result = yellowAbnormal.concat(yellowOver, yellowChecking, yellowNormal);
      color = '#F7E68A';
      break;
      case '蓝':
      result = blueAbnormal.concat(blueOver, blueChecking, blueNormal);
      color = '#5EBEFF';
      break;
      case '未评级':
      result = unvaluedAbnormal.concat(unvaluedOver, unvaluedChecking, unvaluedNormal);
      color = '#4F6793';
      break;
      default:
      result = unvaluedAbnormal.concat(unvaluedOver, unvaluedChecking, unvaluedNormal);
      showLevelName = false;
      break;
    }

    return (
      <Drawer
        width="500px"
        closable={false}
        style={{ padding: 0, height: '100%', background: 'url(http://data.jingan-china.cn/v2/big-platform/safety/com/company-bg.png) no-repeat right center / auto 100%' }}
        {...drawerProps}
      >
        <Section
          isScroll
          closable
          style={{ color: '#fff' }}
          title={(
            <span>
              风险点
              {showLevelName && (
                <span>
                  <span style={{ position: 'relative', top: '-2px' }}>—</span>
                  <span style={{ color }}>{levelName}</span>
                </span>
              )}
            </span>
          )}
          fixedContent={(
            <div className={styles.riskPointCountContainer}>
              <div className={`${styles.unvaluedItem} ${styles.riskPointCount}`}>
                <div className={styles.riskPointCountValue}>{result.length}</div>
                <div className={styles.riskPointCountName} style={{ color: '#00A8FF' }}>
                  总计
                </div>
              </div>
            </div>
          )}
          onClose={onClose}
        >
          {result.map(
            ({
              item_id: id,
              object_title: name,
              status,
              user_name: checkPerson,
              check_date: checkTime,
            }) => {
              const { label, color } = this.getLabelAndColorByStatus(status);
              return (
                <div className={styles.riskPointItem} key={id}>
                  <div className={styles.riskPointItemNameWrapper}>
                    <div className={styles.riskPointItemName}>风险点</div>
                    <div className={styles.riskPointItemValue}>{name}</div>
                  </div>
                  <div className={styles.riskPointItemNameWrapper}>
                    <div className={styles.riskPointItemName}>检查人</div>
                    <div className={styles.riskPointItemValue}>{checkPerson}</div>
                  </div>
                  <div className={styles.riskPointItemNameWrapper}>
                    <div className={styles.riskPointItemName}>检查时间</div>
                    <div className={styles.riskPointItemValue}>{checkTime}</div>
                  </div>
                  <div className={styles.riskPointItemNameWrapper}>
                    <div className={styles.riskPointItemName}>状态</div>
                    <div className={styles.riskPointItemValue} style={{ color }}>
                      {label}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </Section>
      </Drawer>
    );
  }
}
