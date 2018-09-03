import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import classNames from 'classnames';
import ReactEcharts from 'echarts-for-react';

import Timer from './Components/Timer';
import RiskImage from './Components/RiskImage.js';
import RiskPoint from './Components/RiskPoint.js';
import RiskInfo from './Components/RiskInfo.js';
import RiskDetail from './Components/RiskDetail.js';

import styles from './Company.less';
import riskStyles from './Risk.less';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const red = `${iconPrefix}red_new.png`;
const orange = `${iconPrefix}orange_new.png`;
const yellow = `${iconPrefix}yellow_new.png`;
const blue = `${iconPrefix}blue_new.png`;
const exceptionRed = `${iconPrefix}exception_red.png`;
const exceptionOrange = `${iconPrefix}exception_orange.png`;
const exceptionYellow = `${iconPrefix}exception_yellow.png`;
const exceptionBlue = `${iconPrefix}exception_blue.png`;
const selected = `${iconPrefix}selected.png`;
const pointIcon = `${iconPrefix}point.png`;
const areaIcon = `${iconPrefix}area.png`;
const accidentTypeIcon = `${iconPrefix}accidentType.png`;
const riskLevelIcon = `${iconPrefix}riskLevel.png`;
const statusIcon = `${iconPrefix}status.png`;
const importantIcon = `${iconPrefix}important.png`;
const checkIcon = `${iconPrefix}check-icon.png`;
const specialIcon = `${iconPrefix}special-icon.png`;
const peopleIcon = `${iconPrefix}people-icon.png`;
const hdIcon = `${iconPrefix}hd-icon.png`;
const normalIcon = `${iconPrefix}normal-icon.png`;
const checkingIcon = `${iconPrefix}checking-icon.png`;
const abnormalIcon = `${iconPrefix}abnormal-icon.png`;
const overIcon = `${iconPrefix}over-icon.png`;

// 选中高度
const selectedHeight = 180;
const selectedWidth = 63;
// 信息offset
const defaultInfoOffset = {
  x: 30,
  y: -selectedHeight-36,
};
// 正常点的样式
const normalStyle = {
  width: 33,
  height: 35,
  zIndex: 8,
};
// 正常点的偏移
const normalOffset = {
  x: 0,
  y: 0,
};
// 选中点的样式
const selectedStyle = {
  width: 33,
  height: 35,
  zIndex: 9,
};
// 选中点的偏移
const selectedOffset = {
  x: 0,
  y: -selectedHeight + 5,
};
// 根据颜色筛选图片
const switchImageColor = (color, isException) => {
  const result = {
    style: normalStyle,
    offset: normalOffset,
  };
  if (!isException) {
    switch (color) {
      case '红':
        result.src = red;
        break;
      case '橙':
        result.src = orange;
        break;
      case '黄':
        result.src = yellow;
        break;
      case '蓝':
        result.src = blue;
        break;
      default:
        result.src = blue;
        break;
    }
  } else {
    switch (color) {
      case '红':
        result.src = exceptionRed;
        break;
      case '橙':
        result.src = exceptionOrange;
        break;
      case '黄':
        result.src = exceptionYellow;
        break;
      case '蓝':
        result.src = exceptionBlue;
        break;
      default:
        result.src = exceptionBlue;
        break;
    }
  }
  return result;
};
// 获取status
const switchStatus = status => {
  const value = +status;
  if (value === 1 || value === 2) {
    return 0;
  } else if (value === 3) {
    return 1;
  } else if (value === 7) {
    return 2;
  } else {
    return 0;
  }
};
// 获取颜色和status
const switchCheckStatus = value => {
  switch (value) {
    case 1:
      return {
        color: '#fff',
        content: '正常',
      };
    case 2:
      return {
        color: '#FF4848',
        content: '异常',
      };
    case 3:
      return {
        color: '#fff',
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
        backgroundColor: '#FF4848',
      };
  }
};
// 获取时间轴
const timeAxis = (() => {
  const now = moment();
  const timeAxis = [];
  for (let i = 0; i < 31; i++) {
    const time = moment(now)
      .subtract(i, 'days')
      .format('MM-DD');
    timeAxis.push(time);
  }
  return timeAxis.reverse();
})();

@connect(({ bigPlatform }) => ({
  bigPlatform,
}))
class CompanyLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null,
      selectedIndex: 0,
      pieHeight: 0,
      barHeight: 0,
      // 当前选中的四色图对应的风险点
      points: [],
      // 四色图切换按钮显示数量
      pageSize: 3,
      // 当前显示的四色图切换按钮页数
      currentIndex: 0,
      // 当前选中的四色图的id
      selectedFourColorImgId: null,
      // 当前选中的四色图的地址
      selectedFourColorImgUrl: '',
    };
    this.myTimer = null;
    this.currentPieIndex = -1;
    this.highLightTimer = null;
    this.currentLineIndex = -1;
    this.showTipTimer = null;
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;

    dispatch({
      type: 'bigPlatform/fetchCompanyMessage',
      payload: {
        company_id: companyId,
        month: moment().format('YYYY-MM'),
      },
      success: ({ point, fourColorImg: [{ id, webUrl } = {}] }) => {
        // model中已对point和fourColorImg进行处理，确保point必有坐标值，fourColorImg必为数组
        // 如果id不存在，则意味着没有四色图，则不做任何操作
        if (id) {
          this.filterPointsByFourColorImgId(point, id, webUrl);
        }
      },
    });
    dispatch({
      type: 'bigPlatform/fetchSpecialEquipment',
      payload: {
        company_id: companyId,
      },
    });
    // 获取正常风险点总数（左下角对应数据）
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id: companyId,
        status: '1',
      },
    });
    // 获取异常风险点总数（左下角对应数据）
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id: companyId,
        status: '2',
      },
    });
    // 获取待检查风险点总数（左下角对应数据）
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id: companyId,
        status: '3',
      },
    });
    // 获取已超时风险点总数（左下角对应数据）
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id: companyId,
        status: '4',
      },
    });
    // 获取企业大屏四色风险点数量（左下角环形图源数据）
    dispatch({
      type: 'bigPlatform/fetchCountDangerLocationForCompany',
      payload: {
        company_id: companyId,
      },
    });
    // 获取风险点信息（中间四色图上风险点信息数据）
    dispatch({
      type: 'bigPlatform/fetchRiskPointInfo',
      payload: {
        company_id: companyId,
      },
    });
    // 获取隐患详情（右边隐患详情源数据）
    dispatch({
      type: 'bigPlatform/fetchRiskDetail',
      payload: {
        company_id: companyId,
      },
    });
    // 获取隐患数量（左上角隐患数源数据）
    dispatch({
      type: 'bigPlatform/fetchHiddenDanger',
      payload: {
        company_id: companyId,
      },
    });
    // 获取安全人员信息（安全人员信息卡片源数据）
    dispatch({
      type: 'bigPlatform/fetchSafetyOfficer',
      payload: {
        company_id: companyId,
      },
    });
  }

  componentWillUnmount() {
    clearTimeout(this.myTimer);
    clearInterval(this.highLightTimer);
  }

  /**
   * 根据当前选中的四色图id筛选出对应的风险点
   * 将id和points保存到state中
   * 自动选中第一个point
   */
  filterPointsByFourColorImgId = (point, id, webUrl) => {
    const points = point.filter(({ fixImgId }) => fixImgId === id);
    const [{ itemId } = {}] = points;
    this.setState({
      points,
      selectedFourColorImgId: id,
      selectedFourColorImgUrl: webUrl,
      selectedId: itemId || null,
      selectedIndex: 0,
    });
    this.handleClick(itemId, 0);
  };

  /**
   * 环形图加载完毕
   */
  handlePieChartReady = (chart, option) => {
    const changeHighLight = () => {
      var length = option.series[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.currentPieIndex,
      });
      this.currentPieIndex = (this.currentPieIndex + 1) % length;
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.currentPieIndex,
      });
    };
    // 立即执行高亮操作
    changeHighLight();
    // 添加定时器循环
    this.highLightTimer = setInterval(changeHighLight, 2000);
    // 绑定mouseover事件
    chart.on('mouseover', params => {
      clearInterval(this.highLightTimer);
      this.highLightTimer = null;
      if (params.dataIndex !== this.currentPieIndex) {
        // 取消之前高亮的图形
        chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.currentPieIndex,
        });
        // 高亮当前图形
        chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: params.dataIndex,
        });
        this.currentPieIndex = params.dataIndex;
      }
    });
    // 绑定mouseout事件
    chart.on('mouseout', params => {
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.currentPieIndex,
      });
      if (this.highLightTimer) {
        return;
      }
      // 添加定时器循环
      this.highLightTimer = setInterval(changeHighLight, 2000);
    });
  };

  /**
   * 曲线图加载完毕
   */
  handleLineChartReady = (chart, option) => {
    const showTip = () => {
      var length = option.series[0].data.length;
      this.currentLineIndex = (this.currentLineIndex + 1) % length;
      // 显示 tooltip
      chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: this.currentLineIndex,
      });
    };
    // 立即显示
    showTip();
    // 添加定时器
    this.showTipTimer = setInterval(showTip, 2000);
  };

  /**
   * 四色图切换按钮点击事件
   */
  handleClickTab = (id, webUrl) => {
    const {
      bigPlatform: {
        companyMessage: { point },
      },
    } = this.props;
    const { selectedFourColorImgId } = this.state;
    if (selectedFourColorImgId === id) {
      return;
    }
    this.filterPointsByFourColorImgId(point, id, webUrl);
  };

  /* 风险点点击事件 */
  handleClick = (id, index) => {
    const { selectedId } = this.state;
    clearTimeout(this.myTimer);
    if (!id) {
      return;
    }
    this.addTimeout();
    if (selectedId === id) {
      return;
    }
    this.setState({
      selectedId: id,
      selectedIndex: index,
    });
  };

  // 鼠标移动到隐患详情
  handleMouseEnter = () => {
    clearTimeout(this.myTimer);
  };

  // 鼠标移出隐患详情
  handleMouseLeave = () => {
    const { selectedId } = this.state;
    selectedId !== null && this.addTimeout();
  };

  // 添加风险点轮播定时器
  addTimeout = () => {
    this.myTimer = setTimeout(() => {
      const { selectedIndex, points } = this.state;
      if (selectedIndex === points.length - 1) {
        this.handleClick(points[0].itemId, 0);
      } else {
        this.handleClick(points[selectedIndex + 1].itemId, selectedIndex + 1);
      }
    }, 10000);
  };

  /**
   * 上一页
   */
  handlePrevPage = () => {
    this.setState(({ currentIndex }) => ({
      currentIndex: currentIndex - 1,
    }));
  };

  /**
   * 下一页
   */
  handleNextPage = () => {
    this.setState(({ currentIndex }) => ({
      currentIndex: currentIndex + 1,
    }));
  };

  /**
   * 头部
   */
  renderHeader() {
    return (
      <header className={styles.mainHeader}>
        <span className={styles.mainHeaderTitle}>晶 安 智 慧 安 全 云 平 台</span>
        <div className={styles.mainHeaderTime}>
          <Timer />
        </div>
      </header>
    );
  }

  /**
   * 主体
   */
  renderBody() {
    return (
      <Row
        gutter={24}
        className={styles.mainBody}
        style={{ margin: '0', padding: '16px 12px 24px', overflow: 'hidden' }}
      >
        <Col span={6} className={styles.column}>
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {this.renderLeftSection()}
            {this.renderSafety()}
            {this.renderRisk()}
          </div>
        </Col>
        <Col span={12} className={styles.column}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {this.renderCenterSection()}
          </div>
        </Col>
        <Col span={6} className={styles.column}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {this.renderRightSection()}
          </div>
        </Col>
      </Row>
    );
  }

  /**
   * 左边部分
   */
  renderLeftSection() {
    return (
      <div
        style={{ width: '100%', height: '100%', overflow: 'hidden', transition: 'opacity 0.5s' }}
        ref={leftSection => (this.leftSection = leftSection)}
      >
        {this.renderLeftTopSection()}
        {this.renderLeftBottomSection()}
      </div>
    );
  }

  /**
   * 中间部分
   */
  renderCenterSection() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {this.renderCenterTopSection()}
        {this.renderCenterBottomSection()}
      </div>
    );
  }

  /**
   * 右边部分
   * 隐患详情
   */
  renderRightSection() {
    const {
      bigPlatform: { riskDetailList },
    } = this.props;
    const { selectedId } = this.state;
    let data =
      selectedId === null
        ? []
        : riskDetailList.filter(({ item_id, status }) => item_id === selectedId && +status !== 4);
    data = data.map(
      ({
        id,
        flow_name: description,
        report_user_name: sbr,
        report_time: sbsj,
        rectify_user_name: zgr,
        plan_rectify_time: zgsj,
        review_user_name: fcr,
        status,
        hiddenDangerRecordDto: [{ fileWebUrl: background }] = [{ fileWebUrl: '' }],
      }) => ({
        id,
        description,
        sbr,
        sbsj: moment(+sbsj).format('YYYY-MM-DD'),
        zgr,
        zgsj: moment(+zgsj).format('YYYY-MM-DD'),
        fcr,
        status: switchStatus(status),
        background,
      })
    );

    return (
      <RiskDetail
        style={{
          height: '100%',
        }}
        data={data}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }

  /**
   * 左边上部分
   */
  renderLeftTopSection() {
    const {
      companyMessage: {
        companyMessage: {
          // 企业名称
          companyName,
          // 安全负责人
          headOfSecurity,
          // 联系电话
          headOfSecurityPhone,
          // 风险点总数
          countCheckItem,
          // 安全人员总数
          countCompanyUser,
        },
        isImportant,
      },
      // 特种设备总数
      specialEquipment,
      // 隐患总数
      hiddenDanger,
    } = this.props.bigPlatform;
    const infoClassNames = classNames(styles.sectionWrapper, styles.infoWrapper);

    const {
      match: {
        params: { companyId },
      },
    } = this.props;

    return (
      <section className={infoClassNames}>
        <div className={styles.sectionMain}>
          <div className={styles.shadowIn}>
            <div className={styles.companyMain}>
              <div className={styles.companyInfo}>
                <div
                  className={styles.companyName}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.open(`/acloud_new/companyIndex.htm?company_id=${companyId}`);
                  }}
                >
                  {companyName}
                </div>
                <div className={styles.companyCharger}>
                  <span className={styles.fieldName}>安全负责人：</span>
                  {headOfSecurity}
                </div>
                <div className={styles.companyPhone}>
                  <span className={styles.fieldName}>联系方式：</span>
                  {headOfSecurityPhone}
                </div>
              </div>
            </div>

            <div className={styles.summaryBottom} style={{ height: '50%' }}>
              <div className={styles.summaryHalf} style={{ backgroundImage: `url(${peopleIcon})` }}>
                <div className={styles.summaryText}>
                  <span className={styles.fieldName}>安全人员</span>
                </div>
                <div
                  className={styles.summaryNum}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.safety.style.right = 0;
                    this.leftSection.style.opacity = 0;
                  }}
                >
                  {countCompanyUser}
                </div>
              </div>

              <div className={styles.summaryHalf} style={{ backgroundImage: `url(${checkIcon})` }}>
                <div className={styles.summaryText}>
                  <span className={styles.fieldName}>风险点</span>
                </div>
                <div
                  className={styles.summaryNum}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.risk.style.right = 0;
                    this.leftSection.style.opacity = 0;
                  }}
                >
                  {countCheckItem}
                </div>
              </div>

              <div
                className={styles.summaryHalf}
                style={{ backgroundImage: `url(${specialIcon})` }}
              >
                <div className={styles.summaryText}>
                  <span className={styles.fieldName}>特种设备</span>
                </div>
                <div className={styles.summaryNum}>{specialEquipment}</div>
              </div>

              <div className={styles.summaryHalf} style={{ backgroundImage: `url(${hdIcon})` }}>
                <div className={styles.summaryText}>
                  <span className={styles.fieldName}>隐患数量</span>
                </div>
                <div className={styles.summaryNum}>{hiddenDanger}</div>
              </div>
            </div>

            {isImportant && (
              <div className={styles.importantUnit}>
                <img src={importantIcon} alt="重要单位" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  /**
   * 左边下部分
   */
  renderLeftBottomSection() {
    const {
      coItemList: { status1, status2, status3, status4 },
      countDangerLocationForCompany: {
        countDangerLocation: [{ red = 0, orange = 0, yellow = 0, blue = 0 } = {}] = [{}],
      },
    } = this.props.bigPlatform;
    const hdClassNames = classNames(styles.sectionWrapper, styles.hdWrapper);
    // 图表选项
    const option = {
      // color: ['#BF6C6D', '#CC964B', '#C6C181', '#4CA1DE'],
      series: [
        {
          type: 'pie',
          radius: ['50%', '80%'],
          hoverOffset: 5,
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
              formatter: '{b}\n{c|{c}}',
              rich: {
                c: {
                  fontSize: 20,
                },
              },
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '16',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: red, name: '红', itemStyle: { color: '#BF6C6D' } },
            { value: orange, name: '橙', itemStyle: { color: '#CC964B' } },
            { value: yellow, name: '黄', itemStyle: { color: '#C6C181' } },
            { value: blue, name: '蓝', itemStyle: { color: '#4CA1DE' } },
          ],
        },
      ],
    };

    return (
      <section className={hdClassNames}>
        <div className={styles.sectionMain}>
          <div className={styles.shadowIn}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionTitleIcon} />
              风险点
            </div>

            <div className={styles.pieChart}>
              <ReactEcharts
                option={option}
                style={{ height: '100%' }}
                onChartReady={chart => {
                  this.handlePieChartReady(chart, option);
                }}
              />
            </div>

            <div className={styles.summaryBottom} style={{ height: '42%' }}>
              <div className={styles.summaryHalf} style={{ backgroundImage: `url(${normalIcon})` }}>
                <div className={styles.summaryText} style={{ color: '#00A181' }}>
                  正常
                </div>
                <div className={styles.summaryNum}>{status1}</div>
              </div>

              <div
                className={styles.summaryHalf}
                style={{ backgroundImage: `url(${checkingIcon})` }}
              >
                <div className={styles.summaryText} style={{ color: '#4D9ED8' }}>
                  待检查
                </div>
                <div className={styles.summaryNum}>{status3}</div>
              </div>

              <div
                className={styles.summaryHalf}
                style={{ backgroundImage: `url(${abnormalIcon})` }}
              >
                <div className={styles.summaryText} style={{ color: '#B23535' }}>
                  异常
                </div>
                <div className={styles.summaryNum}>{status2}</div>
              </div>

              <div className={styles.summaryHalf} style={{ backgroundImage: `url(${overIcon})` }}>
                <div className={styles.summaryText} style={{ color: '#B23535' }}>
                  已超时
                </div>
                <div className={styles.summaryNum}>{status4}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /**
   * 中间上部分
   * 安全风险四色图
   */
  renderCenterTopSection() {
    const {
      bigPlatform: {
        companyMessage: { fourColorImg = [] },
        riskPointInfoList,
      },
    } = this.props;
    const {
      selectedId,
      pageSize,
      currentIndex,
      selectedFourColorImgId,
      selectedFourColorImgUrl,
      points,
    } = this.state;
    // 页数
    const pageCount = Math.max(Math.ceil(fourColorImg.length / pageSize), 1);
    // 是否为第一页
    const isFirst = currentIndex === 0;
    // 是否为最后一页
    const isLast = currentIndex === pageCount - 1;
    // 当前页的第一个元素
    const currentFirstIndex = currentIndex * pageSize;

    return (
      <div className={riskStyles.fourColorImgContainer}>
        <div className={riskStyles.fourColorImgTitle}>安全风险四色图</div>
        <RiskImage
          src={selectedFourColorImgUrl}
          wrapperClassName={riskStyles.riskImage}
          // perspective='30em'
          rotate="30deg"
        >
          {points &&
            points.map(({ itemId: id, yNum: y, xNum: x }, index) => {
              // 筛选风险点对应的信息
              const info = riskPointInfoList.filter(
                ({ hdLetterInfo: { itemId } }) => itemId === id
              )[0] || {
                hdLetterInfo: {
                  pointName: '',
                  areaName: '',
                  accidentTypeName: '',
                  status: '',
                  riskLevelName: {
                    desc: '',
                  },
                },
                localPictureUrlList: [],
              };
              // 获取风险点位置，值为百分比
              const position = { x, y };
              // 获取风险点的图片，样式及偏移
              const { src, style, offset } = switchImageColor(
                info.hdLetterInfo.riskLevelName.desc,
                +info.hdLetterInfo.status === 2
              );
              const infoData = [
                {
                  icon: pointIcon,
                  title: '风险点名称',
                  content: info.hdLetterInfo.pointName,
                  render: value => <span style={{ fontSize: '16px' }}>{value}</span>,
                },
                {
                  icon: areaIcon,
                  title: '场所/环节/部位名称',
                  content: info.hdLetterInfo.areaName,
                },
                {
                  icon: accidentTypeIcon,
                  title: '易导致后果（风险）',
                  content: info.hdLetterInfo.accidentTypeName,
                },
                {
                  icon: statusIcon,
                  title: '检查状态',
                  content: info.hdLetterInfo.status,
                  render: value => {
                    const { color, content } = switchCheckStatus(value);
                    return <span style={{ color }}>{content}</span>;
                  },
                },
                {
                  icon: riskLevelIcon,
                  title: '风险等级',
                  content: info.hdLetterInfo.riskLevelName.desc,
                },
              ];
              return (
                <Fragment key={id}>
                  <RiskPoint
                    position={position}
                    src={src}
                    style={
                      selectedId === id
                        ? { ...selectedStyle, cursor: 'pointer' }
                        : { ...style, cursor: 'pointer' }
                    }
                    offset={selectedId === id ? selectedOffset : offset}
                    onClick={point => {
                      this.handleClick(id, index, point);
                    }}
                  />
                  <RiskPoint
                    position={position}
                    src={selected}
                    style={{
                      width: selectedWidth,
                      height: selectedId === id ? selectedHeight : 0,
                      zIndex: 1,
                    }}
                  />
                  <RiskInfo
                    position={position}
                    offset={defaultInfoOffset}
                    data={infoData}
                    background={info.localPictureUrlList[0] && info.localPictureUrlList[0].webUrl}
                    style={{
                      display: selectedId === id ? 'block' : 'none',
                      // opacity: selectedId === id ? '1' : '0',
                    }}
                  />
                </Fragment>
              );
            })}
          <div className={riskStyles.fourColorImgPaginationContainer}>
            <div className={riskStyles.tabList}>
              {fourColorImg.map(({ id, webUrl, fileName = '未命名' }, index) => {
                if (index < currentFirstIndex || index >= currentFirstIndex + pageSize) {
                  return null;
                }
                const backgroundColor = selectedFourColorImgId === id ? '#0967D3' : undefined;
                const i = fileName.indexOf('.');
                return (
                  <div className={riskStyles.tabWrapper} key={id}>
                    <div
                      className={riskStyles.tab}
                      style={{
                        backgroundColor,
                        transform: selectedFourColorImgId === id ? 'translateX(0)' : undefined,
                      }}
                      onClick={() => {
                        this.handleClickTab(id, webUrl);
                      }}
                    >
                      {i === -1 ? fileName : fileName.slice(0, i)}
                      <div
                        className={riskStyles.tabRight}
                        style={{ borderLeftColor: backgroundColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={riskStyles.paginationWrapper}>
              <div className={riskStyles.paginationWrapperRight} />
              <div className={riskStyles.paginationList}>
                <div className={riskStyles.paginationItem}>
                  <Icon
                    type="caret-up"
                    style={{
                      fontSize: 14,
                      color: isFirst ? '#00438a' : '#0967D3',
                      cursor: isFirst ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() => {
                      !isFirst && this.handlePrevPage();
                    }}
                  />
                </div>
                <div className={riskStyles.paginationItem}>
                  <Icon
                    type="caret-down"
                    style={{
                      fontSize: 14,
                      color: isLast ? '#00438a' : '#0967D3',
                      cursor: isLast ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() => {
                      !isLast && this.handleNextPage();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </RiskImage>
        <div className={riskStyles.fourColorImgLabelContainer}>
          <div className={riskStyles.fourColorImgLabel}>
            <span
              className={riskStyles.fourColorImgLabelIcon}
              style={{ backgroundColor: '#FC1F02' }}
            />
            <span>重大风险</span>
          </div>
          <div className={riskStyles.fourColorImgLabel}>
            <span
              className={riskStyles.fourColorImgLabelIcon}
              style={{ backgroundColor: '#F17A0A' }}
            />
            <span>较大风险</span>
          </div>
          <div className={riskStyles.fourColorImgLabel}>
            <span
              className={riskStyles.fourColorImgLabelIcon}
              style={{ backgroundColor: '#FBF719' }}
            />
            <span>一般风险</span>
          </div>
          <div className={riskStyles.fourColorImgLabel}>
            <span
              className={riskStyles.fourColorImgLabelIcon}
              style={{ backgroundColor: '#1E60FF' }}
            />
            <span>低风险</span>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 中间下部分
   */
  renderCenterBottomSection() {
    const {
      companyMessage: { check_map = [], hidden_danger_map = [] },
    } = this.props.bigPlatform;
    const checkList = [];
    const dangerList = [];
    for (let i = 0; i < 31; i++) {
      checkList[i] = 0;
      dangerList[i] = 0;
    }
    check_map.forEach(({ month, day, self_check_point }) => {
      const time = moment(`${month}-${day}`, 'M-D').format('MM-DD');
      const index = timeAxis.indexOf(time);
      if (index !== -1) {
        checkList[index] = self_check_point;
      }
    });
    hidden_danger_map.forEach(({ month, day, created_danger }) => {
      const time = moment(`${month}-${day}`, 'M-D').format('MM-DD');
      const index = timeAxis.indexOf(time);
      if (index !== -1) {
        dangerList[index] = created_danger;
      }
    });

    const option = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeAxis,
        axisLabel: {
          interval: 1,
          color: '#fff',
        },
        splitLine: {
          lineStyle: {
            color: ['rgb(2,28,66)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: ['rgb(2,28,66)'],
          },
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#fff',
        },
        splitLine: {
          lineStyle: {
            color: ['rgb(2,28,66)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: ['rgb(2,28,66)'],
          },
        },
      },
      grid: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
        containLabel: true,
      },
      tooltip: {
        position: function(point, params, dom, rect, size) {
          if (point[0] < size.viewSize[0] / 2) {
            return [point[0] + 10, '10%'];
          } else {
            return [point[0] - 10 - size.contentSize[0], '10%'];
          }
        },
        trigger: 'axis',
      },
      series: [
        {
          name: '巡查次数',
          data: checkList,
          type: 'line',
          itemStyle: {
            color: '#5EBEFF',
            borderColor: '#5EBEFF',
          },
          lineStyle: {
            color: '#5EBEFF',
          },
          areaStyle: {
            color: '#5EBEFF',
            opacity: 0.2,
          },
          smooth: true,
        },
        {
          name: '隐患数量',
          data: dangerList,
          type: 'line',
          itemStyle: {
            color: '#F7E68A',
            borderColor: '#F7E68A',
          },
          lineStyle: {
            color: '#F7E68A',
          },
          areaStyle: {
            color: '#F7E68A',
            opacity: 0.2,
          },
          smooth: true,
        },
      ],
    };

    return (
      <section className={styles.sectionWrapper} style={{ height: '32%' }}>
        <div className={styles.sectionMain}>
          <div className={styles.shadowIn}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionTitleIcon} />
              单位巡查
              <div className={styles.legendList}>
                <div className={styles.legendItem}>
                  <span className={styles.legendItemIcon} style={{ backgroundColor: '#5EBEFF' }} />
                  <span className={styles.legendItemName}>巡查</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendItemIcon} style={{ backgroundColor: '#F7E68A' }} />
                  <span className={styles.legendItemName}>隐患</span>
                </div>
              </div>
            </div>
            <div className={styles.lineChart}>
              <ReactEcharts
                option={option}
                style={{ height: '100%' }}
                onChartReady={chart => {
                  this.handleLineChartReady(chart, option);
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /**
   * 安全人员
   */
  renderSafety() {
    const {
      bigPlatform: {
        safetyOfficer: {
          legalNum = 0,
          safeChargerNum = 0,
          safeManagerNum = 0,
          saferNum = 0,
          legalList = [],
          safeChargerList = [],
          safeManagerList = [],
          saferList = [],
        },
      },
    } = this.props;

    // 类名
    const className = classNames(styles.sectionWrapper, styles.safety);
    // 滚动类名
    const scrollClassName = classNames(styles.innerBox, styles.safetyScroll);

    return (
      <section
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          right: '110%',
          width: '100%',
          height: '100%',
          transition: 'top 0.5s, left 0.5s, right 0.5s, bottom 0.5s',
        }}
        ref={safety => (this.safety = safety)}
      >
        <div className={styles.sectionMain}>
          <div className={styles.shadowIn}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionTitleIcon} />
              安全人员
              <Icon
                type="close"
                className={styles.closeButton}
                onClick={() => {
                  this.safety.style.right = '110%';
                  this.leftSection.style.opacity = 1;
                }}
              />
            </div>
            <Row className={styles.personWrapper}>
              <Col span={12} className={styles.person}>
                <div className={styles.personName}>单位法人</div>
                <div className={styles.personValue}>{legalNum}</div>
              </Col>

              <Col span={12} className={styles.person}>
                <div className={styles.personName}>安全负责人</div>
                <div className={styles.personValue}>{safeChargerNum}</div>
              </Col>

              <Col span={12} className={styles.person}>
                <div className={styles.personName}>安全管理员</div>
                <div className={styles.personValue}>{safeManagerNum}</div>
              </Col>

              <Col span={12} className={styles.person}>
                <div className={styles.personName}>安全员</div>
                <div className={styles.personValue}>{saferNum}</div>
              </Col>
            </Row>
            <div className={scrollClassName}>
              {legalList.length !== 0 && (
                <div className={styles.personList} style={{ borderColor: '#FF4848' }}>
                  <div className={styles.personLabel}>单位法人</div>
                  {legalList.map(({ user_id: id, user_name: name, mobile: phone }) => (
                    <div className={styles.personItem} key={id}>
                      <div className={styles.personItemName}>{name}</div>
                      <div className={styles.personItemPhone}>{phone}</div>
                    </div>
                  ))}
                </div>
              )}
              {safeChargerList.length !== 0 && (
                <div className={styles.personList} style={{ borderColor: '#C6C181' }}>
                  <div className={styles.personLabel}>安全负责人</div>
                  {safeChargerList.map(({ user_id: id, user_name: name, mobile: phone }) => (
                    <div className={styles.personItem} key={id}>
                      <div className={styles.personItemName}>{name}</div>
                      <div className={styles.personItemPhone}>{phone}</div>
                    </div>
                  ))}
                </div>
              )}
              {safeManagerList.length !== 0 && (
                <div className={styles.personList} style={{ borderColor: '#00A8FF' }}>
                  <div className={styles.personLabel}>安全管理员</div>
                  {safeManagerList.map(({ user_id: id, user_name: name, mobile: phone }) => (
                    <div className={styles.personItem} key={id}>
                      <div className={styles.personItemName}>{name}</div>
                      <div className={styles.personItemPhone}>{phone}</div>
                    </div>
                  ))}
                </div>
              )}
              {saferList.length !== 0 && (
                <div className={styles.personList} style={{ borderColor: '#0967D3' }}>
                  <div className={styles.personLabel}>安全员</div>
                  {saferList.map(({ user_id: id, user_name: name, mobile: phone }) => (
                    <div className={styles.personItem} key={id}>
                      <div className={styles.personItemName}>{name}</div>
                      <div className={styles.personItemPhone}>{phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /**
   * 风险点
   */
  renderRisk() {
    const {
      bigPlatform: {
        countDangerLocationForCompany: {
          countDangerLocation: [{ red = 0, orange = 0, yellow = 0, blue = 0 } = {}] = [{}],
          redDangerResult = [],
          orangeDangerResult = [],
          yellowDangerResult = [],
          blueDangerResult = [],
        },
      },
    } = this.props;

    // 类名
    const className = classNames(styles.sectionWrapper, styles.risk);
    // 滚动类名
    const scrollClassName = classNames(styles.innerBox, styles.riskScroll);

    return (
      <section
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          right: '110%',
          width: '100%',
          height: '100%',
          transition: 'top 0.5s, left 0.5s, right 0.5s, bottom 0.5s',
        }}
        ref={risk => (this.risk = risk)}
      >
        <div className={styles.sectionMain}>
          <div className={styles.shadowIn}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionTitleIcon} />
              风险点
              <Icon
                type="close"
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  this.risk.style.right = '110%';
                  this.leftSection.style.opacity = 1;
                }}
              />
            </div>
            <Row className={styles.riskLevelList}>
              <Col span={6} className={styles.riskLevelItem}>
                <div className={styles.riskLevelItemValue}>{red}</div>
                <div className={styles.riskLevelItemName} style={{ color: '#FF4848' }}>
                  红
                </div>
              </Col>

              <Col span={6} className={styles.riskLevelItem}>
                <div className={styles.riskLevelItemValue}>{orange}</div>
                <div className={styles.riskLevelItemName} style={{ color: '#F17A0A' }}>
                  橙
                </div>
              </Col>

              <Col span={6} className={styles.riskLevelItem}>
                <div className={styles.riskLevelItemValue}>{yellow}</div>
                <div className={styles.riskLevelItemName} style={{ color: '#FBF719' }}>
                  黄
                </div>
              </Col>

              <Col span={6} className={styles.riskLevelItem}>
                <div className={styles.riskLevelItemValue}>{blue}</div>
                <div className={styles.riskLevelItemName} style={{ color: '#1E60FF' }}>
                  蓝
                </div>
              </Col>
            </Row>
            <div className={scrollClassName}>
              {redDangerResult.length === 0 &&
                orangeDangerResult.length === 0 &&
                yellowDangerResult.length === 0 &&
                blueDangerResult.length === 0 && (
                  <div style={{ textAlign: 'center' }}>暂未风险评级</div>
                )}
              {redDangerResult.length !== 0 &&
                redDangerResult.map(
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
                        <div
                          className={styles.riskPointItemLabel}
                          style={switchColorAndBgColor('红')}
                        >
                          红
                        </div>
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
                            {content}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              {orangeDangerResult.length !== 0 &&
                orangeDangerResult.map(
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
                        <div
                          className={styles.riskPointItemLabel}
                          style={switchColorAndBgColor('橙')}
                        >
                          橙
                        </div>
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
                            {content}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              {yellowDangerResult.length !== 0 &&
                yellowDangerResult.map(
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
                        <div
                          className={styles.riskPointItemLabel}
                          style={switchColorAndBgColor('黄')}
                        >
                          黄
                        </div>
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
                            {content}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              {blueDangerResult.length !== 0 &&
                blueDangerResult.map(
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
                        <div
                          className={styles.riskPointItemLabel}
                          style={switchColorAndBgColor('蓝')}
                        >
                          蓝
                        </div>
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
                            {content}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  render() {
    return (
      <div className={styles.main}>
        {this.renderHeader() /* 头部 */}
        {this.renderBody() /* 主体 */}
      </div>
    );
  }
}

export default CompanyLayout;
