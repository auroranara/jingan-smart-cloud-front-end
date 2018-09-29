import React, { Fragment, Component } from 'react';
import { Row, Col, Avatar, Tooltip, Icon, Switch } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import classNames from 'classnames';
import styles from './Government.less';
import rotate from './Animate.less';
import Timer from './Components/Timer';
import debounce from 'lodash/debounce';
import Ellipsis from '../../../components/Ellipsis';

import ReactEcharts from 'echarts-for-react';
import MapSection from './Components/MapSection';
import MyTooltip from '../FireControl/section/Tooltip';

import DangerCompany from './Sections/DangerCompany';
import CheckInfo from './Sections/CheckInfo';
import CompanyOver from './Sections/CompanyOver';
import CompanyRisk from './Components/CompanyRisk';
import RiskDetail from './Sections/RiskDetail';
import RiskDetailOver from './Sections/RiskDetailOver';
import RiskOver from './Sections/RiskOver';
import HdOverCompany from './Sections/HdOverCompany';
import RiskColors from './Sections/RiskColors';
import FullStaff from './Sections/FullStaff';
import CompanyIn from './Sections/CompanyIn';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
const importantIcon = `${iconPrefix}important.png`;

const { location: locationDefault } = global.PROJECT_CONFIG;
const riskTitles = ['红色风险点', '橙色风险点', '黄色风险点', '蓝色风险点', '未评级风险点'];

const sectionsVisible = {
  communityCom: false, // 社区接入单位数
  companyIn: false, // 接入单位统计
  fullStaff: false, // 专职人员统计
  overHd: false, // 已超期隐患
  hdCom: false, // 隐患单位统计
  comInfo: false, // 企业信息
  riskColors: false, // 风险点
  hdOverDetail: false, // 已超期隐患详情
  hiddenDanger: false, // 隐患详情
  checks: false, // 监督检查
  companyOver: false, // 已超时单位
  riskOver: false, // 单位超时未查
};
@connect(({ bigPlatform, bigPlatformSafetyCompany }) => ({
  bigPlatform,
  bigPlatformSafetyCompany,
}))
class GovernmentBigPlatform extends Component {
  constructor(props) {
    super(props);
    this.debouncedFetchData = debounce(this.fetchData, 500);
    this.state = {
      safetyGovernmentTitle: global.PROJECT_CONFIG.safetyGovernmentTitle,
      scrollNodeTop: 0,
      label: {
        longitude: 120.366011,
        latitude: 31.544389,
      },
      infoWindowShow: false,
      infoWindow: {
        companyId: '',
        companyName: '',
        level: '',
        address: '',
        longitude: 120.366011,
        latitude: 31.544389,
      },
      areaHeight: 0,
      pieHeight: 0,
      center: [locationDefault.x, locationDefault.y],
      zoom: locationDefault.zoom,
      // 右侧显示
      communityCom: true, // 社区接入单位数
      companyIn: false, // 接入单位统计
      fullStaff: false, // 专职人员统计
      overHd: false, // 已超期隐患
      hdCom: false, // 隐患单位统计
      comInfo: false, // 企业信息
      riskColors: false, // 风险点
      hdOverDetail: false, // 已超期隐患详情
      hiddenDanger: false, // 隐患详情
      checks: false, // 监督检查
      companyOver: false, // 已超时单位
      riskOver: false, // 单位超时未查
      companyId: '',
      // riskColorTitle: '红色风险点',
      riskColorSummary: {
        riskColorTitle: '',
        risk: 0,
        abnormal: 0,
        company: 0,
      },
      filter: 'All',
      legendActive: null,
      searchValue: '',
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
      dangerCompanyData: {},
      dangerCompanyLast: '',
      checksMonth: moment().format('YYYY-MM'),
    };
  }

  // UNSAFE_componentWillUpdate() {
  //   requestAnimationFrame(this.resolveAnimationFrame);
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 1000);
    });

    dispatch({
      type: 'bigPlatform/fetchItemList',
      payload: {
        start: 0,
        end: 24,
        pageSize: 25,
        item_type: 1,
      },
    });

    dispatch({
      type: 'bigPlatform/fetchProjectName',
    });

    dispatch({
      type: 'bigPlatform/fetchListForMap',
    });

    dispatch({
      type: 'bigPlatform/fetchCountDangerLocation',
    });

    // dispatch({
    //   type: 'bigPlatform/fetchLocationCenter',
    //   success: response => {
    //     const zoom = parseFloat(response.level);
    //     const center = [
    //       parseFloat(response.location.split(',')[0]),
    //       parseFloat(response.location.split(',')[1]),
    //     ];
    //     this.setState({
    //       center,
    //       zoom,
    //     });
    //   },
    // });

    dispatch({
      type: 'bigPlatform/fetchLocation',
    });

    // 政府专职人员列表
    dispatch({
      type: 'bigPlatform/fetchGovFulltimeWorkerList',
    });

    // 获取超期未整改隐患企业列表
    dispatch({
      type: 'bigPlatform/fetchOverRectifyCompany',
    });

    // 查找重点单位
    // dispatch({
    //   type: 'bigPlatform/fetchSearchImportantCompany',
    // });

    // 查找重点和非重点单位
    dispatch({
      type: 'bigPlatform/fetchSearchAllCompany',
    });

    // 隐患单位数量以及具体信息
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerCompany',
      payload: {
        // date: moment().format('YYYY-MM'),
      },
    });

    dispatch({
      type: 'bigPlatform/fetchNewHomePage',
      payload: {
        month: moment().format('YYYY-MM'),
      },
    });

    // 获取已超时风险点总数
    dispatch({
      type: 'bigPlatform/fetchSelectOvertimeItemNum',
    });

    // 安全政府-超时未查单位
    dispatch({
      type: 'bigPlatform/fetchOvertimeUncheckedCompany',
      payload: {
        pageNum: 1,
        pageSize: 99999,
      },
    });

    this.fetchCheckMsgs(moment().format('YYYY-MM'));

    // requestAnimationFrame(this.resolveAnimationFrame);

    this.handleScroll();

    this.setViewport();
  }

  // 某月监督检查相关信息
  fetchCheckMsgs = month => {
    const { dispatch } = this.props;
    // 专职人员检查信息
    dispatch({
      type: 'bigPlatform/fetchCheckInfo',
      payload: {
        date: month,
      },
    });

    // 本月隐患单位数量以及具体信息
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerCompany',
      payload: {
        date: month,
      },
    });

    // 已超时单位信息
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerOverTime',
      payload: {
        date: month,
      },
    });

    // 监督检查已查
    dispatch({
      type: 'bigPlatform/fetchCheckedCompanyInfo',
      payload: {
        date: month,
        isChecked: '1',
        isNormal: '1',
        isOvertime: '1',
        pageNum: 1,
        pageSize: 1,
      },
    });

    // 监督检查未查
    dispatch({
      type: 'bigPlatform/fetchCheckedCompanyInfo',
      payload: {
        date: month,
        isChecked: '0',
        isNormal: '1',
        isOvertime: '1',
        pageNum: 1,
        pageSize: 1,
      },
    });
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.reqRef);
  }

  setViewport() {
    const vp = document.querySelector('meta[name=viewport]');
    const sw = window.screen.width;
    const stand = 1440;
    const sca = sw / stand;
    vp.content =
      'width=device-width, initial-scale=' +
      sca +
      ', maximum-scale=' +
      sca +
      ', minimum-scale=' +
      sca +
      ', user-scalable=no';
  }

  resolveAnimationFrame = () => {
    const { scrollNodeTop } = this.state;
    setTimeout(() => {
      if (scrollNodeTop >= this.tableNode.offsetHeight + 150) {
        this.setState({
          scrollNodeTop: 0,
        });
        return;
      }
      this.setState({
        scrollNodeTop: scrollNodeTop + 1,
      });
    }, 50);
  };

  debounce = (action, delay) => {
    var timer = null;
    return function() {
      const self = this;
      const args = arguments;

      clearTimeout(timer);
      timer = setTimeout(function() {
        action.apply(self, args);
      }, delay);
    };
  };

  handleScroll = () => {
    const speed = 50;
    // if (this.scrollNode.clientHeight >= this.tableNode.scrollHeight) return;

    let timer = window.setInterval(() => {
      this.scrollup(this.scrollNode);
    }, speed);

    this.scrollNode.onmouseover = () => {
      //清除定时器
      clearInterval(timer);
    };

    this.scrollNode.onmouseout = () => {
      //添加定时器
      timer = window.setInterval(() => {
        this.scrollup(this.scrollNode);
      }, speed);
    };
  };

  scrollup = scroll => {
    //如果scroll滚上去的高度大于scroll1的高度，scrollTop = 0
    if (!scroll) return;
    if (scroll.scrollTop >= scroll.scrollHeight / 2) {
      scroll.scrollTop = 0;
    } else {
      scroll.scrollTop++;
    }
  };

  handleIconEnter = company => {
    const { id, longitude, latitude, name } = company;
    this.setState({
      infoWindowShow: true,
      infoWindow: {
        comapnyId: id,
        longitude: longitude,
        latitude: latitude,
        companyName: name,
      },
    });
  };

  handleIconClick = company => {
    const { dispatch } = this.props;
    const { companyId, infoWindowShow, comInfo } = this.state;
    const { id } = company;
    if (companyId === company.id) {
      if (!comInfo) {
        this.goComponent('comInfo');
      }
      if (!infoWindowShow) {
        this.setState({ infoWindowShow: true });
      }
      return;
    }
    this.setState({
      companyId: id,
    });
    // 企业信息
    dispatch({
      type: 'bigPlatform/fetchCompanyMessage',
      payload: {
        company_id: id,
        month: moment().format('YYYY-MM'),
        status: '7',
      },
      success: response => {
        this.goComponent('comInfo');
        this.setState({
          infoWindowShow: true,
          infoWindow: {
            comapnyId: company.id,
            longitude: company.longitude,
            latitude: company.latitude,
            companyName: response.companyMessage.companyName,
          },
        });
        if (document.querySelector('#companyRisk')) {
          document.querySelector('#companyRisk').scrollTop = 0;
        }
      },
    });
    // 特种设备
    dispatch({
      type: 'bigPlatform/fetchSpecialEquipment',
      payload: {
        company_id: id,
      },
    });
    // 风险点隐患
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerListByDate',
      payload: {
        company_id: id,
        source_type: '3',
      },
    });
  };

  handleHideInfoWindow = () => {
    this.setState({
      infoWindowShow: false,
    });
  };

  renderTable = () => {
    const {
      bigPlatform: {
        newHomePage: { countGridCompany },
      },
    } = this.props;
    return countGridCompany.map(item => {
      return (
        <Fragment key={item.grid_name}>
          <tr>
            <td>{item.grid_name}</td>
            <td>{item.total_num}</td>
          </tr>
        </Fragment>
      );
    });
  };

  // 风险点统计
  getHdBarOption() {
    const {
      bigPlatform: {
        countDangerLocation: {
          red,
          red_abnormal,
          red_company,
          orange,
          orange_abnormal,
          orange_company,
          yellow,
          yellow_abnormal,
          yellow_company,
          blue,
          blue_abnormal,
          blue_company,
          not_rated,
          not_rated_abnormal,
          not_rated_company,
        },
      },
    } = this.props;
    const lightGray = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: 'rgba(255, 255, 255, 1)', // 0% 处的颜色
        },
        {
          offset: 1,
          color: 'rgba(97, 97, 97, 1)', // 100% 处的颜色
        },
      ],
      globalCoord: false, // 缺省为 false
    };
    const gradientsRed = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#e81c02', // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#7e1001', // 100% 处的颜色
        },
      ],
      globalCoord: false, // 缺省为 false
    };
    const gradientsOrange = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#ea760a', // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#793d05', // 100% 处的颜色
        },
      ],
      globalCoord: false, // 缺省为 false
    };
    const gradientsYel = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#e9e517', // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#7e7c0d', // 100% 处的颜色
        },
      ],
      globalCoord: false, // 缺省为 false
    };
    const gradientsBlue = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#1a52d9', // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#0f307f', // 100% 处的颜色
        },
      ],
      globalCoord: false, // 缺省为 false
    };
    const gradientsGray = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#4f6793', // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#28344a', // 100% 处的颜色
        },
      ],
      globalCoord: false, // 缺省为 false
    };
    const colorList = [gradientsRed, gradientsOrange, gradientsYel, gradientsBlue, gradientsGray];
    const comMap = [red_company, orange_company, yellow_company, blue_company, not_rated_company];
    const option = {
      legend: {
        show: false,
      },
      textStyle: {
        color: '#fff',
      },
      grid: {
        top: '20px',
        left: '35px',
        right: '10px',
        bottom: '25px',
        // containLabel: false,
      },
      tooltip: {
        show: 'true',
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(46,78,111,0.5)',
            opacity: 0.6,
          },
        },
        backgroundColor: 'rgba(46,78,111,0.5)',
        padding: [5, 15, 5, 15],
        formatter: function(params) {
          const icon = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#bfbfbf;"></span>`;
          return `<span style="color:${params[0].color};font-weight: bold;">单位数：${
            comMap[params[0].dataIndex]
          }</span><br />${params[0].marker}风险点: ${params[0].data}<br />${icon}异常: ${
            params[1].data
          }`;
        },
      },
      yAxis: {
        type: 'value',
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgb(2,28,66)'],
            width: 2,
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: ['rgb(2,28,66)'],
            width: 2,
          },
        },
        axisLabel: {
          formatter: function(value, index) {
            if (parseInt(value, 10) !== value) return '';
            return parseInt(value, 10);
          },
        },
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              color: ['rgb(2,28,66)'],
              width: 2,
            },
          },
          axisLabel: {
            color: '#fff',
            fontSize: 14,
          },
          data: ['红', '橙', '黄', '蓝', '未评级'],
        },
        {
          type: 'category',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitArea: { show: false },
          splitLine: { show: false },
          data: ['红', '橙', '黄', '蓝', '未评级'],
        },
      ],
      series: [
        {
          name: '风险点',
          type: 'bar',
          xAxisIndex: 0,
          itemStyle: {
            normal: {
              show: true,
              borderWidth: 0,
              borderColor: '#333',
              color: function(params) {
                // build a color map as your need.
                return colorList[params.dataIndex];
              },
            },
          },
          barGap: '0%',
          barWidth: '36%',
          barCategoryGap: '50%',
          data: [red, orange, yellow, blue, not_rated],
        },
        {
          name: '异常',
          type: 'bar',
          xAxisIndex: 1,
          itemStyle: {
            normal: {
              show: true,
              borderWidth: 0,
              color: lightGray,
              borderColor: '#333',
            },
          },
          barGap: '0%',
          barWidth: '25%',
          barCategoryGap: '50%',
          data: [red_abnormal, orange_abnormal, yellow_abnormal, blue_abnormal, not_rated_abnormal],
        },
      ],
    };
    return option;
  }

  onHdAreaReadyCallback = chart => {
    if (!chart) return;
    let currentIndex = -1;
    const chartAnimate = () => {
      const dataLen = chart.getOption().series[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
      currentIndex = (currentIndex + 1) % dataLen;
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
      // 显示 tooltip
      chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
    };
    // chartAnimate();
    setInterval(() => {
      chartAnimate();
    }, 5000);

    chart.on('click', params => {
      const {
        dispatch,
        bigPlatform: {
          countDangerLocation: {
            red,
            red_abnormal,
            red_company,
            orange,
            orange_abnormal,
            orange_company,
            yellow,
            yellow_abnormal,
            yellow_company,
            blue,
            blue_abnormal,
            blue_company,
            not_rated,
            not_rated_abnormal,
            not_rated_company,
          },
        },
      } = this.props;
      const risks = [
        {
          risk: red,
          abnormal: red_abnormal,
          company: red_company,
        },
        {
          risk: orange,
          abnormal: orange_abnormal,
          company: orange_company,
        },
        {
          risk: yellow,
          abnormal: yellow_abnormal,
          company: yellow_company,
        },
        {
          risk: blue,
          abnormal: blue_abnormal,
          company: blue_company,
        },
        {
          risk: not_rated,
          abnormal: not_rated_abnormal,
          company: not_rated_company,
        },
      ];
      dispatch({
        type: 'bigPlatform/fetchDangerLocationCompanyData',
        payload: {
          riskLevel: params.dataIndex + 1,
        },
      });
      this.goComponent('riskColors');
      this.setState({
        // riskColorTitle: riskTitles[params.dataIndex],
        riskColorSummary: {
          riskColorTitle: riskTitles[params.dataIndex],
          risk: risks[params.dataIndex].risk,
          abnormal: risks[params.dataIndex].abnormal,
          company: risks[params.dataIndex].company,
        },
      });
    });
  };

  getHdPieOption() {
    const {
      bigPlatform: {
        listForMap: { overRectifyNum, rectifyNum, reviewNum, total: hdTotal },
      },
    } = this.props;
    const option = {
      title: {
        text: hdTotal,
        left: 'center',
        top: '39%',
        textStyle: {
          color: '#fff',
          fontSize: 22,
        },
        subtext: '总数',
        subtextStyle: {
          color: '#fff',
          fontSize: 14,
        },
      },
      color: ['#f6b54e', '#2a8bd5', '#e86767'],
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              // position: 'center',
              formatter: '{b}\n{number|{c}}',
              rich: {
                number: {
                  fontSize: 22,
                  color: '#fff',
                  align: 'center',
                },
              },
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: 14,
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          data: [
            { value: rectifyNum, name: '未超期' },
            { value: reviewNum, name: '待复查' },
            { value: overRectifyNum, name: '已超期' },
          ],
        },
      ],
    };
    return option;
  }

  onHdPieReadyCallback(chart) {
    if (!chart) return;
    let currentIndex = -1;
    const chartAnimate = () => {
      const dataLen = chart.getOption().series[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
      currentIndex = (currentIndex + 1) % dataLen;
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
    };
    // chartAnimate();
    setInterval(() => {
      chartAnimate();
    }, 5000);
  }

  goBack = section => {
    let obj = {};
    if (this.state.comInfo) {
      this.setState({
        infoWindowShow: false,
      });
      // return;
    }
    this.setState(sectionsVisible);
    setTimeout(() => {
      if (section) {
        obj[section] = true;
        this.setState({
          ...obj,
        });
      } else {
        this.setState({
          communityCom: true,
        });
      }
    }, 225);
  };

  // 返回已超期隐患
  goBackToOver = () => {
    this.setState({
      hdOverDetail: false,
    });
    setTimeout(() => {
      this.setState({
        overHd: true,
      });
    }, 225);
  };

  // 返回隐患单位统计
  goBackToHdCom = () => {
    this.setState({
      hiddenDanger: false,
    });
    setTimeout(() => {
      this.setState({
        hdCom: true,
      });
    }, 225);
  };

  goComponent = type => {
    // if (this.state[type] && type !== 'comInfo') return;
    const obj = {};
    obj[type] = true;
    this.setState(sectionsVisible);
    setTimeout(() => {
      this.setState({
        ...obj,
      });
    }, 225);
  };

  // 社区接入单位排名
  getRankBarOption = () => {
    const {
      bigPlatform: {
        newHomePage: { countGridCompany },
      },
    } = this.props;
    const rankArray = countGridCompany.slice(0, 5);
    const xdata = [],
      ydata = [];
    rankArray.forEach((item, index) => {
      if (item.total_num === 0) return false;
      xdata.push(item.grid_name);
      ydata.push(item.total_num);
    });
    xdata.reverse();
    ydata.reverse();
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(46,78,111,0.5)',
            opacity: 0.6,
          },
        },
        backgroundColor: 'rgba(46,78,111,0.5)',
        padding: [5, 15, 5, 15],
      },
      color: ['#00a8ff'],
      grid: {
        top: '10px',
        left: '25px',
        right: '20%',
        bottom: '20px',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLine: {
          show: false,
          lineStyle: {
            color: ['rgb(2,28,66)'],
            width: 2,
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: xdata,
        axisLabel: {
          formatter: function(value, index) {
            const str = '{rank|' + (xdata.length - index) + '}';
            return str;
          },
          rich: {
            rank: {
              lineHeight: 20,
              align: 'center',
              verticalAlign: 'middle',
              backgroundColor: '#033569',
              color: '#fff',
              width: 20,
              height: 20,
              borderRadius: 50,
            },
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: ['rgb(2,28,66)'],
            width: 2,
          },
        },
      },
      series: [
        {
          name: '接入单位数',
          type: 'bar',
          barWidth: '36%',
          data: ydata,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}  {c}',
            color: '#fff',
          },
        },
      ],
    };
    return option;
  };

  goCompany = company_id => {
    window.open(`${window.publicPath}#/big-platform/safety/company/${company_id}`, `_blank`);
  };

  handleSearchSelect = ({ latitude, longitude, id }) => {
    this.setState({
      center: [longitude, latitude],
    });
    if (this.mapInstance) {
      this.mapInstance.setZoom(18);
    }
    this.handleIconClick({ latitude, longitude, id });
  };

  switchStatus = status => {
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

  showTooltip = (e, name) => {
    const offset = e.target.getBoundingClientRect();
    this.setState({
      tooltipName: name,
      tooltipVisible: true,
      tooltipPosition: [offset.left, offset.top],
    });
  };

  hideTooltip = () => {
    this.setState({
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
    });
  };

  handleInputChange = (value, { props: { label } }) => {
    this.debouncedFetchData(value);
    this.setState({
      searchValue: value,
    });
  };

  fetchData = value => {
    this.props.dispatch({
      type: 'bigPlatformSafetyCompany/fetchSelectList',
      payload: {
        name: value,
      },
      callback: () => {},
    });

    this.setState({
      value: value,
    });
  };

  render() {
    const {
      scrollNodeTop,
      communityCom,
      companyIn,
      fullStaff,
      overHd,
      hdCom,
      comInfo,
      riskColors,
      hdOverDetail,
      safetyGovernmentTitle,
      riskColorSummary,
      center,
      zoom,
      companyId,
      hiddenDanger,
      infoWindow,
      tooltipVisible,
      tooltipName,
      tooltipPosition,
      infoWindowShow,
      checks,
      companyOver,
      dangerCompanyData,
      dangerCompanyLast,
      checksMonth,
      riskOver,
    } = this.state;
    const {
      dispatch,
      bigPlatform: {
        newHomePage: {
          // companyDto: { company_num_with_item },
          companyLevelDto,
          countGridCompany,
        },
        listForMap: {
          overRectifyNum,
          rectifyNum,
          reviewNum,
          dangerCompany,
          total: riskTotal,
          overCheck,
        },
        govFulltimeWorkerList: { total: fulltimeWorker, list: fulltimeWorkerList },
        overRectifyCompany,
        searchAllCompany: { dataImportant, dataUnimportantCompany },
        hiddenDangerListByDate: { ycq = [], wcq = [], dfc = [] },
        dangerLocationCompanyData,
        location,
        checkInfo,
        hiddenDangerCompanyAll,
        hiddenDangerCompanyMonth,
        hiddenDangerCompanyUser,
        hiddenDangerOverTime,
        checkedCompanyInfo,
        hiddenDangerListByDate,
        selectOvertimeItemNum,
        overtimeUncheckedCompany,
      },
    } = this.props;

    // rotate.in 显示 , rotate.out 不显示
    const stylesCommunityCom = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: communityCom,
      [rotate.out]: !communityCom,
    });
    const stylesComIn = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: companyIn,
      [rotate.out]: !companyIn,
    });

    const stylesComInfo = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: comInfo,
      [rotate.out]: !comInfo,
    });

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

          hiddenDangers: riskDetailList2,
        },
        isImportant,
        total: hiddenDangerOver,
      },
      // 特种设备总数
      specialEquipment,
      // 已超期隐患总数
      // hiddenDanger: hiddenDangerOver,
    } = this.props.bigPlatform;

    return (
      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <span>{safetyGovernmentTitle}</span>
          <div className={styles.subHeader}>
            <Timer />
          </div>
        </header>

        <article className={styles.mainBody}>
          <Row gutter={12} className={styles.heightFull}>
            <Col span={6} className={styles.heightFull}>
              <section className={styles.sectionWrapper} style={{ height: 'calc(50% - 6px)' }}>
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    风险点统计
                  </div>
                  <div
                    className={styles.sectionMain}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <div className={styles.hdArea} id="hdArea">
                      <ReactEcharts
                        option={this.getHdBarOption()}
                        style={{ height: '100%', width: '100%' }}
                        className="echarts-for-echarts"
                        onChartReady={this.onHdAreaReadyCallback}
                      />
                    </div>
                    <div className={styles.hdBarLegend}>
                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#fc1f02' }}
                        />
                        红色风险点
                        <span style={{ opacity: 0 }}>点</span>
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#ed7e12' }}
                        />
                        橙色风险点
                        <span style={{ opacity: 0 }}>点</span>
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#fbf719' }}
                        />
                        黄色风险点
                        <span style={{ opacity: 0 }}>点</span>
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#1e60ff' }}
                        />
                        蓝色风险点
                        <span style={{ opacity: 0 }}>点</span>
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#4f6793' }}
                        />
                        未评级风险点
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#bfbfbf' }}
                        />
                        异常状态
                        <span style={{ opacity: 0 }}>点点</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className={styles.sectionWrapper}
                style={{ height: 'calc(50% - 6px)', marginTop: '12px' }}
              >
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    隐患统计
                  </div>
                  <div
                    className={styles.hdCompany}
                    onClick={() => {
                      dispatch({
                        type: 'bigPlatform/fetchHiddenDangerCompany',
                      });
                      this.setState({
                        dangerCompanyData: hiddenDangerCompanyAll,
                        dangerCompanyLast: '',
                      });
                      this.goComponent('hdCom');
                    }}
                  >
                    隐患单位
                    <span className={styles.hdCompanyNum} style={{ color: '#00baff' }}>
                      {hiddenDangerCompanyAll.dangerCompanyNum || 0}
                    </span>
                  </div>
                  <div
                    className={styles.sectionMain}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <div className={styles.hdPie} id="hdPie" style={{ flex: 1 }}>
                      <ReactEcharts
                        option={this.getHdPieOption()}
                        style={{ height: '100%', width: '100%' }}
                        className="echarts-for-echarts"
                        onChartReady={this.onHdPieReadyCallback}
                      />
                    </div>
                    <div className={styles.hdPieLegend}>
                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#f6b54e' }}
                        />
                        未超期
                        <span className={styles.legendNum}>{rectifyNum}</span>
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#2a8bd5' }}
                        />
                        待复查
                        <span className={styles.legendNum}>{reviewNum}</span>
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#e86767' }}
                        />
                        已超期
                        <span className={styles.legendNum}>{overRectifyNum}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Col>
            <Col
              span={12}
              className={styles.heightFull}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <section className={styles.sectionWrapper} style={{ height: 'auto' }}>
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionMain} style={{ border: 'none' }}>
                    <div className={styles.topData}>
                      <div className={styles.topItem}>
                        <Tooltip placement="bottom" title={'接入平台的单位总数'}>
                          <div
                            className={styles.itemActive}
                            onClick={() => {
                              this.goComponent('companyIn');
                            }}
                          >
                            {/* <div className={styles.itemActive}> */}
                            <div className={styles.topName}>重点/所有单位</div>
                            <div className={styles.topNum} style={{ color: '#00baff' }}>
                              {dataImportant.length}/
                              {dataImportant.length + dataUnimportantCompany.length}
                            </div>
                          </div>
                        </Tooltip>
                      </div>

                      <div className={styles.topItem}>
                        <Tooltip placement="bottom" title={'网格员、政府监管员'}>
                          <div
                            className={styles.itemActive}
                            onClick={() => {
                              this.goComponent('fullStaff');
                            }}
                          >
                            <div className={styles.topName}>专职人员</div>
                            <div className={styles.topNum} style={{ color: '#00baff' }}>
                              {fulltimeWorker}
                            </div>
                          </div>
                        </Tooltip>
                      </div>

                      <div className={styles.topItem}>
                        <Tooltip placement="bottom" title={'已超期隐患数量'}>
                          <div
                            className={styles.itemActive}
                            onClick={() => {
                              this.goComponent('overHd');
                            }}
                          >
                            <div className={styles.topName}>已超期隐患</div>
                            <div className={styles.topNum} style={{ color: '#e86767' }}>
                              {overRectifyNum}
                            </div>
                          </div>
                        </Tooltip>
                      </div>

                      <div className={styles.topItem}>
                        <Tooltip placement="bottom" title={'已超时风险点数量'}>
                          <div
                            className={styles.itemActive}
                            onClick={() => {
                              this.goComponent('riskOver');
                            }}
                          >
                            <div className={styles.topName}>已超时风险点</div>
                            <div className={styles.topNum} style={{ color: '#e86767' }}>
                              {selectOvertimeItemNum}
                            </div>
                          </div>
                        </Tooltip>
                      </div>

                      <div className={styles.topItem}>
                        <Tooltip placement="bottom" title={'本月监督检查的数量'}>
                          <div
                            className={styles.itemActive}
                            onClick={() => {
                              this.goComponent('checks');
                            }}
                          >
                            <div className={styles.topName}>本月监督检查</div>
                            <div className={styles.topNum} style={{ color: '#e86767' }}>
                              {checkedCompanyInfo.checked}
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.sectionWrapper} style={{ marginTop: '12px', flex: 1 }}>
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionMain} style={{ border: 'none' }}>
                    <MapSection
                      dispatch={dispatch}
                      locData={location}
                      zoom={zoom}
                      center={center}
                      handleIconClick={this.handleIconClick}
                      infoWindow={infoWindow}
                      infoWindowShow={infoWindowShow}
                      companyLevelDto={companyLevelDto}
                      goBack={this.goBack}
                      comInfo={comInfo}
                      showTooltip={this.showTooltip}
                      hideTooltip={this.hideTooltip}
                      handleHideInfoWindow={this.handleHideInfoWindow}
                    />
                  </div>
                </div>
              </section>
            </Col>

            <Col span={6} className={styles.heightFull} style={{ position: 'relative' }}>
              <section
                className={stylesCommunityCom}
                style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
              >
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    社区接入单位数
                  </div>
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.summaryWrapper}>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryIconCommunity} />
                          社区总数量
                          <span className={styles.summaryNum}>{countGridCompany.length}</span>
                        </div>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryIconCom} />
                          单位数量
                          <span className={styles.summaryNum}>
                            {(dataImportant, length + dataUnimportantCompany.length)}
                          </span>
                        </div>
                      </div>

                      <div className={styles.tableTitleWrapper} style={{ borderBottom: 'none' }}>
                        <span className={styles.tableTitle}>社区接入单位排名</span>
                      </div>

                      <div className={styles.rankBar} id="rankBar">
                        <ReactEcharts
                          option={this.getRankBarOption()}
                          style={{ height: '100%', width: '100%' }}
                          className="echarts-for-echarts"
                        />
                      </div>

                      <div className={styles.tableTitleWrapper}>
                        <span className={styles.tableTitle}>社区接入单位详情</span>
                      </div>

                      <table className={styles.thFix}>
                        <thead>
                          <tr>
                            <th style={{ width: '50%' }}>社区</th>
                            <th style={{ width: '50%' }}>接入单位数</th>
                          </tr>
                        </thead>
                      </table>

                      <div className={styles.scrollWrapper} ref={node => (this.scrollNode = node)}>
                        <div className={styles.tableWrapper} style={{ marginTop: -scrollNodeTop }}>
                          <table className={styles.safeTable}>
                            <tbody>{this.renderTable()}</tbody>
                          </table>

                          <table className={styles.safeTable} ref={node => (this.tableNode = node)}>
                            <tbody>{this.renderTable()}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className={stylesComInfo}
                style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
              >
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    单位概况
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      this.goBack();
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.companyMain}>
                        <div className={styles.companyIcon} />
                        <div className={styles.companyInfo}>
                          <div
                            className={styles.companyName}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              this.goCompany(companyId);
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
                          {isImportant && (
                            <div className={styles.importantUnit}>
                              <img src={importantIcon} alt="重点单位" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.summaryBottom}>
                        <Row gutter={6}>
                          <Col span={12} className={styles.summaryHalf}>
                            <div className={styles.summaryRisk} />
                            <div className={styles.summaryText}>
                              <span className={styles.fieldName}>风险点</span>
                            </div>
                            <div className={styles.summaryNum}>{countCheckItem}</div>
                          </Col>

                          <Col span={12} className={styles.summaryHalf}>
                            <div className={styles.summarySpecial} />
                            <div className={styles.summaryText}>
                              <span className={styles.fieldName}>特种设备</span>
                            </div>
                            <div className={styles.summaryNum}>{specialEquipment}</div>
                          </Col>

                          <Col span={12} className={styles.summaryHalf}>
                            <div className={styles.summaryOver} />
                            <div className={styles.summaryText}>
                              <span className={styles.fieldName}>已超期隐患</span>
                            </div>
                            <div className={styles.summaryNum}>{hiddenDangerOver}</div>
                          </Col>
                        </Row>
                      </div>

                      <div className={styles.tableTitleWrapper} style={{ borderBottom: 'none' }}>
                        <span className={styles.tableTitle}>
                          风险点隐患（
                          {ycq.length + wcq.length + dfc.length}）
                        </span>
                      </div>

                      <div className={styles.scrollContainer} id="companyRisk">
                        <CompanyRisk hiddenDangerListByDate={hiddenDangerListByDate} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* const sectionsVisible = {
                communityCom: false, // 社区接入单位数
                companyIn: false, // 接入单位统计
                fullStaff: false, // 专职人员统计
                overHd: false, // 已超期隐患单位
                hdCom: false, // 隐患单位统计
                comInfo: false, // 企业信息
                riskColors: false, // 风险点
                hdOverDetail: false, // 已超期隐患详情
                hiddenDanger: false, // 隐患详情
                checks: false, // 监督检查
                companyOver: false, // 已超时单位
              }; */}

              {/* 单位统计 */}
              <CompanyIn
                visible={companyIn}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                dataImportant={dataImportant}
                dataUnimportantCompany={dataUnimportantCompany}
              />

              {/* 风险点 */}
              <FullStaff
                visible={fullStaff}
                dispatch={dispatch}
                goBack={this.goBack}
                goComponent={this.goComponent}
                listData={fulltimeWorkerList}
                fulltimeWorker={fulltimeWorker}
              />

              {/* 风险点 */}
              <RiskColors
                visible={riskColors}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                goComponent={this.goComponent}
                listData={dangerLocationCompanyData}
                riskColorSummary={riskColorSummary}
              />

              {/* 已超期隐患单位 */}
              <HdOverCompany
                visible={overHd}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                goComponent={this.goComponent}
                listData={overRectifyCompany}
                overRectifyNum={overRectifyNum}
              />

              {/* 单位超时未查 */}
              <RiskOver
                visible={riskOver}
                goBack={this.goBack}
                goCompany={this.goCompany}
                listData={overtimeUncheckedCompany}
                riskOverNum={selectOvertimeItemNum}
              />

              {/* 已超期隐患详情 */}
              <RiskDetailOver
                visible={hdOverDetail}
                goBack={this.goBack}
                hiddenDangerListByDate={hiddenDangerListByDate}
              />

              {/* 隐患详情 */}
              <RiskDetail
                visible={hiddenDanger}
                goBack={this.goBack}
                hiddenDangerListByDate={hiddenDangerListByDate}
              />

              {/* 隐患单位统计 */}
              <DangerCompany
                data={dangerCompanyData}
                visible={hdCom}
                dispatch={dispatch}
                goBack={this.goBack}
                goComponent={this.goComponent}
                goCompany={this.goCompany}
                monthSelecter={false}
                lastSection={dangerCompanyLast}
                month={checksMonth}
                // monthSelecter={hdComMonth}
              />

              {/* 监督检查 */}
              <CheckInfo
                dispatch={dispatch}
                visible={checks}
                listData={checkInfo}
                checkedCompanyInfo={checkedCompanyInfo}
                dangerCompany={hiddenDangerCompanyMonth}
                dangerCompanyOver={hiddenDangerOverTime}
                goBack={this.goBack}
                goComponent={this.goComponent}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
                fetchCheckMsgs={this.fetchCheckMsgs}
              />

              {/* 已超时单位 */}
              <CompanyOver
                visible={companyOver}
                listData={hiddenDangerOverTime}
                goBack={this.goBack}
                goComponent={this.goComponent}
                goCompany={this.goCompany}
              />
            </Col>
          </Row>
        </article>
        <MyTooltip
          visible={tooltipVisible}
          title={tooltipName}
          position={tooltipPosition}
          offset={[10, 30]}
        />
      </div>
    );
  }
}

export default GovernmentBigPlatform;
