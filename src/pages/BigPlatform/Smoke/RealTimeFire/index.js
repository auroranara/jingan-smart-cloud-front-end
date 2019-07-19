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
   * 渲染
   */
  render() {
    const {
      // 容器类名
      className,
      // 数据源
      // data: {
      //   // 火警单位数量
      //   unnormalCompanyNum = 0,
      //   // 故障单位数量
      //   faultCompanyNum = 0,
      // },
      // 点击事件
      onClick,
      unitsCount,
    } = this.props;

    const unnormalCompanyNum = unitsCount.reduce(function(prev, cur) {
      if (+cur.unnormal > 0) {
        prev++;
      }
      return prev;
    }, 0);

    const faultCompanyNum = unitsCount.reduce((prev, cur) => {
      if (+cur.fault > 0) {
        prev++;
      }
      return prev;
    }, 0);

    const outContactCompanyNum = unitsCount.reduce((prev, cur) => {
      if (+cur.outContact > 0) {
        prev++;
      }
      return prev;
    }, 0);

    return (
      <NewSection title="异常单位统计" className={className} onClick={onClick}>
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
              border: '2px solid #9f9f9f',
              name: '失联单位',
              value: outContactCompanyNum,
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
