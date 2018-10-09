import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import styles from '../Government.less';

class HiddenDangerPie extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getHdPieOption() {
    const {
      listForMap: { overRectifyNum = 0, rectifyNum = 0, reviewNum = 0, total: riskTotal = 0 },
    } = this.props;
    const option = {
      title: {
        text: riskTotal,
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

  render() {
    const {
      dispatch,
      goComponent,
      hiddenDangerCompanyAll,
      listForMap: { overRectifyNum = 0, rectifyNum = 0, reviewNum = 0, total: riskTotal = 0 },
      handleParentChange,
    } = this.props;
    return (
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
                success: () => {
                  handleParentChange({
                    dangerCompanyData: hiddenDangerCompanyAll,
                    dangerCompanyLast: '',
                    checkUserId: '',
                  });
                  goComponent('hdCom');
                },
              });
            }}
          >
            隐患单位
            <span className={styles.hdCompanyNum} style={{ color: '#00baff' }}>
              {hiddenDangerCompanyAll.dangerCompanyNum || 0}
            </span>
          </div>
          <div className={styles.sectionMain} style={{ display: 'flex', flexDirection: 'column' }}>
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
                <span className={styles.legendIcon} style={{ backgroundColor: '#f6b54e' }} />
                未超期
                <span className={styles.legendNum}>{rectifyNum}</span>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendIcon} style={{ backgroundColor: '#2a8bd5' }} />
                待复查
                <span className={styles.legendNum}>{reviewNum}</span>
              </div>

              <div className={styles.legendItem}>
                <span className={styles.legendIcon} style={{ backgroundColor: '#e86767' }} />
                已超期
                <span className={styles.legendNum}>{overRectifyNum}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default HiddenDangerPie;
