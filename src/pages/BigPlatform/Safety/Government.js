import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import { Link } from 'dva/router';
import styles from './Government.less';
import Bar from './Components/Bar';
import Timer from './Components/Timer';

import { DataView } from '@antv/data-set';
import { Map as GDMap, Marker, InfoWindow } from 'react-amap';
import { Chart, Axis, Tooltip, Geom, Shape, Coord, Label, View } from "bizcharts";

@connect(({ bigPlatform }) => ({
  bigPlatform,
}))
class GovernmentBigPlatform extends React.PureComponent {
  state = {
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
    pieHeight: 1,
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

    dispatch({
      type: 'bigPlatform/fetchLocationCenter',
    });

    dispatch({
      type: 'bigPlatform/fetchLocation',
    });

    dispatch({
      type: 'bigPlatform/fetchNewHomePage',
      payload: {
        month: moment().format('YYYY-MM'),
      },
    });

    // requestAnimationFrame(this.resolveAnimationFrame);

    this.handleScroll();

    window.addEventListener('resize', ()=>{
      this.debounce(this.reDoChart(), 300)
    });

    window.onload = () => {
      this.reDoChart();
    };

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
    vp.content = "width=device-width, initial-scale=" + sca
      + ", maximum-scale=" + sca + ", minimum-scale=" + sca + ", user-scalable=no";
  };

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
  }

  debounce = (action, delay)=> {
    var timer = null;
    return function() {
        const self = this;
        const args = arguments;

        clearTimeout(timer);
        timer = setTimeout(function() {
            action.apply(self, args)
        }, delay);
    }
  }

  reDoChart = () => {
    const areaHeight = document.getElementById('hdArea')?document.getElementById('hdArea').offsetHeight: 0;
    const pieHeight = document.getElementById('hdPie')?document.getElementById('hdPie').offsetHeight: 0;
    this.setState({
      areaHeight,
      pieHeight,
    });
  }

  handleScroll = () => {
    const speed = 50;
    // if (this.scrollNode.clientHeight >= this.tableNode.scrollHeight) return;

    let timer = window.setInterval(() => {
      this.scrollup(this.scrollNode);
    }, speed);

    this.scrollNode.onmouseover = () => {
      //清除定时器
      clearInterval(timer);
    }

    this.scrollNode.onmouseout = () => {
      //添加定时器
      timer = window.setInterval(() => {
        this.scrollup(this.scrollNode);
      }, speed);
    }
  }

  scrollup = (scroll) => {
    //如果scroll滚上去的高度大于scroll1的高度，scrollTop = 0
    if (!scroll) return;
    if (scroll.scrollTop >= scroll.scrollHeight / 2) {
      scroll.scrollTop = 0;
    } else {
      scroll.scrollTop++;
    }
  }

  renderBarChart = () => {
    Shape.registerShape('interval', 'triangle', {
      getPoints(cfg) {
        const x = cfg.x;
        const y = cfg.y;
        const y0 = cfg.y0;
        const width = cfg.size;
        return [{ x: x - width / 2, y: y0 }, { x: x, y: y }, { x: x + width / 2, y: y0 }];
      },
      drawShape(cfg, group) {
        // 自定义最终绘制
        const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
        const value = cfg.origin._origin.value;
        group.addShape('text', {
          attrs: {
            text: value,
            textAlign: 'center',
            x: points[1].x,
            y: points[1].y,
            fontSize: 12,
            fill: '#fff',
          },
        });
        const polygon = group.addShape('polygon', {
          attrs: {
            points: [
              [points[0].x, points[0].y],
              [points[1].x, points[1].y],
              [points[2].x, points[2].y],
            ],
            fill: cfg.color,
            opacity: 0.75,
          },
        });
        // 左半三角
        group.addShape('polygon', {
          attrs: {
            points: [
              [points[0].x, points[0].y],
              [points[1].x, points[1].y],
              [points[1].x, points[2].y],
            ],
            fill: cfg.color,
            opacity: 1,
          },
        });
        return polygon; // !必须返回 shape
      },
    });
    const data = [
      { name: '红', value: 10 },
      { name: '橙', value: 3 },
      { name: '黄', value: 3 },
      { name: '蓝', value: 2 },
    ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。

    return (
      <Chart height={300} data={data} forceFit padding={[25, 30, 45, 40]}>
        <Axis name="name" title={null} label={
          {
            textStyle: {
              fontSize: 12, // 文本大小
              textAlign: 'center', // 文本对齐方式
              fill: '#fff', // 文本颜色
            },
          }}
        />
        <Axis
          name="value"
          label={{
            textStyle: {
              fontSize: 12, // 文本大小
              textAlign: 'center', // 文本对齐方式
              fill: '#fff', // 文本颜色
            },
          }}
        />
        <Tooltip />
        <Geom
          type="interval"
          position="name*value"
          color={['name', ['#e86767', '#ff6028', '#f6b54e', '#2a8bd5']]}
          shape="triangle"
        />
      </Chart>
    );
  };

  renderPieChart = () => {
    // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
    const sliceNumber = 0.015;

    let { bigPlatform: { listForMap: {
      gridCheck,
      overRectifyNum,
      photo,
      rectifyNum,
      reviewNum,
      selfCheck,
    } } } = this.props;
    // 自定义 other 的图形，增加两条线
    Shape.registerShape('interval', 'sliceShape', {
      draw: function draw(cfg, container) {
        var points = cfg.points;
        var path = [];
        path.push(['M', points[0].x, points[0].y]);
        path.push(['L', points[1].x, points[1].y - sliceNumber]);
        path.push(['L', points[2].x, points[2].y - sliceNumber]);
        path.push(['L', points[3].x, points[3].y]);
        path.push('Z');
        path = this.parsePath(path);
        return container.addShape('path', {
          attrs: {
            fill: cfg.color,
            path: path,
          },
        });
      },
    });

    let outFake = false;
    let inFake = false;
    if (overRectifyNum === 0 && reviewNum === 0 && rectifyNum === 0) {
      outFake = true;
      overRectifyNum = 1;
      reviewNum = 1;
      rectifyNum = 1;
    }
    if (gridCheck === 0 && selfCheck === 0 && photo === 0) {
      inFake = true;
      gridCheck = 1;
      selfCheck = 1;
      photo = 1;
    }
    const dataOut = [
      { name: '已超期', value: overRectifyNum },
      { name: '待复查', value: reviewNum },
      { name: '未超期', value: rectifyNum },
    ];

    const dataIn = [
      { name: '网格点', value: gridCheck },
      { name: '风险点', value: selfCheck },
      { name: '随手拍', value: photo },
    ];

    const dvIn = new DataView();
    dvIn.source(dataIn).transform({
      type: 'percent',
      field: 'value',
      dimension: 'name',
      as: 'percent',
    });
    const dvOut = new DataView();
    dvOut.source(dataOut).transform({
      type: 'percent',
      field: 'value',
      dimension: 'name',
      as: 'percent',
    });
    const scale = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
      nice: false,
    }
    const {pieHeight} = this.state;
    return (
      <Chart height={pieHeight} data={dataOut} scale={scale} forceFit padding={[0]}>
        <Coord type="theta" radius={0.6} innerRadius={0.76} />
        <Tooltip showTitle={false}
        itemTpl='
          <li data-index={index}>
            <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
            {name}: {outFake ? 0: val}
          </li>'
        />
        <Geom
          type="intervalStack"
          position="value"
          color={["name", ['#e86767', '#2a8bd5', '#f6b54e', '#bbbbbc']]}
          shape="sliceShape"
        >
          <Label
            content='value'
            offset={25}
            textStyle={{
              textAlign: 'center', // 文本对齐方向，可取值为： start middle end
              fill: '#fff', // 文本的颜色
              fontSize: '12', // 文本大小
              fontWeight: 'bold', // 文本粗细
            }}
            formatter={(val, item) => {
              return `${item.point.name}\n${outFake ? 0: val}`;
            }} />
        </Geom>

        <View data={dataIn} >
          <Coord type='theta' radius={0.35} />
          <Tooltip showTitle={false}
          itemTpl='
            <li data-index={index}>
              <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
              {name}: {inFake ? 0: val}
            </li>'
          />
          <Geom
            type="intervalStack"
            position="value"
            color={["name", ['#f7f457', '#35c9c9', '#3e0ec6']]}
            select={false}
          >
          </Geom>
        </View>
      </Chart>
    );
  }

  renderCompanyMarker() {
    const { location } = this.props.bigPlatform;
    return location.map((company) => {
      const position = this.analysisPointData(company.location);
      const level = company.level;
      let offset = [-10, -10];
      if (level === 'A') {
        offset = [-13, -13];
      }
      return (
        <Marker
          position={{ longitude: position.longitude, latitude: position.latitude }}
          key={company.location}
          offset={offset}
          events={{
            click: this.handleCompanyLabel.bind(this, { longitude: position.longitude, latitude: position.latitude }),
          }}
        >
          {level === 'A' && (<img src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-red.svg" alt="" style={{ display: 'block', width: '26px', height: '26px' }} />)}
          {level === 'B' && (<img src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-orange2.png" alt="" style={{ display: 'block', width: '20px', height: '20px' }} />)}
          {level === 'C' && (<img src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-yel2.png" alt="" style={{ display: 'block', width: '20px', height: '20px' }} />)}
          {level === 'D' && (<img src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-blue2.png" alt="" style={{ display: 'block', width: '20px', height: '20px' }} />)}
        </Marker>
      );
    });
  }

  analysisPointData = (data) => {
    // POINT ()
    const str = data.substring(7, data.length - 1);
    const point = str.split(' ');
    return {
      longitude: point[0],
      latitude: point[1],
    };
  }

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
      <div className={styles.companyLabel}>
        <div>{infoWindow.company_name}</div>
        <div>等级：{infoWindow.level}</div>
        <div>地址：{infoWindow.address}</div>
      </div>
    );
  }

  handleCompanyLabel = (company) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bigPlatform/fetchInfoByLocation',
      payload: {
        location: `(${company.longitude} ${company.latitude})`,
      },
      success: (response) => {
        this.setState({
          label: company,
          infoWindow: response,
          infoWindowShow: true,
        });
      },
    });
  }

  handleHideLabel = () => {
    this.setState({
      infoWindowShow: false,
    });
  }

  renderTable = () => {
    const { bigPlatform: { newHomePage: { countGridCompany } } } = this.props;
    return countGridCompany.map((item) => {
      return (
        <Fragment key={item.grid_name}>
          <tr>
            <td>{item.grid_name}</td>
            <td>{item.total_num}</td>
          </tr>
        </Fragment>
      );
    })
  }

  render() {
    const { scrollNodeTop,areaHeight } = this.state;
    const { bigPlatform: { itemTotal,
      countDangerLocation: { total: hdPionts, red, orange, yellow, blue },
      newHomePage: { companyDto: { company_num_with_item }, companyLevelDto },
      listForMap: { gridCheck, overRectifyNum, photo, rectifyNum, reviewNum, selfCheck, total: hdTotal },
      locationCenter,
    } } = this.props;
    const salesData = [
      { name: '红', value: red },
      { name: '橙', value: orange },
      { name: '黄', value: yellow },
      { name: '蓝', value: blue },
    ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
    let Anum = 0, Bnum = 0, Cnum = 0, Dnum = 0;
    companyLevelDto.map(item => {
      if (item.level === 'A') Anum = item.num;
      if (item.level === 'B') Bnum = item.num;
      if (item.level === 'C') Cnum = item.num;
      if (item.level === 'D') Dnum = item.num;
    });

    const zoom = parseFloat(locationCenter.level);
    const center = [parseFloat(locationCenter.location.split(',')[0]), parseFloat(locationCenter.location.split(',')[1])];


    return (
      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <span>晶安智慧安全云平台</span>
          <div className={styles.subHeader}><Timer /></div>
        </header>

        <article className={styles.mainBody}>
          <Row gutter={24} className={styles.heightFull}>
            <Col span={6} className={styles.heightFull}>
              <section className={styles.sectionWrapper} style={{ height: 'calc(50% - 10px)' }}>
                <div className={styles.sectionTitle}>风险点统计</div>
                <div className={styles.sectionMain}>
                  <div className={styles.summaryBar}>
                    <span className={styles.spanHalf}>
                      风险点
                      <span className={styles.summaryNum} style={{ color: '#00baff' }}>
                        {hdPionts}
                      </span>
                    </span>
                    <span className={styles.spanHalf}>
                      未评级风险点
                      <span className={styles.summaryNum} style={{ color: '#e86767' }}>
                        {hdPionts - red - orange - yellow - blue}
                      </span>
                    </span>
                  </div>
                  <div
                    className={styles.sectionChart}
                    id="hdArea"
                    style={{ height: 'calc(100% - 60px)' }}
                  >
                    <Bar data={salesData} height={areaHeight} />
                  </div>
                </div>
              </section>

              <section
                className={styles.sectionWrapper}
                style={{ height: 'calc(50% - 10px)', marginTop: '20px' }}
              >
                <div className={styles.sectionTitle}>隐患统计</div>
                <div className={styles.sectionMain}>
                  <div className={styles.summaryBar}>
                    <span className={styles.spanHalf}>
                      隐患总数
                      <span className={styles.summaryNum} style={{ color: '#00baff' }}>
                        {hdTotal}
                      </span>
                    </span>
                  </div>
                  <div className={styles.sectionChart} id='hdPie' style={{ height: 'calc(100% - 60px)', width: '67%' }}>
                    {this.renderPieChart()}
                  </div>
                  <div className={styles.pieLegend}>
                    <div className={styles.hdTitle}>隐患状态</div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#e86767' }}></span>
                      已超期
                        <span className={styles.legendNum}>
                        {overRectifyNum}
                      </span>
                    </div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#2a8bd5' }}></span>
                      待复查
                        <span className={styles.legendNum}>
                        {reviewNum}
                      </span>
                    </div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#f6b54e' }}></span>
                      未超期
                        <span className={styles.legendNum}>
                        {rectifyNum}
                      </span>
                    </div>

                    <div className={styles.hdTitle}>隐患状态</div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#f7f457' }}></span>
                      网格点
                        <span className={styles.legendNum}>
                        {gridCheck}
                      </span>
                    </div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#35c9c9' }}></span>
                      风险点
                        <span className={styles.legendNum}>
                        {selfCheck}
                      </span>
                    </div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#3e0ec6' }}></span>
                      随手拍
                        <span className={styles.legendNum}>
                        {photo}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </Col>
            <Col span={12} className={styles.heightFull}>
              <section className={styles.sectionWrapper}>
                <div className={styles.sectionTitle} style={{ opacity: 0 }}>
                  地图
                </div>
                <div className={styles.sectionMain} style={{ border: 'none' }}>
                  <div className={styles.topData}>
                    <div className={styles.topItem}>
                      <div className={styles.topName}>接入企业</div>
                      <div className={styles.topNum}>
                        {company_num_with_item}
                      </div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>网格点</div>
                      <div className={styles.topNum} style={{ color: '#00baff' }}>
                        {itemTotal}
                      </div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>风险点</div>
                      <div className={styles.topNum} style={{ color: '#00baff' }}>
                        {hdPionts}
                      </div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>未超期隐患</div>
                      <div className={styles.topNum} style={{ color: '#f6b54e' }}>
                        {rectifyNum}
                      </div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>已超期隐患</div>
                      <div className={styles.topNum} style={{ color: '#e86767' }}>
                        {overRectifyNum}
                      </div>
                    </div>
                  </div>

                  <div className={styles.mapContainer}>
                    <GDMap
                      amapkey="71fbf192d766c9709e279589d6a8bede"
                      plugins={[{ name: 'Scale', options: { locate: false } }, { name: 'ToolBar', options: { locate: false } }]}
                      status={{
                        keyboardEnable: false,
                      }}
                      useAMapUI
                      mapStyle="amap://styles/79a9a32fda8686e79bb79c6e5fe48c2c"
                      center= {center}
                      zoom = {zoom}
                    >
                      {this.renderCompanyMarker()}
                      {this.renderInfoWindow()}
                    </GDMap>

                    <Row className={styles.mapLegend}>
                      <Col span={6}>
                        <span className={styles.dotRed}></span>
                        A类企业 （{Anum}）
                      </Col>
                      <Col span={6}>
                        <span className={styles.dotOrange}></span>
                        B类企业 （{Bnum}）
                      </Col>
                      <Col span={6}>
                        <span className={styles.dotYel}></span>
                        C类企业 （{Cnum}）
                      </Col>
                      <Col span={6}>
                        <span className={styles.dotBlue}></span>
                        D类企业 （{Dnum}）
                      </Col>
                    </Row>
                  </div>
                </div>
              </section>
            </Col>
            <Col span={6} className={styles.heightFull}>
              <section className={styles.sectionWrapper}>
                <div className={styles.sectionTitle}>社区接入企业数</div>
                <div className={styles.sectionMain} style={{ padding: '0 15px' }}>
                  <table className={styles.thFix}>
                    <thead>
                      <th style={{ width: '50%' }}>社区</th>
                      <th style={{ width: '50%' }}>接入企业数</th>
                    </thead>
                  </table>

                  <div className={styles.scrollWrapper} ref={node => this.scrollNode = node}>
                    <div className={styles.tableWrapper} style={{ marginTop: -scrollNodeTop }}>
                      <table className={styles.safeTable}>
                        <tbody>
                          {this.renderTable()}
                        </tbody>
                      </table>

                      <table className={styles.safeTable} ref={node => this.tableNode = node} >
                        <tbody>
                          {this.renderTable()}
                        </tbody>
                      </table>
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
