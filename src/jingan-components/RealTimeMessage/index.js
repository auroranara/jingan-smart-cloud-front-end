import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
// 引入样式文件
import './index.less';

/**
 * 实时消息
 */
export default class RealTimeMessage extends PureComponent {
  state = {
    expanded: false,
  }

  handleClick = () => {
    this.setState(({
      expanded,
    }) => ({
      expanded: !expanded,
    }));
  }

  render() {
    const {
      className,
      data,
      render,
      length=3,
      ...restProps
    } = this.props;
    const { expanded } = this.state;
    const arr = Array.isArray(data) ? data : [];
    const list = expanded ? arr.slice(0, 100) : arr.slice(0, length);

    return (
      <CustomSection
        className={classNames("real-time-message-container", className)}
        title="实时消息"
        extra={arr.length > length && <Icon type={expanded ? "double-left" : "double-right"} className="real-time-message-button" onClick={this.handleClick} />}
        {...restProps}
      >
        <div className="real-time-message-list">
          {list.length > 0 ? list.map(render) : (
            <div className="real-time-message-empty">暂无消息</div>
          )}
        </div>
      </CustomSection>
    );
  }
}
