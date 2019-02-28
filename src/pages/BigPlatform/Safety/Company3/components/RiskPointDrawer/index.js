import React, { PureComponent } from 'react';
import moment from 'moment';
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
  switch (+value) {
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
  last_check_date: checkTime,
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
      <div className={styles.riskPointItemValue}>{checkTime && moment(checkTime).format('YYYY-MM-DD')}</div>
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
      data: {
        redNormalPointList=[],
        redAbnormalPointList=[],
        redPendingPointList=[],
        redOvertimePointList=[],
        orangeNormalPointList=[],
        orangeAbnormalPointList=[],
        orangePendingPointList=[],
        orangeOvertimePointList=[],
        yellowNormalPointList=[],
        yellowAbnormalPointList=[],
        yellowPendingPointList=[],
        yellowOvertimePointList=[],
        blueNormalPointList=[],
        blueAbnormalPointList=[],
        bluePendingPointList=[],
        blueOvertimePointList=[],
        grayNormalPointList=[],
        grayAbnormalPointList=[],
        grayPendingPointList=[],
        grayOvertimePointList=[],
      },
      // 要展示的内容的类型
      riskPointType: { key, value }={},
    } = this.props;
    // 1.如果key为undefined，则显示所有的风险点
    // 2.如果key为status，则根据value值显示对应检查状态的风险点
    // 3.如果key为level，则根据value值显示对应风险等级的风险点
    let redPointList=[], orangePointList=[], yellowPointList=[], bluePointList=[], grayPointList=[];
    switch(key) {
      case 'level':
        switch(value) {
          case '红':
          redPointList = redAbnormalPointList.concat(redOvertimePointList, redPendingPointList, redNormalPointList);
          break;
          case '橙':
          orangePointList = orangeAbnormalPointList.concat(orangeOvertimePointList, orangePendingPointList, orangeNormalPointList);
          break;
          case '黄':
          yellowPointList = yellowAbnormalPointList.concat(yellowOvertimePointList, yellowPendingPointList, yellowNormalPointList);
          break;
          case '蓝':
          bluePointList = blueAbnormalPointList.concat(blueOvertimePointList, bluePendingPointList, blueNormalPointList);
          break;
          case '未评级':
          default:
          grayPointList = grayAbnormalPointList.concat(grayOvertimePointList, grayPendingPointList, grayNormalPointList);
          break;
        }
        break;
      case 'status':
      default:
        switch(value) {
          case '正常':
            redPointList = redNormalPointList;
            orangePointList = orangeNormalPointList;
            yellowPointList = yellowNormalPointList;
            bluePointList = blueNormalPointList;
            grayPointList = grayNormalPointList;
            break;
          case '异常':
            redPointList = redAbnormalPointList;
            orangePointList = orangeAbnormalPointList;
            yellowPointList = yellowAbnormalPointList;
            bluePointList = blueAbnormalPointList;
            grayPointList = grayAbnormalPointList;
          break;
          case '待检查':
            redPointList = redPendingPointList;
            orangePointList = orangePendingPointList;
            yellowPointList = yellowPendingPointList;
            bluePointList = bluePendingPointList;
            grayPointList = grayPendingPointList;
          break;
          case '已超时':
            redPointList = redOvertimePointList;
            orangePointList = orangeOvertimePointList;
            yellowPointList = yellowOvertimePointList;
            bluePointList = blueOvertimePointList;
            grayPointList = grayOvertimePointList;
          break;
          default:
            redPointList = redAbnormalPointList.concat(redOvertimePointList, redPendingPointList, redNormalPointList);
            orangePointList = orangeAbnormalPointList.concat(orangeOvertimePointList, orangePendingPointList, orangeNormalPointList);
            yellowPointList = yellowAbnormalPointList.concat(yellowOvertimePointList, yellowPendingPointList, yellowNormalPointList);
            bluePointList = blueAbnormalPointList.concat(blueOvertimePointList, bluePendingPointList, blueNormalPointList);
            grayPointList = grayAbnormalPointList.concat(grayOvertimePointList, grayPendingPointList, grayNormalPointList);
            break;
        }
        break;
    }
    // 获取各种颜色数量
    const red = redPointList.length;
    const orange = orangePointList.length;
    const yellow = yellowPointList.length;
    const blue = bluePointList.length;
    const gray = grayPointList.length;
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

                  {gray !== 0 && (
                    <div className={styles.riskLevelItem}>
                      <div className={styles.riskLevelItemValue}>{gray}</div>
                      <div className={styles.riskLevelItemName} style={{ color: noteRatedLevelColor }}>
                        未评级
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.riskLevelList}>
                  <div className={`${styles.notRatedItem} ${styles.riskLevelItem}`}>
                    <div className={styles.riskLevelItemValue}>{red + orange + yellow + blue + gray}</div>
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
          {redPointList.map(({ info }) => renderRiskPoint(info, { level: showLevel && getLevelLabel('红'), showStatus }))}
          {orangePointList.map(({ info }) => renderRiskPoint(info, { level: showLevel && getLevelLabel('橙'), showStatus }))}
          {yellowPointList.map(({ info }) => renderRiskPoint(info, { level: showLevel && getLevelLabel('黄'), showStatus }))}
          {bluePointList.map(({ info }) => renderRiskPoint(info, { level: showLevel && getLevelLabel('蓝'), showStatus }))}
          {grayPointList.map(({ info }) => renderRiskPoint(info, { level: showNotRated && getLevelLabel('未评级'), showStatus }))}
          {/* {red + orange + yellow + blue + gray === 0 && <div className={styles.empty} style={{ backgroundImage: `url(${defaultRiskPoint})` }} />} */}
        </div>
      </SectionDrawer>
    );
  }
}
