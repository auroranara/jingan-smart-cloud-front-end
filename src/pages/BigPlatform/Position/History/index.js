import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import TrailBack from './TrailBack';
import borderIcon from '../imgs/mapOuter.png';
import map from '../imgs/map.png';
/* 引入样式文件 */
import styles from './index.less';

const { RangePicker } = DatePicker;

// 时间格式
const timeFormat = 'YYYY-MM-DD HH:mm';
// 默认范围
// const defaultRange = [moment().startOf('minute').subtract(5, 'minutes'), moment().startOf('minute')];
const defaultRange = [moment('2018-12-29 14:23'), moment('2018-12-29 14:25')];
// const defaultRange = [moment('2018-12-29 14:27'), moment('2018-12-29 14:29')];


/**
 * description: 模板
 * author: sunkai
 * date: 2018年12月27日
 */
@connect(({ position }) => ({
  position,
}))
export default class History extends PureComponent {
  state = {
    range: defaultRange,
  };

  // 上次选择的范围
  lastRange = defaultRange;

  componentDidMount() {
    // const { match: { params: { id } } } = this.props;
    // 获取列表
    this.getList(defaultRange);
  }

  /**
   * 获取列表
   */
  getList = (range) => {
    const { match: { params: { id: cardId } }, dispatch } = this.props;
    const [queryStartTime, queryEndTime] = range;
    dispatch({
      type: 'position/fetchList',
      payload: {
        cardId,
        queryStartTime: queryStartTime && +queryStartTime,
        queryEndTime: queryEndTime && +queryEndTime,
      },
    });
  }

  /**
   * 时间选择change事件
   */
  handleChange = (range) => {
    this.setState({ range });
  }

  /**
   * 时间选择Ok事件
   */
  handleOk = (range) => {
    this.isOk = true;
    this.lastRange = range;
    this.getList(range);
    this.setState({ range });
  }

  /**
   * 时间选择OpenChange
   */
  handleOpenChange = (status) => {
    if (!status) {
      if (this.isOk) {
        this.isOk = false;
      }
      else {
        this.setState({ range: this.lastRange });
      }
    }
  }

  /**
   * 修改滚动条颜色
   */
  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: `rgba(9, 103, 211, 0.5)`,
      borderRadius: '10px',
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props}
      />
    );
  }

  render() {
    const { position: { list } } = this.props;
    const { range } = this.state;
    const [ startTime, endTime ] = range;

    return (
      <BigPlatformLayout
        title="晶安人员定位监控系统"
        extra="无锡晶安科技有限公司"
        headerStyle={{ fontSize: 16 }}
        titleStyle={{ fontSize: 46 }}
        style={{
          backgroundImage:
            'url(http://data.jingan-china.cn/v2/big-platform/fire-control/com/new/bg2.png)',
        }}
      >
        <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.wrapper} style={{ display: 'flex', flexDirection: 'column', backgroundImage: `url(${borderIcon})` }}>
              <div style={{ flex: 'none', marginBottom: 12 }}>
                <RangePicker
                  className={styles.rangePicker}
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm' }}
                  format={timeFormat}
                  placeholder={['开始时间', '结束时间']}
                  value={range}
                  onChange={this.handleChange}
                  onOk={this.handleOk}
                  onOpenChange={this.handleOpenChange}
                  allowClear={false}
                />
              </div>
              <div style={{ flex: 'none', marginBottom: 12 }}>
                <div className={styles.th}>
                  <div className={styles.td}>开始时间</div>
                  <div className={styles.td}>结束时间</div>
                  <div className={styles.td}>区域楼层</div>
                </div>
                <div className={styles.tr}>
                  <div className={styles.td}>{startTime.format('HH:mm:ss')}</div>
                  <div className={styles.td}>{endTime.format('HH:mm:ss')}</div>
                  <div className={styles.td}>办公区域</div>
                </div>
              </div>
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div className={styles.th} style={{ flex: 'none' }}>
                  <div className={styles.td}>时间</div>
                  <div className={styles.td}>X坐标</div>
                  <div className={styles.td}>Y坐标</div>
                  <div className={styles.td}>Z坐标</div>
                </div>
                <Scrollbars style={{ flex: '1' }} renderThumbHorizontal={this.renderThumb} renderThumbVertical={this.renderThumb}>
                  {list && list.length > 0 ? list.map(({ intime: time, xarea: x, yarea: y, zarea: z }) => (
                    <div className={styles.tr} key={time}>
                      <div className={styles.td}>{moment(time).format('HH:mm:ss')}</div>
                      <div className={styles.td}>{x}</div>
                      <div className={styles.td}>{y}</div>
                      <div className={styles.td}>{z}</div>
                    </div>
                  )) : <div className={styles.placeholder}>暂无数据</div>}
                </Scrollbars>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <TrailBack src={map} data={list} startTime={startTime && +startTime} endTime={endTime && +endTime} style={{ backgroundImage: `url(${borderIcon})` }} topStyle={{ margin: '24px 24px 0' }} />
          </div>
        </div>
      </BigPlatformLayout>
    );
  }
}
