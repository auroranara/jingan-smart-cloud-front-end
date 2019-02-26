import React, { PureComponent } from 'react';
import SectionDrawer from '../SectionDrawer';
// 引入样式文件
import styles from './index.less';

// 风险等级颜色
const redLevelColor = '#FF4848';
const orangeLevelColor = '#F17A0A';
const yellowLevelColor = '#FBF719';
const blueLevelColor = '#1E60FF';
const noteRatedLevelColor = '#4F6793';
// 获取状态文本
const getStatusLabel = value => {
  let color, content;
  switch (value) {
    case 1:
      color = '#fff';
      content = '正常';
      break;
    case 2:
      color = '#FF4848';
      content = '异常';
      break;
    case 3:
      color = '#fff';
      content = '待检查';
      break;
    case 4:
      color = '#FF4848';
      content = '已超时';
      break;
    default:
      color = '#fff';
      content = '暂无状态';
      break;
  }
  return (
    <div className={styles.riskPointItemValue} style={{ color }}>
      {content}
    </div>
  );
};
// 获取标题后缀
const getTitleSuffix = (key, value) => {
  if (key === 'status') {
    switch (value) {
      case '正常':
        return <span style={{ color: '#00A181' }}>正常</span>;
      case '异常':
        return <span style={{ color: '#FF4848' }}>异常</span>;
      case '待检查':
        return <span style={{ color: '#5EBEFF' }}>待检查</span>;
      case '已超时':
        return <span style={{ color: '#FF4848' }}>已超时</span>;
      default:
        return null;
    }
  }
  else if (key === 'level'){
    switch (value) {
      case '红':
        return <span style={{ color: redLevelColor }}>红</span>;
      case '橙':
        return <span style={{ color: orangeLevelColor }}>橙</span>;
      case '黄':
        return <span style={{ color: yellowLevelColor }}>黄</span>;
      case '蓝':
        return <span style={{ color: blueLevelColor }}>蓝</span>;
      default:
        return <span style={{ color: noteRatedLevelColor }}>未评级</span>;
    }
  }
  return null;
};
// 根据风险等级文本
const getLevelLabel = value => {
  let style;
  switch (value) {
    case '红':
      style = {
        color: '#fff',
        backgroundColor: redLevelColor,
      };
      break;
    case '橙':
      style = {
        color: '#fff',
        backgroundColor: orangeLevelColor,
      };
      break;
    case '黄':
      style = {
        color: '#000',
        backgroundColor: yellowLevelColor,
      };
      break;
    case '蓝':
      style = {
        color: '#fff',
        backgroundColor: blueLevelColor,
      };
      break;
    default:
      style = {
        color: '#fff',
        backgroundColor: noteRatedLevelColor,
      };
      break;
  }
  return (
    <div
      className={styles.riskPointItemLabel}
      style={style}
    >
      {value}
    </div>
  );
};
/* 风险点渲染函数 */
const renderRiskPoint = ({
  item_id: id,
  object_title: name,
  user_name: checkPerson,
  check_date: checkTime,
  status,
}, {
  level,
  showStatus,
}) => (
  <div className={styles.riskPointItem} key={id}>
    {level}
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
    {showStatus && (
      <div className={styles.riskPointItemNameWrapper}>
        <div className={styles.riskPointItemName}>状态</div>
        {getStatusLabel(status)}
      </div>
    )}
  </div>
);

/**
 * 风险点抽屉
 */
export default class RiskPointDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll.dom.scrollTop();
    }
  }

  refScroll = (scroll) => {
    this.scroll = scroll;
  }

  render() {
    const {
      // 抽屉是否可见
      visible,
      // 抽屉关闭事件
      onClose,
      // 数据
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
      riskPointType: { key, value }={},
    } = this.props;
    // 1.如果key为undefined，则显示所有的风险点
    // 2.如果key为status，则根据value值显示对应检查状态的风险点
    // 3.如果key为level，则根据value值显示对应风险等级的风险点
    let redDangerResult=[], orangeDangerResult=[], yellowDangerResult=[], blueDangerResult=[], notRatedDangerResult=[];
    switch(key) {
      case 'level':
        switch(value) {
          case '红':
          redDangerResult = redAbnormal.concat(redOver, redChecking, redNormal);
          break;
          case '橙':
          orangeDangerResult = orangeAbnormal.concat(orangeOver, orangeChecking, orangeNormal);
          break;
          case '黄':
          yellowDangerResult = yellowAbnormal.concat(yellowOver, yellowChecking, yellowNormal);
          break;
          case '蓝':
          blueDangerResult = blueAbnormal.concat(blueOver, blueChecking, blueNormal);
          break;
          case '未评级':
          default:
          notRatedDangerResult = notRatedAbnormal.concat(notRatedOver, notRatedChecking, notRatedNormal);
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
            redDangerResult = redAbnormal.concat(redOver, redChecking, redNormal);
            orangeDangerResult = orangeAbnormal.concat(orangeOver, orangeChecking, orangeNormal);
            yellowDangerResult = yellowAbnormal.concat(yellowOver, yellowChecking, yellowNormal);
            blueDangerResult = blueAbnormal.concat(blueOver, blueChecking, blueNormal);
            notRatedDangerResult = notRatedAbnormal.concat(notRatedOver, notRatedChecking, notRatedNormal);
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
    // 是否为显示检查状态
    const showLevel = key !== 'level';
    // 获取标题后缀
    const titleSuffix = getTitleSuffix(key, value);
    // 是否显示状态
    const showStatus = !titleSuffix || !showLevel;
    // 显示未评级文本
    const showNotRated = showLevel && (red + orange + yellow + blue > 0);
    return (
      <SectionDrawer
        drawerProps={{
          title: (
            <span>
              风险点
              {titleSuffix && (
                <span>
                  <span style={{ position: 'relative', top: '-2px' }}>—</span>
                  {titleSuffix}
                </span>
              )}
            </span>
          ),
          visible,
          onClose: () => {onClose('riskPoint');},
        }}
        sectionProps={{
          refScroll: this.refScroll,
          contentStyle: { paddingBottom: 16 },
          scrollProps: { className: styles.scrollContainer },
          fixedContent: (
            <div className={styles.countContainer}>
              {showNotRated ? (
                <div className={styles.riskLevelList}>
                  <div className={styles.riskLevelItem}>
                    <div className={styles.riskLevelItemValue}>{red}</div>
                    <div className={styles.riskLevelItemName} style={{ color: redLevelColor }}>
                      红
                    </div>
                  </div>

                  <div className={styles.riskLevelItem}>
                    <div className={styles.riskLevelItemValue}>{orange}</div>
                    <div className={styles.riskLevelItemName} style={{ color: orangeLevelColor }}>
                      橙
                    </div>
                  </div>

                  <div className={styles.riskLevelItem}>
                    <div className={styles.riskLevelItemValue}>{yellow}</div>
                    <div className={styles.riskLevelItemName} style={{ color: yellowLevelColor }}>
                      黄
                    </div>
                  </div>

                  <div className={styles.riskLevelItem}>
                    <div className={styles.riskLevelItemValue}>{blue}</div>
                    <div className={styles.riskLevelItemName} style={{ color: blueLevelColor }}>
                      蓝
                    </div>
                  </div>

                  {notRated !== 0 && (
                    <div className={styles.riskLevelItem}>
                      <div className={styles.riskLevelItemValue}>{notRated}</div>
                      <div className={styles.riskLevelItemName} style={{ color: noteRatedLevelColor }}>
                        未评级
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.riskLevelList}>
                  <div className={`${styles.notRatedItem} ${styles.riskLevelItem}`}>
                    <div className={styles.riskLevelItemValue}>{red + orange + yellow + blue + notRated}</div>
                    <div className={styles.riskLevelItemName}>
                      总计
                    </div>
                  </div>
                </div>
              )}
            </div>
          ),
        }}
      >
        <div className={styles.container}>
          {redDangerResult.map(riskPoint => renderRiskPoint(riskPoint, { level: showLevel && getLevelLabel('红'), showStatus }))}
          {orangeDangerResult.map(riskPoint => renderRiskPoint(riskPoint, { level: showLevel && getLevelLabel('橙'), showStatus }))}
          {yellowDangerResult.map(riskPoint => renderRiskPoint(riskPoint, { level: showLevel && getLevelLabel('黄'), showStatus }))}
          {blueDangerResult.map(riskPoint => renderRiskPoint(riskPoint, { level: showLevel && getLevelLabel('蓝'), showStatus }))}
          {notRatedDangerResult.map(riskPoint => renderRiskPoint(riskPoint, { level: showNotRated && getLevelLabel('未评级'), showStatus }))}
          {/* {red + orange + yellow + blue + notRated === 0 && <div className={styles.empty} style={{ backgroundImage: `url(${defaultRiskPoint})` }} />} */}
        </div>
      </SectionDrawer>
    );
  }
}
