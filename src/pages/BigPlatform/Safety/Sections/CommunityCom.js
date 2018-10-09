import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import ReactEcharts from 'echarts-for-react';
import rotate from '../Animate.less';
import styles from '../Government.less';

class CommunityCom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.handleScroll();
  }

  componentWillUnmount() {}

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

  // 社区接入单位排名
  getRankBarOption = () => {
    const { countGridCompany = [] } = this.props;
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

  renderTable = () => {
    const { countGridCompany = [] } = this.props;
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

  render() {
    const {
      visible,
      searchAllCompany: { dataImportant = [], dataUnimportantCompany = [] },
      countGridCompany = [],
    } = this.props;
    const stylesVisible = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: visible,
      [rotate.out]: !visible,
    });
    return (
      <section
        className={stylesVisible}
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
                    {dataImportant.length + dataUnimportantCompany.length}
                  </span>
                </div>
              </div>

              <div className={styles.tableTitleWrapper} style={{ borderBottom: 'none' }}>
                <span className={styles.tableTitle}>社区接入单位排名</span>
              </div>

              <div className={styles.rankBar}>
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
                <div className={styles.tableWrapper}>
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
    );
  }
}

export default CommunityCom;
