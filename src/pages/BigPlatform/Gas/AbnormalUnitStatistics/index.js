import React, { PureComponent } from 'react';
import NewSection from '@/components/NewSection';
// 引入样式文件
import styles from './index.less';

/**
 * description: 异常单位统计
 * author: pcy
 * date: 2019年01月18日
 */
export default class AbnormalUnitStatistics extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 挂载后
   */
  componentDidMount() {}

  /**
   * 更新后
   */
  componentDidUpdate() {}

  /**
   * 销毁前
   */
  componentWillUnmount() {}

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
        // units,
        // 告警单位
        alarmUnit = [],
        // 预警单位
        earlyWarningUnit = [],
        // 正常单位
        normalUnit = [],
      },
      // 点击事件
      onClick,
    } = this.props;

    return (
      <NewSection title="异常单位统计" className={className} onClick={onClick}>
        <div className={styles.list}>
          {[
            {
              border: '2px solid #d93d49',
              name: '报警单位',
              value: alarmUnit.length,
            },
            {
              border: '2px solid #deaa26',
              name: '故障单位',
              value: earlyWarningUnit.length,
            },
            {
              border: '2px solid #8795ab',
              name: '失联单位',
              value: normalUnit.length,
            },
          ].map(({ border, name, value }) => (
            <div className={styles.item} key={name}>
              <span className={styles.quantity} style={{ border: border }}>
                {value}
              </span>
              <span className={styles.name}>{name}</span>
            </div>
          ))}
        </div>
      </NewSection>
    );
  }
}
