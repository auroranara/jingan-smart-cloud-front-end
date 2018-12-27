import React, { PureComponent } from 'react';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import TrailBack from './TrailBack';
import RealTimeMonitor from '../components/RealTimeMonitor';
import AlarmView from '../components/AlarmView';
import borderIcon from '../imgs/mapOuter.png';
/* 引入样式文件 */
import styles from './index.less';

export default class WbTest extends PureComponent {
  state = {

  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    console.log(id);
  }

  render() {
    // const {
    // } = this.state;

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
            {/* 实时监控 */}
            <RealTimeMonitor className={styles.leftTop} />
            {/* 报警查看 */}
            <AlarmView className={styles.leftBottom} />
          </div>
          <div className={styles.right}>
            <TrailBack style={{ backgroundImage: `url(${borderIcon})` }} />
          </div>
        </div>
      </BigPlatformLayout>
    );
  }
}
