import React, { Fragment, Component } from 'react';
import { Row, Col, Avatar, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import classNames from 'classnames';
import styles from './Government.less';
import rotate from './Animate.less';
import Timer from './Components/Timer';
import MapSearch from './Components/MapSearch';
import Ellipsis from '../../../components/Ellipsis';

import { Map as GDMap, Marker, InfoWindow } from 'react-amap';
import ReactEcharts from 'echarts-for-react';
import RiskDetail from './Components/RiskDetail';
import RiskDetailGov from './Components/RiskDetailGov';
/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
const descriptionBlueIcon = `${iconPrefix}description_blue.png`;
const descriptionRedIcon = `${iconPrefix}description_red.png`;
const ycqIcon = `${iconPrefix}ycq.png`;
const wcqIcon = `${iconPrefix}wcq.png`;
const dfcIcon = `${iconPrefix}dfc.png`;
const importantIcon = `${iconPrefix}important.png`;

// const statuses = ['未超期', '待复查', '已超期'];
// 字段名
const defaultFieldNames = {
  id: 'id',
  description: 'description',
  sbr: 'sbr',
  sbsj: 'sbsj',
  zgr: 'zgr',
  zgsj: 'zgsj',
  fcr: 'fcr',
  status: 'status',
  background: 'background',
};
// 获取图章
const getSeal = status => {
  switch (status) {
    case 1:
      return dfcIcon;
    case 2:
      return ycqIcon;
    default:
      return wcqIcon;
  }
};

const { location } = global.PROJECT_CONFIG;

@connect(({ bigPlatform }) => ({
  bigPlatform,
}))
class GovernmentBigPlatform extends Component {
  state = {
    safetyGovernmentTitle: global.PROJECT_CONFIG.safetyGovernmentTitle,
    scrollNodeTop: 0,
    label: {
      longitude: 120.366011,
      latitude: 31.544389,
    },
    infoWindowShow: false,
    infoWindow: {
      company_name: '',
      level: '',
      address: '',
    },
    areaHeight: 0,
    pieHeight: 0,
    center: [location.x, location.y],
    zoom: location.zoom,
    // 右侧显示
    communityCom: true, // 社区接入单位数
    comIn: false, // 接入单位统计
    keyCom: false, // 重点单位统计
    fullStaff: false, // 专职人员统计
    overHd: false, // 已超期隐患
    hdCom: false, // 隐患单位统计
    comInfo: false, // 企业信息
    companyId: '',
  };

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

    // setInterval(() => {
    //   const { communityCom, comIn } = this.state;
    //   if (communityCom) {
    //     this.setState({
    //       communityCom: !communityCom,
    //     });
    //     setTimeout(() => {
    //       this.setState({
    //         comIn: !comIn,
    //       });
    //     }, 225);
    //   } else {
    //     this.setState({
    //       comIn: !comIn,
    //     });
    //     setTimeout(() => {
    //       this.setState({
    //         communityCom: !communityCom,
    //       });
    //     }, 225);
    //   }
    // }, 3000);

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

    dispatch({
      type: 'bigPlatform/fetchNewHomePage',
      payload: {
        month: moment().format('YYYY-MM'),
      },
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

    // requestAnimationFrame(this.resolveAnimationFrame);

    this.handleScroll();

    this.setViewport();
  }

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

  renderCompanyMarker() {
    const { location } = this.props.bigPlatform;
    return location.map(company => {
      const position = this.analysisPointData(company.location);
      const level = company.level;
      let offset = [-10, -10];
      if (level === 'A') {
        offset = [-13, -13];
      }

      return (
        <Marker
          position={{ longitude: position.longitude, latitude: position.latitude }}
          key={company.company_id}
          offset={offset}
          events={{
            click: this.handleCompanyLabel.bind(this, {
              longitude: position.longitude,
              latitude: position.latitude,
              ...company,
            }),
          }}
        >
          {level === 'A' && (
            <img
              src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-red.svg"
              alt=""
              style={{ display: 'block', width: '26px', height: '26px' }}
            />
          )}
          {level === 'B' && (
            <img
              src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-orange2.png"
              alt=""
              style={{ display: 'block', width: '20px', height: '20px' }}
            />
          )}
          {level === 'C' && (
            <img
              src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-yel2.png"
              alt=""
              style={{ display: 'block', width: '20px', height: '20px' }}
            />
          )}
          {level === 'D' && (
            <img
              src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-blue2.png"
              alt=""
              style={{ display: 'block', width: '20px', height: '20px' }}
            />
          )}
        </Marker>
      );
    });
  }

  analysisPointData = data => {
    // POINT ()
    const str = data.substring(7, data.length - 1);
    const point = str.split(' ');
    return {
      longitude: point[0],
      latitude: point[1],
    };
  };

  /* 标注渲染 */
  renderInfoWindow() {
    const { label, infoWindowShow } = this.state;
    let position = null;
    position = {
      longitude: label.longitude,
      latitude: label.latitude,
    };
    return (
      <InfoWindow
        position={position}
        offset={[-5, -15]}
        isCustom={false}
        autoMove={false}
        visible={infoWindowShow}
        events={{ close: this.handleHideLabel }}
      >
        {this.renderLabel()}
      </InfoWindow>
    );
  }

  renderLabel = () => {
    const { infoWindow } = this.state;
    return (
      <div
        style={{ cursor: 'pointer' }}
        className={styles.companyLabel}
        onClick={() => {
          window.open(
            `/acloud_new/#/big-platform/safety/company/${infoWindow.company_id}`,
            '_blank'
          );
        }}
      >
        <div>{infoWindow.company_name}</div>
        <div>
          等级：
          {infoWindow.level}
        </div>
        <div>
          地址：
          {infoWindow.address}
        </div>
      </div>
    );
  };

  handleCompanyLabel = company => {
    const { dispatch } = this.props;
    const { companyId } = this.state;
    if (companyId === company.company_id) {
      this.goComponent('comInfo');
      return;
    }
    this.setState({
      companyId: company.company_id,
    });
    // 企业信息
    dispatch({
      type: 'bigPlatform/fetchCompanyMessage',
      payload: {
        company_id: company.company_id,
        month: moment().format('YYYY-MM'),
      },
      success: response => {
        // this.setState({
        //   label: company,
        //   infoWindow: response,
        //   infoWindowShow: true,
        // });
        this.goComponent('comInfo');
      },
    });
    // 特种设备
    dispatch({
      type: 'bigPlatform/fetchSpecialEquipment',
      payload: {
        company_id: company.company_id,
      },
    });
    // 风险点隐患
    dispatch({
      type: 'bigPlatform/fetchRiskDetail',
      payload: {
        company_id: company.company_id,
      },
    });
  };

  handleHideLabel = () => {
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
        },
      },
    } = this.props;
    const colorList = ['#e81c02', '#ea760a', '#e9e517', '#1a52d9'];
    const comMap = [red_company, orange_company, yellow_company, blue_company];
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
        },
        backgroundColor: 'rgba(46,78,111,0.5)',
        padding: [5, 15, 5, 15],
        borderColor: '#ccc',
        borderWidth: 1,
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
          },
          data: ['红', '橙', '黄', '蓝'],
        },
        {
          type: 'category',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitArea: { show: false },
          splitLine: { show: false },
          data: ['红', '橙', '黄', '蓝'],
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
          data: [red, orange, yellow, blue],
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
          data: [red_abnormal, orange_abnormal, yellow_abnormal, blue_abnormal],
        },
      ],
    };
    return option;
  }

  onHdAreaReadyCallback(chart) {
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
  }

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
        top: '41%',
        textStyle: {
          color: '#fff',
          fontSize: 18,
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
              formatter: '{b}\n{c}',
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

  goBack = () => {
    this.setState({
      comIn: false, // 接入单位统计
      keyCom: false, // 重点单位统计
      fullStaff: false, // 专职人员统计
      overHd: false, // 已超期隐患
      hdCom: false, // 隐患单位统计
      comInfo: false, // 企业信息
    });
    setTimeout(() => {
      this.setState({
        communityCom: true,
      });
    }, 225);
  };

  goComponent = type => {
    if (this.state[type]) return;
    const obj = {};
    obj[type] = true;
    this.setState({
      communityCom: false,
      comIn: false,
      keyCom: false,
      fullStaff: false,
      overHd: false,
      hdCom: false,
      comInfo: false,
    });
    setTimeout(() => {
      this.setState(obj);
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
        },
        backgroundColor: 'rgba(46,78,111,0.5)',
        padding: [5, 15, 5, 15],
        borderColor: '#ccc',
        borderWidth: 1,
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
    window.open(`/acloud_new/#/big-platform/safety/company/${company_id}`, `_blank`);
  };

  handleSelect = ({ latitude, longitude, id }) => {
    this.setState({
      center: [longitude, latitude],
      zoom: 18,
    });
    this.handleCompanyLabel({ company_id: id });
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

  renderComRisk = () => {
    const {
      bigPlatform: { riskDetailList },
    } = this.props;
    const riskDetailData = riskDetailList.map(
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
        status: this.switchStatus(status),
        background,
      })
    );
    const { id, description, sbr, sbsj, zgr, zgsj, fcr, status, background } = defaultFieldNames;
    return (
      <div>
        {riskDetailData.length !== 0 ? (
          riskDetailData.map(item => (
            <div
              key={item[id]}
              style={{
                position: 'relative',
                marginBottom: '12px',
                boxShadow: '3px 3px 3px #000',
                background: `rgba(1, 21, 57, 0.9) url(${getSeal(
                  item[status]
                )}) no-repeat right bottom / 120px`,
              }}
            >
              <div style={{ display: 'flex', padding: '12px 0' }}>
                <Avatar
                  style={{ margin: '0 10px' }}
                  src={item[status] === 2 ? descriptionRedIcon : descriptionBlueIcon}
                  size="small"
                />
                <Ellipsis
                  lines={1}
                  style={{
                    flex: 1,
                    color: item[status] === 2 ? '#ff4848' : '#fff',
                    fontSize: '16px',
                    lineHeight: '24px',
                  }}
                >
                  {item[description] || '暂无信息'}
                </Ellipsis>
              </div>
              <div style={{ display: 'flex', padding: '0 0 10px 6px' }}>
                <div
                  style={{
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '135px',
                    height: '180px',
                    backgroundColor: '#021C42',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img
                      src={item[background]}
                      alt=""
                      style={{ display: 'block', width: '100%' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 168, 255, 0.3)',
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      padding: '5px 0 5px 18px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      lineHeight: '24px',
                    }}
                  >
                    <span style={{ color: '#00A8FF' }}>上报：</span>
                    <Ellipsis lines={1} style={{ flex: 1, color: '#fff' }}>
                      <span style={{ marginRight: '20px' }}>{item[sbr]}</span>
                      {item[sbsj]}
                    </Ellipsis>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      padding: '5px 0 5px 18px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      lineHeight: '24px',
                    }}
                  >
                    <span style={{ color: '#00A8FF' }}>整改：</span>
                    <Ellipsis lines={1} style={{ flex: 1, color: '#fff', lineHeight: 1 }}>
                      <span style={{ marginRight: '20px' }}>{item[zgr]}</span>
                      {item[zgsj]}
                    </Ellipsis>
                  </div>
                  {item[status] === 1 && (
                    <div
                      style={{
                        display: 'flex',
                        padding: '5px 0 5px 18px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        lineHeight: '24px',
                      }}
                    >
                      <span style={{ color: '#00A8FF' }}>复查：</span>
                      <Ellipsis lines={1} style={{ flex: 1, color: '#fff' }}>
                        <span style={{ marginRight: '20px' }}>{item[fcr]}</span>
                      </Ellipsis>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#fff' }}>暂无隐患</div>
        )}
      </div>
      // <RiskDetailGov
      //   style={{
      //     height: '100%',
      //   }}
      //   data={riskDetailData}
      //   // onMouseEnter={this.handleMouseEnter}
      //   // onMouseLeave={this.handleMouseLeave}
      // />
    );
  };

  render() {
    const {
      scrollNodeTop,
      communityCom,
      comIn,
      keyCom,
      fullStaff,
      overHd,
      hdCom,
      comInfo,
      safetyGovernmentTitle,
    } = this.state;
    const {
      bigPlatform: {
        newHomePage: {
          companyDto: { company_num_with_item },
          companyLevelDto,
          countGridCompany,
        },
        listForMap: { overRectifyNum, rectifyNum, reviewNum, dangerCompany, total: riskTotal },
        govFulltimeWorkerList: { total: fulltimeWorker, list: fulltimeWorkerList },
        overRectifyCompany,
        searchAllCompany: { dataImportant, dataUnimportantCompany },
        riskDetailList,
      },
    } = this.props;

    let Anum = 0,
      Bnum = 0,
      Cnum = 0,
      Dnum = 0;
    companyLevelDto.map(item => {
      if (item.level === 'A') Anum = item.num;
      if (item.level === 'B') Bnum = item.num;
      if (item.level === 'C') Cnum = item.num;
      if (item.level === 'D') Dnum = item.num;
    });

    const { center, zoom } = this.state;

    // communityCom: true, // 社区接入单位数
    // comIn: false, // 接入单位统计
    // keyCom: false, // 重点单位统计
    // fullStaff: false, // 专职人员统计
    // overHd: false, // 已超期隐患
    // hdCom: false, // 隐患单位统计
    // rotate.in 显示 , rotate.out 不显示
    const stylesCommunityCom = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: communityCom,
      [rotate.out]: !communityCom,
    });
    const stylesComIn = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: comIn,
      [rotate.out]: !comIn,
    });
    const stylesKeyCom = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: keyCom,
      [rotate.out]: !keyCom,
    });
    const stylesFullStaff = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: fullStaff,
      [rotate.out]: !fullStaff,
    });
    const stylesOverHd = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: overHd,
      [rotate.out]: !overHd,
    });
    const stylesHdCom = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: hdCom,
      [rotate.out]: !hdCom,
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
        },
        isImportant,
      },
      // 特种设备总数
      specialEquipment,
      // 隐患总数
      hiddenDanger,
    } = this.props.bigPlatform;

    const { companyId } = this.state;
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
                      {/* <Bar data={salesData} height={areaHeight} /> */}
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
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#ed7e12' }}
                        />
                        橙色风险点
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#fbf719' }}
                        />
                        黄色风险点
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#1e60ff' }}
                        />
                        蓝色风险点
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#bfbfbf' }}
                        />
                        异常状态
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
                      this.goComponent('hdCom');
                    }}
                  >
                    隐患单位
                    <span className={styles.hdCompanyNum} style={{ color: '#00baff' }}>
                      {dangerCompany.length}
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
                          style={{ backgroundColor: '#fc1f02' }}
                        />
                        未超期
                        <span className={styles.legendNum}>{rectifyNum}</span>
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#ed7e12' }}
                        />
                        待复查
                        <span className={styles.legendNum}>{reviewNum}</span>
                      </div>

                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendIcon}
                          style={{ backgroundColor: '#fbf719' }}
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
                              this.goComponent('comIn');
                            }}
                          >
                            {/* <div className={styles.itemActive}> */}
                            <div className={styles.topName}>接入单位</div>
                            <div className={styles.topNum} style={{ color: '#00baff' }}>
                              {company_num_with_item}
                            </div>
                          </div>
                        </Tooltip>
                      </div>

                      <div className={styles.topItem}>
                        <Tooltip placement="bottom" title={'接入平台中重点单位数量'}>
                          <div
                            className={styles.itemActive}
                            onClick={() => {
                              this.goComponent('keyCom');
                            }}
                          >
                            <div className={styles.topName}>重点单位</div>
                            <div className={styles.topNum} style={{ color: '#00baff' }}>
                              {dataImportant.length}
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
                      <Tooltip placement="bottom" title={'截止当前所有已整改隐患数'}>
                        <div className={styles.topItem}>
                          <div className={styles.topName}>已整改隐患</div>
                          <div className={styles.topNum} style={{ color: '#fff' }}>
                            {rectifyNum}
                          </div>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.sectionWrapper} style={{ marginTop: '12px', flex: 1 }}>
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionMain} style={{ border: 'none' }}>
                    <div className={styles.mapContainer}>
                      <GDMap
                        amapkey="665bd904a802559d49a33335f1e4aa0d"
                        plugins={[
                          { name: 'Scale', options: { locate: false } },
                          { name: 'ToolBar', options: { locate: false } },
                        ]}
                        status={{
                          keyboardEnable: false,
                        }}
                        useAMapUI
                        mapStyle="amap://styles/88a73b344f8608540c84a2d7acd75f18"
                        center={center}
                        zoom={zoom}
                      >
                        {this.renderCompanyMarker()}
                        {this.renderInfoWindow()}
                      </GDMap>

                      <MapSearch
                        style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 666 }}
                        handleSelect={this.handleSelect}
                      />

                      <Row className={styles.mapLegend}>
                        <Col span={6}>
                          <span className={styles.dotRed} />
                          A类单位 （{Anum}）
                        </Col>
                        <Col span={6}>
                          <span className={styles.dotOrange} />
                          B类单位 （{Bnum}）
                        </Col>
                        <Col span={6}>
                          <span className={styles.dotYel} />
                          C类单位 （{Cnum}）
                        </Col>
                        <Col span={6}>
                          <span className={styles.dotBlue} />
                          D类单位 （{Dnum}）
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </section>
            </Col>

            <Col span={6} className={styles.heightFull} style={{ position: 'relative' }}>
              <section
                className={stylesComIn}
                style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
              >
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    接入单位统计
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      this.goBack();
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent} style={{ height: '50%' }}>
                      <div className={styles.tableTitleWrapper}>
                        <span className={styles.tableTitle}>
                          {' '}
                          重点单位（
                          {dataImportant.length}）
                        </span>
                      </div>
                      <div className={styles.scrollContainer}>
                        {dataImportant.map((item, index) => {
                          return (
                            <div
                              className={styles.scrollCol1}
                              onClick={() => {
                                this.goCompany(item.id);
                              }}
                            >
                              <span className={styles.scrollOrder}>{index + 1}</span>
                              {item.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className={styles.sectionContent} style={{ height: '50%' }}>
                      <div className={styles.tableTitleWrapper}>
                        <span className={styles.tableTitle}>
                          {' '}
                          非重点单位（
                          {dataUnimportantCompany.length}）
                        </span>
                      </div>
                      <div className={styles.scrollContainer}>
                        {dataUnimportantCompany.map((item, index) => {
                          return (
                            <div
                              className={styles.scrollCol1}
                              onClick={() => {
                                this.goCompany(item.id);
                              }}
                            >
                              <span className={styles.scrollOrder}>{index + 1}</span>
                              {item.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className={stylesKeyCom}
                style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
              >
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    重点单位统计
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      this.goBack();
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.tableTitleWrapper}>
                        <span className={styles.tableTitle}>
                          {' '}
                          重点单位（
                          {dataImportant.length}）
                        </span>
                      </div>
                      <div className={styles.scrollContainer}>
                        {dataImportant.map((item, index) => {
                          return (
                            <div
                              className={styles.scrollCol1}
                              onClick={() => {
                                this.goCompany(item.id);
                              }}
                            >
                              <span className={styles.scrollOrder}>{index + 1}</span>
                              {item.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className={stylesFullStaff}
                style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
              >
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    专职人员
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      this.goBack();
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.tableTitleWrapper}>
                        <span className={styles.tableTitle}>
                          {' '}
                          专职人员（
                          {fulltimeWorker}）
                        </span>
                      </div>
                      <div className={styles.scrollContainer}>
                        <table className={styles.scrollTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '54%' }}>姓名</th>
                              <th>电话</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fulltimeWorkerList.map((item, index) => {
                              return (
                                <tr>
                                  <td>
                                    <span className={styles.tableOrder}>{index + 1}</span>
                                    {item.user_name}
                                  </td>
                                  <td>{item.phone_number}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className={stylesOverHd}
                style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
              >
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    已超期隐患单位
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      this.goBack();
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.scrollContainer} style={{ borderTop: 'none' }}>
                        <table className={styles.scrollTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '38px' }} />
                              <th style={{ width: '74%' }}>
                                隐患单位（
                                {overRectifyCompany.length}）
                              </th>
                              <th>
                                隐患数（
                                {overRectifyNum}）
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {overRectifyCompany.map((item, index) => {
                              return (
                                <tr>
                                  <td style={{ textAlign: 'left', paddingLeft: '10px' }}>
                                    {index + 1}
                                  </td>
                                  <td>
                                    <span
                                      className={styles.cursorSpan}
                                      onClick={() => {
                                        this.goCompany(item.companyId);
                                      }}
                                    >
                                      {item.companyName}
                                    </span>
                                  </td>
                                  <td>{item.hiddenDangerCount}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className={stylesHdCom}
                style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
              >
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionTitle}>
                    <span className={styles.titleBlock} />
                    隐患单位统计
                  </div>
                  <div
                    className={styles.backBtn}
                    onClick={() => {
                      this.goBack();
                    }}
                  />
                  <div className={styles.sectionMain}>
                    <div className={styles.sectionContent}>
                      <div className={styles.summaryWrapper}>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryIconCom} />
                          单位数量
                          <span className={styles.summaryNum}>{dangerCompany.length}</span>
                        </div>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryIconHd} />
                          隐患数量
                          <span className={styles.summaryNum}>{riskTotal}</span>
                        </div>
                      </div>

                      <div className={styles.scrollContainer}>
                        <table className={styles.scrollTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '40px' }} />
                              <th style={{ width: '74%' }}>单位</th>
                              <th>隐患数</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dangerCompany.map(item => {
                              return (
                                <tr>
                                  <td>
                                    {item.company_type === '1' && (
                                      <span className={styles.keyComMark} />
                                    )}
                                  </td>
                                  <td>{item.name}</td>
                                  <td>{item.total_danger}</td>
                                </tr>
                              );
                            })}
                            {/* <tr>
                              <td>
                                <span className={styles.keyComMark} />
                                无锡晶安司
                              </td>
                              <td>131</td>
                            </tr>
                            <tr>
                              <td>
                                <span className={styles.keyComMark} />
                                无锡晶安智慧科技有限公司
                              </td>
                              <td>24</td>
                            </tr>
                            <tr>
                              <td>
                                <span className={styles.keyComMark} />
                                无锡晶安智慧科技有限公司
                              </td>
                              <td>45</td>
                            </tr>
                            <tr>
                              <td>无锡晶安智限公司</td>
                              <td>7</td>
                            </tr>
                            <tr>
                              <td>无锡晶安智慧科技有限公司</td>
                              <td>578</td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

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
                          <span className={styles.summaryNum}>{company_num_with_item}</span>
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
                          // onChartReady={this.onHdAreaReadyCallback}
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
                            <div className={styles.summaryNum}>{hiddenDanger}</div>
                          </Col>
                        </Row>
                      </div>

                      <div className={styles.tableTitleWrapper} style={{ borderBottom: 'none' }}>
                        <span className={styles.tableTitle}>
                          风险点隐患（
                          {riskDetailList.length}）
                        </span>
                      </div>

                      <div className={styles.scrollContainer}>{this.renderComRisk()}</div>
                    </div>
                  </div>
                </div>
              </section>
            </Col>
          </Row>
        </article>
      </div>
    );
  }
}

export default GovernmentBigPlatform;
