import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './Company.less';
import moment from 'moment';
import Timer from './Components/Timer';

import { DataView } from '@antv/data-set';
import { Chart, Axis, Tooltip, Geom, Coord, Label, Legend } from "bizcharts";

@connect(({ bigPlatform }) => ({
  bigPlatform,
}))
class CompanyLayout extends React.PureComponent {
  state = {
    pieHeight: 0,
    barHeight: 0,
  };

  componentDidMount() {
    const { dispatch, location: { query: { company_id } } } = this.props;
    window.onload = () => {
      this.reDoChart();
    };

    window.addEventListener('resize', () => {
      this.debounce(this.reDoChart(), 300)
    });

    dispatch({
      type: 'bigPlatform/fetchCompanyMessage',
      payload: {
        company_id,
        month: moment().format('YYYY-MM'),
      },
    });
    dispatch({
      type: 'bigPlatform/fetchSpecialEquipment',
      payload: {
        company_id,
        month: moment().format('YYYY-MM'),
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id,
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id,
        status: '1',
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id,
        status: '2',
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id,
        status: '3',
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCoItemList',
      payload: {
        company_id,
        status: '4',
      },
    });
    dispatch({
      type: 'bigPlatform/fetchCountDangerLocationForCompany',
      payload: {
        company_id,
      },
    });

    this.setViewport();
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

    return (
      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <span>晶安智慧安全云平台</span>
          <div className={styles.subHeader}><Timer /></div>
        </header>

        <article className={styles.mainBody}>
          <Row gutter={24} className={styles.heightFull}>
            <Col span={6} className={styles.heightFull}>
              <section className={styles.sectionWrapper} style={{ height: '330px' }}>
                <div className={styles.sectionTitle}>单位信息</div>
                <div className={styles.sectionMain}>
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
                          <div className={styles.summaryNum}>{statusAll}</div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.sectionWrapper} style={{ height: 'calc(100% - 360px)', marginTop: '30px' }}>
                <div className={styles.sectionTitle}>风险点</div>
                <div className={styles.sectionMain}>
                  <div className={styles.shadowIn}>
                    <div className={styles.hdPie} id='hdPie'>
                      {this.renderPieChart(dataPie)}
                    </div>

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

            <Col span={12} className={styles.heightFull}>
              <section className={styles.sectionWrapper} style={{ height: '300px', position: 'absolute', bottom: '0', width: '100%' }}>
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
          </Row>
        </article>
      </div>
    );
  }
}

export default CompanyLayout;
