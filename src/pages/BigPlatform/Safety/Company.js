import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './Company.less';
import moment from 'moment';
import Timer from './Components/Timer';
import RiskImage from './Components/RiskImage.js';
import RiskPoint from './Components/RiskPoint.js';
import RiskInfo from './Components/RiskInfo.js';
import RiskDetail from './Components/RiskDetail.js';

import classNames from 'classnames';
import { DataView } from '@antv/data-set';
import { Chart, Axis, Tooltip, Geom, Coord, Label, Legend } from "bizcharts";

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const red = `${iconPrefix}red.png`
const orange = `${iconPrefix}orange.png`;
const yellow = `${iconPrefix}yellow.png`;
const blue = `${iconPrefix}blue.png`;
const sRed = `${iconPrefix}s_red.png`;
const sOrange = `${iconPrefix}s_orange.png`;
const sYellow = `${iconPrefix}s_yellow.png`;
const sBlue = `${iconPrefix}s_blue.png`;
const exception = `${iconPrefix}exception.png`;
const selected = `${iconPrefix}selected.png`;
const pointIcon = `${iconPrefix}point.png`;
const areaIcon = `${iconPrefix}area.png`;
const accidentTypeIcon = `${iconPrefix}accidentType.png`;
const riskLevelIcon = `${iconPrefix}riskLevel.png`;
const statusIcon = `${iconPrefix}status.png`;
// 选中高度
const selectedHeight = 135;
const selectedWidth = 63;
// 信息offset
const defaultInfoOffset = {
  x: 50,
  y: -selectedHeight - 50,
}
// 正常点的样式
const normalStyle = {
  width: 39,
  height: 40,
  zIndex: 9,
};
// 正常点的偏移
const normalOffset = {
  x: -2,
  y: 0,
};
// 选中点的样式
const selectedStyle = {
  width: 33,
  height: 40,
  zIndex: 8,
};
// 选中点的偏移
const selectedOffset = {
  x: 0,
  y: -selectedHeight,
};
// 点图标，0为正常，1为选中，2为异常
const pointImages = [
  [
    {
      src: red,
      style: normalStyle,
      offset: normalOffset,
    },
    {
      src: orange,
      style: normalStyle,
      offset: normalOffset,
    },
    {
      src: yellow,
      style: normalStyle,
      offset: normalOffset,
    },
    {
      src: blue,
      style: normalStyle,
      offset: normalOffset,
    },
  ],
  [
    {
      src: sRed,
      style: selectedStyle,
      offset: selectedOffset,
    },
    {
      src: sOrange,
      style: selectedStyle,
      offset: selectedOffset,
    },
    {
      src: sYellow,
      style: selectedStyle,
      offset: selectedOffset,
    },
    {
      src: sBlue,
      style: selectedStyle,
      offset: selectedOffset,
    },
  ],
  [
    {
      src: exception,
      style: normalStyle,
      offset: normalOffset,
    },
  ],
];
// 根据颜色筛选图片
const switchImageColor = (list, color) => {
  switch (color) {
    case '红':
      return list[0];
    case '橙':
      return list[1];
    case '黄':
      return list[2];
    default:
      return list[3];
  }
}
// 获取status
const switchStatus = (status) => {
  const value = +status;
  if (value === 1 || value === 2) {
    return 0;
  }
  else if (value === 3) {
    return 1;
  }
  else if (value === 7) {
    return 2;
  }
  else {
    return 0;
  }
};
// 获取颜色和status
const switchCheckStatus = (value = 0) => {
  switch (value) {
    case 1:
      return {
        color: '#E8292D',
        content: '异常',
      };
    case 2:
      return {
        color: '#794277',
        content: '待检查',
      };
    case 3:
      return {
        color: '#EF5150',
        content: '已超时',
      };
    default:
      return {
        color: '#20DE3A',
        content: '正常',
      };
  }
}

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
    };
    this.timer = null;
    this.points = [];
  }

  componentDidMount() {
    const { dispatch, match: { params: { companyId } } } = this.props;
    window.onload = () => {
      this.reDoChart();
    };

    setTimeout(() => {
      this.reDoChart();
    }, 2000);

    window.addEventListener('resize', () => {
      this.debounce(this.reDoChart(), 300)
    });

    dispatch({
      type: 'bigPlatform/fetchCompanyMessage',
      payload: {
        company_id: companyId,
        month: moment().format('YYYY-MM'),
      },
    });
    dispatch({
      type: 'bigPlatform/fetchSpecialEquipment',
      payload: {
        company_id: companyId,
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id: companyId,
        status: '1',
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id: companyId,
        status: '2',
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id: companyId,
        status: '3',
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id: companyId,
        status: '4',
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCountDangerLocationForCompany',
      payload: {
        company_id: companyId,
      },
    });
    // 获取风险点信息
    dispatch({
      type: 'bigPlatform/fetchRiskPointInfo',
      payload: {
        company_id: companyId,
      },
    });
    // 获取隐患详情
    dispatch({
      type: 'bigPlatform/fetchRiskDetail',
      payload: {
        company_id: companyId,
      },
    });
    // 获取隐患数量
    dispatch({
      type: 'bigPlatform/fetchHiddenDanger',
      payload: {
        company_id: companyId,
      },
    });

    this.setViewport();
  }

  componentDidUpdate() {
    const { selectedId } = this.state;
    if (selectedId === null) {
      // 默认选中第一个风险点
      this.points[0] && this.points[0].handleClick();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  /* 风险点点击事件 */
  handleClick = (id, index) => {
    const { selectedId } = this.state;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const { selectedIndex } = this.state;
      if (selectedIndex === this.points.length - 1) {
        this.points[0].handleClick();
      }
      else {
        this.points[selectedIndex + 1].handleClick();
      }
    }, 10000);
    if (selectedId === id) {
      return;
    }
    this.setState({
      selectedId: id,
      selectedIndex: index,
    });
  }

  handleMouseEnter = () => {
    clearTimeout(this.timer);
  }

  handleMouseLeave = () => {
    const { selectedIndex } = this.state;
    this.points[selectedIndex] && this.points[selectedIndex].handleClick();
  }

  setViewport() {
    const vp = document.querySelector('meta[name=viewport]');
    const sw = window.screen.width;
    const stand = 1920;
    const sca = sw / stand;
    vp.content = "width=device-width, initial-scale=" + sca
      + ", maximum-scale=" + sca + ", minimum-scale=" + sca + ", user-scalable=no";
  };

  debounce = (action, delay) => {
    let timer = null;
    return function () {
      const self = this;
      const args = arguments;

      clearTimeout(timer);
      timer = setTimeout(function () {
        action.apply(self, args)
      }, delay);
    }
  }

  reDoChart = () => {
    const pieHeight = document.getElementById('hdPie') ? document.getElementById('hdPie').offsetHeight : 0;
    const barHeight = document.getElementById('checkBar') ? document.getElementById('checkBar').offsetHeight : 0;
    this.setState({
      pieHeight,
      barHeight,
    });
  }

  renderBarChart = (dataBar) => {
    const dv = new DataView();
    dv.source(dataBar).transform({
      type: 'fold',
      fields: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], // 展开字段集
      key: '日', // key字段
      value: '次数', // value字段
    });
    const { barHeight } = this.state;
    return (
      <Chart height={barHeight} data={dv} forceFit padding={[35, 20, 35, 35]}>
        <Axis name="日" label={{
          textStyle: {
            fontSize: 12, // 文本大小
            textAlign: 'center', // 文本对齐方式
            fill: '#fff', // 文本颜色
          },
        }} />
        <Axis name="次数" label={{
          textStyle: {
            fontSize: 12, // 文本大小
            textAlign: 'center', // 文本对齐方式
            fill: '#fff', // 文本颜色
          },
        }} />
        <Legend position='top' marker='circle' textStyle={{
          fontSize: 12, // 文本大小
          fill: '#fff', // 文本颜色
        }} />
        <Tooltip />
        <Geom type='interval' opacity={1} position="日*次数" color={['name', ['#f9d678', '#58bafc']]} adjust={[{ type: 'dodge', marginRatio: 1 / 3 }]} />
      </Chart>
    );
  }

  renderPieChart = (dataPie) => {
    // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值

    // let { bigPlatform: { listForMap: {
    //   gridCheck,
    //   overRectifyNum,
    //   photo,
    //   rectifyNum,
    //   reviewNum,
    //   selfCheck,
    // } } } = this.props;

    let outFake = false;
    // if (overRectifyNum === 0 && reviewNum === 0 && rectifyNum === 0) {
    //   outFake = true;
    //   overRectifyNum = 1;
    //   reviewNum = 1;
    //   rectifyNum = 1;
    // }



    const dv = new DataView();
    dv.source(dataPie).transform({
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
    const { pieHeight } = this.state;
    return (
      <Chart height={pieHeight} data={dataPie} scale={scale} forceFit padding={[40]}>
        <Coord type="polar" />
        {/* <Tooltip showTitle={false}
        itemTpl='
          <li data-index={index}>
            <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
            {name}: {outFake ? 0: value}
          </li>'
        /> */}
        <Tooltip showTitle={false} />
        <Geom
          type="interval"
          position="name*value"
          color={["name", ['#c46d6b', '#d39945', '#cfc378', '#4d9ed8']]}
        >
          <Label
            content='name'
            textStyle={{
              textAlign: 'center', // 文本对齐方向，可取值为： start middle end
              fill: '#fff', // 文本的颜色
              fontSize: '12', // 文本大小
            }}
          />
        </Geom>
      </Chart>
    );
  }

  /* 风险四色图 */
  renderRiskFourColor() {
    const { bigPlatform: { companyMessage: { point: points, fourColorImg }, riskPointInfoList } } = this.props;
    const { selectedId } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '36px 0 10px' }}>
        <div style={{ height: '40px', lineHeight: '40px', paddingLeft: '15px', color: '#00A8FF', fontSize: '20px' }}>
          <div>安全风险四色图</div>
        </div>
        <RiskImage
          src={fourColorImg || ''}
          wrapperStyle={{
            flex: 1,
            height: `calc(100% - 72px)`,
          }}
        // perspective='30em'
        // rotate='45deg'
        >
          {points && points.map(({ itemId: id, yNum: y, xNum: x }, index) => {
            const info = riskPointInfoList.filter(({ hdLetterInfo: { itemId } }) => itemId === id)[0];
            if (info) {
              const position = { x, y };
              const { src, style, offset } = selectedId === id ? switchImageColor(pointImages[1], info.hdLetterInfo.riskLevelName.desc) : (+info.status !== 2 ? switchImageColor(pointImages[0], info.hdLetterInfo.riskLevelName.desc) : pointImages[2][1]);
              const infoData = [
                {
                  icon: pointIcon,
                  title: info.hdLetterInfo.pointName,
                  render: (title) => (<span style={{ fontSize: '16px' }}>{title}</span>),
                },
                {
                  icon: areaIcon,
                  title: info.hdLetterInfo.areaName,
                },
                {
                  icon: accidentTypeIcon,
                  title: info.hdLetterInfo.accidentTypeName,
                },
                {
                  icon: statusIcon,
                  title: info.hdLetterInfo.status,
                  render: (title) => { const { color, content } = switchCheckStatus(title - 1); return (<span style={{ color }}>{content}</span>) },
                },
                {
                  icon: riskLevelIcon,
                  title: info.hdLetterInfo.riskLevelName.desc,
                  render: (title) => (<span style={{ color: info.hdLetterInfo.riskLevelName.color }}>{title}</span>),
                },
              ];
              return (
                <Fragment key={id}>
                  <RiskPoint
                    position={position}
                    src={src}
                    style={style}
                    offset={offset}
                    onClick={(point) => { this.handleClick(id, index, point); }}
                    ref={(point) => { this.points[index] = point; }}
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
                      opacity: selectedId === id ? '1' : 0,
                    }}
                  />
                </Fragment>
              );
            }
            else {
              return null;
            }
          })}
        </RiskImage>
        <div style={{ display: 'flex', height: '24px', padding: '16px 0' }}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', marginRight: '4px', width: '16px', height: '16px', backgroundColor: '#BF6C6E' }} />
            <span>重大风险</span>
          </div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', marginRight: '4px', width: '16px', height: '16px', backgroundColor: '#CC964B' }} />
            <span>较大风险</span>
          </div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', marginRight: '4px', width: '16px', height: '16px', backgroundColor: '#C6BC7A' }} />
            <span>一般风险</span>
          </div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', marginRight: '4px', width: '16px', height: '16px', backgroundColor: '#4C9ED6' }} />
            <span>低风险</span>
          </div>
        </div>
      </div>
    );
  }

  /* 隐患详情 */
  renderRiskDetail() {
    const { bigPlatform: { riskDetailList, companyMessage: { fourColorImg } } } = this.props;
    const { selectedId } = this.state;
    let data = !/^http/.test(fourColorImg) ? riskDetailList.filter(({ status }) => +status !== 4) : riskDetailList.filter(({ item_id, status }) => item_id === selectedId && +status !== 4);
    data = data.map(({ id, flow_name: description, report_user_name: sbr, report_time: sbsj, rectify_user_name: zgr, plan_rectify_time: zgsj, review_user_name: fcr, status, hiddenDangerRecordDto: [{ fileWebUrl: background }] = [{}] }) => ({
      id,
      description,
      sbr,
      sbsj: moment(+sbsj).format('YYYY-MM-DD'),
      zgr,
      zgsj: moment(+zgsj).format('YYYY-MM-DD'),
      fcr,
      status: switchStatus(status),
      background,
    }));

    return (
      <Col span={6} className={styles.heightFull}>
        <RiskDetail
          style={{
            height: '100%',
            paddingTop: '36px',
          }}
          data={data}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      </Col>
    );
  }

  render() {
    const {
      companyMessage: {
        companyMessage: {
          companyName,
          headOfSecurity,
          headOfSecurityPhone,
          countCheckItem,
          countCompanyUser,
        },
        check_map: {
          self_check_point,
        },
        hidden_danger_map: {
          created_danger,
        },
      },
      coItemList: {
        status1,
        status2,
        status3,
        status4,
        statusAll,
      },
      specialEquipment,
      countDangerLocationForCompany: {
        red,
        orange,
        blue,
        yellow,
      },
      hiddenDanger,
    } = this.props.bigPlatform;

    const dataPie = [
      { name: '红色风险点', value: red },
      { name: '橙色风险点', value: orange },
      { name: '黄色风险点', value: yellow },
      { name: '蓝色风险点', value: blue },
    ];

    const dataBar = [
      { name: '隐患数量', ...created_danger },
      { name: '巡查次数', ...self_check_point },
    ];

    const infoClassNames = classNames(styles.sectionWrapper, styles.infoWrapper);
    const hdClassNames = classNames(styles.sectionWrapper, styles.hdWrapper);

    let pieShow = true;
    if (red === 0 && orange === 0 && yellow === 0 && blue === 0) pieShow = false;
    const { match: { params: { companyId } } } = this.props;
    return (
      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <span>晶安智慧安全云平台</span>
          <div className={styles.subHeader}><Timer /></div>
        </header>

        <article className={styles.mainBody}>
          <Row gutter={24} className={styles.heightFull}>
            <Col span={6} className={styles.heightFull} style={{ display: 'flex', flexDirection: 'column' }}>
              <section className={infoClassNames}>
                <div className={styles.sectionTitle}>单位信息</div>
                <div className={styles.sectionMain} onClick={() => { window.open(`/acloud_new/companyIndex.htm?company_id=${companyId}`); }}>
                  <div className={styles.shadowIn}>
                    <div className={styles.companyMain}>
                      <div className={styles.companyIcon}></div>
                      <div className={styles.companyInfo}>
                        <div className={styles.companyName}>{companyName}</div>
                        <div className={styles.companyCharger}>安全负责人：{headOfSecurity}</div>
                        <div className={styles.companyPhone}>联系方式：{headOfSecurityPhone}</div>
                      </div>
                    </div>

                    <div className={styles.summaryBottom}>
                      <Row gutter={6}>
                        <Col span={12} className={styles.summaryHalf}>
                          <div className={styles.summaryPeople}></div>
                          <div className={styles.summaryText}>安全人员</div>
                          <div className={styles.summaryNum}>{countCompanyUser}</div>
                        </Col>

                        <Col span={12} className={styles.summaryHalf}>
                          <div className={styles.summaryCheck}></div>
                          <div className={styles.summaryText}>检查点</div>
                          <div className={styles.summaryNum}>{countCheckItem}</div>
                        </Col>

                        <Col span={12} className={styles.summaryHalf}>
                          <div className={styles.summarySpecial}></div>
                          <div className={styles.summaryText}>特种设备</div>
                          <div className={styles.summaryNum}>{specialEquipment}</div>
                        </Col>

                        <Col span={12} className={styles.summaryHalf}>
                          <div className={styles.summaryhd}></div>
                          <div className={styles.summaryText}>隐患数量</div>
                          <div className={styles.summaryNum}>{hiddenDanger}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </section>

              <section className={hdClassNames} style={{ flex: 1 }}>
                <div className={styles.sectionTitle}>风险点</div>
                <div className={styles.sectionMain}>
                  <div className={styles.shadowIn}>

                    {pieShow && (
                      <div className={styles.hdPie} id='hdPie'>
                        {this.renderPieChart(dataPie)}
                      </div>)}

                    <div className={styles.summaryBottom}>
                      <Row gutter={6}>
                        <Col span={12} className={styles.summaryHalf}>
                          <div className={styles.summaryNormal}></div>
                          <div className={styles.summaryText}>正常</div>
                          <div className={styles.summaryNum}>{status1}</div>
                        </Col>

                        <Col span={12} className={styles.summaryHalf}>
                          <div className={styles.summaryChecking}></div>
                          <div className={styles.summaryText}>待检查</div>
                          <div className={styles.summaryNum}>{status3}</div>
                        </Col>

                        <Col span={12} className={styles.summaryHalf}>
                          <div className={styles.summaryAbnormal}></div>
                          <div className={styles.summaryText}>异常</div>
                          <div className={styles.summaryNum}>{status2}</div>
                        </Col>

                        <Col span={12} className={styles.summaryHalf}>
                          <div className={styles.summaryOver}></div>
                          <div className={styles.summaryText}>已超时</div>
                          <div className={styles.summaryNum}>{status4}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </section>
            </Col>

            <Col span={12} className={styles.heightFull} style={{ display: 'flex', flexDirection: 'column' }}>
              {this.renderRiskFourColor()}
              <section className={styles.sectionWrapper} style={{ height: '37%' }}>
                <div className={styles.sectionTitle}>单位巡查</div>
                <div className={styles.sectionMain} style={{ padding: '0' }}>
                  <div className={styles.shadowIn}>
                    <div className={styles.checkBar} id='checkBar'>
                      {this.renderBarChart(dataBar)}
                    </div>
                  </div>
                </div>
              </section>
            </Col>

            {this.renderRiskDetail()}
          </Row>
        </article>
      </div>
    );
  }
}

export default CompanyLayout;
