import React from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
// import { Link } from 'dva/router';
import styles from './Government.less';

// import G2 from '@antv/g2';
import { DataView } from '@antv/data-set';
import { Map as GDMap, Marker, InfoWindow } from 'react-amap';
import { Chart, Axis, Tooltip, Geom, Shape, Coord, Label, View } from "bizcharts";

class GovernmentBigPlatform extends React.PureComponent {
  state = {
    time: '0000-00-00 星期一 00:00:00',
  };

  componentDidMount() {
    // setInterval(() => {
    //   this.getTime();
    // }, 1000);
    // this.renderBarChart();
    // this.renderPieChart();
  }

  getTime = () => {
    const now = moment();
    const myday = now.weekday();
    const weekday = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];

    const dayText = moment(now).format('YYYY-MM-DD');
    const timeText = moment(now).format('HH:mm:ss');

    this.setState({
      time: `${dayText}  ${weekday[myday]}  ${timeText}`,
    });
  }

  renderBarChart = () => {
    Shape.registerShape('interval', 'triangle', {
      getPoints(cfg) {
        const x = cfg.x;
        const y = cfg.y;
        const y0 = cfg.y0;
        const width = cfg.size;
        return [
          { x: x - width / 2, y: y0 },
          { x: x, y: y },
          { x: x + width / 2, y: y0 },
        ]
      },
      drawShape(cfg, group) { // 自定义最终绘制
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
          }
        } />
        <Axis name="value" label={
          {
            textStyle: {
              fontSize: 12, // 文本大小
              textAlign: 'center', // 文本对齐方式
              fill: '#fff', // 文本颜色
            },
          }
        } />
        <Tooltip />
        <Geom type="interval" position="name*value" color={['name', ['#e86767', '#ff6028', '#f6b54e', '#2a8bd5']]} shape='triangle' />
      </Chart>
    );
  }

  renderPieChart = () => {
    // const { DataView } = new View();
    // var _DataSet = DataSet,
    // const DataView = _DataSet.DataView;
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
      { name: '红', value: 10 },
      { name: '橙', value: 3 },
      { name: '黄', value: 3 },
      { name: '蓝', value: 2 },
    ];

    const dataIn = [
      { name: 'aa', value: 7 },
      { name: 'bb', value: 3 },
      { name: 'cc', value: 13 },
    ];

    const dvIn = new DataView();
    dvIn.source(dataIn).transform({
      type: 'percent',
      field: 'value',
      dimension: 'name',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
    }
    const dvOut = new DataView();
    dvOut.source(dataOut).transform({
      type: 'percent',
      field: 'value',
      dimension: 'name',
      as: 'percent',
    });

    return (
      <Chart height={300} data={dataOut} forceFit >
        <Coord type="theta" radius={0.9} innerRadius={0.8} />
        <Tooltip showTitle={false} />
        <Geom
          type="intervalStack"
          position="value"
          color={["name", ['#e86767', '#2a8bd5', '#f6b54e', '#bbbbbc']]}
          shape="sliceShape"
        >
        </Geom>

        <View data={dataIn} >
          <Coord type='theta' radius={0.6} />
          <Geom
            type="intervalStack"
            position="value"
            color={["name", ['#f7f457', '#35c9c9', '#3e0ec6']]}
          >
          </Geom>
        </View>
      </Chart>
    );
  }

  render() {
    const { time } = this.state;

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
                        <span className={styles.summaryNum} style={{ color: '#00baff' }}>0</span>
                    </span>
                    <span className={styles.spanHalf}>
                      未评级风险点
                        <span className={styles.summaryNum} style={{ color: '#e86767' }}>0</span>
                    </span>
                  </div>
                  <div className={styles.sectionChart} id='hdArea' style={{ height: 'calc(100% - 60px)' }}>
                    {this.renderBarChart()}
                  </div>
                </div>
              </section>

              <section className={styles.sectionWrapper} style={{ height: 'calc(50% - 10px)', marginTop: '20px' }}>
                <div className={styles.sectionTitle}>隐患统计</div>
                <div className={styles.sectionMain}>
                  <div className={styles.summaryBar}>
                    <span className={styles.spanHalf}>
                      隐患总数
                        <span className={styles.summaryNum} style={{ color: '#00baff' }}>0</span>
                    </span>
                  </div>
                  <div className={styles.sectionChart} id='hdPie' style={{ height: 'calc(100% - 60px)', width: '70%' }}>
                    {this.renderPieChart()}
                  </div>
                </div>
              </section>
            </Col>
            <Col span={12} className={styles.heightFull}>
              <section className={styles.sectionWrapper}>
                <div className={styles.sectionTitle} style={{ opacity: 0 }}>地图</div>
                <div className={styles.sectionMain} style={{ border: 'none' }}>
                  <div className={styles.topData}>
                    <div className={styles.topItem}>
                      <div className={styles.topName}>接入企业</div>
                      <div className={styles.topNum}>0</div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>网格点</div>
                      <div className={styles.topNum} style={{ color: '#00baff' }}>0</div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>风险点</div>
                      <div className={styles.topNum} style={{ color: '#00baff' }}>0</div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>未超期隐患</div>
                      <div className={styles.topNum} style={{ color: '#f6b54e' }}>0</div>
                    </div>

                    <div className={styles.topItem}>
                      <div className={styles.topName}>已超期隐患</div>
                      <div className={styles.topNum} style={{ color: '#e86767' }}>0</div>
                    </div>
                  </div>

                  <div className={styles.mapContainer}>
                    <GDMap
                      amapkey="71fbf192d766c9709e279589d6a8bede"
                      plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
                      status={{
                        keyboardEnable: false,
                      }}
                      useAMapUI
                      mapStyle="amap://styles/79a9a32fda8686e79bb79c6e5fe48c2c"
                    >
                    </GDMap>
                  </div>
                </div>
              </section>
            </Col>
            <Col span={6} className={styles.heightFull}>
              <section className={styles.sectionWrapper}>
                <div className={styles.sectionTitle}>社区接入企业数</div>
                <div className={styles.sectionMain} style={{ padding: '0 15px' }}>
                  <table className={styles.safeTable}>
                    {/* <thead>
                      <th style={{ width: '50%' }}>社区</th>
                      <th style={{ width: '50%' }}>接入企业数</th>
                    </thead> */}
                    <tbody>
                      <tr>
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
              </section>
            </Col>
          </Row>
        </article>
      </div>
    );
  }
}

export default GovernmentBigPlatform;
