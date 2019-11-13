import React, { Component, Fragment } from 'react';
import { Spin, Card, Select, DatePicker, message } from 'antd';
import CustomEmpty from '@/jingan-components/CustomEmpty';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;

/**
 * 储罐区详情-监测数据趋势
 */
export default class MonitorDataTrend extends Component {
  state = {
    pointId: undefined, // 选中的监测点位id
    date: undefined, // 选中的日期
    paramId: undefined, // 选中的参数id
  }

  componentDidUpdate({ pointList: prevPointList }) {
    const { pointList } = this.props;
    if (prevPointList !== pointList) {
      const pointId = Array.isArray(pointList) && pointList.length ? pointList[0].id : undefined; // 只考虑到是否为数组，默认数组成员为对象
      this.setState({
        pointId,
        date: moment().startOf('day'),
      }, pointId && this.getParamList);
    }
  }

  /**
   * 获取源数据
   */
  getParamList() {
    const { getParamList } = this.props;
    const { pointId, date } = this.state;
    getParamList({
      pointId,
      date,
    }, (success, paramList) => {
      if (success) {
        this.setState({
          paramId: Array.isArray(paramList) && paramList.length ? paramList[0].id : undefined,
        });
      } else {
        message.error('获取监测数据趋势失败，请稍后重试或联系管理人员！');
      }
    });
  }

  /**
   * 获取图表配置
   */
  getOption = () => {
    const option = {
      title: {
        text: '{a|一天用}{b|电量分布}\n{c|副标题}',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          lineHeight: 14,
          color: 'rgba(0, 0, 0, 0.65)',
          rich: {
            a: {
              color: 'red',
            },
            b: {
              color: 'blue',
            },
            c: {
              color: 'green',
            },
          },
        },
        subtext: '纯属虚构',
        subtextAlign: {
          align: 'left',
          lineHeight: 12,
        },
        padding: 0,
        itemGap: 0,
        left: 'center',
        top: 'top',
      },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
          },
      },
      xAxis:  {
          type: 'category',
          boundaryGap: false,
          data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45'],
      },
      yAxis: {
          type: 'value',
          axisLabel: {
              formatter: '{value} W',
          },
          axisPointer: {
              snap: true,
          },
      },
      series: [
          {
              name:'用电量',
              type:'line',
              smooth: true,
              data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
              markArea: {
                  data: [ [{
                      name: '早高峰',
                      xAxis: '07:30',
                  }, {
                      xAxis: '10:00',
                  }], [{
                      name: '晚高峰',
                      xAxis: '17:30',
                  }, {
                      xAxis: '21:15',
                  }] ],
              },
          },
      ],
    };

    return option;
  }

  /**
   * pointId的change事件
   */
  handlePointIdChange = (pointId) => {
    this.setState({
      pointId,
    }, this.getParamList);
  }

  /**
   * date的change事件
   */
  handleDateChange = (date) => {
    this.setState({
      date,
    }, this.getParamList);
  }

  /**
   * paramId的change事件（在我的想象中，获取接口会返回所有参数，paramId只控制显示哪个参数）
   */
  handleParamIdChange = (paramId) => {
    this.setState({
      paramId,
    });
  }

  render() {
    const {
      className,
      style,
      pointList,
      paramList,
      loading,
    } = this.props;
    const { pointId, date, paramId } = this.state;
    const pointList2 = Array.isArray(pointList) ? pointList : [];
    const paramList2 = Array.isArray(paramList) ? paramList : [];
    const param = paramList2.find(({ id }) => id === paramId);

    return (
      <Card
        className={classNames(styles.container, className)}
        style={style}
        title="监测数据趋势"
        extra={(
          <div className={styles.extraContainer}>
            <div className={styles.extraWrapper}>
              <Select
                className={styles.select}
                placeholder="请选择监测点位"
                value={pointId}
                onChange={this.handlePointIdChange}
              >
                {pointList2.map(({ id, name }) => (
                  <Option key={id}>{name}</Option>
                ))}
              </Select>
            </div>
            <div className={styles.extraWrapper}>
              <DatePicker
                placeholder="请选择日期"
                value={date}
                onChange={this.handleDateChange}
                allowClear={false}
              />
            </div>
          </div>
        )}
        tabList={paramList2.map(({ id, name }) => ({ key: id, tab: name }))}
        activeTabKey={paramId}
        onTabChange={this.handleParamIdChange}
      >
        <Spin spinning={!!loading}>
          {pointList2.length && param && param.history || true ? (
            <ReactEcharts
              option={this.getOption()}
            />
          ) : (
            <CustomEmpty className={styles.empty} />
          )}
        </Spin>
      </Card>
    );
  }
}
