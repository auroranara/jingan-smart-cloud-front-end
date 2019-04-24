import React, { PureComponent } from 'react';
import { Progress } from 'antd';
import SectionDrawer from '../SectionDrawer';
import GasList from './GasList';
// 引入样式文件
import styles from './index.less';
const emptyIcon = 'http://data.jingan-china.cn/v2/big-platform/monitor/com/waterBg1.png';
// progress
const STATUS_CN = ['正常', '报警', '失联'];
const COLORS = ['rgb(0, 161, 129)', 'rgb(232, 103, 103)', 'rgb(198, 193, 129)'];

function handlePercent(n = 0, total = 0) {
  // 分母是0，直接返回0
  if (!total) return 0;
  return Math.round((n / total) * 100);
}

function ProgressBar(props) {
  const { status = 0, num = 0, percent = 0, strokeWidth = 10 } = props;
  const strokeColor = COLORS[status];
  return (
    <div className={styles.progress}>
      <div className={styles.status}>{STATUS_CN[status]}</div>
      <Progress
        percent={percent}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        showInfo={false}
        style={{ flex: 1 }}
      />
      <div className={styles.num} style={{ color: strokeColor }}>
        {num}
      </div>
    </div>
  );
}
/**
 * 可燃有毒气体监测抽屉
 */
export default class GasMonitorDrawer extends PureComponent {
  state = {};

  render() {
    const {
      // 抽屉是否可见
      visible,
      // 抽屉关闭事件
      onClose,
      // 数据
      data,
      gasList,
    } = this.props;
    const {} = this.state;
    const { count: total = 0, normal = 0, unnormal: abnormal = 0, outContact: loss = 0 } = data;
    const sts = [
      {
        status: 0,
        num: normal,
        percent: handlePercent(normal, total),
      },
      {
        status: 1,
        num: abnormal,
        percent: handlePercent(abnormal, total),
      },
      {
        status: 2,
        num: loss,
        percent: handlePercent(loss, total),
      },
    ];

    let emptyComponent = (
      <img src={emptyIcon} alt="空图片" width="135" height="135" className={styles.emptyIcon} />
    );
    return (
      <SectionDrawer
        drawerProps={{
          title: '可燃有毒气体监测',
          visible,
          onClose: () => {
            onClose('gasMonitor');
          },
        }}
        sectionProps={{
          contentStyle: { paddingBottom: 16 },
        }}
      >
        <div className={styles.container}>
          <div className={styles.countContainer}>
            {total ? (
              <div className={styles.circle}>
                <span className={styles.pointNum}>{total}</span>
                <span className={styles.point}>监测点</span>
              </div>
            ) : null}
            <div className={styles.progressContainer}>
              {total ? sts.map((item, index) => <ProgressBar key={index} {...item} />) : null}
            </div>
            {total ? null : emptyComponent}
          </div>
          <GasList data={{ gasCount: data, gasList }} />
        </div>
      </SectionDrawer>
    );
  }
}
