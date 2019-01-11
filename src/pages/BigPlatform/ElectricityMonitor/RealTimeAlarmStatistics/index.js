import React, { PureComponent } from 'react';
import { Progress } from 'antd';
import NewSection from '@/components/NewSection';
// 引入样式文件
import styles from './index.less';

/**
 * description: 实时报警统计
 * author: sunkai
 * date: 2019年01月10日
 */
export default class RealTimeAlarmStatistics extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {

  }

  /**
   * 更新后
   */
  componentDidUpdate() {

  }

  /**
   * 销毁前
   */
  componentWillUnmount() {

  }

  /**
   * 渲染
   */
  render() {
    const {
      // 容器类名
      className,
      // 数据源
      data: {
        // 所有单位
        units,
        // 告警单位
        alarmUnit=[],
        // 预警单位
        earlyWarningUnit=[],
        // 正常单位
        normalUnit=[],
      },
      // 点击事件
      onClick,
    } = this.props;


    return (
      <NewSection title="实时报警统计" className={className} onClick={onClick}>
        <div className={styles.list}>
          {[{
            color: '#ff4848',
            name: '告警单位',
            value: alarmUnit.length,
          }, {
            color: '#f6ba38',
            name: '预警单位',
            value: earlyWarningUnit.length,
          }, {
            color: '#00fbfc',
            name: '正常单位',
            value: normalUnit.length,
          }].map(({ color, name, value }) => (
            <div className={styles.item} key={name}>
              <div className={styles.left}>{name}</div>
              <div className={styles.center}>
                <Progress showInfo={false} strokeColor={color} percent={units.length > 0 ? value / units.length * 100 : 0} status="active" />
              </div>
              <div className={styles.right} style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
      </NewSection>
    );
  }
}
