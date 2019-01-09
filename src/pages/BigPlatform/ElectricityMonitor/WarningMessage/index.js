import React, { PureComponent } from 'react';
import NewSection from '@/components/NewSection';
// 引入样式文件
import styles from './index.less';

// 告警信息Item
const Message = function({

}) {
  return (
    <div className={styles.message}>

    </div>
  );
};

/**
 * description: 告警信息
 * author: sunkai
 * date: 2019年01月09日
 */
export default class WarningMessage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 是否展开告警信息
      isExpanded: false,
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
      data,
    } = this.props;
    const { isExpanded } = this.state;

    return (
      <NewSection
        title="告警信息"
        className={className}
        style={{ display: 'flex', flexDirection: 'column', height: 'auto' }}
        titleStyle={{ flex: 'none' }}
        contentStyle={{ flex: '1', display: 'flex', height: 'auto' }}
        scroll={{
          className: styles.scroll,
        }}
      >
        {[1,2,3].map(item => <Message />)}
      </NewSection>
    );
  }
}
