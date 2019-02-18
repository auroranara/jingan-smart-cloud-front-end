import React, { PureComponent } from 'react';
import NewSection from '@/components/NewSection';
// 引入样式文件
import styles from './index.less';

export default class RealTimeFire extends PureComponent {
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
        // 报警单位
        unnormalCompanyNum = 0,
        // 故障单位
        faultCompanyNum = 0,
        // 失联单位
        outContacts = 0,
      },
      // 点击事件
      onClick,
    } = this.props;

    return (
      <NewSection title="实时火警单位统计" className={className} onClick={onClick}>
        <div className={styles.list}>
          {[
            {
              border: '2px solid #d93d49',
              name: '火警单位',
              value: unnormalCompanyNum,
            },
            {
              border: '2px solid #deaa26',
              name: '故障单位',
              value: faultCompanyNum,
            },
            {
              border: '2px solid #8795ab',
              name: '失联单位',
              value: outContacts,
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
