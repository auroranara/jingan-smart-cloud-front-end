import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
// 引入样式文件
import styles from './index.less';

/**
 * 维保任务统计
 */
@connect(({ operation }) => ({
  count: operation.taskCount,
}))
export default class TaskCount extends PureComponent {
  componentDidMount() {
    this.getTaskCount();
  }

  getTaskCount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'operation/fetchTaskCount',
      payload: {},
    });
  }

  handleClick = e => {
    const { onClick } = this.props;
    const process = e.currentTarget.getAttribute('data-process');
    onClick && onClick(process);
  };

  render() {
    const {
      count: {
        pending = 0, // 待处理
        processing = 0, // 处理中
        processed = 0, // 已处理
      } = {},
    } = this.props;
    const list = [
      {
        label: '待处理',
        value: pending,
        borderColor: '#f83329',
      },
      {
        label: '处理中',
        value: processing,
        borderColor: '#ffb400',
      },
      {
        label: '已处理',
        value: processed,
        borderColor: '#00ffff',
      },
    ];

    return (
      <CustomSection className={styles.container} title="运维任务统计">
        <div className={styles.list}>
          {list.map(({ label, value, borderColor }) => (
            <div
              key={label}
              className={styles.item}
              data-process={label}
              onClick={this.handleClick}
            >
              <div style={{ borderColor }}>
                <span>{value}</span>
              </div>
              <div>{label}</div>
            </div>
          ))}
        </div>
      </CustomSection>
    );
  }
}
