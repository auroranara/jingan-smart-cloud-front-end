import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import { Link } from 'dva/router';
import styles from './Government.less';
import Bar from './Bar';

import { DataView } from '@antv/data-set';
import { Map as GDMap, Marker, InfoWindow } from 'react-amap';
import { Chart, Axis, Tooltip, Geom, Shape, Coord, Label, View, Legend } from "bizcharts";

@connect(({ bigPlatform }) => ({
  bigPlatform,
}))
class GovernmentBigPlatform extends React.PureComponent {
  state = {
    time: '0000-00-00 星期一 00:00:00',
    scrollNodeTop: 0,
    label: {
      longitude: 120.366011,
      latitude: 31.544389,
    },
    infoWindowShow: false,
  };

  UNSAFE_componentWillUpdate() {
    // requestAnimationFrame(this.resolveAnimationFrame);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 1000);
    });

    this.timer = setInterval(() => {
      this.getTime();
    }, 1000);

    dispatch({
      type: 'bigPlatform/fetchItemList',
    });

    // requestAnimationFrame(this.resolveAnimationFrame);

    this.handleScroll();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.reqRef);
    clearInterval(this.timer);
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
  }

  handleScroll = () => {
    const speed = 50;
    if (this.scrollNode.clientHeight >= this.tableNode.scrollHeight) return;

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


  getTime = () => {
    const now = moment();
    const myday = now.weekday();
    const weekday = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

    const dayText = moment(now).format('YYYY-MM-DD');
    const timeText = moment(now).format('HH:mm:ss');

    this.setState({
      time: `${dayText}  ${weekday[myday]}  ${timeText}`,
    });
  };

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

    // document.getElementById('hdArea').clientHeight
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
    const dataOut = [
      { name: '已超期', value: 10 },
      { name: '待复查', value: 3 },
      { name: '未超期', value: 3 },
    ];

    const dataIn = [
      { name: '网格点', value: 7 },
      { name: '风险点', value: 3 },
      { name: '随手拍', value: 13 },
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
          console.log(val);

          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
      nice: false,
    }
    return (
      <Chart height={300} data={dataOut} scale={scale} forceFit padding={[0]}>
        <Coord type="theta" radius={0.6} innerRadius={0.76} />
        <Tooltip showTitle={false} />
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
              return item.point.name + '\n' + val;
            }} />
        </Geom>

        <View data={dataIn} >
          <Coord type='theta' radius={0.35} />
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
    // const { userList } = this.props.map;
    const companyList = [{ "level": "A", "location": "POINT (120.363731 31.585241)" }, { "level": "A", "location": "POINT (120.380086 31.573547)" }, { "level": "C", "location": "POINT (120.35291 31.573752)" }, { "level": "D", "location": "POINT (120.335564 31.577691)" }, { "level": "B", "location": "POINT (120.373663 31.56754)" }, { "level": "B", "location": "POINT (120.765802 31.701894)" }, { "level": "C", "location": "POINT (120.313246 31.593969)" }, { "level": "B", "location": "POINT (120.372652 31.569028)" }];
    return companyList.map((company) => {
      const position = this.analysisPointData(company.location);
      const level = company.level;
      return (
        <Marker
          position={{ longitude: position.longitude, latitude: position.latitude }}
          key={company.location}
          offset={[-10, -10]}
          events={{
            click: this.handleCompanyLabel.bind(this, { longitude: position.longitude, latitude: position.latitude }),
          }}
        >
          {level === 'A' && (<img src="http://p92lxg7ga.bkt.clouddn.com/icon-video.png" alt="" style={{ display: 'block', width: '20px', height: '20px' }} />)}
          {/* {level === 'A' && (<img src="../../static/img/BigPlatform/Government/dot-red.svg" alt="" style={{ display: 'block', width: '26px', height: '26px' }} />)} */}
          {level === 'B' && (<img src="../../static/img/BigPlatform/Government/dot-orange2.png" alt="" style={{ display: 'block', width: '20px', height: '20px' }} />)}
          {level === 'C' && (<img src="../../static/img/BigPlatform/Government/dot-yel2.png" alt="" style={{ display: 'block', width: '20px', height: '20px' }} />)}
          {level === 'D' && (<img src="../../static/img/BigPlatform/Government/dot-blue2.png" alt="" style={{ display: 'block', width: '20px', height: '20px' }} />)}
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
        {this.renderLabel(label)}
      </InfoWindow>
    );
  }

  renderLabel = (label) => {
    return (
      <div className={styles.companyLabel}>
        <div>company_name</div>
        <div>等级：level</div>
        <div>地址：address</div>
      </div>
    );
  }

  handleCompanyLabel = (company) => {
    this.setState({
      label: company,
      infoWindowShow: true,
    });
  }

  handleHideLabel = () => {
    this.setState({
      infoWindowShow: false,
    });
  }

  render() {
    const { time, scrollNodeTop } = this.state;
    const { itemTotal } = this.props;
    const salesData = [
      { name: '红', value: 10 },
      { name: '橙', value: 3 },
      { name: '黄', value: 3 },
      { name: '蓝', value: 2 },
    ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。

    return (
      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <span>晶安智慧安全云平台</span>
          <div className={styles.subHeader}>{time}</div>
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
                        {itemTotal}
                      </span>
                    </span>
                    <span className={styles.spanHalf}>
                      未评级风险点
                      <span className={styles.summaryNum} style={{ color: '#e86767' }}>
                        0
                      </span>
                    </span>
                  </div>
                  <div
                    className={styles.sectionChart}
                    id="hdArea"
                    style={{ height: 'calc(100% - 60px)' }}
                  >
                    <Bar data={salesData} />
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
                        0
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
                        <span className={styles.legendNum}>{0}</span>
                    </div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#2a8bd5' }}></span>
                      待复查
                        <span className={styles.legendNum}>{0}</span>
                    </div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#f6b54e' }}></span>
                      未超期
                        <span className={styles.legendNum}>{0}</span>
                    </div>

                    <div className={styles.hdTitle}>隐患状态</div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#f7f457' }}></span>
                      网格点
                        <span className={styles.legendNum}>{0}</span>
                    </div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#35c9c9' }}></span>
                      风险点
                        <span className={styles.legendNum}>{0}</span>
                    </div>
                    <div className={styles.hdLegend}>
                      <span className={styles.legendCircle} style={{ backgroundColor: '#3e0ec6' }}></span>
                      随手拍
                        <span className={styles.legendNum}>{0}</span>
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
                      <div className={styles.topNum}>0</div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>网格点</div>
                      <div className={styles.topNum} style={{ color: '#00baff' }}>
                        0
                      </div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>风险点</div>
                      <div className={styles.topNum} style={{ color: '#00baff' }}>
                        0
                      </div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>未超期隐患</div>
                      <div className={styles.topNum} style={{ color: '#f6b54e' }}>
                        0
                      </div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>已超期隐患</div>
                      <div className={styles.topNum} style={{ color: '#e86767' }}>
                        0
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
                    >
                      {this.renderCompanyMarker()}
                      {this.renderInfoWindow()}
                    </GDMap>

                    <Row className={styles.mapLegend}>
                      <Col span={6}>
                        <span className={styles.dotRed}></span>
                        A类企业 （{0}）
                      </Col>
                      <Col span={6}>
                        <span className={styles.dotOrange}></span>
                        B类企业 （{0}）
                      </Col>
                      <Col span={6}>
                        <span className={styles.dotYel}></span>
                        C类企业 （{0}）
                      </Col>
                      <Col span={6}>
                        <span className={styles.dotBlue}></span>
                        D类企业 （{0}）
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
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr><tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr><tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr><tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr><tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                        </tbody>
                      </table>

                      <table className={styles.safeTable} ref={node => this.tableNode = node} >
                        <tbody>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
                          <tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr><tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr><tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr><tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr><tr>
                            <td>淼泉居委</td>
                            <td>308</td>
                          </tr>
                          <tr>
                            <td>高长村</td>
                            <td>55</td>
                          </tr>
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
