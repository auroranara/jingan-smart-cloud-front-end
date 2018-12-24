import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import styles from '../Government.less';
import iconBarChart from '../img/icon-barChart.png';
import iconBarChartActive from '../img/icon-barChart-active.png';
import iconPieChart from '../img/icon-pieChart.png';
import iconPieChartActive from '../img/icon-pieChart-active.png';

const dangerTitles = ['未超期隐患', '待复查隐患', '已超期隐患'];
const dangerStatus = [2, 3, 7];
const modeBtns = [
  {
    mode: 'pie',
    common: iconPieChart,
    active: iconPieChartActive,
  },
  {
    mode: 'bar',
    common: iconBarChart,
    active: iconBarChartActive,
  },
];
class HiddenDangerPie extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modeActive: 0,
      chartMode: 'pie',
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getPieOption() {
    const {
      listForMap: { overRectifyNum = 0, rectifyNum = 0, reviewNum = 0, total: riskTotal = 0 },
    } = this.props;
    const legendData = { 未超期: rectifyNum, 待复查: reviewNum, 已超期: overRectifyNum };
    const option = {
      title: {
        text: riskTotal,
        left: 'center',
        top: '41%',
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
      legend: {
        show: true,
        data: ['未超期', '待复查', '已超期'],
        icon: 'circle',
        formatter: name => {
          return `${name} ${legendData[name]}`;
        },
        bottom: 15,
        left: 'center',
        textStyle: { color: '#fff' },
        itemGap: 20,
      },
      color: ['#f6b54e', '#2a8bd5', '#e86767'],
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              formatter: '{b}\n{number|{c}}',
              rich: {
                number: {
                  fontSize: 20,
                  color: '#fff',
                  align: 'center',
                },
              },
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: 13,
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

  getBarOption() {
    const {
      listForMap: { overRectifyNum = 0, rectifyNum = 0, reviewNum = 0, total: riskTotal = 0 },
    } = this.props;
    const option = {
      grid: {
        top: '90px',
        left: '40px',
        right: '10px',
        bottom: '40px',
      },
      yAxis: {
        type: 'value',
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLabel: {
          color: '#fff',
          formatter: function(value, index) {
            if (parseInt(value, 10) !== value) return '';
            return parseInt(value, 10);
          },
        },
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 14,
        },
        data: ['总数', '未超期', '待复查', '已超期'],
      },
      color: ['#00abc9', '#f6b54e', '#2a8bd5', '#e86767'],
      series: [
        {
          type: 'bar',
          barWidth: 30,
          label: {
            show: true,
            position: 'top',
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     position: 'top',
          //   },
          // },
          data: [
            { name: '总数', value: riskTotal, itemStyle: { color: '#00abc9' } },
            { name: '未超期', value: rectifyNum, itemStyle: { color: '#f6b54e' } },
            { name: '待复查', value: reviewNum, itemStyle: { color: '#2a8bd5' } },
            { name: '已超期', value: overRectifyNum, itemStyle: { color: '#e86767' } },
          ],
        },
      ],
    };
    return option;
  }

  onHdPieReadyCallback = chart => {
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

    chart.on('click', params => {
      const { closeAllDrawers } = this.props;
      const { dataIndex } = params;
      const { chartMode } = this.state;
      closeAllDrawers();
      if (!chartMode || chartMode === 'pie') {
        this.handleDataClick(params, dataIndex);
      } else if (chartMode === 'bar') {
        if (dataIndex === 0) {
          this.handleHdComClick();
        } else {
          this.handleDataClick(params, dataIndex - 1);
        }
      }
    });
  };

  renderModeBtns = () => {
    const { modeActive } = this.state;
    return (
      <div className={styles.modeChange}>
        {modeBtns.map((data, index) => {
          const { common, active, mode } = data;
          return (
            <span
              className={styles.modeBtn}
              style={{
                backgroundColor: `${modeActive === index ? '#093d7f' : '#033069'}`,
              }}
              onClick={() => {
                this.setState({ modeActive: index, chartMode: mode });
              }}
              key={index}
            >
              <img src={modeActive === index ? active : common} alt="modeIcon" />
            </span>
          );
        })}
      </div>
    );
  };

  renderChart = mode => {
    if (!mode || mode === 'pie') return this.getPieOption();
    else if (mode === 'bar') return this.getBarOption();
  };

  handleHdComClick = () => {
    const {
      dispatch,
      listForMap: { dangerCompany = [], total: dangerCount = 0, dangerCompanyNum = 0 },
      handleParentChange,
      gridId,
    } = this.props;
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerCompany',
      payload: {
        gridId,
      },
      success: () => {
        handleParentChange({
          dangerCompanyData: { dangerCompanyNum, dangerCompany, dangerCount },
          dangerCompanyLast: '',
          checkUserId: '',
          dangerCoTitle: '隐患单位统计',
          dangerCoDrawer: true,
        });
        handleParentChange({ dangerCoDrawer: true });
      },
    });
  };

  handleDataClick = (params, index) => {
    const { dispatch, handleParentChange, gridId } = this.props;
    dispatch({
      type: 'bigPlatform/fetchListForMapForHidden',
      payload: {
        gridId,
        status: dangerStatus[index],
      },
      success: response => {
        handleParentChange({
          dangerCoDrawer: true,
          dangerCoTitle: dangerTitles[index],
          dangerCompanyData: {
            dangerCompanyNum: response.list.length,
            dangerCompany: response.list,
            dangerCount: params.value,
            status: dangerStatus[index],
          },
          dangerCompanyLast: '',
          checkUserId: '',
        });
      },
    });
  };

  render() {
    const { chartMode } = this.state;
    const {
      listForMap: { dangerCompanyNum = 0 },
      closeAllDrawers,
    } = this.props;
    return (
      <section className={styles.sectionWrapper} style={{ height: 'calc(50% - 6px)' }}>
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionTitle}>
            <span className={styles.titleBlock} />
            隐患统计
          </div>
          {this.renderModeBtns()}
          <div
            className={styles.hdCompany}
            onClick={() => {
              closeAllDrawers();
              this.handleHdComClick();
            }}
          >
            隐患单位
            <span className={styles.hdCompanyNum} style={{ color: '#00baff' }}>
              {dangerCompanyNum || 0}
            </span>
          </div>
          <div className={styles.sectionMain} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.hdPie} id="hdPie" style={{ flex: 1 }}>
              <ReactEcharts
                option={this.renderChart(chartMode)}
                style={{ height: '100%', width: '100%' }}
                className="echarts-for-echarts"
                notMerge={true}
                onChartReady={this.onHdPieReadyCallback}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default HiddenDangerPie;
