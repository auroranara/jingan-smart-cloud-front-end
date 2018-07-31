import React from 'react';
import { Row, Col } from 'antd';
// import { Link } from 'dva/router';
import styles from './Government.less';

class UserLayout extends React.PureComponent {
  state = {
    time: '0000-00-00 星期一 00:00:00',
  };

  componentDidMount() {
    setInterval(() => {
      this.getTime();
    }, 1000);

  }

  getTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const myday = date.getDay();
    const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const dayText = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
    const timeText = (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute) + ':' + (second < 10 ? ('0' + second) : second);

    this.setState({
      time: dayText + ' ' + weekday[myday] + ' ' + timeText,
    });
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
                  <div className={styles.sectionChart}></div>
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

                  </div>
                </div>
              </section>
            </Col>
            <Col span={6} className={styles.heightFull}>
              <section className={styles.sectionWrapper}>
                <div className={styles.sectionTitle}>社区接入企业数</div>
                <div className={styles.sectionMain} style={{ padding: '0 15px' }}>
                  <table className={styles.safeTable}>
                    <thead>
                      <th style={{ width: '50%' }}>社区</th>
                      <th style={{ width: '50%' }}>接入企业数</th>
                    </thead>
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

export default UserLayout;
