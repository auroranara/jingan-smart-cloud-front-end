import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import Section from '../Section/Section.js';
import Switcher from '../Switcher/Switcher';
import styles from './StatisticsOfMaintenance.less';

/**
 * 维保情况统计
 */
export default class App extends PureComponent {
  state = {
    currentSelectedPeriod: '近7天',
  }

  handleClick = (item, index) => {
    const { onSwitch } = this.props;
    this.setState({
      currentSelectedPeriod: item,
    });
    if (onSwitch) {
      onSwitch(item, index);
    }
  }

  renderSwitchers() {
    const { currentSelectedPeriod } = this.state;

    return (
      <div className={styles.switcherContainer}>
        {['近7天', '本月', '本季度', '本年度'].map((item, index) => {
          return <Switcher style={{ top: index*56, zIndex: currentSelectedPeriod===item?5:(4-index) }} isSelected={currentSelectedPeriod===item} content={item} key={item} onClick={() => {this.handleClick(item, index);}} />;
        })}
      </div>
    );
  }

  render() {
    const {
      maintenance: {
        name: maintenanceName="维保单位",
        total: maintenanceTotal=0,
        repaired: maintenanceRepaired=0,
        unrepaired: maintenanceUnrepaired=0,
        repairing: maintenanceRepairing=0,
        duration: maintenanceDuration=0,
        rate: maintenanceRate=0,
      } = {},
      local: {
        total: localTotal=0,
        repaired: localRepaired=0,
        unrepaired: localUnrepaired=0,
        repairing: localRepairing=0,
        duration: localDuration=0,
        rate: localRate=0,
      } = {},
    } = this.props;

    // 总维保数颜色
    const totalColor = '#01A4CA';
    // 已维保颜色
    const repairedColor = '#2787D5';
    // 待维保颜色
    const unrepairedColor = '#D16772';
    // 维保中颜色
    const repairingColor = '#DEAD5C';

    // 配置项
    const option = {
      color: [totalColor, repairedColor, unrepairedColor, repairingColor],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        textStyle: {
          color: '#fff',
        },
        icon: 'circle',
      },
      textStyle: {
        color: '#fff',
      },
      grid: {
        top: '60',
        left: '10',
        right: '10',
        bottom: '10',
        borderColor: '#2d344a',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: [maintenanceName, '本单位'],
        interval: 1,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#04e9eb',
            type: 'dashed',
            width: 2,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#3f5d79',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#3f5d79',
            width: 2,
          },
        },
        splitLine: {
          lineStyle: {
            color: '#3f5d79',
            width: 2,
          },
        },
      },
      series: [
        {
          name: '总维保数',
          type: 'bar',
          data: [maintenanceTotal, localTotal],
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
            },
          },
        },
        {
          name: '已维保',
          type: 'bar',
          data: [maintenanceRepaired, localRepaired],
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
            },
          },
        },
        {
          name: '待维保',
          type: 'bar',
          data: [maintenanceUnrepaired, localUnrepaired],
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
            },
          },
        },
        {
          name: '维保中',
          type: 'bar',
          data: [maintenanceRepairing, localRepairing],
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: 'top',
            },
          },
        },
      ],
    };

    return (
      <Section title="维保情况统计" fixedContent={(
        <Fragment>
          <div className={styles.detailContainer}>
            <div>
              <div className={styles.detailItem}>
                <div>平均响应时长</div>
                <div style={{ color: '#04D8DD' }}>{maintenanceDuration || '--'}</div>
              </div>
              <div className={styles.detailItem}>
                <div>完成率</div>
                <div style={{ color: '#FFCC54' }}>{`${Math.round(maintenanceRate*100)}%`}</div>
              </div>
            </div>
            <div>
              <div className={styles.detailItem}>
                <div>平均响应时长</div>
                <div style={{ color: '#04D8DD' }}>{localDuration || '--'}</div>
              </div>
              <div className={styles.detailItem}>
                <div>完成率</div>
                <div style={{ color: '#FFCC54' }}>{`${Math.round(localRate*100)}%`}</div>
              </div>
            </div>
          </div>
          {this.renderSwitchers()}
        </Fragment>
      )}>
        <div style={{ height: '100%' }}>
          <div className={styles.chartContainer}>
            <ReactEcharts
              style={{ height: '100%' }}
              option={option}
            />
          </div>
        </div>
      </Section>
    );
  }
}
