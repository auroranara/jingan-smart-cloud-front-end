import React, { PureComponent } from 'react';
import NewSection from '@/components/NewSection';
// 接入率
import accessRateIcon from '../imgs/access-rate-icon.png';
// 接入单位
import accessUnitIcon from '../imgs/access-unit-icon.png';
// 管辖单位
import jurisdictionUnitIcon from '../imgs/jurisdiction-unit-icon.png';
// 引入样式文件
import styles from './index.less';

/**
 * description: 接入单位统计
 * author: sunkai
 * date: 2019年01月10日
 */
export default class AccessUnitStatistics extends PureComponent {
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
        // 管辖单位统计数
        jurisdictionalUnitStatistics=0,
        // 接入单位统计数
        accessUnitStatistics=0,
        // 接入率
        accessRate='--',
      },
      // 点击事件
      onClick,
    } = this.props;

    return (
      <NewSection title="接入单位统计" className={className} onClick={onClick}>
        <div className={styles.list}>
          {[{
            icon: jurisdictionUnitIcon,
            name: '管辖单位',
            value: jurisdictionalUnitStatistics,
          }, {
            icon: accessUnitIcon,
            name: '接入单位',
            value: accessUnitStatistics,
          }, {
            icon: accessRateIcon,
            name: '接入率',
            value: accessRate,
          }].map(({ icon, name, value }) => (
            <div className={styles.item} key={name}>
              <div className={styles.left} style={{ backgroundImage: `url(${icon})` }} />
              <div className={styles.right}>
                <div className={styles.name}>{name}</div>
                <div className={styles.value}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </NewSection>
    );
  }
}
