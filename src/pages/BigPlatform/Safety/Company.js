import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import classNames from 'classnames';
import ReactEcharts from 'echarts-for-react';
import Slide from 'components/Slide';
import MonitorBall from 'components/MonitorBall';
import Rotate from 'components/Rotate';

// import Timer from './Components/Timer';
import RiskImage from './Components/RiskImage.js';
import RiskPoint from './Components/RiskPoint.js';
import RiskInfo from './Components/RiskInfo.js';
import RiskDetail from './Components/RiskDetail.js';
import CurrentHiddenDanger from './Components/CurrentHiddenDanger';
import StaffList from './Components/StaffList';
import StaffRecords from './Components/StaffRecords';
import Header from '../UnitFireControl/components/Header/Header';
import VideoPlay from '../FireControl/section/VideoPlay.js';

import styles from './Company.less';
import riskStyles from './Risk.less';
import videoPointIcon from './img/videoPoint.png';
// import unselectedVideoPointIcon from './img/unselectedVideoPoint.png';
import importantIcon from './img/importantCompany.png';
import checkingIcon from './img/checkingIcon.png';
import abnormalIcon from './img/abnormalIcon.png';
import overIcon from './img/overIcon.png';
import gray from '@/assets/gray_new.png';
import exceptionGray from '@/assets/exception_gray.png';

const { Option } = Select;
const { projectName } = global.PROJECT_CONFIG;
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
const checkIcon = `${iconPrefix}check-icon.png`;
const specialIcon = `${iconPrefix}special-icon.png`;
const peopleIcon = `${iconPrefix}people-icon.png`;
const hdIcon = `${iconPrefix}hd-icon.png`;
const normalIcon = `${iconPrefix}normal-icon.png`;

// 选中高度
const selectedHeight = 180;
const selectedWidth = 63;
// 信息offset
const defaultInfoOffset = {
  x: 30,
  y: -selectedHeight - 36,
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
        result.src = gray;
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
        result.src = exceptionGray;
        break;
    }
  }
  return result;
};
// 获取颜色和status
const switchCheckStatus = value => {
  switch (value) {
    case 1:
      return {
        color: '#fff',
        _color: '#00A181',
        content: '正常',
      };
    case 2:
      return {
        color: '#FF4848',
        _color: '#FF4848',
        content: '异常',
      };
    case 3:
      return {
        color: '#fff',
        _color: '#5EBEFF',
        content: '待检查',
      };
    case 4:
      return {
        color: '#FF4848',
        _color: '#FF4848',
        content: '已超时',
      };
    default:
      return {
        color: '#fff',
        _color: '#fff',
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
        backgroundColor: '#4F6793',
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

@connect(({ bigPlatform, loading }) => ({
  bigPlatform,
  monitorDataLoading: loading.effects['bigPlatform/fetchMonitorData'],
}))
class CompanyLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 之前选中的风险点id
      prevSelectedId: null,
      // 当前选中的风险点id
      selectedId: null,
      // 当前选中的风险点索引
      selectedIndex: 0,
      // 当前选中的四色图对应的风险点
      points: [],
      // 当前选中的四色图的id
      selectedFourColorImgId: null,
      // 当前选中的四色图的地址
      selectedFourColorImgUrl: '',
      // 是否显示视频播放
      videoVisible: false,
      // 当前播放的视频id
      videoKeyId: '',
      // 是否显示当前隐患
      isCurrentHiddenDangerShow: false,
      // 当前四色图的所有风险点id
      currentFourColorImgPointIds: [],
      // percent
      percent: 39,
      // 风险点模块的筛选状态
      riskStatus: undefined,
      // 单位巡查当前显示的模块索引
      unitInspectionIndex: 0,
      // 当前选中的人员列表的月份
      selectedStaffListMonth: '2018-09',
      // 当前选中的人员记录的月份
      selectedStaffRecordsMonth: '2018-09',
      // 选中的人员id
      selectedUserId: null,
    };
    this.myTimer = null;
    this.currentPieIndex = -1;
    this.highLightTimer = null;
    this.currentLineIndex = -1;
    this.showTipTimer = null;
    // 曲线图元素
    this.lineChart = null;
  }

  /**
   * 挂载后
   */
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
        // 如果id不存在，则意味着没有四色图
        if (id) {
          this.filterPointsByFourColorImgId(point, id, webUrl);
        } else {
          this.setState({
            isCurrentHiddenDangerShow: true,
          });
        }
      },
    });
    dispatch({
      type: 'bigPlatform/fetchSpecialEquipment',
      payload: {
        company_id: companyId,
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
    // 获取安全人员信息（安全人员信息卡片源数据）
    dispatch({
      type: 'bigPlatform/fetchSafetyOfficer',
      payload: {
        company_id: companyId,
      },
    });

    // 获取视频列表
    dispatch({
      type: 'bigPlatform/fetchAllCamera',
      payload: {
        company_id: companyId,
      },
    });

    // 获取监控数据
    dispatch({
      type: 'bigPlatform/fetchMonitorData',
      payload: {
        companyId,
      },
    });

    // 添加曲线图显示文字定时器
    this.showTipTimer = setInterval(this.showLineChartTip, 2000);
  }

  /**
   * 销毁前
   */
  componentWillUnmount() {
    clearTimeout(this.myTimer);
    clearInterval(this.highLightTimer);
    clearInterval(this.showTipTimer);
  }

  timeoutCallback = () => {
    const { selectedIndex, currentFourColorImgPointIds } = this.state;
    if (selectedIndex === currentFourColorImgPointIds.length - 1) {
      this.handleClick(currentFourColorImgPointIds[0], 0);
    } else {
      this.handleClick(currentFourColorImgPointIds[selectedIndex + 1], selectedIndex + 1);
    }
  };

  // 添加风险点轮播定时器
  addTimeout = () => {
    this.myTimer = setTimeout(this.timeoutCallback, 10000);
  };

  /**
   * 根据当前选中的四色图id筛选出对应的风险点
   * 将id和points保存到state中
   * 自动选中第一个point
   */
  filterPointsByFourColorImgId = (point, id, webUrl) => {
    const points = point.filter(({ fixImgId }) => fixImgId === id);
    const currentFourColorImgPointIds = points.map(({ itemId }) => itemId);
    const [itemId] = currentFourColorImgPointIds;
    this.setState({
      points,
      selectedFourColorImgId: id,
      selectedFourColorImgUrl: webUrl,
      isCurrentHiddenDangerShow: false, // 切换四色图时必隐藏当前隐患模块
      currentFourColorImgPointIds, // 切换四色图时保存选中四色图对应的所有风险点id
    });
    this.handleClick(itemId, 0);
  };

  /**
   * 显示曲线图的文字
   */
  showLineChartTip = () => {
    const { unitInspectionIndex } = this.state;
    if (!this.lineChart || unitInspectionIndex !== 0) {
      return;
    }
    var length = this.lineChart.getOption().series[0].data.length;
    this.currentLineIndex = (this.currentLineIndex + 1) % length;
    // 显示 tooltip
    this.lineChart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: this.currentLineIndex,
    });
  };

  // 显示视频弹框
  handleVideoShow = keyId => {
    this.setState({ videoVisible: true, videoKeyId: keyId });
  };

  // 隐藏视频弹框
  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: undefined });
  };

  /**
   * 环形图加载完毕
   */
  handlePieChartReady = chart => {
    const changeHighLight = () => {
      var length = chart.getOption().series[0].data.length;
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
  handleLineChartReady = chart => {
    if (document.querySelector('.domLineChart').getAttribute('_echarts_instance_') === chart.id) {
      this.lineChart = chart;
    }
  };

  /**
   * 四色图下拉框选择事件
   */
  handleSelectFourColorImg = (id, { props: { url } }) => {
    const {
      bigPlatform: {
        companyMessage: { point },
      },
    } = this.props;
    const { selectedFourColorImgId } = this.state;
    if (selectedFourColorImgId === id) {
      return;
    }
    this.filterPointsByFourColorImgId(point, id, url);
  };

  /* 风险点点击事件 */
  handleClick = (id, index, flag) => {
    const { selectedId } = this.state;
    clearTimeout(this.myTimer);
    // 如果id不存在，则取消风险点选中，并移除定时器
    if (!id) {
      this.setState({
        selectedId: null,
      });
      return;
    }
    this.addTimeout();
    if (selectedId === id) {
      // 虽然现在看来flag其实完全可以不写，但是不清楚之前写的时候是怎么考虑的，所以就留着不动
      if (flag) {
        this.setState({
          selectedId: null,
        });
      }
      return;
    }
    this.setState({
      selectedId: id,
      selectedIndex: index,
      isCurrentHiddenDangerShow: false, // 确保有风险点选中时当前隐患模块必然隐藏
    });
  };

  // 鼠标移动到隐患详情
  handleMouseEnter = () => {
    clearTimeout(this.myTimer);
  };

  // 鼠标移出隐患详情
  handleMouseLeave = () => {
    const { currentFourColorImgPointIds } = this.state;
    currentFourColorImgPointIds.length > 0 && this.addTimeout();
  };

  /**
   * 显示当前隐患
   */
  handleShowCurrentHiddenDanger = () => {
    // 显示当前隐患模块
    this.setState(({ selectedId }) => ({
      prevSelectedId: selectedId,
      isCurrentHiddenDangerShow: true,
    }));
    // 取消风险点选中并移除定时器
    this.handleClick(null, 0);
  };

  /**
   * 隐藏当前隐患
   */
  handleHideCurrentHiddenDanger = () => {
    const { selectedIndex, currentFourColorImgPointIds } = this.state;
    // 隐藏当前隐患模块
    this.setState({
      isCurrentHiddenDangerShow: false,
    });
    // 选中之前选中的风险点并添加定时器
    this.handleClick(currentFourColorImgPointIds[selectedIndex], selectedIndex);
  };

  /**
   * 监控球点击事件
   */
  handleClickMonitorBall = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    window.open(`${window.publicPath}#/big-platform/monitor/company/${companyId}`);
  };

  /**
   * 点击显示风险点模块
   */
  handleClickShowRiskSection(riskStatus) {
    // 更换风险点模块中的内容
    this.setState({
      riskStatus,
    });
    // 显示风险点模块
    this.risk.style.right = 0;
    this.leftSection.style.opacity = 0;
  }

  /**
   * 切换单位巡查
   */
  handleSwitchUnitInspection = (index, checkUserId) => {
    const { unitInspectionIndex, selectedStaffListMonth } = this.state;
    // 每次翻转重新获取源数据
    if (index === 1 && unitInspectionIndex === 0) {
      this.handleSelectStaffList(moment().format('YYYY-MM'));
    } else if (index === 2) {
      this.handleSelectStaffRecords(selectedStaffListMonth, checkUserId);
    }
    this.setState({
      unitInspectionIndex: index,
      selectedUserId: checkUserId,
    });
  };

  /**
   * 根据月份获取人员列表
   */
  handleSelectStaffList = month => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'bigPlatform/fetchStaffList',
      payload: {
        company_id: companyId,
        month,
      },
    });
    this.setState({
      selectedStaffListMonth: month,
    });
  };

  /**
   * 根据月份获取人员记录
   */
  handleSelectStaffRecords = (month, checkUserId = this.state.selectedUserId) => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'bigPlatform/fetchStaffRecords',
      payload: {
        company_id: companyId,
        month,
        checkUserId,
      },
    });
    this.setState({
      selectedStaffRecordsMonth: month,
    });
  };

  /**
   * 单位巡查人员列表
   */
  renderStaffList() {
    // 从props中获取人员列表
    const {
      bigPlatform: { staffList },
    } = this.props;
    // 从state中获取当前选中的月份
    const { selectedStaffListMonth } = this.state;

    return (
      <StaffList
        data={staffList}
        month={selectedStaffListMonth}
        fieldNames={{
          id: 'check_user_id',
          person: 'user_name',
          total: 'totalCheck',
          abnormal: 'abnormal',
        }}
        onBack={() => {
          this.handleSwitchUnitInspection(0);
        }}
        onClick={checkUserId => {
          this.handleSwitchUnitInspection(2, checkUserId);
        }}
        onSelect={this.handleSelectStaffList}
      />
    );
  }

  /**
   * 单位巡查人员巡查记录
   */
  renderStaffRecords() {
    // 从props中获取人员记录
    const {
      bigPlatform: { staffRecords },
    } = this.props;
    const { selectedStaffRecordsMonth } = this.state;

    return (
      <StaffRecords
        data={staffRecords}
        month={selectedStaffRecordsMonth}
        fieldNames={{
          id: 'check_id',
          person: 'user_name',
          time: 'check_date',
          point: 'object_title',
          result: 'fireCheckStatus',
        }}
        onBack={() => {
          this.handleSwitchUnitInspection(1);
        }}
        onSelect={this.handleSelectStaffRecords}
      />
    );
  }

  /**
   * 监控球
   */
  renderMonitorBall() {
    const {
      bigPlatform: {
        monitorData: { score = 0, count = 0, unnormal = 0 },
      },
      monitorDataLoading,
    } = this.props;
    // 当percent小于80或者报警时，显示异常颜色
    const color = +score < 80 || +unnormal > 0 ? '#ff7863' : '#00A8FF';
    // 当percent为0时不显示监控球
    return +count !== 0 && !monitorDataLoading ? (
      <MonitorBall
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: '9',
          boxShadow: `0 0 1em ${color}`,
        }}
        height={128}
        color={color}
        percent={score}
        title="安全监测"
        onClick={this.handleClickMonitorBall}
      />
    ) : null;
  }

  /**
   * 四色图下拉框
   */
  renderFourColorImgSelect() {
    const {
      bigPlatform: {
        companyMessage: { fourColorImg = [] },
      },
    } = this.props;
    const { selectedFourColorImgId } = this.state;
    return fourColorImg.length > 1 ? (
      <Select
        value={selectedFourColorImgId}
        onSelect={this.handleSelectFourColorImg}
        className={riskStyles.fourColorImgSelect}
        style={{
          position: 'absolute',
          top: '16px',
          left: 0,
          width: 150,
        }}
        dropdownClassName={riskStyles.fourColorImgSelectDropDown}
      >
        {fourColorImg.map(({ id, fileName = '未命名', webUrl }) => {
          const isSelected = selectedFourColorImgId === id;
          const i = fileName.indexOf('.');
          return (
            <Option
              key={id}
              value={id}
              url={webUrl}
              style={{ backgroundColor: isSelected && '#0967D3', color: isSelected && '#fff' }}
            >
              {i === -1 ? fileName : fileName.slice(0, i)}
            </Option>
          );
        })}
      </Select>
    ) : null;
  }

  /**
   * 当前隐患
   */
  renderCurrentHiddenDanger(closable) {
    const {
      bigPlatform: {
        riskDetailList: { ycq = [], wcq = [], dfc = [] },
      },
    } = this.props;
    return (
      <CurrentHiddenDanger
        ycq={ycq}
        wcq={wcq}
        dfc={dfc}
        closable={closable}
        onClose={this.handleHideCurrentHiddenDanger}
      />
    );
  }

  /**
   * 右边部分
   * 隐患详情
   */
  renderRightSection() {
    const {
      bigPlatform: {
        riskDetailList: { ycq = [], wcq = [], dfc = [] },
      },
    } = this.props;
    const {
      prevSelectedId,
      selectedId,
      isCurrentHiddenDangerShow,
      selectedFourColorImgId,
      currentFourColorImgPointIds,
    } = this.state;
    const riskDetailList = ycq.concat(wcq, dfc);
    let data = isCurrentHiddenDangerShow
      ? prevSelectedId === null
        ? riskDetailList.filter(({ item_id }) => currentFourColorImgPointIds.includes(item_id))
        : riskDetailList.filter(({ item_id }) => item_id === prevSelectedId)
      : selectedId === null
        ? riskDetailList.filter(({ item_id }) => currentFourColorImgPointIds.includes(item_id))
        : riskDetailList.filter(({ item_id }) => item_id === selectedId);

    // 当没有四色图时，默认显示当前隐患，否则显示选中的风险点对应的隐患详情
    return !selectedFourColorImgId ? (
      this.renderCurrentHiddenDanger(false)
    ) : (
      <Slide
        // offset={{
        //   left: 12,
        // }}
        direction="left"
        showExtra={isCurrentHiddenDangerShow}
        extra={this.renderCurrentHiddenDanger(true)}
      >
        <RiskDetail
          style={{
            height: '100%',
          }}
          data={data}
          // flag={!isCurrentHiddenDangerShow && selectedId === null}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      </Slide>
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
      riskDetailList: { ycq = [], wcq = [], dfc = [] },
    } = this.props.bigPlatform;
    const { isCurrentHiddenDangerShow } = this.state;
    const infoClassNames = classNames(styles.sectionWrapper, styles.infoWrapper);
    const hiddenDanger = ycq.length + wcq.length + dfc.length;

    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const isRiskPointValued = +countCheckItem !== 0;
    const isPeopleValued = +countCompanyUser !== 0;
    const isHiddenDangerValued = +hiddenDanger !== 0 && !isCurrentHiddenDangerShow;

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
              <div
                className={
                  isPeopleValued ? `${styles.summaryHalf} ${styles.hoverable}` : styles.summaryHalf
                }
                style={{ backgroundImage: `url(${peopleIcon})` }}
                onClick={
                  isPeopleValued
                    ? () => {
                        this.safety.style.right = 0;
                        this.leftSection.style.opacity = 0;
                      }
                    : undefined
                }
              >
                <div className={styles.summaryText}>
                  <span className={styles.fieldName}>安全人员</span>
                </div>
                <div className={styles.summaryNum}>{countCompanyUser}</div>
              </div>

              <div
                className={
                  isRiskPointValued
                    ? `${styles.summaryHalf} ${styles.hoverable}`
                    : styles.summaryHalf
                }
                style={{ backgroundImage: `url(${checkIcon})` }}
                onClick={() => {
                  isRiskPointValued && this.handleClickShowRiskSection();
                }}
              >
                <div className={styles.summaryText}>
                  <span className={styles.fieldName}>风险点</span>
                </div>
                <div className={styles.summaryNum}>{countCheckItem}</div>
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

              <div
                className={
                  isHiddenDangerValued
                    ? `${styles.summaryHalf} ${styles.hoverable}`
                    : styles.summaryHalf
                }
                style={{ backgroundImage: `url(${hdIcon})` }}
                onClick={isHiddenDangerValued ? this.handleShowCurrentHiddenDanger : undefined}
              >
                <div className={styles.summaryText}>
                  <span className={styles.fieldName}>当前隐患</span>
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
        countDangerLocation: [
          { red = 0, orange = 0, yellow = 0, blue = 0, not_rated: unvalued = 0 } = {},
        ] = [{}],
      },
    } = this.props.bigPlatform;
    const hdClassNames = classNames(styles.sectionWrapper, styles.hdWrapper);
    const isNormalValued = +status1 !== 0;
    const isCheckingValued = +status3 !== 0;
    const isAbnormalValued = +status2 !== 0;
    const isOverValued = +status4 !== 0;
    let data;
    if (red === 0 && orange === 0 && yellow === 0 && blue === 0) {
      data = [{ value: unvalued, name: '总计', itemStyle: { color: '#4F6793' } }];
    } else {
      const valuedData = [
        { value: red, name: '红', itemStyle: { color: '#BF6C6D' } },
        { value: orange, name: '橙', itemStyle: { color: '#CC964B' } },
        { value: yellow, name: '黄', itemStyle: { color: '#C6C181' } },
        { value: blue, name: '蓝', itemStyle: { color: '#4CA1DE' } },
      ];
      if (unvalued === 0) {
        data = valuedData;
      } else {
        const unvaluedData = [{ value: unvalued, name: '未评级', itemStyle: { color: '#4F6793' } }];
        data = valuedData.concat(unvaluedData);
      }
    }
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
          data,
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
                onChartReady={this.handlePieChartReady}
              />
            </div>

            <div className={styles.summaryBottom} style={{ height: '42%' }}>
              <div
                className={
                  isNormalValued ? `${styles.summaryHalf} ${styles.hoverable}` : styles.summaryHalf
                }
                style={{ backgroundImage: `url(${normalIcon})` }}
                onClick={() => {
                  isNormalValued && this.handleClickShowRiskSection(1);
                }}
              >
                <div className={styles.summaryText} style={{ color: '#00A181' }}>
                  正常
                </div>
                <div className={styles.summaryNum}>{status1}</div>
              </div>

              <div
                className={
                  isCheckingValued
                    ? `${styles.summaryHalf} ${styles.hoverable}`
                    : styles.summaryHalf
                }
                style={{ backgroundImage: `url(${checkingIcon})` }}
                onClick={() => {
                  isCheckingValued && this.handleClickShowRiskSection(3);
                }}
              >
                <div className={styles.summaryText} style={{ color: '#5EBEFF' }}>
                  待检查
                </div>
                <div className={styles.summaryNum}>{status3}</div>
              </div>

              <div
                className={
                  isAbnormalValued
                    ? `${styles.summaryHalf} ${styles.hoverable}`
                    : styles.summaryHalf
                }
                style={{ backgroundImage: `url(${abnormalIcon})` }}
                onClick={() => {
                  isAbnormalValued && this.handleClickShowRiskSection(2);
                }}
              >
                <div className={styles.summaryText} style={{ color: '#FF4848' }}>
                  异常
                </div>
                <div className={styles.summaryNum}>{status2}</div>
              </div>

              <div
                className={
                  isOverValued ? `${styles.summaryHalf} ${styles.hoverable}` : styles.summaryHalf
                }
                style={{ backgroundImage: `url(${overIcon})` }}
                onClick={() => {
                  isOverValued && this.handleClickShowRiskSection(4);
                }}
              >
                <div className={styles.summaryText} style={{ color: '#FF4848' }}>
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
      bigPlatform: { riskPointInfoList, allCamera = [] },
    } = this.props;
    const { selectedId, selectedFourColorImgId, selectedFourColorImgUrl, points } = this.state;
    let red = 0,
      orange = 0,
      yellow = 0,
      blue = 0,
      gray = 0,
      camera = 0;

    return (
      <div className={riskStyles.fourColorImgContainer}>
        {this.renderMonitorBall()}
        <div className={riskStyles.fourColorImgTitle}>安全点位图</div>
        <RiskImage
          src={selectedFourColorImgUrl}
          wrapperClassName={riskStyles.riskImage}
          // perspective='30em'
          rotate="30deg"
        >
          {allCamera.length > 0 &&
            allCamera.map(({ id, fix_img_id: fixImgId, x_num: x, y_num: y, key_id }) => {
              const position = { x, y };
              const isCurrentImgCamera = selectedFourColorImgId === fixImgId;
              if (isCurrentImgCamera) {
                camera++;
                return (
                  <Fragment key={id}>
                    <RiskPoint
                      position={position}
                      src={videoPointIcon}
                      style={{
                        width: 36,
                        height: 36,
                        cursor: 'pointer',
                        boxShadow: '0 0 5px rgba(0,0,0,0.9)',
                        borderRadius: '50%',
                      }}
                      offset={normalOffset}
                      onClick={() => {
                        this.handleVideoShow(key_id);
                      }}
                    />
                  </Fragment>
                );
              }
              return null;
            })}
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
              let isGray = false;
              switch (info.hdLetterInfo.riskLevelName.desc) {
                case '红':
                  red++;
                  break;
                case '橙':
                  orange++;
                  break;
                case '黄':
                  yellow++;
                  break;
                case '蓝':
                  blue++;
                  break;
                default:
                  gray++;
                  isGray = true;
                  break;
              }
              let infoData = [
                {
                  icon: pointIcon,
                  title: '风险点名称',
                  content: info.hdLetterInfo.pointName,
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
              if (isGray) {
                if (!info.hdLetterInfo.pointName && !info.hdLetterInfo.areaName && !info.hdLetterInfo.accidentTypeName && !info.hdLetterInfo.status && !info.hdLetterInfo.riskLevelName.desc) {
                  infoData = [];
                }
                else {
                  infoData.splice(4, 1);
                  if (!info.hdLetterInfo.accidentTypeName) {
                    infoData.splice(2, 1);
                  }
                  if (!info.hdLetterInfo.areaName) {
                    infoData.splice(1, 1);
                  }
                }
              }
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
                    onClick={() => {
                      this.handleClick(id, index, true);
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
                    background={
                      isGray
                        ? undefined
                        : info.localPictureUrlList[0] && info.localPictureUrlList[0].webUrl
                    }
                    style={{
                      display: selectedId === id ? 'block' : 'none',
                      // opacity: selectedId === id ? '1' : '0',
                    }}
                  />
                </Fragment>
              );
            })}
          {this.renderFourColorImgSelect()}
        </RiskImage>
        <div className={riskStyles.fourColorImgLabelContainer}>
          {red > 0 && (
            <div className={riskStyles.fourColorImgLabel}>
              <span
                className={riskStyles.fourColorImgLabelIcon}
                style={{ backgroundColor: '#FC1F02' }}
              />
              <span>重大风险</span>
            </div>
          )}
          {orange > 0 && (
            <div className={riskStyles.fourColorImgLabel}>
              <span
                className={riskStyles.fourColorImgLabelIcon}
                style={{ backgroundColor: '#F17A0A' }}
              />
              <span>较大风险</span>
            </div>
          )}
          {yellow > 0 && (
            <div className={riskStyles.fourColorImgLabel}>
              <span
                className={riskStyles.fourColorImgLabelIcon}
                style={{ backgroundColor: '#FBF719' }}
              />
              <span>一般风险</span>
            </div>
          )}
          {blue > 0 && (
            <div className={riskStyles.fourColorImgLabel}>
              <span
                className={riskStyles.fourColorImgLabelIcon}
                style={{ backgroundColor: '#1E60FF' }}
              />
              <span>低风险</span>
            </div>
          )}
          {gray > 0 && (
            <div className={riskStyles.fourColorImgLabel}>
              <span
                className={riskStyles.fourColorImgLabelIcon}
                style={{ backgroundColor: '#4E6693' }}
              />
              <span>风险点</span>
            </div>
          )}
          {camera > 0 && (
            <div className={riskStyles.fourColorImgLabel}>
              <span
                className={riskStyles.fourColorImgLabelIcon}
                style={{
                  backgroundImage: `url(${videoPointIcon})`,
                  boxShadow: 'none',
                  border: 'none',
                }}
              />
              <span>视频监控</span>
            </div>
          )}
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
    const { unitInspectionIndex } = this.state;

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
        top: 30,
        left: 20,
        right: 20,
        bottom: 10,
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
      <Rotate axis="x" frontIndex={unitInspectionIndex} style={{ height: '32%' }}>
        <section className={styles.sectionWrapper} style={{ height: '100%' }}>
          <div className={styles.sectionMain}>
            <div className={styles.shadowIn}>
              <div className={styles.sectionTitle}>
                <span className={styles.sectionTitleIcon} />
                单位巡查
                <div
                  className={styles.jumpButton}
                  onClick={() => {
                    this.handleSwitchUnitInspection(1);
                  }}
                >
                  巡查记录>>
                </div>
              </div>
              <div className={styles.lineChart} style={{ position: 'relative' }}>
                <ReactEcharts
                  option={option}
                  style={{ height: '100%' }}
                  onChartReady={this.handleLineChartReady}
                  className="domLineChart"
                />
                <div className={styles.legendList}>
                  <div className={styles.legendItem}>
                    <span
                      className={styles.legendItemIcon}
                      style={{ backgroundColor: '#5EBEFF' }}
                    />
                    <span className={styles.legendItemName}>巡查</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span
                      className={styles.legendItemIcon}
                      style={{ backgroundColor: '#F7E68A' }}
                    />
                    <span className={styles.legendItemName}>隐患</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {this.renderStaffList()}
        {this.renderStaffRecords()}
      </Rotate>
    );
  }

  /**
   * 安全人员
   */
  renderSafety() {
    let {
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
    legalList = legalList || [];
    safeChargerList = safeChargerList || [];
    safeManagerList = safeManagerList || [];
    saferList = saferList || [];

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
          // 未评级总数
          countDangerLocation: [{ red: r, orange: o, yellow: y, blue: b, not_rated = 0 } = {}] = [
            {},
          ],
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
          unvaluedDangerResult: {
            normal: unvaluedNormal = [],
            checking: unvaluedChecking = [],
            abnormal: unvaluedAbnormal = [],
            over: unvaluedOver = [],
          } = {},
        },
      },
    } = this.props;
    const { riskStatus } = this.state;
    // 是否全部未评级
    const isAllUnvalued = r + o + y + b === 0;
    // 获取对应状态的风险点
    let redDangerResult,
      orangeDangerResult,
      yellowDangerResult,
      blueDangerResult,
      unvaluedDangerResult;
    if (riskStatus === 1) {
      redDangerResult = redNormal;
      orangeDangerResult = orangeNormal;
      yellowDangerResult = yellowNormal;
      blueDangerResult = blueNormal;
      unvaluedDangerResult = unvaluedNormal;
    } else if (riskStatus === 2) {
      redDangerResult = redAbnormal;
      orangeDangerResult = orangeAbnormal;
      yellowDangerResult = yellowAbnormal;
      blueDangerResult = blueAbnormal;
      unvaluedDangerResult = unvaluedAbnormal;
    } else if (riskStatus === 3) {
      redDangerResult = redChecking;
      orangeDangerResult = orangeChecking;
      yellowDangerResult = yellowChecking;
      blueDangerResult = blueChecking;
      unvaluedDangerResult = unvaluedChecking;
    } else if (riskStatus === 4) {
      redDangerResult = redOver;
      orangeDangerResult = orangeOver;
      yellowDangerResult = yellowOver;
      blueDangerResult = blueOver;
      unvaluedDangerResult = unvaluedOver;
    } else {
      redDangerResult = [...redAbnormal, ...redOver, ...redChecking, ...redNormal];
      orangeDangerResult = [...orangeAbnormal, ...orangeOver, ...orangeChecking, ...orangeNormal];
      yellowDangerResult = [...yellowAbnormal, ...yellowOver, ...yellowChecking, ...yellowNormal];
      blueDangerResult = [...blueAbnormal, ...blueOver, ...blueChecking, ...blueNormal];
      unvaluedDangerResult = [
        ...unvaluedAbnormal,
        ...unvaluedOver,
        ...unvaluedChecking,
        ...unvaluedNormal,
      ];
    }
    // 获取对应状态的评级数量统计
    const red = redDangerResult.length;
    const orange = orangeDangerResult.length;
    const yellow = yellowDangerResult.length;
    const blue = blueDangerResult.length;
    const unvalued = unvaluedDangerResult.length;
    // const red = 0;
    // const orange = 0;
    // const yellow = 0;
    // const blue = 0;
    const { _color, content } = switchCheckStatus(+riskStatus);

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
              {riskStatus && (
                <span>
                  <span style={{ position: 'relative', top: '-2px' }}>—</span>
                  <span style={{ color: _color }}>{content}</span>
                </span>
              )}
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
            {!isAllUnvalued ? (
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

                {not_rated !== 0 && (
                  <div className={styles.riskLevelItem}>
                    <div className={styles.riskLevelItemValue}>{unvalued}</div>
                    <div className={styles.riskLevelItemName} style={{ color: '#4F6793' }}>
                      未评级
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.riskLevelList}>
                <div className={`${styles.unvaluedItem} ${styles.riskLevelItem}`}>
                  <div className={styles.riskLevelItemValue}>{unvalued}</div>
                  <div className={styles.riskLevelItemName} style={{ color: '#00A8FF' }}>
                    总计
                  </div>
                </div>
              </div>
            )}
            <div className={scrollClassName}>
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
                      {!riskStatus && (
                        <div className={styles.riskPointItemNameWrapper}>
                          <div className={styles.riskPointItemName}>状态</div>
                          <div className={styles.riskPointItemValue} style={{ color }}>
                            {content}
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
                      {!riskStatus && (
                        <div className={styles.riskPointItemNameWrapper}>
                          <div className={styles.riskPointItemName}>状态</div>
                          <div className={styles.riskPointItemValue} style={{ color }}>
                            {content}
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
                      {!riskStatus && (
                        <div className={styles.riskPointItemNameWrapper}>
                          <div className={styles.riskPointItemName}>状态</div>
                          <div className={styles.riskPointItemValue} style={{ color }}>
                            {content}
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
                      {!riskStatus && (
                        <div className={styles.riskPointItemNameWrapper}>
                          <div className={styles.riskPointItemName}>状态</div>
                          <div className={styles.riskPointItemValue} style={{ color }}>
                            {content}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
              {unvaluedDangerResult.map(
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
                      {!isAllUnvalued && (
                        <div
                          className={styles.riskPointItemLabel}
                          style={switchColorAndBgColor('未评级')}
                        >
                          未评级
                        </div>
                      )}
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
                      {!riskStatus && (
                        <div className={styles.riskPointItemNameWrapper}>
                          <div className={styles.riskPointItemName}>状态</div>
                          <div className={styles.riskPointItemValue} style={{ color }}>
                            {content}
                          </div>
                        </div>
                      )}
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
    const {
      dispatch,
      bigPlatform: { allCamera = [] },
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;
    return (
      <div className={styles.main}>
        <Header title={projectName} />
        <Row
          gutter={24}
          className={styles.mainBody}
          style={{ margin: '0', padding: '16px 12px 24px', overflow: 'hidden' }}
        >
          <Col span={6} className={styles.column}>
            <div
              style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  transition: 'opacity 0.5s',
                }}
                ref={leftSection => (this.leftSection = leftSection)}
              >
                {this.renderLeftTopSection()}
                {this.renderLeftBottomSection()}
              </div>
              {this.renderSafety()}
              {this.renderRisk()}
            </div>
          </Col>
          <Col span={12} className={styles.column}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <div style={{ width: '100%', height: '100%' }}>
                {this.renderCenterTopSection()}
                {this.renderCenterBottomSection()}
              </div>
            </div>
          </Col>
          <Col span={6} className={styles.column}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {this.renderRightSection()}
            </div>
          </Col>
        </Row>
        <VideoPlay
          dispatch={dispatch}
          style={{ zIndex: 99999999 }}
          videoList={allCamera}
          visible={videoVisible}
          showList={true}
          actionType="bigFireControl/fetchStartToPlay"
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
        />
      </div>
    );
  }
}

export default CompanyLayout;
